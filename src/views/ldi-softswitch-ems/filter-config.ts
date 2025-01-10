import NeDevicesDropDown from "@/components/shared/dropdowns/NeDevicesDropDown.vue";
import NCEAlarmNameDropDown from "@/components/shared/dropdowns/NCEAlarmNameDropDown.vue";
import DropDownFromServer from "@/components/shared/dropdowns/DropDownFromServer.vue";
import { dropDownsCategory } from "@/constants/drop-down-from-server";
import FromToSelector from "@/components/shared/date-selector/FromToSelector.vue";
import { AppConstants } from "@/constants/app-constants";
import NCEGponAlarmNameDropDown from "@/components/shared/dropdowns/NCEGponAlarmNameDropDown.vue";
import NceGponDevicesDropDown from "@/components/shared/dropdowns/NceGponDevicesDropDown.vue";
import NokiaTXNAlarmNameDropDown from "@/components/shared/dropdowns/NokiaTXNAlarmNameDropDown.vue";
import NokiaTXNDevicesDropDown from "@/components/shared/dropdowns/NokiaTXNDevicesDropDown.vue";
import LDISoftswitchEMSAlarmNameDropDown from "@/components/shared/dropdowns/LDISoftswitchEMSAlarmNameDropDown.vue";
import LDISoftswitchEMSTrunksDropDown from "@/components/shared/dropdowns/LDISoftswitchEMSTrunksDropDown.vue";

export const LDISoftswitchEMSFilterConfig = {
  formConfig: {
    title: `${AppConstants.LDI_SOFTSWITCH_EMS_PRESENTATION_NAME} Filters`,
    fields: [
      {
        label: "Alarm Rules",
        name: "alarmFilterConfigId",
        type: "component",
        component: LDISoftswitchEMSAlarmNameDropDown,
        value: "",
        placeholder: "Select Alarm Rule",
        props: {
          multiSelect: true,
        },
      },
      {
        label: "Trunks Group",
        name: "trunkGroup",
        type: "component",
        component: LDISoftswitchEMSTrunksDropDown,
        value: "",
        placeholder: "Select Trunk Group",
        props: {
          multiSelect: true,
        },
      },
      {
        label: "Severity",
        name: "severity",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select Severity",
        props: {
          multiSelect: false,
          dropDownCatagory: dropDownsCategory.LDI_SOFTSWITCH_ALARM_SEVERITY,
        },
      },
      {
        label: "Alarm Type",
        name: "alarmType",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select Alarm Type",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.ALARM_TYPE,
        },
      },
      {
        label: "Alarm Status",
        name: "alarmStatus",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select Alarm Status",
        props: {
          multiSelect: false,
          dropDownCatagory: dropDownsCategory.ALARM_STATUS,
        },
      },
      {
        label: "Occured On",
        name: "lastOccurred",
        type: "component",
        component: FromToSelector,
      },
    ],
    actionButton: "enabled",
    canSaveTemplate: true,
    templateType: AppConstants.FILTER_TEMPLATE_TYPES.LDI_SOFTSWITCH_EMS,
    showTemplateSelection: true,
  },
};
