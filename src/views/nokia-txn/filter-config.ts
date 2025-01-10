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

export const NceTXNFilterConfig = {
  formConfig: {
    title: `${AppConstants.NOKIA_TXN_PRESENTATION_NAME} Filters`,
    fields: [
      {
        label: "Alarm Name",
        name: "alarmName",
        type: "component",
        component: NokiaTXNAlarmNameDropDown,
        value: "",
        placeholder: "Select Alarm Name",
        props: {
          multiSelect: true,
        },
      },
      {
        label: "Devices",
        name: "devices",
        type: "component",
        component: NokiaTXNDevicesDropDown,
        value: "",
        placeholder: "Select Network Element",
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
          dropDownCatagory: dropDownsCategory.NOKIA_TXN_ALARM_SEVERITY,
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
    templateType: AppConstants.FILTER_TEMPLATE_TYPES.NOKIA_TXN,
    showTemplateSelection: true,
  },
};
