/* eslint-disable */
import * as yup from "yup";

enum FormValidationCommonRules {
  password = "required&min:8&matches:^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d):Password must contain at least one uppercase letter, one lowercase letter, and one number.",
  email = "required&email",
  username = "required&string&maxLength:255",
  fullname = "required&string&maxLength:50&matches:/^[A-Za-zs.]+$/",
  age = "min:0&max:70",
  phoneNumber = "required&matches:^\\+?\\d{1,3}[-.\\s]?\\(\\d{1,3}\\)[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}$:Invalid phone number format",
  commonNameText = "required&maxLength:255",
  commonText = "required",
}

const FormValidationYup = {
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .matches(
      /^(\+?\d{1,3}[-.\s]?)?(\d{1,3})?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
      "Invalid phone number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
};

export { FormValidationCommonRules, FormValidationYup };
