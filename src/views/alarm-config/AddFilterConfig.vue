<template>
  <crud-view-layout :isLoading="loading">
    <template #body>
      <el-form>
        <basic-alarm-config-section
          @change="change"
          name="alarm_filter_config"
          :appType="appType"
          @isValid="onIsValid"
          :canChangeDisplaySeverity="canChangeDisplaySeverity"
          :errorMessageToggled="errorMessageToggled"
        />
        <advance-alarm-config-section
          @change="change"
          name="alarm_filter_advanced_conditions"
          :appType="appType"
          @isValid="onIsValid"
          :errorMessageToggled="errorMessageToggled"
        />
        <alarm-recipients-config-section
          v-show="formValues?.alarm_filter_config?.is_email_escalation"
          @change="change"
          :toggledValue="formValues?.alarm_filter_config?.is_email_escalation"
          @resetFromParent="resetAlarmRecipients"
          name="alarm_recipients"
          @isValid="onIsValid"
          :errorMessageToggled="errorMessageToggled"
        />
        <ticket-escalation-config-section
          v-show="formValues?.alarm_filter_config?.is_ticket_escalation"
          @change="change"
          :toggledValue="formValues?.alarm_filter_config?.is_ticket_escalation"
          @resetFromParent="resetTicketEscalation"
          name="escalation_ticket"
          @isValid="onIsValid"
          :app-type="String(appType)"
          :errorMessageToggled="errorMessageToggled"
        />
        <!--begin::Actions-->
        <div class="d-flex justify-content-end">
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
import { ref, onMounted } from "vue";
import AdvanceAlarmConfigSection from "@/components/alarm-form-config-section/AdvanceAlarmConfigSection.vue";
import AlarmRecipientsConfigSection from "@/components/alarm-form-config-section/AlarmRecipientsConfigSection.vue";
import TicketEscalationConfigSection from "@/components/alarm-form-config-section/TicketEscalationConfigSection.vue";
import AlarmConfigService from "@/core/services/AlarmConfigService";
import {
  AlertForCreate,
  swalConfirmation,
} from "@/core/helpers/sweetAlert.utils";
import router from "@/router";
import { useRoute } from "vue-router";
import {
  getAppTypeByNetworkAndApptypeBase64String,
  getAppTypeByNetworkType,
  proxyToObject,
} from "@/core/helpers/utils";
import GlobalSettingService from "@/core/services/GlobalSettingService";
export default {
  components: {
    BasicAlarmConfigSection,
    CrudViewLayout,
    AdvanceAlarmConfigSection,
    AlarmRecipientsConfigSection,
    TicketEscalationConfigSection,
  },
  setup() {
    let formValues = ref({});
    const key = ref(0); //for resetting the form
    const isFormValid = {};
    const route = useRoute();
    const loading = ref(false);
    const canChangeDisplaySeverity = ref();
    const appType = getAppTypeByNetworkAndApptypeBase64String(
      route.params.appType
    );
    // route.params.appType === "transmission"
    //   ? "NCE"
    //   : route.params.appType === "ip"
    //   ? "OBSERVIUM"
    //   : "NCE_GPON";
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
            const response = await AlarmConfigService.createAlarmConfig(
              proxyToObject(formValues.value)
            );
            console.log(response);
            AlertForCreate(response, `alarm-config-${appType}`);
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
      loading.value = false;
    });

    return {
      ...methods,
      key,
      appType,
      loading,
      formValues,
      errorMessageToggled,
      canChangeDisplaySeverity,
    };
  },
};
</script>

<style></style>
