import { FieldInterface } from "@/components/forms/interfaceField";
import { FormValidationCommonRules } from "@/constants/FormValidationRules";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import { IFormConfig } from "@/core/interface/form-config-interface";
import CurdApiService from "@/core/services/CurdApiService";

export const getDesignationFormConfig = async (
  createEditForm = false,
  id = ""
): Promise<IFormConfig> => {
  const fieldsToEdit = ["name"];
  const fieldNotToInclude: Array<string> = [];
  let data;

  if (createEditForm) {
    data = (await CurdApiService.getById("designation", id)).data.data;
  }

  let fields: FieldInterface[] = [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter Name",
      required: true,
      value: data?.name ?? "",
      editable: fieldsToEdit.includes("name"),
      validate: true,
    },
  ];

  if (createEditForm) {
    fields = fields.filter((field) => {
      return !fieldNotToInclude.includes(field.name);
    });
  }

  return {
    title: createEditForm ? "Edit Designation" : "Create Designation",
    fields,
    validationSchema: {
      name: createYupValidationSchema({
        name: FormValidationCommonRules.commonNameText,
      }),
    },
    actionButton: "enabled",
  };
};
