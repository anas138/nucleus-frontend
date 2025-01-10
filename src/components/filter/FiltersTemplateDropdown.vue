<template>
  <div
    class="d-flex justify-content-start align-items-center mx-2 dd__filters-container"
  >
    <button
      class="btn btn-outline btn-outline-primary mx-1"
      @click="openDrawer = true"
      style="position: relative"
    >
      <div class="d-flex justify-content-center align-items-center">
        <span class="mr-1">
          Filters Template <span class="mx-2">(Your watchlist)</span></span
        >
        <span><i class="fa fa-chevron-down"></i></span>
      </div>
      <span
        class="badge bg-danger"
        style="position: absolute; top: -10px; right: -10px"
        v-if="templateDropdownValue"
      >
        1
      </span>
    </button>
    <!-- <el-select
      v-model="templateDropdownValue"
      placeholder="Select Template"
      @change="onChange"
      clearable
    >
      <el-option
        v-for="item in templatesData"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select> -->

    <!-- Another design option -->
    <el-drawer v-model="openDrawer" size="30%" :close-on-click-modal="true">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <div class="card-title">
            <h3 class="text-white text-wrap">Quick Filter your watchlist</h3>
          </div>
        </div>
        <div class="card-body">
          <div v-if="templatesData && templatesData.length">
            <p class="tip text-wrap">
              You can save multiple templates from `Filters` form screen and
              switch them here.
            </p>
            <span class="mb-3"><i class="fa fa-list"></i> My Templates</span>
            <ul class="filters__list list-group">
              <li
                :class="[
                  {
                    'filters__list__selected-item':
                      templateDropdownValue === item.id,
                  },
                  'filters__list-item',
                  'list-group-item',
                ]"
                v-for="item in templatesData"
                :key="`filter-item-${item.id}`"
              >
                <span
                  :class="[
                    {
                      'filters__list__selected-item-text':
                        templateDropdownValue === item.id,
                    },
                    'filters__list-item-text text-wrap',
                  ]"
                  @click="onSelectDrawerOption(item.id)"
                >
                  {{ item.name }}</span
                >
                <span>
                  <i
                    class="fa fa-check-circle me-2 text-success"
                    v-if="templateDropdownValue === item.id"
                  ></i>
                  <el-popconfirm
                    confirm-button-text="Yes"
                    cancel-button-text="No"
                    :icon="InfoFilled"
                    icon-color="#626AEF"
                    title="Are you sure to delete this?"
                    @confirm="deleteFilter(item.id)"
                  >
                    <template #reference>
                      <span><i class="fa fa-trash"></i></span>
                    </template>
                  </el-popconfirm>
                </span>
              </li>
            </ul>
            <div class="d-flex justify-content-end mt-5">
              <button
                type="reset"
                class="btn btn-secondary btn-active-light-primary"
                @click="resetFilterTemplate"
              >
                Reset
              </button>
            </div>
          </div>
          <div
            class="d-flex flex-column justify-content-center align-items-center"
            v-else
          >
            <img class="h-150px h-lg-300px" :src="$emptyDataImageUrl" alt="" />
            <h5 class="text-wrap">No Templates Saved Yet</h5>
            <p class="text-wrap">
              You can save multiple templates from `Filters` form screen and
              switch them here.
            </p>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { proxyToObject } from "@/core/helpers/utils";
import { FiltersTemplateActions } from "@/store/enums/StoreEnums";
import { ModuleName } from "@/store/enums/module-enum";
import { FiltersTemplatesMutations } from "@/store/enums/StoreEnums";
interface IOptions {
  label: string;
  value: number | string;
}
export default {
  props: {
    templateType: {
      type: String,
      required: true,
    },
  },
  emits: ["change"],
  setup(props, { emit }) {
    const store = useStore();
    store.dispatch(
      `${ModuleName.filtersTemplate}/${FiltersTemplateActions.Get_ALL_FILTERS_TEMPLATE}`,
      props.templateType
    );
    let templateDropdownValue = computed(
      () =>
        store.getters[`${ModuleName.filtersTemplate}/getSelectedTemplatesId`][
          props.templateType
        ]
    );
    let templatesData = computed(
      () =>
        store.getters[`${ModuleName.filtersTemplate}/getFilterTemplates`][
          props.templateType
        ]
    ); // later fetch from Backend
    let optionGroups: { label: string; options: IOptions[] }[] = [];
    let options: IOptions[] = [];
    const openDrawer = ref(false);

    const methods = {
      onChange(selectedValue) {
        openDrawer.value = false;
        const selectedTemplate = templatesData.value.find(
          (item) => item.id == selectedValue
        );
        if (selectedTemplate) {
          console.log("selectedTemplate", proxyToObject(selectedTemplate));
          emit("change", proxyToObject(selectedTemplate).filters_payload);
        } else {
          emit("change", null);
        }
      },
      deleteFilter(id) {
        store.dispatch(
          FiltersTemplateActions.getNameSpacedAction(
            FiltersTemplateActions.DELETE_FILTERS_TEMPLATE
          ),
          { id, template_type: props.templateType }
        );
      },
      resetFilterTemplate() {
        if (templateDropdownValue.value) {
          store.commit(
            `${ModuleName.filtersTemplate}/${FiltersTemplatesMutations.CLEAR_FILTER_TEMPLATES}`,
            {
              type: props.templateType,
            }
          );
          this.onChange(null);
        }
      },
      onSelectDrawerOption(id) {
        // templateDropdownValue.value = id;
        store.commit(
          `${ModuleName.filtersTemplate}/${FiltersTemplatesMutations.SELECTED_TEMPLATE_ID}`,
          {
            type: props.templateType,
            id: id,
          }
        );
        store.commit(
          `${ModuleName.filtersTemplate}/${FiltersTemplatesMutations.CLEAR_FILTERS}`,
          false
        );
        this.onChange(id);
      },
    };

    onUnmounted(() => {
      store.commit(
        `${ModuleName.filtersTemplate}/${FiltersTemplatesMutations.CLEAR_FILTER_TEMPLATES}`,
        {
          type: props.templateType,
        }
      );
    });

    return {
      ...methods,
      templatesData,
      options,
      templateDropdownValue,
      optionGroups,
      openDrawer,
    };
  },
};
</script>

<style scoped>
.dd__filters-container {
  border-radius: 8px;
  padding: 4px;
  padding-left: 8px;
  padding-right: 8px;
  white-space: nowrap;
  /* background: #f5daab; */
}
.filters__list {
  list-style: none;
  margin-top: 0.8rem;
}
.filters__list-item {
  padding: 8px;
  display: flex;
  justify-content: space-between;
}
.filters__list__selected-item {
  background: var(--kt-light);
  cursor: pointer;
}
.filters__list__selected-item-text {
  font-weight: bold;
  color: var(--kt-dark);
}
.filters__list-item:hover {
  background: var(--kt-light);
  cursor: pointer;
}
.filters__list-item-text:hover {
  color: var(--kt-primary);
}
</style>
