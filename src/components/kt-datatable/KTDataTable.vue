<template>
  <!--begin::Card header-->
  <div class="d-flex justify-content-end align-items-center flex-wrap py-3">
    <slot name="custom-actions"></slot>
    <inputWithToolTip
      v-if="inputWithToolTipEnabled"
      type="text"
      :placeholder="searchPlaceholder"
      :toolTipContent="toolTipContent"
      :filterTemplateEnabled="filterOptions?.formConfig?.showTemplateSelection"
      :searchInputLoading="searchInputLoading"
      @input="
        (val) => {
          if (enableSearchInputLoading) {
            searchInputLoading = true;
          }
          searchText = val;
        }
      "
    />

    <input
      v-else-if="searchEnabled"
      type="text"
      data-kt-subscription-table-filter="search"
      class="form-control form-control-solid w-250px mx-3"
      :placeholder="searchPlaceholder"
      v-model="searchText"
    />

    <button
      type="button"
      class="btn btn-primary ms-3"
      @click="onDownloadClick"
      :disabled="isDownloading || !isDateSelected"
      v-if="downloadEnabled"
    >
      <ButtonSpinner v-if="isDownloading" />Download CSV
    </button>

    <filters-template-dropdown
      :templateType="filterOptions?.formConfig?.templateType"
      v-if="filterOptions?.formConfig?.showTemplateSelection"
      @change="applyFilters"
    />
    <reuseableFilterVue
      v-if="filterOptions"
      ref="reuseableFilterVueRef"
      :display="filterOptions.display || 'drawer'"
      :formConfig="filterOptions.formConfig"
      :keyAgainstSaveFilter="
        filterOptions.formConfig?.filterPersistence?.persistenceKey
      "
      @filter-apply="applyFilters"
      class="mx-3"
    />

    <!-- <el-tooltip content="All Columns are Searchable">
      <i class="fa fa-info-circle" aria-hidden="true"></i>
    </el-tooltip> -->
  </div>
  <!--end::Card header-->
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <TableContent
      @on-items-select="onItemSelect"
      @on-sort="onSort"
      @row-click="rowClick"
      :header="header"
      :headerCapitalize="headerCapitalize"
      :tableBordered="tableBordered"
      :tableHover="tableHover"
      :data="dataToDisplay"
      :checkboxEnabled="checkboxEnabled"
      :checkboxLabel="checkboxLabel"
      :empty-table-text="loading ? `` : emptyTableText"
      :isReportModule="isReportModule"
      :isDateSelected="isDateSelected"
      :sort-label="sortLabel"
      :sort-order="sortOrder"
      :loading="loading"
    >
      <template
        v-for="head in header"
        :key="head.key"
        v-slot:[head.key]="{ row: item }"
      >
        <template v-if="$slots[head.key]">
          <slot :name="head.key" :row="item" />
        </template>
        <template v-else>
          <!-- if you pass a slot then that will not have a tooltip-->
          <el-tooltip
            v-if="
              item[head.key]?.length >
                (head.textOverflowLimit ? head.textOverflowLimit : 30) &&
              head.textOverflow
            "
            :content="item[head.key]"
            placement="top"
          >
            <span>{{
              `${item[head.key].slice(
                0,
                head.textOverflowLimit ? head.textOverflowLimit : 30
              )} .......`
            }}</span>
          </el-tooltip>
          <span v-else>{{ item[head.key] }}</span>
        </template>
      </template>
    </TableContent>
    <TableFooter
      @page-change="pageChange"
      :current-page="currentPage"
      v-model:itemsPerPage="itemsInTable"
      :count="totalItems"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import TableContent from "@/components/kt-datatable/table-partials/table-content/TableContent.vue";
import TableFooter from "@/components/kt-datatable/table-partials/TableFooter.vue";
import { Sort } from "@/components/kt-datatable/table-partials/models";
import { PaginatedData } from "@/core/interface/interfaces";
import config from "@/constants/apiConfig";
import arraySort from "array-sort";
import reuseableFilterVue from "@/components/filter/reuseableFilter.vue";
import FiltersTemplateDropdown from "../filter/FiltersTemplateDropdown.vue";
import inputWithToolTip from "./inputWithToolTip.vue";
import ButtonSpinner from "@/components/shared/spinners/ButtonSpinner.vue";
import { ModuleName } from "@/store/enums/module-enum";
import { useStore } from "vuex";

export default defineComponent({
  name: "kt-datatable",
  props: {
    header: { type: Array, required: true },
    headerCapitalize: { type: Boolean, required: false, default: false },
    tableBordered: { type: Boolean, required: false, default: false },
    tableHover: { type: Boolean, required: false, default: true },
    itemsPerPage: { type: Number, default: config.limitPerPage || 10 },
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    total: { type: Number, required: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    emptyTableText: { type: String, required: false, default: "No data found" },
    currentPage: { type: Number, required: false, default: 1 },
    fetchCallBack: { type: Function, required: true },
    searchPlaceholder: { type: String, required: false, default: "" },
    toolTipContent: { type: String, required: false, default: "" },
    paginationFromServer: { type: Boolean, required: false, default: true },
    filterOptions: { type: Object, required: false, default: null },
    filterDataManipulator: { type: Function, required: false },
    searchStringHandler: { type: Function, required: false },
    dataKeyToSearchAgainst: { type: String, required: false, default: "" },
    searchEnabled: { type: Boolean, required: false, default: true },
    inputWithToolTipEnabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    downloadEnabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDownloading: {
      type: Boolean,
      required: false,
      default: false,
    },
    isReportModule: { type: Boolean, required: false, default: false },
    isDateSelected: { type: Boolean, required: false, default: false },
    refreshKey: { type: Number, required: false, default: 0 },
    showLoadingSpinner: { type: Boolean, default: true },
    enableSearchInputLoading: { type: Boolean, default: false },
  },
  emits: [
    "page-change",
    "on-sort",
    "on-items-select",
    "on-items-per-page-change",
    "row-click",
    "update:totalCount",
    "on-download-click",
  ],
  components: {
    TableContent,
    TableFooter,
    ButtonSpinner,
    inputWithToolTip,
    reuseableFilterVue,
    FiltersTemplateDropdown,
  },
  setup(props, { emit }) {
    const store = useStore();
    const currentPage = ref(props.currentPage);
    const itemsInTable = ref<number>(props.itemsPerPage);
    const searchInputLoading = ref(false);
    const searchText = ref("");
    const reuseableFilterVueRef = ref();
    const queryParams = {
      limit: itemsInTable.value,
      search: searchText.value,
      page: 1,
      orderDirection: "",
      orderBy: "",
    };
    let appliedFilters = {};
    const loading = ref(false);

    watch(
      () => itemsInTable.value,
      async (val) => {
        currentPage.value = 1;
        queryParams.limit = val;
        queryParams.page = 1;
        props.paginationFromServer && fetchData();
        emit("on-items-per-page-change", val);
      }
    );

    let timer;
    watch(searchText, async (newSearch) => {
      if (props.searchStringHandler)
        newSearch = props.searchStringHandler(newSearch);
      clearTimeout(timer);
      timer = setTimeout(async () => {
        if (props.paginationFromServer) {
          currentPage.value = 1;
          searchText.value = newSearch;
          queryParams.search = newSearch;
          queryParams.page = 1;
          fetchData();
        } else {
          await fetchData();
          searchFromLocal(newSearch);
        }
      }, 500);
    });

    const searchFromLocal = async (newSearch) => {
      currentPage.value = 1;
      data.value = data.value.filter((element) => {
        const keysToSearchAgainst = props.dataKeyToSearchAgainst.split(",");

        // Check if any of the specified properties contain the search term
        return keysToSearchAgainst.some((key) => {
          return (
            element[key] &&
            element[key].toLowerCase().includes(newSearch.toLowerCase())
          );
        });
      });
    };

    const pageChange = async (page: number) => {
      currentPage.value = page;
      queryParams.page = page;
      props.paginationFromServer && fetchData();
      emit("page-change", page);
    };

    async function fetchData() {
      if (props.showLoadingSpinner && !searchInputLoading.value) {
        loading.value = true;
      }

      data.value = await props.fetchCallBack({
        ...queryParams,
        ...appliedFilters,
      });
      loading.value = false;
      searchInputLoading.value = false;

      if (!props.paginationFromServer) {
        emit("update:totalCount", data.value?.length);
      } else {
        emit("update:totalCount", data.value?.total);
      }
    }

    // add filters to applied filter object and fetchData
    async function applyFilters(data) {
      // revert to page 1 if filters is applied
      currentPage.value = 1;
      queryParams.page = 1;

      if (props.filterDataManipulator) data = props.filterDataManipulator(data);
      appliedFilters = data;
      await fetchData();
      if (!props.paginationFromServer && searchText.value.length) {
        searchFromLocal(searchText.value);
      }
    }

    let data;
    if (props.paginationFromServer) {
      data = ref({} as PaginatedData);
    } else {
      data = ref([]);
    }

    onMounted(() => {
      try {
        if (props.filterOptions) {
          if (
            props.filterOptions.formConfig?.filterPersistence &&
            props.filterOptions.formConfig?.filterPersistence?.canPersist ==
              true &&
            typeof props.filterOptions.formConfig?.filterPersistence
              ?.persistenceKey === "string" &&
            Object.keys(props.filterOptions?.formConfig?.queryParams).length ==
              0
          ) {
            const filterObject =
              store.getters[`${ModuleName.filters}/getSavedFilters`];
            if (filterObject) {
              if (
                filterObject[
                  props.filterOptions.formConfig?.filterPersistence
                    ?.persistenceKey
                ]
              ) {
                reuseableFilterVueRef.value?.applyFilter(
                  filterObject[
                    props.filterOptions.formConfig?.filterPersistence
                      ?.persistenceKey
                  ]
                );
              } else {
                fetchData();
              }
            } else {
              fetchData();
            }
          } else if (
            typeof props.filterOptions?.formConfig?.queryParams === "object" &&
            Object.keys(props.filterOptions?.formConfig?.queryParams).length > 0
          ) {
            reuseableFilterVueRef.value?.applyFilter(
              props.filterOptions?.formConfig?.queryParams
            );
          } else {
            fetchData();
          }
        } else {
          fetchData();
        }
      } catch (error) {
        console.log("error", error);
      }
    });

    watch(
      () => props.refreshKey,
      (val) => {
        fetchData();
      }
    );

    const dataToDisplay = computed(() => {
      if (!props.paginationFromServer) {
        if (data.value.length <= itemsInTable.value) {
          return data.value;
        } else {
          let sliceFrom = (currentPage.value - 1) * itemsInTable.value;
          return data.value.slice(sliceFrom, sliceFrom + itemsInTable.value);
        }
      }
      return data.value?.list ?? [];
    });

    const totalItems = computed(() => {
      if (!props.paginationFromServer) return data.value.length ?? 0;
      return data.value?.total ?? 0;
    });

    const onSort = (sort: Sort) => {
      if (props.paginationFromServer) {
        queryParams.orderBy = String(sort.key);
        queryParams.orderDirection = String(sort.order.toUpperCase());
        fetchData();
      } else {
        const reverse: boolean = sort.order === "asc";
        if (sort.key) {
          arraySort(data.value, sort.key, { reverse });
        }
      }
      emit("on-sort", sort);
    };

    //eslint-disable-next-line
    const onItemSelect = (selectedItems: any) => {
      emit("on-items-select", selectedItems);
    };
    const rowClick = (data) => {
      emit("row-click", data);
    };

    const onDownloadClick = () => {
      emit("on-download-click");
    };

    return {
      pageChange,
      dataToDisplay,
      onSort,
      onItemSelect,
      itemsInTable,
      totalItems,
      loading,
      searchText,
      applyFilters,
      rowClick,
      onDownloadClick,
      searchInputLoading,
      reuseableFilterVueRef,
    };
  },
});
</script>
