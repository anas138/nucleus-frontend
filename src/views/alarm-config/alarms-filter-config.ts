import { IFormConfig } from "@/core/interface/form-config-interface";

export const alarmFilterConfig = {
  formConfig: {
    title: `Alarms Config Filters`,
    fields: [
      {
        label: "Status",
        name: "status",
        type: "dropdown",
        value: "",
        placeholder: "Select status",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
        clearable: true,
        props: {
          multiSelect: false,
        },
        editable: true,
      },
      {
        label: "Email Escalation",
        name: "is_email_escalation",
        type: "dropdown",
        value: "",
        placeholder: "Select Escalation Type",
        options: [
          { value: 1, label: "Yes" },
          { value: 0, label: "No" },
        ],
        clearable: true,
        props: {
          multiSelect: false,
        },
        editable: true,
      },
      {
        label: "Ticket Escalation",
        name: "is_ticket_escalation",
        type: "dropdown",
        value: "",
        placeholder: "Select Escalation Type",
        options: [
          { value: 1, label: "Yes" },
          { value: 0, label: "No" },
        ],
        clearable: true,
        props: {
          multiSelect: false,
        },
        editable: true,
      },
    ],
    actionButton: "enabled",
    validationSchema: {},
  } as IFormConfig,
};
