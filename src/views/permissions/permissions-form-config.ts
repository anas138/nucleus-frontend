import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";

export const formConfig = {
  title: "Create Permission",
  fields: [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter Permission",
      required: true,
      value: "",
      editable: true,
      validate: true,
    },
  ],
  validationSchema: {
    name: createYupValidationSchema({
      name: "required:true&maxLength:255",
    }),
  },
  actionButton: "enabled",
};
