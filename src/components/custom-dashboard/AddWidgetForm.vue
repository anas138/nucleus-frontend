<template>
  <button
    class="btn btn-primary"
    type="button"
    @click="() => (openDrawer = true)"
  >
    <i class="fa-solid fa-plus"></i> Add Widget
  </button>
  <el-drawer
    v-model="openDrawer"
    :size="width > 720 ? '30%' : '80%'"
    :close-on-click-modal="true"
  >
    <div class="card mb-5 mb-xl-10">
      <div
        class="card-header border-0 bg-primary"
        data-bs-target="#kt_account_profile_details"
        aria-expanded="true"
        aria-controls="kt_account_profile_details"
      >
        <!--begin::Card title-->
        <div class="card-title m-0">
          <h3 class="fw-bold m-0 text-white">Add Widget</h3>
        </div>
        <!--end::Card title-->
      </div>
      <Form @submit="onSubmit">
        <div class="card-body">
          <div class="mb-3">Widget Name</div>
          <el-input
            v-model="values.name"
            type="text"
            placeholder="Enter wiget name"
            name="name"
            @blur="nameField.handleBlur"
            @input="nameField.handleChange"
          />

          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              {{ errors.name }}
            </div>
          </div>

          <div class="my-3">Widget Type</div>

          <drop-down-from-server
            v-model="values.widget_type_id"
            name="widget_type_id"
            placeholder="Select wiget type"
            :dropDownCatagory="AppConstants.DASHBOARD_WIDGET_TYPE"
            :clearable="false"
            :emitDataType="0"
            @blur="widgetTypeIdField.handleBlur"
            @input="widgetTypeIdField.handleChange"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              {{ errors.widget_type_id }}
            </div>
          </div>

          <div class="my-3">Alarm Name</div>

          <basic-drop-down
            v-model="values.alarm_config_id"
            name="alarm_config_id"
            placeholder="Select alarm name"
            :list="alarmsName"
            :clearable="false"
            @blur="alarmConfigIdField.handleBlur"
            @input="alarmConfigIdField.handleChange"
          />

          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              {{ errors.alarm_config_id }}
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button class="btn btn-primary" type="submit">Summit</button>
        </div>
      </Form>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onUnmounted,
  computed,
} from "vue";
import { Form, ErrorMessage, useForm, useField } from "vee-validate";
import AlarmConfigService from "@/core/services/AlarmConfigService";
import DropDownFromServer from "@/components/shared/dropdowns/DropDownFromServer.vue";
import BasicDropDown from "@/components/shared/dropdowns/BasicDropDown.vue";
import { AppConstants } from "@/constants/app-constants";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import * as yup from "yup";
import {
  swalConfirmation,
  swalSuccess,
  swalSuccessConfirmation,
} from "@/core/helpers/sweetAlert.utils";
import { addWidgetCustomDashboard } from "@/core/services/CustomAppDashboardService";
import { ElNotificationSuccess } from "@/core/helpers/ElNotification.utils";

interface FormValues {
  name: string;
  widget_type_id: string | number | null;
  alarm_config_id: string | number | null;
}

export default defineComponent({
  components: { Form, DropDownFromServer, BasicDropDown },
  props: {
    networkType: {
      type: String,
      required: true,
    },
    widgetId: {
      type: Number,
      required: true,
    },
  },
  emits: ["widgetAdded"],
  setup(props, { emit }) {
    const windowWidth = ref(window.innerWidth);
    const onWidthChange = () => (windowWidth.value = window.innerWidth);
    const width = computed(() => windowWidth.value);
    const openDrawer = ref<boolean>(false);

    const validationSchema = createYupValidationSchema({
      name: "required",
      widget_type_id: yup.string().required("Widget type is required"),
      alarm_config_id: yup.string().required("Alarm name is required"),
    });

    const {
      handleSubmit,
      errors,
      resetForm,
      values,
      setFieldValue,
      handleReset,
    } = useForm<FormValues>({
      validationSchema: validationSchema,
      initialValues: {
        name: "",
        widget_type_id: "",
        alarm_config_id: "",
      },
      validateOnMount: false, // Ensure this is at the correct location
    });

    // Use useField for each form field
    const nameField = useField("name");
    const widgetTypeIdField = useField("widget_type_id");
    const alarmConfigIdField = useField("alarm_config_id");

    const alarmsName = ref([]);

    onUnmounted(() => window.removeEventListener("resize", onWidthChange));
    onMounted(() => {
      window.addEventListener("resize", onWidthChange);
    });

    const getAlarms = async () => {
      const res = await AlarmConfigService.getAllAlarmsConfig(
        props.networkType
      );
      if (res.length) {
        alarmsName.value = res.map((val) => {
          return { key: val.id, label: val.alarm_name };
        });
      }
    };

    watch(
      () => props.networkType,
      () => {
        getAlarms();
      },
      { immediate: true }
    );

    watch(
      () => openDrawer.value,
      (val) => {
        if (!val) {
          resetForm();
        }
      }
    );

    const onSubmit = handleSubmit((val) => {
      swalConfirmation("", async () => {
        const res = await addWidgetCustomDashboard(props.widgetId, {
          ...val,
          is_shared: true,
        });
        openDrawer.value = false;
        ElNotificationSuccess(res.message);
        emit("widgetAdded");
      });
    });

    return {
      openDrawer,
      width,
      nameField,
      widgetTypeIdField,
      alarmConfigIdField,
      values,
      errors,
      alarmsName,
      AppConstants,
      validationSchema,
      onSubmit,
    };
  },
});
</script>
