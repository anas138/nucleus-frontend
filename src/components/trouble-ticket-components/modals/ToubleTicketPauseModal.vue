<template>
  <el-dialog
    v-model="dialogFormVisible"
    :show-close="false"
    width="60%"
    :top="width < 1400 ? '0vh' : '20vh'"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="d-flex justify-content-between align-items-center">
        <h4 :id="titleId" :class="titleClass" class="text-white">
          {{ pauseModalTitle }}
        </h4>
        <ModalCloseButton @close="close" />
      </div>
    </template>

    <Form>
      <div class="col-12">
        <div class="d-flex justify-content-between col-md-12 mb-6">
          <label class="col-form-label fw-semobold required fs-6 col-md-4"
            >Pause Time</label
          >
          <div class="col-8">
            <el-date-picker
              class="w-100"
              v-model="selectedDate"
              type="datetimerange"
              start-placeholder="Start date"
              end-placeholder="End date"
              :default-time="defaultTime"
              :format="AppConstants.DATE_FORMATS.DATETIME_FOR_FROM_TO_SELECTOR"
              @blur="formUseFields.pause_start_time.handleBlur"
              @input="formUseFields.pause_start_time.handleChange"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">{{ errors.pause_start_time }}</div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between col-md-12 mb-6">
          <label class="col-form-label fw-semobold required fs-6 col-md-4"
            >Pause Reason</label
          >
          <div class="col-md-8">
            <BasicTextInput
              v-model="values.pause_reason"
              type="textarea"
              placeholder="Write your comment here"
              name="description"
              :autosize="{ minRows: 2, maxRows: 2 }"
              @blur="formUseFields.pause_reason.handleBlur"
              @input="formUseFields.pause_reason.handleChange"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">{{ errors.pause_reason }}</div>
            </div>
          </div>
        </div>
      </div>
    </Form>

    <template #footer>
      <div class="col-12">
        <div class="d-flex align-items-center justify-content-end">
          <button
            type="button"
            class="btn btn-danger me-3"
            @click="() => (dialogFormVisible = false)"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" @click="onSubmit">
            Submit
          </button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  computed,
  onUnmounted,
} from "vue";
import { AppConstants } from "@/constants/app-constants";
import { calculateTimeDifference } from "@/core/helpers/utils";
import ModalCloseButton from "@/components/shared/buttons/ModalCloseButton.vue";
import _ from "lodash";
import { useField, useForm, Form } from "vee-validate";
import { PauseRequestTicketModel } from "@/core/model/trouble-ticket-model";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import * as yup from "yup";
import { useStore } from "vuex";
import { ModuleName } from "@/store/enums/module-enum";
import BasicTextInput from "@/components/shared/inputs/basicTextInput.vue";

export default defineComponent({
  components: {
    Form,
    ModalCloseButton,
    BasicTextInput,
  },
  name: "NCE-alarm-details",
  props: {
    modalVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    pausePayload: { type: Object, required: true, default: () => ({}) },
  },
  emits: ["update:modalDisable", "pauseSubmit"],
  setup(props, { emit }) {
    const store = useStore();
    const dialogFormVisible = ref(props.modalVisible);
    const defaultTime = ref<[Date, Date]>([new Date(), new Date()]);
    const selectedDate = ref();

    const windowWidth = ref(window.innerWidth);
    const onWidthChange = () => (windowWidth.value = window.innerWidth);
    const width = computed(() => windowWidth.value);

    onUnmounted(() => window.removeEventListener("resize", onWidthChange));
    onMounted(() => {
      window.addEventListener("resize", onWidthChange);
    });

    const canSubmitRCA = computed(
      () =>
        store.getters[`${ModuleName.troubleTicket}/getTicketData`]?.permissions
          ?.can_approve_pause
    );
    const pauseModalTitle = ref(
      canSubmitRCA.value ? "Approve Pause Request" : "Pause Request"
    );

    const validationSchema = createYupValidationSchema({
      pause_start_time: !canSubmitRCA.value
        ? yup
            .date()
            .nullable()
            .min(new Date(), `Start Date must be later then current Date`)
            .required("Date is required")
        : null,
      pause_reason: yup.string().nullable().required("Reason is required"),
    });

    const {
      handleSubmit,
      errors,
      resetForm,
      values,
      setFieldValue,
      handleReset,
    } = useForm({
      validationSchema: validationSchema,
      initialValues: {
        ...PauseRequestTicketModel,
      },
      validateOnMount: false, // Ensure this is at the correct location
    });

    // Initializing useFields Hooks for Model-INputs
    const formUseFields = {};
    Object.keys(PauseRequestTicketModel).map(
      (key) => (formUseFields[`${key}`] = useField(`${key}`))
    );

    const onSubmit = handleSubmit(async (payload) => {
      payload["duration"] = await calculateTimeDifference(
        payload.pause_start_time,
        payload.pause_end_time
      );
      if (props.pausePayload?.comment) {
        payload["comment"] = props.pausePayload?.comment;
      }
      emit("pauseSubmit", payload);
    });

    watch(
      () => props.pausePayload,
      (val) => {
        if (Object.keys(val).length) {
          selectedDate.value = [
            val?.currentPauseData?.pause_start_time,
            val?.currentPauseData?.pause_end_time,
          ];
          setFieldValue(
            "pause_start_time",
            val?.currentPauseData?.pause_start_time
          );
          setFieldValue(
            "pause_end_time",
            val?.currentPauseData?.pause_end_time
          );
          setFieldValue("pause_reason", val?.currentPauseData?.pause_reason);
        }
      }
    );

    watch(
      () => selectedDate.value,
      (val) => {
        if (val) {
          setFieldValue("pause_start_time", val[0]);
          setFieldValue("pause_end_time", val[1]);
        } else {
          values.pause_start_time = null;
          values.pause_end_time = null;
        }
      }
    );

    watch(
      () => props.modalVisible,
      (val) => {
        dialogFormVisible.value = val;
      }
    );

    watch(
      () => dialogFormVisible.value,
      (val) => {
        if (!val) {
          emit("update:modalDisable", dialogFormVisible.value);
        }
      }
    );

    return {
      width,
      values,
      errors,
      onSubmit,
      defaultTime,
      selectedDate,
      AppConstants,
      formUseFields,
      pauseModalTitle,
      dialogFormVisible,
    };
  },
});
</script>
