import { FieldInterface } from "@/components/forms/interfaceField";
import { FormValidationCommonRules } from "@/constants/FormValidationRules";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import CurdApiService from "@/core/services/CurdApiService";

export const getformConfig = async (CreateEditForm = false, id = "") => {
  const departments = (await CurdApiService.getAll("department")).data.data;
  const options = departments.map((department) => {
    return { value: department.id, label: department.name };
  });

  const fieldToEdit = ["name", "department_id"];
  const fieldNotToInclude: string[] = [];

  let data;

  if (CreateEditForm) {
    data = (await CurdApiService.getById("subdepartment", id)).data.data;
  }
  let fields: FieldInterface[] = [
    {
      label: "Department",
      name: "department_id",
      type: "dropdown",
      placeholder: "Select a Department",
      required: true,
      options: options,
      value: data?.department_id || "",
      editable: CreateEditForm ? fieldToEdit.includes("department_id") : true,
      validate: true,
    },
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
    title: CreateEditForm ? "Edit Sub Department" : "Create Sub Department",
    fields,
    validationSchema: {
      name: createYupValidationSchema({
        name: FormValidationCommonRules.commonNameText,
      }),
      department_id: createYupValidationSchema({
        department_id: "required:true",
      }),
    },
  };
};
