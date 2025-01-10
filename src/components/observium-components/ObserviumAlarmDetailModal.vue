<template>
  <modal :loading="isLoading">
    <template v-slot:header>
      <h2 class="fw-bold text-white">
        {{ $observiumPresentationName }} Alarm Details
      </h2>
    </template>
    <template v-slot:body>
      <div class="d-flex align-items-center justify-content-end mb-3">
        <TroubleTicketManager
          :alarmId="id"
          :appType="appType"
          :troubleTicketData="troubleTicketData"
          v-if="
            $hasPermission(troubleTicketAccessPermission) &&
            showTroubleTicketManager
          "
        />
        <go-to-alarm-config
          v-if="alarm_filter_config_id"
          appType="OBSERVIUM"
          :id="alarm_filter_config_id"
        />
      </div>
      <div class="">
        <h5>Alarm Detail</h5>
        <details-table-two-columns :data="alarmConfig" />
      </div>
      <hr class="p-1" />
      <div class="row">
        <div class="col-md-6">
          <h5 class="mb-4">Entity Details</h5>
          <details-table-one-columns :data="entityConfig" />
        </div>

        <div class="col-md-6">
          <h5 class="mb-4">Device Details</h5>
          <details-table-one-columns :data="deviceConfig" />
        </div>
        <div v-if="alarmDetails.entity_type === 'port'">
          <hr class="p-1" />
          <port-bits-graphs :portId="alarmDetails.entity_id" />
        </div>
      </div>
    </template>
  </modal>
</template>
<script lang="ts">
import Modal from "@/components/shared/modal/Modal.vue";
import DetailsTableOneColumns from "@/components/table/detailsTableOneColumns.vue";
import detailsTableTwoColumns from "@/components/table/detailsTableTwoColumns.vue";
import { ObserviumAlarmSeverityBadge } from "@/core/helpers/utils";
import { IobserviumAlert } from "@/core/interface/observium-alarm-interface";
import ObserviumAlarmService from "@/core/services/ObserviumAlarmService";
import { defineComponent, onMounted, getCurrentInstance, ref } from "vue";
import GoToAlarmConfig from "@/components/shared/buttons/GoToAlarmConfig.vue";
import PortBitsGraphs from "@/components/obs-port-bits-graphs/PortBitsGraphs.vue";
import TroubleTicketManager from "@/components/shared/buttons/TroubleTicketManager.vue";
import { AppConstants, TroubleTicketContants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";

interface troubleTicketInterface {
  id?: number;
  status?: number;
  ticket_number?: string;
}

export default defineComponent({
  name: "observium-alarm-details",
  props: {
    id: {
      type: Number,
      required: true,
    },
    showTroubleTicketManager: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    detailsTableTwoColumns,
    DetailsTableOneColumns,
    Modal,
    TroubleTicketManager,
    GoToAlarmConfig,
    PortBitsGraphs,
  },
  setup(props) {
    const alarmDetails = ref<IobserviumAlert>();
    const alarmConfig = ref();
    const deviceConfig = ref();
    const entityConfig = ref();
    const app = getCurrentInstance();
    const isLoading = ref(false);
    const alarm_filter_config_id = ref<number | undefined>(0);

    const troubleTicketData = ref<troubleTicketInterface>({});

    onMounted(async () => {
      isLoading.value = true;
      const response: IobserviumAlert =
        await ObserviumAlarmService.getAlarmById(String(props.id));
      alarmDetails.value = { ...response };
      if (
        response?.troubleTicket !== null &&
        response?.troubleTicket?.status !==
          TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.COMPLETED &&
        response?.troubleTicket?.status !==
          TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.CANCELLED
      ) {
        Object.assign(troubleTicketData.value, {
          id: response?.troubleTicket?.id,
          status: response?.troubleTicket?.status,
          ticket_number: response?.troubleTicket?.ticket_number,
        });
      }
      const formatTime =
        app?.appContext.config.globalProperties.$format.datetimeFormat;

      alarm_filter_config_id.value = response.alarm_filter_config_id;
      alarmConfig.value = [
        {
          label: "Severity",
          value: ObserviumAlarmSeverityBadge(response.alert_severity),
        },
        {
          label: "Id",
          value: response.alert_id,
        },
        {
          label: "Title",
          value: response.title,
        },
        {
          label: "Message",
          value: response.alert_message,
        },
        {
          label: "State",
          value: response.alert_state,
        },
        {
          label: "Conditions",
          value: response.conditions,
        },
        {
          label: "Metrics",
          value: response.metrics,
        },
        {
          label: "Occured On",
          value: formatTime(response.alert_timestamp),
        },
        {
          label: "Cleared on",
          value: formatTime(response.cleared_on),
        },
      ];
      deviceConfig.value = [
        {
          label: "HostName",
          value: response.device_hostname,
        },
        {
          label: "Hardware",
          value: response.device_hardware,
        },
        {
          label: "Description",
          value: response.device_description,
        },
        {
          label: "Location",
          value: response.device_location,
        },
        {
          label: "Uptime",
          value: response.device_uptime,
        },
      ];
      entityConfig.value = [
        {
          label: "Id",
          value: response.entity_id,
        },
        {
          label: "Name",
          value: response.entity_name,
        },
        {
          label: "Type",
          value: response.entity_type,
        },
        {
          label: "Description",
          value: response.entity_description,
        },
      ];
      isLoading.value = false;
    });

    const showModalLocal = ref(true);
    return {
      alarmDetails,
      alarmConfig,
      deviceConfig,
      entityConfig,
      showModalLocal,
      isLoading,
      troubleTicketData,
      alarm_filter_config_id,
      appType: AppConstants.APP_TYPE.OBSERVIUM,
      troubleTicketAccessPermission: permissions.troubleTicket.access,
    };
  },
});
</script>
