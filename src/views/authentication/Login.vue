<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <auth-header title="Please sign in to your account" />
    <!--begin::Form-->
    <Form
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="login"
    >
      <!--begin::Heading-->
      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-bold text-dark">Username</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="username"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="username" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-7">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack mb-2">
          <!--begin::Label-->
          <label class="form-label fw-bold text-dark fs-6 mb-0">Password</label>
          <!--end::Label-->

          <!--begin::Link-->
          <router-link to="/password-reset" class="link-primary fs-6 fw-bold">
            Forgot Password ?
          </router-link>
          <!--end::Link-->
        </div>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <div class="input-group">
          <Field
            tabindex="2"
            class="form-control form-control-lg form-control-solid"
            :type="isPasswordVisible ? 'text' : 'password'"
            name="password"
            autocomplete="off"
          />
          <div class="input-group-append">
            <button
              type="button"
              class="btn btn-light h-100"
              @click="togglePasswordVisibility"
            >
              <i
                class="fa"
                :class="isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'"
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="d-sm-flex flex-stack">
        <!--begin::Submit button-->
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-primary py-3 mt-3 me-3"
          style="width: 45%"
        >
          <span class="indicator-label"> Continue </span>

          <span class="indicator-progress">
            Please wait...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <!--end::Submit button-->
        <MicrosoftLoginButton
          class="mt-3"
          :submitMSButton="submitMSButton"
          @button-submitted="
            (val) => {
              if (submitButton) {
                submitButton.disabled = val;
              }
            }
          "
        />
      </div>
      <!--end::Actions-->
    </Form>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form } from "vee-validate";
import { Actions } from "@/store/enums/StoreEnums";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import { FormValidationCommonRules } from "@/constants/FormValidationRules";
import { ROUTES } from "@/constants/app-constants";
import AuthHeader from "@/components/authentication/AuthHeader.vue";
import MicrosoftLoginButton from "./MicrosoftLoginButton.vue";

export default defineComponent({
  name: "sign-in",
  components: {
    Field,
    Form,
    ErrorMessage,
    AuthHeader,
    MicrosoftLoginButton,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const isPasswordVisible = ref(false);

    const submitButton = ref<HTMLButtonElement | null>(null);
    const submitMSButton = ref<boolean>(false);

    const defaultDashboardRoute = store.getters.getDefaultDashboard;

    //Create form validation object
    const login = createYupValidationSchema({
      username: FormValidationCommonRules.username,
      password: "required",
    });

    //Form submit function
    const onSubmitLogin = async (values) => {
      submitMSButton.value = true;
      if (submitButton.value) {
        // eslint-disable-next-line
        submitButton.value!.disabled = true;
        // Activate indicator
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }
      // Send login request
      await store
        .dispatch(Actions.LOGIN, values)
        .then(async (res) => {
          await store.dispatch(Actions.GET_ALL_PERMISSIONS);
          if (route.query.redirect) {
            router.push({ path: route.query.redirect.toString() });
          } else {
            router.push({
              path: defaultDashboardRoute
                ? defaultDashboardRoute
                : ROUTES.DASHBOARD.INDEX,
            });
          }
        })
        .catch((error) => console.log(error))
        .finally(() => {
          //Deactivate indicator
          submitButton.value?.removeAttribute("data-kt-indicator");
          // eslint-disable-next-line
          submitButton.value!.disabled = false;
          submitMSButton.value = false;
        });
    };
    function togglePasswordVisibility() {
      isPasswordVisible.value = !isPasswordVisible.value;
    }

    return {
      onSubmitLogin,
      togglePasswordVisibility,
      isPasswordVisible,
      login,
      submitButton,
      submitMSButton,
    };
  },
});
</script>
<style scoped></style>
