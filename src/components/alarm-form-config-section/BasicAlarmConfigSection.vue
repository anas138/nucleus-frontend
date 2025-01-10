<template>
  <div class="card mb-2">
    <!--begin::Card header-->
    <div
      class="card-header cursor-pointer bg-secondary"
      role="button"
      data-bs-target="#basicAlarmConfig"
      data-bs-toggle="collapse"
      aria-expanded="true"
      aria-controls="basicAlarmConfig"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0 required">Basic Alarm Config</h3>
        <span class="fs-6 fst-italic hint-class fw-normal mx-1"
          >(Setup basic alarm rule configuration)</span
        >
        <el-tooltip :content="hintContent" :placement="'top'">
          <i
            class="fa-solid fa-info bg-primary rounded-circle px-2 py-1 text-white fs-9 ms-1"
          ></i
        ></el-tooltip>
      </div>
      <!--end::Card title-->
    </div>
    <!--begin::Card header-->

    <div id="basicAlarmConfig" class="collapse show pt-3">
      <div class="row">
        <div
          v-for="(field, fieldKey) in basicAlarmConfig"
          :key="fieldKey"
          class="col-lg-4"
        >
          <label class="col-form-label fw-semibold fs-6">
            <span :class="field.required && `required`">
              {{ field.label }}
            </span>
            <span
              class="fs-6 fst-italic hint-class fw-normal mx-1"
              v-if="field?.subLabel"
              >({{ field?.subLabel }})</span
            >
          </label>
          <div class="fv-row align-items-center">
            <el-form-item>
              <Component
                :is="field.component"
                :name="field?.name"
                :placeholder="field?.placeholder"
                :value="field.value"
                v-bind="field.props"
                :disabled="disabled"
                :clearable="false"
                @change="change"
                @blur="touched[field.name] = true"
                @focus="touched[field.name] = false"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <div
                    v-if="
                      // touched[field.name] &&
                      errorMessageToggled && errors[field.name]
                    "
                    class="error-message"
                  >
                    {{ errors[field.name] }}
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
      </div>
      <hr />
      <div class="row" v-if="canChangeDisplaySeverity">
        <div class="col-lg-4">
          <label class="col-form-label fw-semibold fs-6">
            <span :class="`required`"> Can Change Severity</span>
          </label>
          <div class="fv-row align-items-center">
            <el-form-item>
              <BasicSwitchInput
                name="is_change_in_display_severity"
                :value="is_change_in_display_severity"
                v-model="is_change_in_display_severity"
                @change="change"
              />
            </el-form-item>
          </div>
        </div>
        <div class="col-lg-4" v-if="is_change_in_display_severity">
          <label class="col-form-label fw-semibold fs-6">
            <span :class="`required`">Conditional Severity</span>
          </label>
          <div class="fv-row align-items-center">
            <el-form-item>
              <DropDownFromServer
                name="conditional_severity"
                placeholder="Select Severity"
                v-model="conditional_severity"
                :dropDownCatagory="
                  appType === AppConstants.APP_TYPE.NCE
                    ? dropDownsCategory.NCE_SEVERITY
                    : appType === AppConstants.APP_TYPE.OBSERVIUM
                    ? dropDownsCategory.OBS_SEVERITY
                    : appType === AppConstants.APP_TYPE.NCE_GPON
                    ? dropDownsCategory.NCE_GPON_SEVERITY
                    : appType === AppConstants.APP_TYPE.NOKIA_TXN
                    ? dropDownsCategory.NOKIA_TXN_ALARM_SEVERITY
                    : dropDownsCategory.LDI_SOFTSWITCH_ALARM_SEVERITY
                "
                @change="change"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <div
                    v-if="
                      // touched[field.name] &&
                      errorMessageToggled && errors.conditional_severity
                    "
                    class="error-message"
                  >
                    {{ errors.conditional_severity }}
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
        <div class="col-lg-4" v-if="is_change_in_display_severity">
          <label class="col-form-label fw-semibold fs-6">
            <span :class="`required`">Severity To Be Displayed</span>
          </label>
          <div class="fv-row align-items-center">
            <el-form-item>
              <DropDownFromServer
                name="severity_to_be_displayed"
                placeholder="Select Severity"
                v-model="severity_to_be_displayed"
                :dropDownCatagory="
                  appType === AppConstants.APP_TYPE.NCE
                    ? dropDownsCategory.NCE_SEVERITY
                    : appType === AppConstants.APP_TYPE.OBSERVIUM
                    ? dropDownsCategory.OBS_SEVERITY
                    : appType === AppConstants.APP_TYPE.NCE_GPON
                    ? dropDownsCategory.NCE_GPON_SEVERITY
                    : appType === AppConstants.APP_TYPE.NOKIA_TXN
                    ? dropDownsCategory.NOKIA_TXN_ALARM_SEVERITY
                    : dropDownsCategory.LDI_SOFTSWITCH_ALARM_SEVERITY
                "
                @change="change"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <div
                    v-if="
                      // touched[field.name] &&
                      errorMessageToggled && errors.severity_to_be_displayed
                    "
                    class="error-message"
                  >
                    {{ errors.severity_to_be_displayed }}
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
      </div>
      <hr v-if="canChangeDisplaySeverity" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
import BasicNumberInput from "@/components/shared/inputs/BasicNumberInput.vue";
import DropDownFromServer from "@/components/shared/dropdowns/DropDownFromServer.vue";
import { dropDownsCategory } from "@/constants/drop-down-from-server";
import BasicDropDown from "@/components/shared/dropdowns/BasicDropDown.vue";
import basicTextInput from "@/components/shared/inputs/basicTextInput.vue";
import * as Yup from "yup";
import { proxyToObject } from "@/core/helpers/utils";
import { IBasicAlarmConfig } from "@/core/interface/alarm-config-interfaces";
import EmailEscalationVue from "./compound-component/EmailEscalation.vue";
import TicketEscalationVue from "./compound-component/TicketEscalation.vue";
import RecordStatus from "./compound-component/RecordStatus.vue";
import { AppConstants } from "@/constants/app-constants";
import BasicSwitchInput from "../shared/inputs/BasicSwitchInput.vue";

export default {
  components: {
    BasicSwitchInput,
    DropDownFromServer,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    appType: {
      type: String,
      required: true,
      validator: function (value) {
        return (
          value === AppConstants.APP_TYPE.NCE ||
          value === AppConstants.APP_TYPE.OBSERVIUM ||
          value === AppConstants.APP_TYPE.NCE_GPON ||
          value === AppConstants.APP_TYPE.NOKIA_TXN ||
          value === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
        );
      },
    },
    value: {
      type: Object as () => IBasicAlarmConfig,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    errorMessageToggled: {
      type: Boolean,
      required: false,
      default: false,
    },
    canChangeDisplaySeverity: {
      type: Boolean || undefined,
    },
  },
  emits: ["change", "isValid"],
  setup(props, ctx) {
    const is_change_in_display_severity = ref(
      props?.value?.is_change_in_display_severity || false
    );
    const conditional_severity = ref(props?.value?.conditional_severity || "");
    const severity_to_be_displayed = ref(
      props?.value?.severity_to_be_displayed || ""
    );
    const hintContent =
      props.appType === AppConstants.APP_TYPE.NCE ||
      props.appType === AppConstants.APP_TYPE.NCE_GPON ||
      props.appType === AppConstants.APP_TYPE.NOKIA_TXN
        ? "Rules are matched based on 'Name' and Advanced Conditions."
        : "Rules are matched using Advanced Conditions only.";

    // make sure that key and component is same in below obj
    // as value will be updated based the component name
    const value = ref({
      alarm_name: props?.value?.alarm_name || "",
      severity: props?.value?.severity || "",
      is_regional_escalation: props.value
        ? props?.value?.is_regional_escalation
        : true,
      email_escalation_delay: props?.value?.email_escalation_delay || 0,
      ticket_escalation_delay: props?.value?.ticket_escalation_delay || 0,
      is_email_escalation: props?.value?.is_email_escalation || false,
      is_ticket_escalation: props?.value?.is_ticket_escalation || false,
      record_status: props?.value?.record_status || "ACTIVE",
      description: props?.value?.description || "",
    });

    if (props.canChangeDisplaySeverity) {
      Object.assign(value.value, {
        ...value.value,
        is_change_in_display_severity:
          props?.value?.is_change_in_display_severity || false,
      });
    }

    if (props?.value?.conditional_severity) {
      Object.assign(value.value, {
        ...value.value,
        conditional_severity: props?.value?.conditional_severity || "",
      });
    }

    if (props?.value?.severity_to_be_displayed) {
      Object.assign(value.value, {
        ...value.value,
        severity_to_be_displayed: props?.value?.severity_to_be_displayed || "",
      });
    }

    watch(
      () => is_change_in_display_severity.value,
      (val) => {
        if (val) {
          Object.assign(value.value, {
            ...value.value,
            is_change_in_display_severity: true,
            conditional_severity: props?.value?.conditional_severity || "",
            severity_to_be_displayed:
              props?.value?.severity_to_be_displayed || "",
          });
          validateFields();
        } else {
          delete value.value["is_change_in_display_severity"];
          delete value.value["conditional_severity"];
          delete value.value["severity_to_be_displayed"];
          conditional_severity.value = "";
          severity_to_be_displayed.value = "";
        }
      }
    );

    const touched = ref({
      alarm_name: false,
      severity: false,
      is_regional_escalation: false,
      email_escalation_delay: false,
      ticket_escalation_delay: false,
      record_status: false,
    });

    //this maintains a error message for field
    const errors = ref({});

    //validation schema
    const schema = Yup.object().shape({
      alarm_name: Yup.string()
        .required("Name is required")
        .min(1, "Name must not be empty"),
      severity: Yup.string().required("Severity is required"),
      is_regional_escalation: Yup.boolean().required(
        "Regional Escalation is required"
      ),
      email_escalation_delay: Yup.number()
        .required("Email Escalation is required")
        .min(0),
      is_email_escalation: Yup.boolean().required(
        "Email Escalation is required"
      ),
      ticket_escalation_delay: Yup.number()
        .required("Ticket Escalation is required")
        .min(0),
      is_ticket_escalation: Yup.boolean().required(
        "Ticket Escalation is required"
      ),
      record_status: Yup.string()
        .required("Status is required")
        .min(1, "Status must not be empty"),
      description: Yup.string().optional(),
      is_change_in_display_severity: Yup.boolean().required(
        "Change Display Severity is required"
      ),
      conditional_severity: Yup.string().required(
        "Conditional Severity is required"
      ),
      severity_to_be_displayed: Yup.string().required(
        "Display Severity is required"
      ),
    });

    const basicAlarmConfig = reactive([
      {
        name: "alarm_name",
        label: "Name",
        value: value.value.alarm_name,
        component: basicTextInput,
        placeholder: "Enter Alarm Name",
        required: true,
      },
      {
        name: "severity",
        label: "Severity",
        subLabel: "Threshold Severity",
        value: value.value.severity,
        component: DropDownFromServer,
        placeholder: "Select Severity",
        required: true,
        props: {
          dropDownCatagory:
            props.appType === AppConstants.APP_TYPE.NCE
              ? dropDownsCategory.NCE_SEVERITY
              : props.appType === AppConstants.APP_TYPE.OBSERVIUM
              ? dropDownsCategory.OBS_SEVERITY
              : props.appType === AppConstants.APP_TYPE.NCE_GPON
              ? dropDownsCategory.NCE_GPON_SEVERITY
              : props.appType === AppConstants.APP_TYPE.NOKIA_TXN
              ? dropDownsCategory.NOKIA_TXN_ALARM_SEVERITY
              : dropDownsCategory.LDI_SOFTSWITCH_ALARM_SEVERITY,
        },
      },
      {
        name: "is_regional_escalation",
        label: "Is Regional Escalation",
        value: value.value.is_regional_escalation,
        component: BasicDropDown,
        placeholder: "",
        required: true,
        props: {
          multiSelect: false,
          list: [
            {
              key: true,
              label: "True",
            },
            {
              key: false,
              label: "False",
            },
          ],
        },
      },
      {
        name: "description",
        label: "Description",
        value: value.value.description,
        component: basicTextInput,
        placeholder: "Enter Description",
        required: false,
      },
      {
        label: "Email Escalation ( min )",
        value: {
          email_escalation_delay: value.value.email_escalation_delay,
          is_email_escalation: value.value.is_email_escalation,
        },
        component: EmailEscalationVue,
        required: true,
        props: {},
      },
      {
        label: "Ticket Escalation ( min )",
        value: {
          ticket_escalation_delay: value.value.ticket_escalation_delay,
          is_ticket_escalation: value.value.is_ticket_escalation,
        },
        component: TicketEscalationVue,
        required: true,
        props: {},
      },
      {
        label: "Status",
        value: {
          record_status: value.value.record_status,
        },
        component: RecordStatus,
        required: true,
        props: {},
      },
    ]);

    //sends validation as false/true on initail form load
    ctx.emit("isValid", {
      value: props.value ? true : false,
      name: props.name,
    });

    function change(data) {
      value.value[data.name] =
        typeof data?.value === "string" ? data?.value?.trim() : data.value;
      ctx.emit("change", {
        value: {
          ...proxyToObject(value.value),
          app_type: props.appType.toUpperCase(),
        },
        name: props.name,
      });
      schema
        .validateAt(data.name, value.value, { abortEarly: false })
        .then(() => {
          // Validation successful, emit isValid with true
          ctx.emit("isValid", { value: true, name: props.name });
          errors.value[data.name] = "";
        })
        .catch((error) => {
          // Validation failed, emit isValid with false and error messages
          errors.value[data.name] = error.inner[0].message;
          ctx.emit("isValid", { value: false, name: props.name });
        });
    }

    function validateFields() {
      Object.keys(value.value).forEach((key) => {
        schema
          .validateAt(key, value.value, { abortEarly: false })
          .then(() => {
            // Validation successful, handle accordingly
            ctx.emit("isValid", { value: true, name: props.name });
            errors.value[key] = "";
          })
          .catch((error) => {
            // Validation failed, store error message
            errors.value[key] = error.inner[0].message;
            ctx.emit("isValid", { value: false, name: props.name });
          });
      });
    }

    onMounted(() => {
      validateFields();
    });

    return {
      change,
      basicAlarmConfig,
      errors,
      touched,
      hintContent,
      is_change_in_display_severity,
      dropDownsCategory,
      conditional_severity,
      severity_to_be_displayed,
      AppConstants,
    };
  },
};
</script>

<style></style>
