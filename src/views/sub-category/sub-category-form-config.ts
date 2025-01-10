import { FieldInterface } from "@/components/forms/interfaceField";
import BasicNumberInputVue from "@/components/shared/inputs/BasicNumberInput.vue";
import BasicSwitchInputVue from "@/components/shared/inputs/BasicSwitchInput.vue";
import { FormValidationCommonRules } from "@/constants/FormValidationRules";
import { AppConstants } from "@/constants/app-constants";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import { IFormConfig } from "@/core/interface/form-config-interface";
import CurdApiService from "@/core/services/CurdApiService";
import * as Yup from "yup";

export const getSubCategoryFormConfig = async (
  createEditForm = false,
  id = ""
): Promise<IFormConfig> => {
  const fieldsToEdit = [
    "name",
    "tat",
    "tat_uom",
    "description",
    "record_status",
  ];
  const fieldNotToInclude: Array<string> = [
    createEditForm ? "" : "record_status",
  ];
  let data;

  if (createEditForm) {
    data = (await CurdApiService.getById("tt-category", id)).data.data;
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
    {
      label: "Turn Around Time",
      name: "tat",
      type: "component",
      component: BasicNumberInputVue,
      required: true,
      value: data?.tat ?? 0,
      editable: fieldsToEdit.includes("tat"),
      validate: true,
    },
    {
      label: "Turn Around Time(UOM)",
      name: "tat_uom",
      type: "dropdown",
      placeholder: "Select a Turn Around Time(UOM)",
      required: true,
      options: AppConstants.TURN_AROUND_TIME_UNIT,
      value: data?.tat_uom ?? "",
      editable: fieldsToEdit.includes("tat_uom"),
      validate: true,
    },
    {
      label: "Description",
      name: "description",
      type: "textarea",
      placeholder: "Enter Description",
      required: false,
      value: data?.description ?? "",
      editable: createEditForm ? fieldsToEdit.includes("description") : true,
      validate: false,
    },
    {
      label: "Status",
      name: "record_status",
      type: "component",
      component: BasicSwitchInputVue,
      required: true,
      value: data?.record_status ?? "ACTIVE",
      editable: fieldsToEdit.includes("record_status"),
      validate: false,
      props: {
        activeValue: "ACTIVE",
        inActiveValue: "INACTIVE",
        style: "--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949",
      },
    },
  ];

  // if (createEditForm) {
  fields = fields.filter((field) => {
    return !fieldNotToInclude.includes(field.name);
  });
  // }

  return {
    title: createEditForm ? "Edit Sub Category" : "Create Sub Category",
    fields,
    validationSchema: {
      name: createYupValidationSchema({
        name: Yup.string().trim().required("Name is required").min(1),
      }),
      tat: createYupValidationSchema({
        tat: Yup.string()
          .required("Turn Around Time must be greater than 0")
          .min(1),
      }),
      tat_uom: createYupValidationSchema({
        tat_uom: Yup.string().required("Turn Around Time(UNIT) is required"),
      }),
    },
    actionButton: "enabled",
  };
};
