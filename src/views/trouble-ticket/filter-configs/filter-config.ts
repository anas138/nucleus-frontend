import NeDevicesDropDown from "@/components/shared/dropdowns/NeDevicesDropDown.vue";
import NCEAlarmNameDropDown from "@/components/shared/dropdowns/NCEAlarmNameDropDown.vue";
import DropDownFromServer from "@/components/shared/dropdowns/DropDownFromServer.vue";
import { dropDownsCategory } from "@/constants/drop-down-from-server";
import FromToSelector from "@/components/shared/date-selector/FromToSelector.vue";
import { AppConstants } from "@/constants/app-constants";
import CategoryDropDown from "@/components/shared/dropdowns/CategoryDropDown.vue";
import SubDepartmentEngineeringDropDown from "@/components/shared/dropdowns/SubDepartmentEngineeringDropDown.vue";
import OpenTicketStatusDropDown from "@/components/shared/dropdowns/OpenTicketStatusDropDown.vue";
import NetworkTypeDropDown from "@/components/shared/dropdowns/NetworkTypeDropDown.vue";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import * as yup from "yup";
import PriorityDropDown from "@/components/shared/dropdowns/PriorityDropDown.vue";
import AllAlarmNameDropDown from "@/components/shared/dropdowns/AllAlarmNameDropDown.vue";

export const OpenTicketsConfig = {
  formConfig: {
    title: `Open Trouble Tickets Filters`,
    fields: [
      {
        label: "Priority",
        name: "priorityLevel",
        type: "component",
        component: PriorityDropDown,
        value: "",
        placeholder: "Select Priority",
        props: {
          autoPick: false,
        },
      },
      {
        label: "Network Type",
        name: "networkType",
        type: "component",
        component: NetworkTypeDropDown,
        value: "",
        placeholder: "Select a Network Type",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Alarm Name",
        name: "alarmFilterConfigIds",
        type: "component",
        component: AllAlarmNameDropDown,
        value: "",
        placeholder: "Select Alarm Name",
        props: {
          multiSelect: true,
        },
      },
      {
        label: "Status",
        name: "status",
        type: "component",
        component: OpenTicketStatusDropDown,
        value: "",
        placeholder: "Select Status",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TROUBLE_TICKET_STATUS,
        },
      },
      {
        label: "Generation Type",
        name: "ticket_generation_type",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select a Generation Type",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TICKET_GENERATION_TYPE,
        },
      },
      {
        label: "Accumulated",
        name: "isOutageOccurred",
        type: "dropdown",
        placeholder: "Select Outage Type",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Over TAT",
        name: "overTat",
        type: "dropdown",
        placeholder: "Select TAT Type",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Category",
        name: "category",
        type: "component",
        component: CategoryDropDown,
        value: "",
        placeholder: "Select Category",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Medium",
        name: "medium",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select Medium",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TROUBLE_TICKET_MEDIUM,
        },
      },
      {
        label: "Sub Department",
        name: "subDepartment",
        type: "component",
        component: SubDepartmentEngineeringDropDown,
        value: "",
        placeholder: "Select Sub Department",
        props: {
          multiSelect: false,
          departmentId: 1,
        },
      },
      {
        label: "Created At",
        name: "Date",
        type: "component",
        component: FromToSelector,
        props: {
          prefix: true,
        },
      },
    ],
    actionButton: "enabled",
    queryParams: {},
    filterPersistence: {
      canPersist: true,
      persistenceKey: AppConstants.FILTER_KEYS.OPEN_TROUBLE_TICKET,
    },
  },
};

export const ClosedTicketsConfig = {
  formConfig: {
    title: `Closed Trouble Tickets Filters`,
    fields: [
      {
        label: "Priority",
        name: "priorityLevel",
        type: "component",
        component: PriorityDropDown,
        value: "",
        placeholder: "Select Priority",
        props: {
          autoPick: false,
        },
      },
      {
        label: "Network Type",
        name: "networkType",
        type: "component",
        component: NetworkTypeDropDown,
        value: "",
        placeholder: "Select a Network Type",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Alarm Name",
        name: "alarmFilterConfigIds",
        type: "component",
        component: AllAlarmNameDropDown,
        value: "",
        placeholder: "Select Alarm Name",
        props: {
          multiSelect: true,
        },
      },
      {
        label: "Generation Type",
        name: "ticket_generation_type",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select a Generation Type",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TICKET_GENERATION_TYPE,
        },
      },
      {
        label: "Accumulated",
        name: "isOutageOccurred",
        type: "dropdown",
        placeholder: "Select Outage Type",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Over TAT",
        name: "overTat",
        type: "dropdown",
        placeholder: "Select TAT Type",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Category",
        name: "category",
        type: "component",
        component: CategoryDropDown,
        value: "",
        placeholder: "Select Category",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Medium",
        name: "medium",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select Medium",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TROUBLE_TICKET_MEDIUM,
        },
      },
      {
        label: "Sub Department",
        name: "subDepartment",
        type: "component",
        component: SubDepartmentEngineeringDropDown,
        value: "",
        placeholder: "Select Sub Department",
        props: {
          multiSelect: false,
          departmentId: 1,
        },
      },
      {
        label: "Created At",
        name: "Date",
        type: "component",
        component: FromToSelector,
        props: {
          prefix: true,
        },
      },
    ],
    queryParams: {},
    actionButton: "enabled",
  },
};

export const CancelledTicketsConfig = {
  formConfig: {
    title: `Cancelled Trouble Tickets Filters`,
    fields: [
      {
        label: "Priority",
        name: "priorityLevel",
        type: "component",
        component: PriorityDropDown,
        value: "",
        placeholder: "Select Priority",
        props: {
          autoPick: false,
        },
      },
      {
        label: "Network Type",
        name: "networkType",
        type: "component",
        component: NetworkTypeDropDown,
        value: "",
        placeholder: "Select a Network Type",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Alarm Name",
        name: "alarmFilterConfigIds",
        type: "component",
        component: AllAlarmNameDropDown,
        value: "",
        placeholder: "Select Alarm Name",
        props: {
          multiSelect: true,
        },
      },
      {
        label: "Generation Type",
        name: "ticket_generation_type",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select a Generation Type",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TICKET_GENERATION_TYPE,
        },
      },
      {
        label: "Accumulated",
        name: "isOutageOccurred",
        type: "dropdown",
        placeholder: "Select Outage Type",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Over TAT",
        name: "overTat",
        type: "dropdown",
        placeholder: "Select TAT Type",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Category",
        name: "category",
        type: "component",
        component: CategoryDropDown,
        value: "",
        placeholder: "Select Category",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Medium",
        name: "medium",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select Medium",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TROUBLE_TICKET_MEDIUM,
        },
      },
      {
        label: "Sub Department",
        name: "subDepartment",
        type: "component",
        component: SubDepartmentEngineeringDropDown,
        value: "",
        placeholder: "Select Sub Department",
        props: {
          multiSelect: false,
          departmentId: 1,
        },
      },
      {
        label: "Created At",
        name: "Date",
        type: "component",
        component: FromToSelector,
        props: {
          prefix: true,
        },
      },
    ],
    queryParams: {},
    actionButton: "enabled",
  },
};

export const RCARequestsTicketsConfig = {
  formConfig: {
    title: `RCA Requests Trouble Tickets Filters`,
    fields: [
      {
        label: "Priority",
        name: "priorityLevel",
        type: "component",
        component: PriorityDropDown,
        value: "",
        placeholder: "Select Priority",
        props: {
          autoPick: false,
        },
      },
      {
        label: "Network Type",
        name: "networkType",
        type: "component",
        component: NetworkTypeDropDown,
        value: "",
        placeholder: "Select a Network Type",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Alarm Name",
        name: "alarmFilterConfigIds",
        type: "component",
        component: AllAlarmNameDropDown,
        value: "",
        placeholder: "Select Alarm Name",
        props: {
          multiSelect: true,
        },
      },
      {
        label: "Generation Type",
        name: "ticket_generation_type",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select a Generation Type",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TICKET_GENERATION_TYPE,
        },
      },
      {
        label: "Accumulated",
        name: "isOutageOccurred",
        type: "dropdown",
        placeholder: "Select Outage Type",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Over TAT",
        name: "overTat",
        type: "dropdown",
        placeholder: "Select TAT Type",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Category",
        name: "category",
        type: "component",
        component: CategoryDropDown,
        value: "",
        placeholder: "Select Category",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Medium",
        name: "medium",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select Medium",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TROUBLE_TICKET_MEDIUM,
        },
      },
      {
        label: "Sub Department",
        name: "subDepartment",
        type: "component",
        component: SubDepartmentEngineeringDropDown,
        value: "",
        placeholder: "Select Sub Department",
        props: {
          multiSelect: false,
          departmentId: 1,
        },
      },
      {
        label: "Created At",
        name: "Date",
        type: "component",
        component: FromToSelector,
        props: {
          prefix: true,
        },
      },
    ],
    queryParams: {},
    actionButton: "enabled",
  },
};

export const PauseTicketsConfig = {
  formConfig: {
    title: `Pause Trouble Tickets Filters`,
    fields: [
      {
        label: "Priority",
        name: "priorityLevel",
        type: "component",
        component: PriorityDropDown,
        value: "",
        placeholder: "Select Priority",
        props: {
          autoPick: false,
        },
      },
      {
        label: "Network Type",
        name: "networkType",
        type: "component",
        component: NetworkTypeDropDown,
        value: "",
        placeholder: "Select a Network Type",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Alarm Name",
        name: "alarmFilterConfigIds",
        type: "component",
        component: AllAlarmNameDropDown,
        value: "",
        placeholder: "Select Alarm Name",
        props: {
          multiSelect: true,
        },
      },
      {
        label: "Generation Type",
        name: "ticket_generation_type",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select a Generation Type",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TICKET_GENERATION_TYPE,
        },
      },
      {
        label: "Accumulated",
        name: "isOutageOccurred",
        type: "dropdown",
        placeholder: "Select Outage Type",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Over TAT",
        name: "overTat",
        type: "dropdown",
        placeholder: "Select TAT Type",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Category",
        name: "category",
        type: "component",
        component: CategoryDropDown,
        value: "",
        placeholder: "Select Category",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Medium",
        name: "medium",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select Medium",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TROUBLE_TICKET_MEDIUM,
        },
      },
      {
        label: "Sub Department",
        name: "subDepartment",
        type: "component",
        component: SubDepartmentEngineeringDropDown,
        value: "",
        placeholder: "Select Sub Department",
        props: {
          multiSelect: false,
          departmentId: 1,
        },
      },
      {
        label: "Created At",
        name: "Date",
        type: "component",
        component: FromToSelector,
        props: {
          prefix: true,
        },
      },
    ],
    queryParams: {},
    actionButton: "enabled",
  },
};

export const PauseRequestTicketsConfig = {
  formConfig: {
    title: `Pause Requests Trouble Tickets Filters`,
    fields: [
      {
        label: "Priority",
        name: "priorityLevel",
        type: "component",
        component: PriorityDropDown,
        value: "",
        placeholder: "Select Priority",
        props: {
          autoPick: false,
        },
      },
      {
        label: "Network Type",
        name: "networkType",
        type: "component",
        component: NetworkTypeDropDown,
        value: "",
        placeholder: "Select a Network Type",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Alarm Name",
        name: "alarmFilterConfigIds",
        type: "component",
        component: AllAlarmNameDropDown,
        value: "",
        placeholder: "Select Alarm Name",
        props: {
          multiSelect: true,
        },
      },
      {
        label: "Generation Type",
        name: "ticket_generation_type",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select a Generation Type",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TICKET_GENERATION_TYPE,
        },
      },
      {
        label: "Accumulated",
        name: "isOutageOccurred",
        type: "dropdown",
        placeholder: "Select Outage Type",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Over TAT",
        name: "overTat",
        type: "dropdown",
        placeholder: "Select TAT Type",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Category",
        name: "category",
        type: "component",
        component: CategoryDropDown,
        value: "",
        placeholder: "Select Category",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Medium",
        name: "medium",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select Medium",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TROUBLE_TICKET_MEDIUM,
        },
      },
      {
        label: "Sub Department",
        name: "subDepartment",
        type: "component",
        component: SubDepartmentEngineeringDropDown,
        value: "",
        placeholder: "Select Sub Department",
        props: {
          multiSelect: false,
          departmentId: 1,
        },
      },
      {
        label: "Created At",
        name: "Date",
        type: "component",
        component: FromToSelector,
        props: {
          prefix: true,
        },
      },
    ],
    queryParams: {},
    actionButton: "enabled",
  },
};

export const ticketsReportConfig = {
  formConfig: {
    title: `Trouble Tickets Report Filters`,
    fields: [
      {
        label: "Date range",
        name: "Date",
        type: "component",
        component: FromToSelector,
        props: {
          QuickOptions: true,
          singleKey: true,
        },
        validate: true,
      },
      {
        label: "Network Type",
        name: "networkType",
        type: "component",
        component: NetworkTypeDropDown,
        value: "",
        placeholder: "Select a Network Type",
        props: {
          multiSelect: false,
        },
      },
      {
        label: "Status",
        name: "status",
        type: "component",
        component: DropDownFromServer,
        value: "",
        placeholder: "Select Status",
        props: {
          multiSelect: false,
          emitDataType: 0,
          dropDownCatagory: dropDownsCategory.TROUBLE_TICKET_STATUS,
        },
      },
      {
        label: "RCA Submitted",
        name: "rcaSubmitted",
        type: "dropdown",
        placeholder: "Select RCA",
        value: "",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
        editable: true,
        clearable: true,
      },
      {
        label: "Category",
        name: "category",
        type: "component",
        component: CategoryDropDown,
        value: "",
        placeholder: "Select Category",
        props: {
          multiSelect: false,
        },
      },
      // {
      //   label: "Generation Type",
      //   name: "ticketGenerationType",
      //   type: "component",
      //   component: DropDownFromServer,
      //   value: "",
      //   placeholder: "Select a Generation Type",
      //   props: {
      //     multiSelect: false,
      //     emitDataType: 0,
      //     dropDownCatagory: dropDownsCategory.TICKET_GENERATION_TYPE,
      //   },
      // },
      // {
      //   label: "Medium",
      //   name: "medium",
      //   type: "component",
      //   component: DropDownFromServer,
      //   value: "",
      //   placeholder: "Select Medium",
      //   props: {
      //     multiSelect: false,
      //     emitDataType: 0,
      //     dropDownCatagory: dropDownsCategory.TROUBLE_TICKET_MEDIUM,
      //   },
      // },
      {
        label: "Assigned To",
        name: "subDepartment",
        type: "component",
        component: SubDepartmentEngineeringDropDown,
        value: "",
        placeholder: "Select Sub Department",
        props: {
          multiSelect: false,
          departmentId: 1,
        },
      },
      {
        label: "Resolved By",
        name: "resolveBySubDepartment",
        type: "component",
        component: SubDepartmentEngineeringDropDown,
        value: "",
        placeholder: "Select Sub Department",
        props: {
          multiSelect: false,
          departmentId: 1,
        },
      },
    ],
    validationSchema: {
      Date: createYupValidationSchema({
        Date: yup.array().nullable().required(),
      }),
    },
    actionButton: "enabled",
  },
};
