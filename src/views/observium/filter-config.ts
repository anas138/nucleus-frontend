import ObsDevicesDropDown from "@/components/shared/dropdowns/ObsDevicesDropDown.vue";
import ObsAlarmName from "@/components/shared/dropdowns/ObsAlarmName.vue";
import DropDownFromServer from "@/components/shared/dropdowns/DropDownFromServer.vue";
import { dropDownsCategory } from "@/constants/drop-down-from-server";
import FromToSelector from "@/components/shared/date-selector/FromToSelector.vue";
import { AppConstants } from "@/constants/app-constants";

export const ObserviumFilterConfig = {
  formConfig: {
    title: `${AppConstants.OBSERVIUM_PRESENTATION_NAME} Filters`,
    fields: [
      {
        label: "Alarm Name",
        name: "alarmName",
        type: "component",
        component: ObsAlarmName,
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
        component: ObsDevicesDropDown,
        value: "",
        placeholder: "Select Network Element",
        props: {
          multiSelect: true,
        },
      },
      {
        label: "Entity Name",
        name: "entity_name",
        type: "text",
        value: "",
        placeholder: "Enter Entity Name",
        editable: true,
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
          dropDownCatagory: dropDownsCategory.OBS_SEVERITY,
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
    templateType: AppConstants.FILTER_TEMPLATE_TYPES.OBSERVIUM,
    showTemplateSelection: true,
  },
};
