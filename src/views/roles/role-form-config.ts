import { FieldInterface } from "@/components/forms/interfaceField";
import { FormValidationCommonRules } from "@/constants/FormValidationRules";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import CurdApiService from "@/core/services/CurdApiService";

export const getformConfig = async (CreateEditForm = false, id = "") => {
  const fieldToEdit = ["name"];
  const fieldNotToInclude: string[] = [];

  let data;

  if (CreateEditForm) {
    data = (await CurdApiService.getById("roles", id)).data.data;
  }
  let fields: FieldInterface[] = [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter Name",
      required: true,
      value: data?.name || "",
      editable: CreateEditForm ? fieldToEdit.includes("name") : true,
      validate: true,
    },
  ];
  if (CreateEditForm) {
    fields = fields.filter((field) => {
      return !fieldNotToInclude.includes(field.name);
    });
  }
  return {
    fields,
    validationSchema: {
      name: createYupValidationSchema({
        name: FormValidationCommonRules.commonNameText,
      }),
    },
  };
};
