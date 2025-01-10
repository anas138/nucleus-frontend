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
          Provide Reason for Bulk Updation of Tickets
        </h4>
        <ModalCloseButton @close="close" />
      </div>
    </template>

    <Form>
      <div class="col-12">
        <div class="d-flex justify-content-between col-md-12 mb-6">
          <label class="col-form-label fw-semobold required fs-6 col-md-4"
            >Status</label
          >
          <div class="col-md-8">
            <el-select v-model="values.status" placeholder="Select Status">
              <el-option
                v-for="(dropDownValue, index) in statusOptions"
                :key="index"
                :value="dropDownValue.id"
                :label="dropDownValue.label"
              >
                {{ dropDownValue.label }}
              </el-option>
            </el-select>

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">{{ errors.status }}</div>
            </div>
          </div>
        </div>
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
            >Bulk Updation Comment</label
          >
          <div class="col-md-8">
            <BasicTextInput
              v-model="values.comment"
              type="textarea"
              placeholder="Write your comment here"
              name="description"
              :autosize="{ minRows: 2, maxRows: 2 }"
              @blur="formUseFields.comment.handleBlur"
              @input="formUseFields.comment.handleChange"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">{{ errors.comment }}</div>
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
            :disabled="bulkUpdationButtonDisable"
            @click="() => (dialogFormVisible = false)"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="bulkUpdationButtonDisable"
            class="btn btn-primary"
            @click="onSubmit"
          >
            <ButtonSpinner v-if="bulkUpdationButtonDisable" />
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
import { AppConstants, TroubleTicketContants } from "@/constants/app-constants";
import ModalCloseButton from "@/components/shared/buttons/ModalCloseButton.vue";
import _ from "lodash";
import { useField, useForm, Form } from "vee-validate";
import { BulkUpdationModel } from "@/core/model/trouble-ticket-model";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import * as yup from "yup";
import BasicTextInput from "@/components/shared/inputs/basicTextInput.vue";
import DropDownFromServer from "@/components/shared/dropdowns/DropDownFromServer.vue";
import ButtonSpinner from "@/components/shared/spinners/ButtonSpinner.vue";
import { swalConfirmation } from "@/core/helpers/sweetAlert.utils";
import { permissions } from "@/constants/permissions-constants";
import { PermissionsService } from "@/core/services/PermissionsService";

export default defineComponent({
  components: {
    Form,
    ModalCloseButton,
    BasicTextInput,
    ButtonSpinner,
    DropDownFromServer,
  },
  name: "NCE-alarm-details",
  props: {
    modalVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    bulkUpdationButtonDisable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modalDisable", "bulkUpdationSubmit"],
  setup(props, { emit }) {
    let config = reactive([]);
    const dialogFormVisible = ref(props.modalVisible);

    const ticketToCompletePermission = permissions.troubleTicket.create;

    const statusOptions = reactive([
      {
        id: TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.RESOLVED,
        label: TroubleTicketContants.STATUS.RESOLVED,
      },
    ]);

    const ticketPermissions = () => {
      if (PermissionsService.hasPermission(ticketToCompletePermission)) {
        statusOptions.push({
          id: TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.COMPLETED,
          label: TroubleTicketContants.STATUS.COMPLETED,
        });
      }
    };

    onMounted(() => {
      ticketPermissions();
    });

    const validationSchema = createYupValidationSchema({
      status: yup.number().nullable().required("Status is required"),
      resolution_reason: yup.number().nullable().required("Reason is required"),
      comment: yup.string().nullable().required("Comment is required"),
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
        ...BulkUpdationModel,
      },
      validateOnMount: false, // Ensure this is at the correct location
    });

    // Initializing useFields Hooks for Model-INputs
    const formUseFields = {};
    Object.keys(BulkUpdationModel).map(
      (key) => (formUseFields[`${key}`] = useField(`${key}`))
    );

    const onSubmit = handleSubmit(async (val) => {
      swalConfirmation("Are you sure to update tickets in bulk ? ", () => {
        const payload = { ...val };
        emit("bulkUpdationSubmit", payload);
      });
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

    return {
      values,
      errors,
      onSubmit,
      statusOptions,
      formUseFields,
      dialogFormVisible,
    };
  },
});
</script>
