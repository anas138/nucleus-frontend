<template>
  <div class="card mb-5 mb-xl-10">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer bg-primary sticky-top"
      role="button"
      data-bs-target="#kt_account_profile_details"
      aria-expanded="true"
      aria-controls="kt_account_profile_details"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0 text-white">{{ title }}</h3>
      </div>
      <!--end::Card title-->
    </div>
    <!--begin::Card header-->

    <div id="kt_account_profile_details" class="collapse show">
      <form @submit.prevent="submitForm">
        <div class="card-body border-top p-9 flex-grow-1">
          <div v-for="(field, index) in fields" :key="index" class="form-group">
            <!--Start::Input group-->
            <div class="row mb-6">
              <label
                class="col-lg-4 col-form-label fw-semobold fs-6"
                :for="field.name"
              >
                <span :class="field.required ? 'required' : 'notReq'">
                  {{ field.label }}
                </span>
              </label>
              <div class="col-lg-8 fv-row align-items-center">
                <el-form-item
                  v-if="
                    field.type === 'text' ||
                    field.type === 'email' ||
                    field.type === 'password' ||
                    field.type === 'number'
                  "
                >
                  <el-input
                    :type="field.type"
                    :placeholder="field.placeholder"
                    :name="field.name"
                    :disabled="!field.editable"
                    v-model="form[field.name]"
                    @input="markAsTouched(field.name)"
                  />
                </el-form-item>

                <input
                  v-else-if="field.type === 'range'"
                  @input="markAsTouched(field.name)"
                  class="form-control form-control-lg form-control-solid"
                  :type="field.type"
                  :placeholder="field.placeholder"
                  :name="field.name"
                  :min="field.min"
                  :max="field.max"
                  :step="field.step"
                  :disabled="!field.editable"
                  v-model="form[field.name]"
                />
                <el-form-item v-else-if="field.type === 'component'">
                  <Component
                    :key="key"
                    :is="field.component"
                    :name="field.name"
                    :placeholder="field.placeholder"
                    :value="form[field.name]"
                    v-bind="field.props"
                    @change="change"
                  />
                </el-form-item>
                <div v-else-if="field.type === 'radio'">
                  <el-radio-group
                    v-model="form[field.name]"
                    @change="markAsTouched(field.name)"
                    :disabled="!field.editable"
                  >
                    <el-radio
                      v-for="(option, optionIndex) in field.options"
                      :key="optionIndex"
                      :label="option.label"
                    >
                      {{ option.label }}
                    </el-radio>
                  </el-radio-group>
                </div>
                <el-form-item v-else-if="field.type === 'dropdown'">
                  <el-select
                    @select="markAsTouched(field.name)"
                    :disabled="!field.editable"
                    v-model="form[field.name]"
                    :multiple="field.multiSelect"
                    filterable
                    default-first-option
                    class=""
                    :clearable="field.clearable"
                    :placeholder="field.placeholder"
                  >
                    <el-option
                      v-for="(option, optionIndex) in field.options"
                      :key="optionIndex"
                      :value="option.value"
                      :label="option.label"
                    >
                      {{ option.label }}
                    </el-option>
                  </el-select>
                </el-form-item>
                <div v-else-if="field.type === 'checkbox'">
                  <el-checkbox
                    v-model="form[field.name]"
                    :disabled="!field.editable"
                  >
                    {{ field.label }}
                  </el-checkbox>
                </div>
                <el-form-item v-else-if="field.type === 'textarea'">
                  <el-input
                    @input="markAsTouched(field.name)"
                    :disabled="!field.editable"
                    v-model="form[field.name]"
                    :placeholder="field.placeholder"
                    :type="field.type"
                    rows="3"
                    :name="field.name"
                  />
                </el-form-item>
                <div
                  class="fv-plugins-message-container"
                  v-if="field.type !== 'checkbox'"
                >
                  <div class="fv-help-block">
                    <div
                      v-if="field.validate && touched[field.name]"
                      class="error-message"
                    >
                      {{
                        validateField(field) === true
                          ? ""
                          : validateField(field)
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- end::Input group -->
          </div>
        </div>
        <!--begin::Actions-->
        <div
          class="card-footer d-flex justify-content-end py-6 px-9 sticky-bottom"
        >
          <button
            type="reset"
            class="btn btn-secondary btn-active-light-primary me-2"
            @click="resetFilters"
          >
            Reset
          </button>
          <save-filters-template-dialog
            v-if="canSaveTemplate"
            :templateType="templateType"
            :filtersForm="form"
          />
          <button
            type="submit"
            id="kt_account_profile_details_submit"
            ref="submitButton"
            class="btn btn-primary"
          >
            <span class="indicator-label"> Apply Filters </span>
            <span class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
        <!--end::Actions-->
      </form>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  watch,
  computed,
  onMounted,
} from "vue";
import SaveFiltersTemplateDialog from "../filter/SaveFiltersTemplateDialog.vue";
import { ModuleName } from "@/store/enums/module-enum";
import { FiltersTemplatesMutations } from "@/store/enums/StoreEnums";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { filtersMutations } from "@/store/enums/filers-enum";

export default defineComponent({
  components: { SaveFiltersTemplateDialog },
  name: "ReuseableFormForFilters",
  props: {
    fields: {
      type: Array,
      required: true,
    },
    validationSchema: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: "Filter",
    },
    canSaveTemplate: {
      type: Boolean,
      default: false,
    },
    templateType: {
      type: String,
    },
    canPersist: {
      type: Boolean,
      default: false,
    },
    keyAgainstSaveFilter: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    let form = {};
    let touched = {};
    let showSaveTemplateDialog = ref(false);
    const store = useStore();
    let clearFilter = computed(
      () =>
        store.getters[
          `${ModuleName.filtersTemplate}/getClearFiltersOnFilterTemplateSelect`
        ]
    );
    let templateDropdownValue = computed(
      () =>
        store.getters[`${ModuleName.filtersTemplate}/getSelectedTemplatesId`][
          props.templateType
        ]
    );

    props.fields.map((field) => {
      if (field.multiSelect) {
        form[field.name] = [...field.value];
      } else {
        form[field.name] = field.value;
      }
      touched[field.name] = false;
    });
    form = reactive({ ...form });
    touched = reactive(touched);
    const key = ref(0);
    const methods = {
      async submitForm() {
        // this dispatch action to store
        // store.dispatch(action, form);

        // Validate the form before submitting
        if (props.canPersist) {
          try {
            store.commit(
              `${ModuleName.filters}/${filtersMutations.SET_SAVE_FILTERS}`,
              { key: props.keyAgainstSaveFilter, value: { ...form } }
            );
          } catch (error) {
            console.log(error);
          }
        }
        if (this.validateForm()) {
          context.emit("submit", form);
          console.log("Form submitted successfully");
        } else {
          console.log("Form validation failed");
        }
        if (props.templateType) {
          this.resetFilterTemplate();
        }
      },
      resetFilters() {
        this.resetForm();
        if (props.canPersist) {
          const filterObject =
            store.getters[`${ModuleName.filters}/getSavedFilters`];

          if (filterObject) {
            store.commit(
              `${ModuleName.filters}/${filtersMutations.DELETE_SAVED_FILTER}`,
              props.keyAgainstSaveFilter
            );
          }
        }
        if (!templateDropdownValue.value) {
          context.emit("submit", {});
        }
        console.log("Form reset successfully");
      },
      resetForm() {
        // destroys all children components
        key.value = key.value + 1;

        Object.keys(form).forEach((val) => {
          if (Array.isArray(form[val])) {
            form[val] = [];
          } else {
            form[val] = "";
          }
        });
        if (Object.keys(route.query).length) {
          router.replace({ path: route.path, query: {} });
        }
      },
      resetFilterTemplate() {
        store.commit(
          `${ModuleName.filtersTemplate}/${FiltersTemplatesMutations.CLEAR_FILTER_TEMPLATES}`,
          {
            type: props.templateType,
          }
        );
      },
      isValid: false,
      validateForm() {
        if (props.validationSchema) {
          for (const field of props.fields) {
            this.markAllFieldAsTouched();
            if (
              field.validate &&
              typeof this.validateField(field) === "string"
            ) {
              return false;
            }
          }
        }
        return true;
      },
      validateField(field) {
        if (!field.validate) {
          this.isValid = true;
          return;
        }
        try {
          this.isValid = true;
          props.validationSchema[field.name].validateSync({
            [field.name]: form[field.name] || "",
          });
          return true;
        } catch (error) {
          this.isValid = false;
          return error.message;
        }
      },
      markAsTouched(fieldName) {
        if (form[fieldName]) {
          touched[fieldName] = true;
        }
      },
      markAllFieldAsTouched() {
        props.fields.map((field) => {
          touched[field.name] = true;
        });
      },
      change(data) {
        form[data.name] = data.value;
      },
      openSaveDialog() {
        showSaveTemplateDialog.value = true;
        console.log("showSaveTemplateDialog", showSaveTemplateDialog.value);
      },
    };

    watch(
      () => clearFilter.value,
      (val) => {
        if (!val) {
          methods.resetForm();
        }
      }
    );

    return {
      ...methods,
      form,
      touched,
      key,
      showSaveTemplateDialog,
    };
  },
  emits: ["submit"],
});
</script>
<style scoped>
.sticky-top {
  top: 0;
  z-index: 10;
}

.sticky-bottom {
  bottom: 0;
  z-index: 10;
  background-color: var(--kt-card-bg);
}
</style>
