<template>
  <div class="card mb-2">
    <!--begin::Card header-->
    <div
      class="card-header cursor-pointer bg-secondary"
      role="button"
      data-bs-target="#TicketEscalationConfig"
      data-bs-toggle="collapse"
      aria-expanded="true"
      aria-controls="TicketEscalationConfig"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0 required">Ticket Escalation Config</h3>
        <span class="fs-6 fst-italic hint-class fw-normal mx-1"
          >(Setup basic alarm rule configuration)</span
        >
      </div>
      <!--end::Card title-->
    </div>
    <!--begin::Card header-->

    <div id="TicketEscalationConfig" class="collapse show pt-3">
      <div class="row">
        <div
          v-for="(field, fieldKey) in TicketEscalationConfig"
          :key="fieldKey"
          class="col-lg-4"
        >
          <label
            class="col-form-label d-flex align-items-center fw-semibold fs-6"
          >
            <span :class="field.required ? `required me-3` : 'me-3'">
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
          <div class="fv-row align-items-center" :key="updateKey">
            <el-form-item>
              <Component
                :is="field.component"
                :name="field?.name"
                :placeholder="field?.placeholder"
                :value="field.value"
                v-bind="field.props"
                :disabled="disabled"
                :clearable="field.clearable"
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
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch, reactive } from "vue";
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
import SubDepartmentEngineeringDropDown from "../shared/dropdowns/SubDepartmentEngineeringDropDown.vue";
import TicketReversalNotificationStatus from "./compound-component/TicketReversalNotificationStatus.vue";
import CategoryDropDown from "../shared/dropdowns/CategoryDropDown.vue";
import SubCategoryDropDown from "../shared/dropdowns/SubCategoryDropDown.vue";
import { useRoute } from "vue-router";
import NeDevicesDropDown from "../shared/dropdowns/NeDevicesDropDown.vue";
import { AppConstants } from "@/constants/app-constants";
import ObsDevicesDropDown from "../shared/dropdowns/ObsDevicesDropDown.vue";
import NceGponDevicesDropDown from "../shared/dropdowns/NceGponDevicesDropDown.vue";
import NokiaTXNDevicesDropDown from "../shared/dropdowns/NokiaTXNDevicesDropDown.vue";
import LDISoftswitchEMSTrunksDropDown from "../shared/dropdowns/LDISoftswitchEMSTrunksDropDown.vue";

export default {
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
      type: Object,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    toggledValue: {
      type: Boolean,
      required: false,
    },
    errorMessageToggled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["change", "isValid", "resetFromParent"],
  setup(props, ctx) {
    // make sure that key and component is same in below obj
    // as value will be updated based the component name
    const updateKey = ref(0);
    const value = ref({
      ticket_escalation_initial_sub_department:
        props?.value?.ticket_escalation_initial_sub_department || "",
      // ticket_escalation_medium: props?.value?.ticket_escalation_medium || "",
      can_revert_ticket_on_alarm_recovery:
        props?.value?.can_revert_ticket_on_alarm_recovery || false,
      ticket_escalation_category:
        props?.value?.ticket_escalation_category || null,
      ticket_escalation_sub_category:
        props?.value?.ticket_escalation_sub_category || null,
      ticket_escalation_device: props?.value?.ticket_escalation_device || [],
    });

    const touched = ref({
      ticket_escalation_initial_sub_department: false,
      // ticket_escalation_medium: false,
      can_revert_ticket_on_alarm_recovery: false,
      ticket_escalation_category: false,
      ticket_escalation_device: false,
      //   ticket_escalation_sub_category: false,
    });

    //this maintains a error message for field
    const errors = ref({});

    //validation schema
    const schema = Yup.object().shape({
      ticket_escalation_initial_sub_department: Yup.string().required(
        "Sub-Department is required"
      ),
      // ticket_escalation_medium: Yup.string().required("Medium is required"),
      can_revert_ticket_on_alarm_recovery: Yup.boolean().required(
        "Ticket Reversal Notification is required"
      ),
      ticket_escalation_category: Yup.number()
        .nullable()
        .required("Category is required"),
      ticket_escalation_sub_category: Yup.number().nullable().optional(),
      ticket_escalation_device: Yup.array().optional(),
    });

    const clearDropDownValue = ref<boolean>(false);

    const TicketEscalationConfig = reactive([
      {
        name: "ticket_escalation_initial_sub_department",
        label: "Sub-Department",
        value: value.value.ticket_escalation_initial_sub_department,
        component: SubDepartmentEngineeringDropDown,
        placeholder: "Select Sub-Department",
        required: true,
        clearable: true,
      },
      // {
      //   name: "ticket_escalation_medium",
      //   label: "Medium",
      //   value: value.value.ticket_escalation_medium,
      //   component: DropDownFromServer,
      //   placeholder: "Select Medium",
      //   props: {
      //     multiSelect: false,
      //     emitDataType: 0,
      //     dropDownCatagory: dropDownsCategory.TROUBLE_TICKET_MEDIUM,
      //   },
      // },

      {
        name: "ticket_escalation_category",
        label: "Category",
        value: value.value.ticket_escalation_category,
        component: CategoryDropDown,
        placeholder: "Select Category",
        required: true,
        clearable: true,
        props: {},
      },
      {
        name: "ticket_escalation_sub_category",
        label: "Sub Category",
        value: value.value.ticket_escalation_sub_category,
        component: SubCategoryDropDown,
        placeholder: "Select Sub Category",
        required: false,
        clearable: true,
        props: {
          //categoryId: parentCategoryId.value,
          categoryId: value.value.ticket_escalation_category,
          clearDropDownValue: clearDropDownValue.value,
        },
        events: {},
      },
      {
        label:
          props.appType === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
            ? "Trunk groups for ticketing"
            : "Network devices for ticketing",
        name: "ticket_escalation_device",
        type: "component",
        component:
          props.appType === AppConstants.APP_TYPE.NCE
            ? NeDevicesDropDown
            : props.appType === AppConstants.APP_TYPE.OBSERVIUM
            ? ObsDevicesDropDown
            : props.appType === AppConstants.APP_TYPE.NCE_GPON
            ? NceGponDevicesDropDown
            : props.appType === AppConstants.APP_TYPE.NOKIA_TXN
            ? NokiaTXNDevicesDropDown
            : LDISoftswitchEMSTrunksDropDown,
        required: false,
        value: value.value.ticket_escalation_device,
        placeholder:
          props.appType === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
            ? "Select Trunk Groups"
            : "Select Network Devices",
        props: {
          multiSelect: true,
          emitDataType:
            props.appType === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
              ? 0
              : "string",
        },
        hint:
          props.appType === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
            ? "Select trunk groups to enable ticketing against them"
            : "Select network devices to enable ticketing against them",
      },
      {
        name: "can_revert_ticket_on_alarm_recovery",
        label: "Enable Ticket Auto Cancelation",
        required: false,
        clearable: false,
        value: {
          can_revert_ticket_on_alarm_recovery:
            value.value.can_revert_ticket_on_alarm_recovery,
        },
        component: TicketReversalNotificationStatus,
        props: {},
        hint: "Enable trouble ticket auto cancelation on alarm recovery",
      },
    ]);

    //sends validation as false/true on initail form load
    ctx.emit("isValid", {
      value: props.value ? true : false,
      name: props.name,
    });

    function change(data) {
      if (data.name == "ticket_escalation_category") {
        TicketEscalationConfig.forEach((val) => {
          if (val.name == "ticket_escalation_sub_category") {
            clearDropDownValue.value = !clearDropDownValue.value;
            val.props = {
              categoryId: data.value,
              clearDropDownValue: clearDropDownValue.value,
            };
            val.value = null;
            value.value.ticket_escalation_sub_category = null;
          }
        });
      }
      value.value[data.name] = data.value;
      ctx.emit("change", {
        value: {
          ...proxyToObject(value.value),
        },
        name: props.name,
      });
      validateAllKeys();
    }

    const validateAllKeys = () => {
      if (props.toggledValue) {
        Object.keys(value.value).forEach((key) => {
          schema
            .validateAt(key, value.value, { abortEarly: false })
            .then(() => {
              // Validation successful, handle accordingly
              errors.value[key] = "";
              ctx.emit("isValid", { value: true, name: props.name });
            })
            .catch((error) => {
              // Validation failed, store error message
              errors.value[key] = error.inner[0].message;
              ctx.emit("isValid", { value: false, name: props.name });
            });
        });
      } else {
        ctx.emit("isValid", { value: true, name: props.name });
        ctx.emit("resetFromParent");
      }
    };

    watch(
      () => props.toggledValue,
      (val) => {
        if (!val) {
          Object.assign(value.value, {
            ticket_escalation_initial_sub_department: "",
            // ticket_escalation_medium: "",
            can_revert_ticket_on_alarm_recovery: false,
            ticket_escalation_category: null,
            ticket_escalation_sub_category: null,
            ticket_escalation_device: [],
          });
          TicketEscalationConfig.forEach((val) => {
            if (val.name !== "can_revert_ticket_on_alarm_recovery") {
              val.value = null;
            } else {
              val.value = { can_revert_ticket_on_alarm_recovery: false };
            }
          });
          errors.value = [];
          ctx.emit("isValid", { value: true, name: props.name });
          ctx.emit("resetFromParent");
        } else {
          validateAllKeys();
          updateKey.value++;
          if (!props.value) {
            ctx.emit("isValid", { value: false, name: props.name });
          }
        }
      },
      {
        immediate: true,
      }
    );

    return {
      change,
      TicketEscalationConfig,
      errors,
      touched,
      updateKey,
    };
  },
};
</script>
