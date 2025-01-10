<template>
  <form @submit.prevent="submitForm" class="pt-5">
    <div class="">
      <div v-for="(field, index) in fields" :key="index" class="form-group">
        <!--Start::Input group-->
        <div class="row mb-6">
          <label
            class="col-lg-2 col-form-label fw-semobold fs-6"
            :for="field.name"
          >
            <span class="me-3" :class="field.required ? 'required' : 'notReq'">
              {{ field.label }}
            </span>
            <el-tooltip
              :content="field?.hint"
              :placement="'top'"
              v-if="field?.hint"
            >
              <i
                class="fa-solid fa-info tooltip_bg_color rounded-circle px-2 py-1 text-white fs-9"
              ></i
            ></el-tooltip>
          </label>
          <div class="col-lg-5 fv-row align-items-center">
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
                @change="field?.onChange"
                @input="markAsTouched(field.name)"
              />
            </el-form-item>

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
              @change="field?.onChange"
              v-model="form[field.name]"
            />
            <div v-else-if="field.type === 'radio'">
              <el-radio-group
                v-model="form[field.name]"
                @input="markAsTouched(field.name)"
                @change="field?.onChange"
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
                @change="field?.onChange"
                :disabled="!field.editable"
                v-model="form[field.name]"
                :multiple="field.multiSelect"
                filterable
                :clearable="field.clearable"
                default-first-option
                class=""
                :placeholder="field.placeholder"
              >
                <el-option
                  v-for="(option, optionIndex) in field.options"
                  :key="optionIndex"
                  :value="option?.value || option?.key"
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
                @change="field?.onChange"
              >
                {{ field.label }}
              </el-checkbox>
            </div>
            <el-form-item v-else-if="field.type === 'textarea'">
              <el-input
                @input="markAsTouched(field.name)"
                :disabled="!field.editable"
                v-model="form[field.name]"
                @change="field?.onChange"
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
                    validateField(field) === true ? "" : validateField(field)
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
    <div class="card-footer d-flex justify-content-end py-6 px-9">
      <button
        type="reset"
        @click="goBack"
        class="btn btn-secondary btn-active-light-primary me-2"
      >
        Go Back
      </button>

      <button
        type="submit"
        id="kt_account_profile_details_submit"
        ref="submitButton"
        class="btn btn-primary"
        v-if="actionButton === 'enabled'"
      >
        <span class="indicator-label" v-if="actionButton === 'enabled'">
          Submit
        </span>
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
</template>

<script>
import { defineComponent, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ReuseableForm",
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
      default: "Form",
    },
    actionButton: {
      type: String,
      default: "enabled",
    },
  },
  setup(props, context) {
    const router = useRouter();
    let form = {};
    let touched = {};

    props.fields.map((field, index) => {
      if (field.multiSelect) {
        form[field.name] = [...field.value];
      } else {
        form[field.name] = field.value;
      }
      touched[field.name] = false;
      // listen for changes in value
      watch(props.fields[index], (newField) => {
        form[newField.name] = newField.value;
      });
    });
    form = reactive({ ...form });
    touched = reactive(touched);
    const key = ref(0); // for destroying all children components

    const methods = {
      submitForm() {
        // this dispatch action to store
        // store.dispatch(action, form);

        // Validate the form before submitting
        if (this.validateForm()) {
          context.emit("submit", form);
          console.log("Form submitted successfully");
        } else {
          console.log("Form validation failed");
        }
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
      goBack() {
        // destroys all children components
        key.value = key.value + 1;

        router.go(-1);
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
      // this will only work for <components/>
      change(data) {
        props.field?.onChange(data.value);
        form[data.name] = data.value;
      },
    };

    return {
      ...methods,
      form,
      touched,
      key,
    };
  },
  emits: ["submit"],
});
</script>
