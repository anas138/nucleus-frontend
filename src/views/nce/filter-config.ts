import NeDevicesDropDown from "@/components/shared/dropdowns/NeDevicesDropDown.vue";
import NCEAlarmNameDropDown from "@/components/shared/dropdowns/NCEAlarmNameDropDown.vue";
import DropDownFromServer from "@/components/shared/dropdowns/DropDownFromServer.vue";
import { dropDownsCategory } from "@/constants/drop-down-from-server";
import FromToSelector from "@/components/shared/date-selector/FromToSelector.vue";
import { AppConstants } from "@/constants/app-constants";

export const NceFilterConfig = {
  formConfig: {
    title: `${AppConstants.NCE_PRESENTATION_NAME} Filters`,
    fields: [
      {
        label: "Alarm Name",
        name: "alarmName",
        type: "component",
        component: NCEAlarmNameDropDown,
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
        component: NeDevicesDropDown,
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
          dropDownCatagory: dropDownsCategory.NCE_SEVERITY,
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
    templateType: AppConstants.FILTER_TEMPLATE_TYPES.NCE,
    showTemplateSelection: true,
  },
};
