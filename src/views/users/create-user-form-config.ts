import { FieldInterface } from "@/components/forms/interfaceField";
import {
  FormValidationCommonRules,
  FormValidationYup,
} from "@/constants/FormValidationRules";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import CurdApiService from "@/core/services/CurdApiService";
import * as yup from "yup";
import ServerDropDownService from "@/core/services/ServerDropDownService";
import { reactive, ref } from "vue";
import { basicDropDownListValue } from "@/core/interface/interfaces";
import BasicSwitchInput from "@/components/shared/inputs/BasicSwitchInput.vue";
import { AppConstants } from "@/constants/app-constants";

// the user form uses different approach for making form config of edit and add
// it is recommend to use this approach
// no fields to edit or fieldNOtToInclude is required in this approach in return
export const getuserFormConfig = async (CreateEditForm = false, id = "") => {
  const responses = await Promise.all(
    ["roles", "department", "designation", "regions"].map(async (resource) => {
      return (await CurdApiService.getAll(resource)).data.data.map(
        (response) => {
          return { value: response.id, label: response.name };
        }
      );
    })
  );

  const fieldsToEdit = [
    "full_name",
    "username",
    "email",
    "personal_mobile",
    "official_mobile",
    "role",
    "department",
    "sub department",
    "sub_department_ids",
    "designation",
    "region",
    "record_status",
  ];
  const fieldNotToInclude = [CreateEditForm ? "password" : ""];
  let data;

  const subDepartmentOptions = ref([] as basicDropDownListValue[]);
  const selectedSubDepartment = ref<number | null>();

  const selectedHodSubDeparment: number[] = reactive([]);

  if (CreateEditForm) {
    data = (await CurdApiService.getById("users", id)).data.data;
    subDepartmentOptions.value =
      await ServerDropDownService.getAllSubDepartmentsOfDepartmentForDropDown(
        data.department_id
      );
    selectedSubDepartment.value = data.sub_department_id;
    data?.userDepartments?.map((val: any) => {
      if (val?.sub_department_id) {
        selectedHodSubDeparment.push(val.sub_department_id);
      }
    });
    Object.assign(selectedHodSubDeparment, data.sub_department_id);
  }

  let fields: FieldInterface[] = [
    {
      label: "Full Name",
      name: "full_name",
      type: "text",
      placeholder: "Enter Full Name",
      required: true,
      value: data?.full_name || "",
      editable: CreateEditForm ? fieldsToEdit.includes("full_name") : true,
      validate: true,
    },
    {
      label: "User Name",
      name: "username",
      type: "text",
      placeholder: "Enter User Name",
      required: true,
      value: data?.username || "",
      editable: CreateEditForm ? fieldsToEdit.includes("username") : true,
      validate: true,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter email",
      required: true,
      value: data?.email || "",
      editable: CreateEditForm ? fieldsToEdit.includes("email") : true,
      validate: true,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter password",
      required: true,
      value: data?.password || "",
      editable: CreateEditForm ? fieldsToEdit.includes("password") : true,
      validate: true,
    },
    {
      label: "Role",
      name: "role",
      type: "dropdown",
      placeholder: "Select a role",
      required: true,
      options: responses[0],
      multiSelect: true,
      value: data?.roles.map((role) => role.id) || [],
      editable: CreateEditForm ? fieldsToEdit.includes("role") : true,
      validate: true,
    },
    {
      label: "Region",
      name: "region",
      type: "dropdown",
      placeholder: "Select a region",
      required: true,
      options: responses[3],
      multiSelect: true,
      value: data?.regions.map((region) => region.id) || [],
      editable: CreateEditForm ? fieldsToEdit.includes("region") : true,
      validate: true,
    },
    {
      label: "User Type",
      name: "user_type",
      type: "dropdown",
      placeholder: "Select a User Type",
      required: true,
      options: AppConstants.USER_TYPE,
      value: data?.user_type || "EMPLOYEE",
      editable: CreateEditForm ? fieldsToEdit.includes("user_type") : true,
      validate: true,
    },
    {
      label: "Designation",
      name: "designation",
      type: "dropdown",
      placeholder: "Select a Designation",
      required: true,
      options: responses[2],
      value: data?.designation_id || "",
      editable: CreateEditForm ? fieldsToEdit.includes("designation") : true,
      validate: true,
    },
    {
      label: "Department",
      name: "department",
      type: "dropdown",
      placeholder: "Select a Department",
      required: true,
      options: responses[1],
      value: data?.department_id || "",
      editable: CreateEditForm ? fieldsToEdit.includes("department") : true,
      validate: true,
      onChange: async (selectedDepartment) => {
        subDepartmentOptions.value =
          await ServerDropDownService.getAllSubDepartmentsOfDepartmentForDropDown(
            selectedDepartment
          );

        selectedSubDepartment.value = null;
        Object.assign(selectedHodSubDeparment, []);
      },
    },
    {
      label: "Sub Department",
      name: "sub department",
      type: "dropdown",
      placeholder: "Select a Sub Department",
      required: false,
      options: subDepartmentOptions,
      value: selectedSubDepartment,
      editable: CreateEditForm ? fieldsToEdit.includes("sub department") : true,
      clearable: true,
      validate: false,
      onChange: async (val) => {
        if (val == "") {
          selectedSubDepartment.value = null;
        }
      },
    },
    {
      label: "Multiple Subdepartments Assignment",
      name: "sub_department_ids",
      type: "dropdown",
      placeholder: "Select a Sub Departments",
      required: false,
      options: subDepartmentOptions,
      value: selectedHodSubDeparment,
      editable: CreateEditForm
        ? fieldsToEdit.includes("sub_department_ids")
        : true,
      clearable: true,
      validate: false,
      hint: "Assign multiple sub-departments so user can receive priority, escalation emails and notifications for relevant tasks.",
      multiSelect: true,
      onChange: async (val) => {
        if (val == "") {
          Object.assign(selectedHodSubDeparment, []);
        }
      },
    },
    {
      label: "Personal Phone Number",
      name: "personal_mobile",
      type: "text",
      placeholder: "Enter Personal Phone Number",
      required: true,
      value: data?.personal_mobile || "",
      editable: CreateEditForm
        ? fieldsToEdit.includes("personal_mobile")
        : true,
      validate: true,
    },
    {
      label: "Official Phone Number",
      name: "official_mobile",
      type: "text",
      placeholder: "Enter Official Phone Number",
      required: true,
      value: data?.official_mobile || "",
      editable: CreateEditForm
        ? fieldsToEdit.includes("official_mobile")
        : true,
      validate: true,
    },
    {
      label: "Status",
      name: "record_status",
      type: "component",
      component: BasicSwitchInput,
      required: true,
      value: data?.record_status || "ACTIVE",
      editable: CreateEditForm ? fieldsToEdit.includes("record_status") : true,
      validate: false,
      props: {
        activeValue: "ACTIVE",
        inActiveValue: "INACTIVE",
        style: "--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949",
      },
    },
  ];

  if (CreateEditForm) {
    fields = fields.filter((field) => {
      return !fieldNotToInclude.includes(field.name);
    });
  }
  return {
    title: !CreateEditForm ? "Create User" : "Edit User",
    fields,
    validationSchema: {
      full_name: createYupValidationSchema({
        full_name: FormValidationCommonRules.commonNameText,
      }),
      role: yup.object().shape({
        role: yup.array().required().min(1).label("Role"),
      }),
      region: yup.object().shape({
        region: yup.array().required().min(1).label("Region"),
      }),
      department: createYupValidationSchema({
        department: "required",
      }),
      user_type: createYupValidationSchema({
        user_type: "required",
      }),
      designation: createYupValidationSchema({
        designation: "required",
      }),
      email: createYupValidationSchema({
        email: FormValidationCommonRules.email,
      }),
      password: createYupValidationSchema({
        password: FormValidationCommonRules.password,
      }),
      username: createYupValidationSchema({
        username: FormValidationCommonRules.username,
      }),
      personal_mobile: yup.object().shape({
        personal_mobile: yup
          .string()
          .required("Personal Phone Number is required")
          .matches(
            /^(\+?\d{1,3}[-.\s]?)?(\d{1,3})?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
            "Invalid Personal Phone Number"
          ),
      }),
      official_mobile: yup.object().shape({
        official_mobile: yup
          .string()
          .required("Official Phone Number is required")
          .matches(
            /^(\+?\d{1,3}[-.\s]?)?(\d{1,3})?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
            "Invalid Official Phone Number"
          ),
      }),

      // Add more fields and validation rules as needed
    },
  };
};
