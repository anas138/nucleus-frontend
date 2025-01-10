<template>
  <div
    class="d-flex justify-content-end"
    data-kt-subscription-table-toolbar="base"
  >
    <button
      class="btn btn-primary"
      @click="openFilter = true"
      style="position: relative"
    >
      <span class="svg-icon svg-icon-2">
        <i class="bi bi-funnel w-10px"></i>
      </span>
      <span
        v-if="filterCount > 0"
        class="badge bg-danger"
        style="position: absolute; top: -10px; right: -10px"
      >
        {{ filterCount }}
      </span>
      Filters
    </button>

    <el-drawer
      v-model="openFilter"
      :size="width > 450 ? '480px' : '80%'"
      :close-on-click-modal="true"
    >
      <ReuseableFormForFilters
        :fields="formConfig.fields"
        :title="formConfig.title"
        :validationSchema="formConfig.validationSchema"
        @submit="applyFilter"
        :canSaveTemplate="formConfig.canSaveTemplate"
        :templateType="formConfig.templateType"
        :canPersist="formConfig?.filterPersistence?.canPersist"
        :keyAgainstSaveFilter="keyAgainstSaveFilter"
      />
    </el-drawer>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import ReuseableFormForFilters from "../forms/ReuseableFormForFilters.vue";
import { ModuleName } from "@/store/enums/module-enum";
import { FiltersTemplatesMutations } from "@/store/enums/StoreEnums";
import { useStore } from "vuex";
export default {
  props: {
    display: { type: String, required: false, default: "drawer" },
    formConfig: { type: Object, required: true },
    keyAgainstSaveFilter: { type: String, default: "" },
  },
  emits: ["filter-apply"],
  components: {
    ReuseableFormForFilters,
  },
  setup(props, { emit }) {
    const openFilter = ref(false);
    const filterCount = ref(0);
    // ---------- logic for determining size of window
    const windowWidth = ref(window.innerWidth);

    const onWidthChange = () => (windowWidth.value = window.innerWidth);
    onMounted(() => window.addEventListener("resize", onWidthChange));
    onUnmounted(() => window.removeEventListener("resize", onWidthChange));

    const width = computed(() => windowWidth.value);

    onMounted(() => {
      try {
        if (
          props.formConfig?.filterPersistence?.canPersist &&
          Object.keys(props.formConfig?.queryParams).length === 0
        ) {
          const filterObject =
            store.getters[`${ModuleName.filters}/getSavedFilters`];
          if (filterObject) {
            if (filterObject[props.keyAgainstSaveFilter]) {
              props.formConfig?.fields.forEach((field) => {
                if (filterObject[props.keyAgainstSaveFilter][field.name]) {
                  field.value =
                    filterObject[props.keyAgainstSaveFilter][field.name];
                }
              });
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

    const store = useStore();
    let clearFilter = computed(
      () =>
        store.getters[
          `${ModuleName.filtersTemplate}/getClearFiltersOnFilterTemplateSelect`
        ]
    );
    //---------------------------------------------
    function applyFilter(data) {
      filterCount.value = 0;
      console.log(data);
      for (let key in data) {
        if (data[key] && data[key].length !== 0) {
          filterCount.value++;
        }
      }
      openFilter.value = false;
      emit("filter-apply", data);
      store.commit(
        `${ModuleName.filtersTemplate}/${FiltersTemplatesMutations.CLEAR_FILTERS}`,
        true
      );
    }

    watch(
      () => clearFilter.value,
      (val) => {
        if (!val) {
          filterCount.value = 0;
        }
      }
    );
    return {
      openFilter,
      applyFilter,
      filterCount,
      width,
    };
  },
};
</script>
