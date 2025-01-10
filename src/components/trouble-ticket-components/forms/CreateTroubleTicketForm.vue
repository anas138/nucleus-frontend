<template>
  <Form @submit="onSubmit" v-if="!isLoading">
    <div class="">
      <div class="row">
        <div class="row col-md-6 mb-6">
          <label class="col-form-label fw-semobold fs-6 required col-md-4"
            >Case Title</label
          >
          <div class="col-md-8">
            <basicTextInput
              v-model="values.case_title"
              type="text"
              placeholder="Enter Case Title"
              name="case_title"
              @blur="formUseFields.case_title.handleBlur"
              @input="formUseFields.case_title.handleChange"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">{{ errors.case_title }}</div>
            </div>
          </div>
        </div>

        <div class="row col-md-6 mb-6">
          <label class="col-form-label fw-semobold required fs-6 col-md-4"
            >Sub Department</label
          >
          <div class="col-md-8">
            <SubDepartmentEngineeringDropDown
              v-model="values.sub_department_id"
              placeholder="Select Sub Department"
              name="sub_department_id"
              @department-id="(id:number)=>{values.department_id=id}"
              @blur="formUseFields.sub_department_id.handleBlur"
              @input="formUseFields.sub_department_id.handleChange"
              :clearable="false"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                {{ errors.sub_department_id }}
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="row col-md-6 mb-6">
          <label class="col-form-label fw-semobold fs-6 required col-md-4"
            >Department</label
          >
          <div class="col-md-8">
            <DepartmentDropDown
              v-model="values.department_id"
              placeholder="Select Department"
              name="department_id"
              @change="values.sub_department_id = null"
              @blur="formUseFields.department_id.handleBlur"
              @input="formUseFields.department_id.handleChange"
              :clearable="false"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">{{ errors.department_id }}</div>
            </div>
          </div>
        </div> -->

        <div class="row col-md-6 mb-6">
          <label class="col-form-label fw-semobold fs-6 required col-md-4"
            >Category
          </label>
          <div class="col-md-8">
            <CategoryDropDown
              v-model="values.trouble_ticket_category_id"
              placeholder="Select Category"
              name="trouble_ticket_category_id"
              @change="
                (val) => {
                  values.trouble_ticket_sub_category_id = null;
                  categoryIdForTurnAroundTime = val.value;
                }
              "
              :clearable="false"
              @blur="formUseFields.trouble_ticket_category_id.handleBlur"
              @input="formUseFields.trouble_ticket_category_id.handleChange"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                {{ errors.trouble_ticket_category_id }}
              </div>
            </div>
          </div>
        </div>
        <div class="row col-md-6 mb-6" :key="values.trouble_ticket_category_id">
          <label class="col-form-label fw-semobold fs-6 col-md-4"
            >Sub Category</label
          >
          <div class="col-md-8">
            <SubCategoryDropDown
              :categoryId="values.trouble_ticket_category_id"
              v-model="values.trouble_ticket_sub_category_id"
              placeholder="Select Sub Category"
              name="trouble_ticket_sub_category_id"
              @blur="formUseFields.trouble_ticket_sub_category_id.handleBlur"
              @input="formUseFields.trouble_ticket_sub_category_id.handleChange"
              :clearable="true"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                {{ errors.trouble_ticket_sub_category_id }}
              </div>
            </div>
          </div>
        </div>

        <TurnAroundTime
          :trouble-ticket-category-id="categoryIdForTurnAroundTime"
        />

        <div class="row col-md-6 mb-6">
          <label class="col-form-label fw-semobold fs-6 col-md-4"
            >Priority</label
          >
          <div class="col-md-8">
            <PriorityDropDown
              v-model="values.priority_level"
              placeholder="Select Priority"
              name="priority_level"
              @blur="formUseFields.priority_level.handleBlur"
              @input="formUseFields.priority_level.handleChange"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                {{ errors.priority_level }}
              </div>
            </div>
          </div>
        </div>

        <div class="row col-md-12 mb-6">
          <label class="col-form-label fw-semobold fs-6 col-md-2"
            >Description</label
          >
          <div class="col-md-10">
            <basicTextInput
              v-model="values.description"
              type="textarea"
              :placeholder="''"
              name="description"
              :autosize="{ minRows: 4, maxRows: 4 }"
            />

            <!-- <div class="fv-plugins-message-container">
                    <div class="fv-help-block">{{ errors.name }}</div>
                  </div> -->
          </div>
        </div>

        <div />

        <div class="row col-md-12 mb-6">
          <label class="col-form-label fw-semobold fs-6 col-md-2"
            >Attachments:</label
          >
          <div class="col-md-10">
            <DocumentsUploader
              @attachmentList="
                (val) => {
                  values.attachment = val;
                }
              "
              @uploadingFile="uploadingStatus"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer d-flex justify-content-end py-6 px-9">
      <button
        type="submit"
        id="kt_account_profile_details_submit"
        ref="submitButton"
        class="btn btn-primary"
      >
        <span class="indicator-label"> Submit </span>

        <span class="indicator-progress">
          <span
            class="spinner-border spinner-border-sm align-middle ms-2"
          ></span>
        </span>
      </button>
    </div>
  </Form>
  <CreateTroubleTicketSkeleton v-else />
  <!-- <button type="button" @click="getooooo"></button> -->
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  computed,
} from "vue";
import { AppConstants } from "@/constants/app-constants";
import { Form, ErrorMessage, useForm, useField } from "vee-validate";
import _ from "lodash";
import basicTextInput from "@/components/shared/inputs/basicTextInput.vue";
import CategoryDropDown from "@/components/shared/dropdowns/CategoryDropDown.vue";
import SubCategoryDropDown from "@/components/shared/dropdowns/SubCategoryDropDown.vue";
import SubDepartmentEngineeringDropDown from "@/components/shared/dropdowns/SubDepartmentEngineeringDropDown.vue";
import TurnAroundTime from "@/components/shared/TurnAroundTime.vue";
import { TroubleTicket } from "@/core/interface/trouble-ticket-interfaces";
import { TroubleTicketModel } from "@/core/model/trouble-ticket-model";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import * as yup from "yup";
import DocumentsUploader from "@/components/shared/DocumentsUploader.vue";
import { ModuleName } from "@/store/enums/module-enum";
import { useStore } from "vuex";
import router from "@/router";
import TroubleTicketService from "@/core/services/TroubleTicketService";
import { ElNotificationSuccess } from "@/core/helpers/ElNotification.utils";
import { swalConfirmation } from "@/core/helpers/sweetAlert.utils";
import CreateTroubleTicketSkeleton from "@/components/trouble-ticket-components/forms/skeletons/CreateTroubleTicketSkeleton.vue";
import PriorityDropDown from "@/components/shared/dropdowns/PriorityDropDown.vue";

export default defineComponent({
  components: {
    // BasicDropDown,
    basicTextInput,
    CategoryDropDown,
    SubCategoryDropDown,
    SubDepartmentEngineeringDropDown,
    DocumentsUploader,
    TurnAroundTime,
    PriorityDropDown,
    CreateTroubleTicketSkeleton,
    Form,
  },
  props: {
    alarmId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const isLoading = ref<boolean>(true);

    const userInfo = computed(() => {
      const { id, sub_department_id } = store.getters.currentUser;
      return { id, sub_department_id };
    });

    const submitButton = ref<HTMLButtonElement | null>(null);

    const alarmData = computed(
      () => store.getters[`${ModuleName.troubleTicket}/getAlarm`]
    );
    const categoryIdForTurnAroundTime = ref();

    const validationSchema = createYupValidationSchema({
      // name: "required",
      case_title: yup.string().nullable().required("Case Title is required"),
      trouble_ticket_category_id: yup
        .number()
        .nullable()
        .required("Category is required"),
      // total_tat: yup
      //   .number()
      //   .nullable()
      //   .required("Turn Around Time is required"),
      department_id: yup.number().nullable().required("Department is required"),
      sub_department_id: yup
        .number()
        .nullable()
        .required("Sub Department is required"),
      priority_level: yup.number().nullable().required("Priority is required"),
    });

    const {
      handleSubmit,
      errors,
      resetForm,
      values,
      setFieldValue,
      handleReset,
    } = useForm<TroubleTicket>({
      validationSchema: validationSchema,
      initialValues: {
        ...TroubleTicketModel,
      },
      validateOnMount: false, // Ensure this is at the correct location
    });

    // Initializing useFields Hooks for Model-INputs
    const formUseFields = {};
    Object.keys(TroubleTicketModel).map(
      (key) => (formUseFields[`${key}`] = useField(`${key}`))
    );

    const uploadingStatus = (val) => {
      if (val) {
        submitButton.value!.disabled = true;
      } else {
        submitButton.value!.disabled = false;
      }
    };

    const onSubmit = handleSubmit(async (val) => {
      swalConfirmation("Are you sure you want to create ticket?", async () => {
        try {
          if (submitButton.value) {
            // eslint-disable-next-line
            submitButton.value!.disabled = true;
            // Activate indicator
            submitButton.value.setAttribute("data-kt-indicator", "on");
          }
          if (alarmData.value.alarm_filter_config_id) {
            const body: TroubleTicket = {
              ...val,
              alarm_id: alarmData.value.id,
              alarm_config_id: alarmData.value.alarm_filter_config_id,
            };
            const res = await TroubleTicketService.createTroubleTicket(body);
            ElNotificationSuccess(res.message);
            if (
              res?.data?.sub_department_id ===
              userInfo?.value?.sub_department_id
            ) {
              router.replace(`/trouble-ticket/view/${res?.data?.id}`);
            } else {
              router.replace({ name: "trouble-ticket-list" });
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          //Deactivate indicator
          submitButton.value?.removeAttribute("data-kt-indicator");
          // eslint-disable-next-line
          submitButton.value!.disabled = false;
        }
      });
    });

    watch(
      () => alarmData.value,
      (data) => {
        if (data?.id) {
          isLoading.value = false;
        }
      }
    );

    watch(
      () => values.trouble_ticket_sub_category_id,
      (val) => {
        if (val) {
          categoryIdForTurnAroundTime.value = val;
        } else {
          categoryIdForTurnAroundTime.value = values.trouble_ticket_category_id;
        }
      }
    );

    const showModalLocal = ref(true);
    return {
      showModalLocal,
      AppConstants,
      categoryIdForTurnAroundTime,
      onSubmit,
      handleSubmit,
      submitButton,
      uploadingStatus,
      errors,
      resetForm,
      values,
      isLoading,
      formUseFields,
    };
  },
});
</script>
