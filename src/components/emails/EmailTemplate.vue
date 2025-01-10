<template>
  <modal :loading="EmailLoadingFlag" @close="onClose">
    <template v-slot:header>
      <h2 class="fw-bold text-white">{{ title }}</h2>
    </template>
    <template v-slot:body>
      <div class="row mb-1" v-for="(field, key) in formConfig" :key="key">
        <label
          class="col-lg-2 col-form-label fw-semobold fs-6"
          :for="field.name"
        >
          <span :class="field.required ? 'required' : 'notReq'">
            {{ field.label }}
          </span>
        </label>
        <div class="col-lg-10 fv-row align-items-center">
          <el-form-item>
            <Component
              :key="key"
              :is="field.component"
              :name="field.name"
              v-bind="field.props"
              @change="change"
              :disabled="readOnly ? true : false"
            />
          </el-form-item>
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <div class="error-message">
                {{ errors[field.name] }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-1">
        <label
          class="col-lg-2 col-form-label fw-semobold fs-6"
          :for="'EmailPreview'"
        >
          <span> Email Preview </span>
        </label>
        <div class="col-lg-10 fv-row align-items-start">
          <div class="container email-preview-container">
            <iframe class="w-100 h-600px" :srcdoc="htmlTempToDisplay"></iframe>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer v-if="!readOnly">
      <div class="d-flex justify-content-end">
        <el-button
          type="primary"
          round
          :disabled="Object.keys(errors).length > 0"
          @click="sendEmail"
        >
          <span class="icon-link"><i class="bi-send-fill me-2"></i></span>
          Send Email
        </el-button>
      </div>
    </template>
  </modal>
</template>
<script lang="ts">
import basicTextInput from "@/components/shared/inputs/basicTextInput.vue";
import TagInput from "@/components/shared/inputs/EmailTagInput.vue";
import Modal from "@/components/shared/modal/Modal.vue";
import { FormValidationCommonRules } from "@/constants/FormValidationRules";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import { proxyToObject } from "@/core/helpers/utils";
import { defineComponent, onMounted, ref, shallowRef } from "vue";
import * as yup from "yup";

export default defineComponent({
  components: { basicTextInput, TagInput, Modal },
  name: "alarm-email",
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    title: {
      type: String,
      required: false,
      default: "Email Template",
    },
    htmlTemplate: {
      required: true,
    },
    sendEmailFunction: {
      type: Function,
      required: true,
    },
    subject: {
      required: false,
      type: String,
      default: "",
    },
    to: {
      required: false,
      type: String,
      default: "",
    },
    cc: {
      required: false,
      type: Array,
      default: () => [],
    },
    readOnly: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  emits: ["close"],
  setup(props, context) {
    const formData = shallowRef({
      subject: props.subject,
      cc: props.cc,
      to: props.to,
    });
    const showModalLocal = ref(true);
    const formConfig = shallowRef();
    const EmailLoadingFlag = ref(props.loading);
    const htmlTempToDisplay = ref();
    const errors = ref({});

    const validationSchema = createYupValidationSchema({
      to: yup
        .array()
        .required()
        .min(1, "(TO) must contain 1 email")
        .of(yup.string().email("Invalid email format")),
      subject: FormValidationCommonRules.commonText,
      cc: yup.array().optional().of(yup.string().email("Invalid email format")),
    });

    //perform validation if props are passed
    errors.value["subject"] =
      props.subject === "" ? "" : validateInput("subject");
    errors.value["to"] = props.to === "" ? "" : validateInput("to");
    props.cc.length && validateInput("cc");

    onMounted(async () => {
      EmailLoadingFlag.value = true;
      formConfig.value = [
        {
          label: "Subject",
          name: "subject",
          required: true,
          component: basicTextInput,
          props: {
            value: props.subject,
            placeholder: "Enter Subject",
          },
        },
        {
          label: "To",
          name: "to",
          required: true,
          component: TagInput,
          props: {
            value: props.to,
          },
        },
        {
          label: "cc",
          name: "cc",
          required: false,
          component: TagInput,
          props: {
            value: props.cc,
          },
        },
      ];
      htmlTempToDisplay.value = await props.htmlTemplate;
      EmailLoadingFlag.value = false;
    });

    function validateInput(name) {
      validationSchema
        .validateAt(name, formData.value)
        .then(() => {
          // Validation successful, emit isValid with true
          errors.value && delete errors.value[name];
        })
        .catch((error) => {
          // Validation failed,
          errors.value[name] = error.errors[0];
        });
    }

    function change(newValue) {
      formData.value[newValue.name] = newValue.value;
      validateInput(newValue.name);
    }
    function sendEmail() {
      props.sendEmailFunction(proxyToObject(formData.value));
    }
    function onClose() {
      context.emit("close");
    }
    return {
      showModalLocal,
      change,
      formConfig,
      EmailLoadingFlag,
      htmlTempToDisplay,
      sendEmail,
      errors,
      onClose,
    };
  },
});
</script>

<style>
.email-preview-container {
  width: 100%;
}
</style>
