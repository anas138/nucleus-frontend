<template>
  <div>
    <DynamicForm
      :fields="fields"
      :title="title"
      :validationSchema="validationSchema"
    />
  </div>
</template>

<script>
import DynamicForm from "@/components/forms/ReuseableForm.vue";
import * as yup from "yup";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import { string } from "yup/lib/locale";

export default {
  components: {
    DynamicForm,
  },
  data() {
    return {
      title: "xyz title",
      fields: [
        {
          label: "Text Field",
          name: "text",
          type: "text",
          placeholder: "Enter text",
          required: true,
          value: "this is some value",
          editable: true,
          validate: true,
        },
        {
          label: "Email Field",
          name: "email",
          type: "email",
          placeholder: "Enter email",
          value: "",
          editable: true,
          validate: true,
        },
        {
          label: "Password Field",
          name: "password",
          type: "password",
          placeholder: "Enter password",
          value: "",
          editable: true,
          validate: true,
        },
        {
          label: "Range Field",
          name: "range",
          type: "range",
          min: 0,
          max: 100,
          step: 1,
          value: 50,
          editable: true,
        },
        {
          label: "Radio Field",
          name: "radio",
          type: "radio",
          options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
            { label: "Option 3", value: "option3" },
          ],
          value: "",
          editable: true,
          validate: false,
        },
        {
          label: "Dropdown Field",
          name: "dropdown",
          type: "dropdown",
          multiSelect: false,
          options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
            { label: "Option 3", value: "option3" },
          ],
          value: "",
          editable: true,
          validate: false,
        },
        {
          label: "Checkbox",
          name: "checkbox",
          type: "checkbox",
          value: 1,
          editable: true,
        },
      ],
      validationSchema: {
        text: createYupValidationSchema({
          text: "minLength:10&required:true",
        }),
        email: createYupValidationSchema({ email: "string&email&required" }),
        password: createYupValidationSchema({
          password: "required:minLength:8",
        }),
        // Add more fields and validation rules as needed
      },
    };
  },
};
</script>
