<template>
  <!--begin::Basic info-->
  <div class="card mb-5 mb-xl-10">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-toggle="collapse"
      data-bs-target="#kt_account_profile_details"
      aria-expanded="true"
      aria-controls="kt_account_profile_details"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Profile Details</h3>
      </div>
      <!--end::Card title-->
    </div>
    <!--begin::Card header-->

    <!--begin::Content-->
    <div id="kt_account_profile_details" class="collapse show">
      <!--begin::Form-->
      <Form
        id="kt_account_profile_details_form"
        class="form"
        novalidate="novalidate"
        @submit="saveChanges1()"
        :validation-schema="profileDetailsValidator"
      >
        <!--begin::Card body-->
        <div class="card-body border-top p-9">
          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semobold fs-6"
              >Avatar</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8">
              <!--begin::Image input-->
              <div
                class="image-input image-input-outline"
                data-kt-image-input="true"
                style="background-image: url(/media/avatars/blank.png)"
              >
                <!--begin::Preview existing avatar-->
                <div
                  class="image-input-wrapper w-125px h-125px"
                  :style="`background-image: url(${profileDetails.image})`"
                ></div>
                <!--end::Preview existing avatar-->

                <!--begin::Label-->
                <label
                  class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                >
                  <el-tooltip content="Change avatar"
                    ><i class="bi bi-pencil-fill fs-7"></i
                  ></el-tooltip>

                  <!--begin::Inputs-->
                  <input
                    type="file"
                    name="avatar"
                    accept=".png, .jpg, .jpeg"
                    @change="handleAvatarUpload"
                  />
                  <input type="hidden" name="avatar_remove" />
                  <!--end::Inputs-->
                </label>
                <!--end::Label-->

                <!--begin::Remove-->
                <span
                  class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                  data-bs-toggle="tooltip"
                  @click="removeImage()"
                  title=""
                >
                  <el-tooltip content="Remove avatar"
                    ><i class="bi bi-x fs-2"></i
                  ></el-tooltip>
                </span>
                <!--end::Remove-->
              </div>
              <!--end::Image input-->

              <!--begin::Hint-->
              <div class="form-text">Allowed file types: png, jpg, jpeg.</div>
              <!--end::Hint-->
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label required fw-semobold fs-6"
              >Full Name</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <Field
                type="text"
                name="full_name"
                class="form-control form-control-lg form-control-solid"
                placeholder="Full Name"
                v-model="profileDetails.full_name"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="full_name" />
                </div>
              </div>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semobold fs-6">
              <span class="required">Official Contact Phone</span>

              <el-tooltip content="Phone number must be active"
                ><i
                  class="fas fa-exclamation-circle ms-1 fs-7"
                  data-bs-toggle="tooltip"
                ></i
              ></el-tooltip>
            </label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <Field
                type="tel"
                name="official_mobile"
                class="form-control form-control-lg form-control-solid"
                placeholder="Official Phone number"
                v-model="profileDetails.official_mobile"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="official_mobile" />
                </div>
              </div>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semobold fs-6">
              <span class="required">Personal Contact Phone</span>

              <el-tooltip content="Phone number must be active"
                ><i
                  class="fas fa-exclamation-circle ms-1 fs-7"
                  data-bs-toggle="tooltip"
                ></i
              ></el-tooltip>
            </label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <Field
                type="tel"
                name="personal_mobile"
                class="form-control form-control-lg form-control-solid"
                placeholder="Phone number"
                v-model="profileDetails.personal_mobile"
              />
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="personal_mobile" />
                </div>
              </div>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->
        </div>
        <!--end::Card body-->

        <!--begin::Actions-->
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button
            type="reset"
            class="btn btn-light btn-active-light-primary me-2"
          >
            Discard
          </button>

          <button
            type="submit"
            id="kt_account_profile_details_submit"
            ref="submitButton1"
            class="btn btn-primary"
          >
            <span class="indicator-label"> Save Changes </span>
            <span class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
        <!--end::Actions-->
      </Form>
      <!--end::Form-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Basic info-->

  <!--begin::Sign-in Method-->
  <div class="card mb-5 mb-xl-10">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-toggle="collapse"
      data-bs-target="#kt_account_signin_method"
    >
      <div class="card-title m-0">
        <h3 class="fw-bolder m-0">Password Reset</h3>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Content-->
    <div id="kt_account_signin_method" class="collapse show">
      <!--begin::Card body-->
      <div class="card-body border-top p-9">
        <!--begin::Password-->
        <div class="d-flex flex-wrap align-items-center mb-8">
          <div
            id="kt_signin_password"
            :class="{ 'd-none': passwordFormDisplay }"
          >
            <div class="fs-4 fw-bolder mb-1">Password</div>
            <div class="fs-6 fw-semobold text-gray-600">************</div>
          </div>
          <div
            id="kt_signin_password_edit"
            class="flex-row-fluid"
            :class="{ 'd-none': !passwordFormDisplay }"
          >
            <div class="fs-6 fw-semobold text-gray-600 mb-4">
              Password must be at least 8 character, should contain one
              uppercase, one lowercase, and one number.
            </div>

            <!--begin::Form-->
            <Form
              id="kt_signin_change_password"
              class="form"
              novalidate="novalidate"
              @submit="updatePassword"
              :validation-schema="changePassword"
            >
              <div class="row mb-6">
                <div class="col-lg-6">
                  <div class="fv-row mb-0">
                    <label for="password" class="form-label fs-6 fw-bold mb-3"
                      >New Password</label
                    >
                    <password name="password" placeholder="" />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="password" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="fv-row mb-0">
                    <label
                      for="confirmpassword"
                      class="form-label fs-6 fw-bold mb-3"
                      >Confirm New Password</label
                    >
                    <password name="confirmpassword" placeholder="" />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="confirmpassword" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex">
                <button
                  id="kt_password_submit"
                  type="submit"
                  ref="updatePasswordButton"
                  class="btn btn-primary me-2 px-6"
                >
                  <span class="indicator-label"> Update Password </span>
                  <span class="indicator-progress">
                    Please wait...
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                </button>
                <button
                  id="kt_password_cancel"
                  type="reset"
                  @click="passwordFormDisplay = !passwordFormDisplay"
                  class="btn btn-color-gray-400 btn-active-light-primary px-6"
                >
                  Cancel
                </button>
              </div>
            </Form>
            <!--end::Form-->
          </div>
          <div
            id="kt_signin_password_button"
            class="ms-auto"
            :class="{ 'd-none': passwordFormDisplay }"
          >
            <button
              @click="passwordFormDisplay = !passwordFormDisplay"
              class="btn btn-light fw-bolder"
            >
              Reset Password
            </button>
          </div>
        </div>
        <!--end::Password-->
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Sign-in Method-->
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { ErrorMessage, Field, Form } from "vee-validate";
import Swal from "sweetalert2/dist/sweetalert2.js";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import Password from "@/components/shared/inputs/Password.vue";
import { useStore } from "vuex";
import {
  FormValidationCommonRules,
  FormValidationYup,
} from "@/constants/FormValidationRules";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import { Actions } from "@/store/enums/StoreEnums";

interface ProfileDetails {
  image: string;
  full_name: string;
  official_mobile: string;
  personal_mobile: string;
}
import UploadService from "@/core/services/UploadService";
import { imageUrl } from "@/core/helpers/utils";
import { ElNotification } from "element-plus";
import { ElNotificationSuccess } from "@/core/helpers/ElNotification.utils";

export default defineComponent({
  name: "account-settings",
  components: {
    ErrorMessage,
    Field,
    Form,
    Password,
  },
  setup() {
    const submitButton1 = ref<HTMLElement | null>(null);
    const updatePasswordButton = ref<HTMLElement | null>(null);
    const store = useStore();
    const user = computed(() => {
      return store.getters.currentUser;
    });

    const passwordFormDisplay = ref(false);

    const profileDetailsValidator = createYupValidationSchema({
      full_name: FormValidationCommonRules.commonNameText,
      official_mobile: FormValidationYup.phoneNumber,
      personal_mobile: FormValidationYup.phoneNumber,
    });

    const changePassword = createYupValidationSchema({
      password: FormValidationCommonRules.password,
      confirmpassword: FormValidationYup.confirmPassword,
    });

    const profileDetails = ref<ProfileDetails>({
      full_name: user.value.full_name,
      official_mobile: user.value.official_mobile,
      personal_mobile: user.value.personal_mobile,
      image: user.value.profile_picture,
    });

    const password = ref("");

    const saveChanges1 = () => {
      if (
        submitButton1.value &&
        (user.value.full_name !== profileDetails.value.full_name ||
          user.value.official_mobile !== profileDetails.value.official_mobile ||
          user.value.personal_mobile !== profileDetails.value.personal_mobile)
      ) {
        // Activate indicator
        submitButton1.value.setAttribute("data-kt-indicator", "on");
        const body: any = {
          full_name: profileDetails.value.full_name,
          official_mobile: profileDetails.value.official_mobile,
          personal_mobile: profileDetails.value.personal_mobile,
        };

        ApiService.put("auth/update-user", body)
          .then((response) => {
            submitButton1.value?.removeAttribute("data-kt-indicator");
            ElNotification({
              title: "Success",
              message: response.data.message,
              type: "success",
            });
            store.dispatch(Actions.GET_MY_INFO);
          })
          .catch((err) => {
            submitButton1.value?.removeAttribute("data-kt-indicator");
          });
      }
    };

    const updatePassword = (val) => {
      if (updatePasswordButton.value) {
        // Activate indicator
        updatePasswordButton.value.setAttribute("data-kt-indicator", "on");
        const body: any = {
          password: val.password,
        };

        ApiService.post("auth/update-password-api", body)
          .then((response) => {
            updatePasswordButton.value?.removeAttribute("data-kt-indicator");
            Swal.fire({
              text: "Password is successfully changed!",
              icon: "success",
              confirmButtonText: "Ok",
              buttonsStyling: false,
              customClass: {
                confirmButton: "btn btn-light-primary",
              },
            }).then(() => {
              passwordFormDisplay.value = false;
            });
          })
          .catch((err) => {
            updatePasswordButton.value?.removeAttribute("data-kt-indicator");
          });
      }
    };

    const removeImage = () => {
      ApiService.put("auth/update-user", {
        profile_picture: "",
      } as any).then(() => {
        store.dispatch(Actions.GET_MY_INFO);
        profileDetails.value.image = "";
        ElNotification({
          title: "Success",
          message: `Profile Picture Removed.`,
          type: "success",
        });
      });
    };

    const handleAvatarUpload = async (event) => {
      const file: File = event.target.files[0];
      if (file) {
        await UploadService.uploadProfilePicture(file);
        profileDetails.value.image = URL.createObjectURL(file);
        store.dispatch(Actions.GET_MY_INFO);
      }
    };
    return {
      submitButton1,
      saveChanges1,
      profileDetails,
      passwordFormDisplay,
      removeImage,
      profileDetailsValidator,
      password,
      changePassword,
      updatePasswordButton,
      updatePassword,
      handleAvatarUpload,
    };
  },
});
</script>
