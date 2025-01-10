<template>
  <el-dialog
    v-model="dialogFormVisible"
    :show-close="false"
    width="60%"
    :top="'25vh'"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="d-flex justify-content-between align-items-center">
        <h4 :id="titleId" :class="titleClass" class="text-white">
          Provide Reason for Resolution of Ticket
        </h4>
        <ModalCloseButton @close="close" />
      </div>
    </template>

    <Form>
      <div class="col-12">
        <div class="d-flex justify-content-between col-md-12 mb-6">
          <label class="col-form-label fw-semobold required fs-6 col-md-4"
            >Resolution Reason</label
          >
          <div class="col-md-8">
            <DropDownFromServer
              v-model="values.resolution_reason"
              placeholder="Select Resolution Reason"
              name="resolution_reason"
              dropDownCatagory="TICKET_RESOLUTION_REASON"
              :emitDataType="0"
              :clearable="false"
              @blur="formUseFields.resolution_reason.handleBlur"
              @input="formUseFields.resolution_reason.handleChange"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">{{ errors.resolution_reason }}</div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between col-md-12 mb-6">
          <label class="col-form-label fw-semobold required fs-6 col-md-4"
            >Resolution Comment</label
          >
          <div class="col-md-8">
            <BasicTextInput
              v-model="values.resolution_comment"
              type="textarea"
              placeholder="Write your comment here"
              name="description"
              :autosize="{ minRows: 2, maxRows: 2 }"
              @blur="formUseFields.resolution_comment.handleBlur"
              @input="formUseFields.resolution_comment.handleChange"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">{{ errors.resolution_comment }}</div>
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
} from "vue";
import { AppConstants } from "@/constants/app-constants";
import ModalCloseButton from "@/components/shared/buttons/ModalCloseButton.vue";
import _ from "lodash";
import { useField, useForm, Form } from "vee-validate";
import { ResolutionModel } from "@/core/model/trouble-ticket-model";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import * as yup from "yup";
import BasicTextInput from "@/components/shared/inputs/basicTextInput.vue";
import DropDownFromServer from "@/components/shared/dropdowns/DropDownFromServer.vue";

export default defineComponent({
  components: {
    Form,
    ModalCloseButton,
    BasicTextInput,
    DropDownFromServer,
  },
  name: "NCE-alarm-details",
  props: {
    modalVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    resolvePayload: { type: Object, required: true, default: () => ({}) },
  },
  emits: ["update:modalDisable", "resolutionSubmit"],
  setup(props, { emit }) {
    let config = reactive([]);
    const dialogFormVisible = ref(props.modalVisible);

    const showModalLocal = ref(true);

    const validationSchema = createYupValidationSchema({
      resolution_reason: yup.number().nullable().required("Reason is required"),
      resolution_comment: yup
        .string()
        .nullable()
        .required("Comment is required"),
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
        ...ResolutionModel,
      },
      validateOnMount: false, // Ensure this is at the correct location
    });

    // Initializing useFields Hooks for Model-INputs
    const formUseFields = {};
    Object.keys(ResolutionModel).map(
      (key) => (formUseFields[`${key}`] = useField(`${key}`))
    );

    const onSubmit = handleSubmit(async (val) => {
      const payload = { ...props.resolvePayload, ...val };
      emit("resolutionSubmit", payload);
    });

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

    return { values, errors, onSubmit, formUseFields, dialogFormVisible };
  },
});
</script>
