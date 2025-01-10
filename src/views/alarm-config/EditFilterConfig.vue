<template>
  <crud-view-layout
    pageIcon="fa-solid fa-cog"
    :pageTitle="pageTitle"
    :isLoading="loading"
  >
    <template #body>
      <el-form>
        <basic-alarm-config-section
          @change="change"
          name="alarm_filter_config"
          :appType="appType"
          @isValid="onIsValid"
          :value="formValues.alarm_filter_config"
          :key="key"
          :disabled="disabled"
          :canChangeDisplaySeverity="canChangeDisplaySeverity"
          :errorMessageToggled="errorMessageToggled"
        />
        <advance-alarm-config-section
          @change="change"
          name="alarm_filter_advanced_conditions"
          :appType="appType"
          @isValid="onIsValid"
          :value="formValues.alarm_filter_advanced_conditions"
          :key="key"
          :disabled="disabled"
          :errorMessageToggled="errorMessageToggled"
        />
        <alarm-recipients-config-section
          v-show="formValues?.alarm_filter_config?.is_email_escalation"
          @change="change"
          name="alarm_recipients"
          :toggledValue="formValues?.alarm_filter_config?.is_email_escalation"
          @resetFromParent="resetAlarmRecipients"
          @isValid="onIsValid"
          :value="formValues.alarm_recipients"
          :key="key"
          :disabled="disabled"
          :errorMessageToggled="errorMessageToggled"
        />
        <ticket-escalation-config-section
          v-show="formValues?.alarm_filter_config?.is_ticket_escalation"
          @change="change"
          :toggledValue="formValues?.alarm_filter_config?.is_ticket_escalation"
          @resetFromParent="resetTicketEscalation"
          name="escalation_ticket"
          @isValid="onIsValid"
          :value="formValues.escalation_ticket"
          :key="key"
          :app-type="String(appType)"
          :disabled="disabled"
          :errorMessageToggled="errorMessageToggled"
        />
        <!--begin::Actions-->
        <div class="d-flex justify-content-end" v-if="!disabled">
          <button
            type="reset"
            class="btn btn-secondary btn-active-light-primary me-2"
            @click="reset"
          >
            Go Back
          </button>

          <button
            type="submit"
            ref="submitButton"
            class="btn btn-primary"
            @click.prevent="submit"
          >
            <span class="indicator-label"> Submit </span>
            <span class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
        <!--end::Actions-->
      </el-form>
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import BasicAlarmConfigSection from "@/components/alarm-form-config-section/BasicAlarmConfigSection.vue";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import { onMounted, ref, computed } from "vue";
import AdvanceAlarmConfigSection from "@/components/alarm-form-config-section/AdvanceAlarmConfigSection.vue";
import AlarmRecipientsConfigSection from "@/components/alarm-form-config-section/AlarmRecipientsConfigSection.vue";
import TicketEscalationConfigSection from "@/components/alarm-form-config-section/TicketEscalationConfigSection.vue";
import AlarmConfigService from "@/core/services/AlarmConfigService";
import {
  AlertForEdit,
  swalConfirmation,
} from "@/core/helpers/sweetAlert.utils";
import { useRoute } from "vue-router";
import router from "@/router";
import { upperFirst } from "lodash";
import { IBasicAlarmConfig } from "@/core/interface/alarm-config-interfaces";
import {
  appTypetoPresentationLayer,
  getAppTypeByNetworkAndApptypeBase64String,
  getAppTypeByNetworkType,
  proxyToObject,
} from "@/core/helpers/utils";
import { AppConstants } from "@/constants/app-constants";
import GlobalSettingService from "@/core/services/GlobalSettingService";

export default {
  components: {
    BasicAlarmConfigSection,
    CrudViewLayout,
    AdvanceAlarmConfigSection,
    AlarmRecipientsConfigSection,
    TicketEscalationConfigSection,
  },
  props: {
    app_Type: {
      type: String,
      required: false,
      validator: function (value) {
        return (
          value === AppConstants.APP_TYPE.NCE ||
          value === AppConstants.APP_TYPE.OBSERVIUM ||
          value === AppConstants.APP_TYPE.NCE_GPON ||
          value === AppConstants.APP_TYPE.NOKIA_TXN ||
          value === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
        );
      },
    },
    data: {
      required: false,
    },
    id: {
      type: Number,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    // keep in mind that prop.data will have higher priority over prop.id,
    // and route id  will have a higher priority over prop id

    //   data > route.id > prop.id

    let formValues = ref({});
    const key = ref(0); //for resetting the form
    const isFormValid = {};
    const route = useRoute();
    const id = props.id || route.params.id;
    const canChangeDisplaySeverity = ref();
    const appType =
      props.app_Type ||
      getAppTypeByNetworkAndApptypeBase64String(route.params.appType);
    const pageTitle = computed(() =>
      !props.disabled
        ? `Edit Alarm (${
            formValues.value["alarm_filter_config"]?.alarm_name
          } | ${appTypetoPresentationLayer(appType)}) Config`
        : `(${
            formValues.value["alarm_filter_config"]?.alarm_name
          } | ${appTypetoPresentationLayer(appType)}) Config`
    );
    const errorMessageToggled = ref(false);
    const methods = {
      change(data) {
        formValues.value[data.name] = data.value;
      },
      onIsValid(data) {
        isFormValid[data.name] = data.value;
      },
      reset() {
        router.push({ name: `alarm-config-${appType}-list` });
      },
      async submit() {
        errorMessageToggled.value = true;
        if (
          Object.values(isFormValid).every((val) => {
            return val === true;
          })
        ) {
          swalConfirmation("", async () => {
            const response = await AlarmConfigService.updateAlarmConfig(
              proxyToObject(formValues.value),
              id
            );
            AlertForEdit(response, `alarm-config-${appType}`);
          });
        }
      },
      resetAlarmRecipients() {
        formValues.value["alarm_recipients"] = [];
      },
      resetTicketEscalation() {
        delete formValues.value["escalation_ticket"];
      },
    };
    const loading = ref(false);

    onMounted(async () => {
      loading.value = true;
      const alarmGlobalSettings =
        await GlobalSettingService.getAlarmGlobalSettings(appType);
      if (
        alarmGlobalSettings?.data?.can_change_display_severity &&
        alarmGlobalSettings?.data?.can_change_display_severity == "1"
      ) {
        canChangeDisplaySeverity.value = true;
      }
      const response =
        props.data ||
        (await AlarmConfigService.getAlarmsConfigById(Number(id)));
      formValues.value["alarm_filter_config"] = {
        app_type: response["app_type"],
        alarm_name: response.alarm_name,
        severity: upperFirst(response.severity),
        is_regional_escalation: response.is_regional_escalation,
        ticket_escalation_delay: response.ticket_escalation_delay,
        email_escalation_delay: response.email_escalation_delay,
        is_email_escalation: response.is_email_escalation,
        is_ticket_escalation: response.is_ticket_escalation,
        record_status: response.record_status,
        description: response.description,
        is_change_in_display_severity: response?.is_change_in_display_severity,
        conditional_severity: response?.conditional_severity,
        severity_to_be_displayed: response?.severity_to_be_displayed,
      } as IBasicAlarmConfig;

      formValues.value["alarm_filter_advanced_conditions"] =
        response.alarm_filter_advanced_conditions;

      formValues.value["alarm_recipients"] = response.alarm_recipients;
      formValues.value["escalation_ticket"] = {
        ticket_escalation_initial_sub_department:
          response.ticket_escalation_initial_sub_department,
        ticket_escalation_medium: response.ticket_escalation_medium,
        can_revert_ticket_on_alarm_recovery:
          response.can_revert_ticket_on_alarm_recovery,
        ticket_escalation_category: response.ticket_escalation_category,
        ticket_escalation_sub_category: response.ticket_escalation_sub_category,
        ticket_escalation_device:
          appType === AppConstants.APP_TYPE.NCE
            ? response.escalationTicketDevices?.map((val) => {
                return val?.nce_device_id;
              })
            : appType === AppConstants.APP_TYPE.OBSERVIUM
            ? response.escalationTicketDevices?.map((val) => {
                return val?.obs_device_id;
              })
            : appType === AppConstants.APP_TYPE.NCE_GPON
            ? response.escalationTicketDevices?.map((val) => {
                return val?.nce_gpon_device_id;
              })
            : appType === AppConstants.APP_TYPE.NOKIA_TXN
            ? response.escalationTicketDevices?.map((val) => {
                return val?.nokia_device_id;
              })
            : response.escalationTicketDevices?.map((val) => {
                return val?.ldi_softswitch_trunk_group_id;
              }),
      };
      loading.value = false;
      key.value++;
    });
    return {
      ...methods,
      key,
      formValues,
      appType,
      loading,
      pageTitle,
      errorMessageToggled,
      canChangeDisplaySeverity,
    };
  },
};
</script>

<style></style>
