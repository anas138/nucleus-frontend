<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <auth-header title="Update Password" sub-title="Enter your new password." />
    <!--begin::Form-->
    <Form
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      @submit="onSubmitUpdatePassword"
      id="kt_login_password_update_form"
      :validation-schema="updatePassword"
    >
      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-gray-900 fs-6">Password</label>
        <password name="password" />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->
      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-gray-900 fs-6"
          >Confirm Password</label
        >
        <password
          name="confirm_password"
          placeholder="Enter Confirm Password"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="confirm_password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="d-flex flex-wrap justify-content-center pb-lg-0">
        <button
          type="submit"
          ref="submitButton"
          id="kt_password_reset_submit"
          class="btn btn-lg btn-primary fw-bold me-4"
        >
          <span class="indicator-label"> Submit </span>
          <span class="indicator-progress">
            Please wait...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>

        <router-link to="/sign-in" class="btn btn-lg btn-light-primary fw-bold"
          >Cancel</router-link
        >
      </div>
      <!--end::Actions-->
    </Form>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script setup lang="ts">
import { ref } from "vue";
import AuthenticationService from "@/core/services/AuthenticationService";
import { useRoute } from "vue-router";
import { ElNotification } from "element-plus";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import router from "@/router";
import {
  FormValidationCommonRules,
  FormValidationYup,
} from "@/constants/FormValidationRules";
import Password from "@/components/shared/inputs/Password.vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import AuthHeader from "@/components/authentication/AuthHeader.vue";
import { AppConstants } from "@/constants/app-constants";
import { swalSuccess } from "@/core/helpers/sweetAlert.utils";

const submitButton = ref<HTMLButtonElement | null>(null);
const route = useRoute();

//Create form validation object
const updatePassword = createYupValidationSchema({
  password: FormValidationCommonRules.password,
  confirm_password: FormValidationYup.confirmPassword,
});

//Form submit function
const onSubmitUpdatePassword = (values) => {
  delete values["confirm_password"];
  values.token = route.query.token;
  AuthenticationService.updatePassword(values).then((res) => {
    swalSuccess(
      null,
      "Your password has been updated. Please login with your new password.",
      "Ok, got it!",
      () => {
        router.push("sign-in");
      }
    );
  });
};
</script>
