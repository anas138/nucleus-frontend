<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <auth-header
      title="Forgot Password ?"
      sub-title="Enter your email to reset your password."
    />
    <Form
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      @submit="onSubmitForgotPassword"
      id="kt_login_password_reset_form"
      :validation-schema="forgotPassword"
    >
      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-gray-900 fs-6">Email</label>
        <Field
          class="form-control form-control-solid"
          type="email"
          placeholder=""
          name="email"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
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
import { ErrorMessage, Field, Form } from "vee-validate";
import { useStore } from "vuex";
import * as Yup from "yup";
import AuthenticationService from "@/core/services/AuthenticationService";
import { ElNotification } from "element-plus";
import router from "@/router";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import AuthHeader from "@/components/authentication/AuthHeader.vue";
import { swalSuccess } from "@/core/helpers/sweetAlert.utils";

const store = useStore();

const submitButton = ref<HTMLButtonElement | null>(null);

//Create form validation object
const forgotPassword = createYupValidationSchema({
  email: "required&email",
});
//Form submit function
const onSubmitForgotPassword = async (values) => {
  AuthenticationService.forgotPassword(values).then((res) => {
    swalSuccess(
      null,
      "Reset password request has been sent to your inbox. Please check.",
      "Ok, got it!"
    );
  });
};
</script>
