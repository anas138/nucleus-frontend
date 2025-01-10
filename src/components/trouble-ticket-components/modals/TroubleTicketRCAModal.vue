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
          RCA Required
        </h4>
        <ModalCloseButton @close="close" />
      </div>
    </template>

    <Form>
      <div class="col-12">
        <div class="d-flex justify-content-between col-md-12 mb-6">
          <label class="col-form-label fw-semobold required fs-6 col-md-4"
            >Select concerned department
          </label>
          <div class="col-md-8">
            <SubDepartmentEngineeringDropDown
              :departmentId="1"
              v-model="values.sub_department_id"
              placeholder="Select Sub-Department"
              name="sub_department_id"
              :clearable="false"
              @return-sub-dep-name="(val) => (selectedSubDepName = val)"
              @blur="formUseFields.sub_department_id.handleBlur"
              @input="formUseFields.sub_department_id.handleChange"
            />

            <div class="fv-plugins-message-container">
              <div class="fv-help-block">{{ errors.sub_department_id }}</div>
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
import { RCARequiredTicketModel } from "@/core/model/trouble-ticket-model";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import * as yup from "yup";
import SubDepartmentEngineeringDropDown from "@/components/shared/dropdowns/SubDepartmentEngineeringDropDown.vue";

export default defineComponent({
  components: {
    Form,
    ModalCloseButton,
    SubDepartmentEngineeringDropDown,
  },
  props: {
    modalVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    rcaPayload: { type: Object, required: true, default: () => ({}) },
  },
  emits: ["update:modalDisable", "rcaSubmit"],
  setup(props, { emit }) {
    let config = reactive([]);
    const dialogFormVisible = ref(props.modalVisible);

    const selectedSubDepName = ref("");

    const validationSchema = createYupValidationSchema({
      sub_department_id: yup
        .number()
        .nullable()
        .required("Sub-Department is required"),
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
        ...RCARequiredTicketModel,
      },
      validateOnMount: false, // Ensure this is at the correct location
    });

    // Initializing useFields Hooks for Model-INputs
    const formUseFields = {};
    Object.keys(RCARequiredTicketModel).map(
      (key) => (formUseFields[`${key}`] = useField(`${key}`))
    );

    const onSubmit = handleSubmit(async (val) => {
      const payload = {
        ...props.rcaPayload,
        sub_department_id: val?.sub_department_id,
        is_rca_required: true,
        subDepName: selectedSubDepName.value,
      };

      emit("rcaSubmit", payload);
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
      formUseFields,
      selectedSubDepName,
      dialogFormVisible,
    };
  },
});
</script>
