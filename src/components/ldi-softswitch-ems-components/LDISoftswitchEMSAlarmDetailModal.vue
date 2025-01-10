<template>
  <modal :loading="isLoading">
    <template v-slot:header>
      <h2 class="fw-bold text-white">
        {{ $LDISoftswitchEMSPresentationName }} Alarm Details
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
          v-if="alarmFilterConfigId"
          :appType="appType"
          :id="alarmFilterConfigId"
        />
      </div>

      <div class="">
        <h5 class="">Alarm Details</h5>
        <details-table :data="config[0]" />
      </div>

      <hr class="p-1" />
      <div class="mb-10">
        <h5 class="mb-4">Trunk Details</h5>
        <details-table :data="config[1]" />
      </div>
    </template>
  </modal>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  getCurrentInstance,
  ref,
} from "vue";
import { LDISoftswitchEMSAlarmSeverityBadge } from "@/core/helpers/utils";
import detailsTable from "@/components/table/detailsTableTwoColumns.vue";
import Modal from "@/components/shared/modal/Modal.vue";
import GoToAlarmConfig from "@/components/shared/buttons/GoToAlarmConfig.vue";
import TroubleTicketManager from "@/components/shared/buttons/TroubleTicketManager.vue";
import { AppConstants, TroubleTicketContants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";
import LDISoftswitchEMSAlarmService from "@/core/services/LDISoftswitchEMSAlarmService";
import { ILDISoftswitchEMSAlart } from "@/core/interface/ldi-softswitch-ems-alarm-interface";

interface troubleTicketInterface {
  id?: number;
  status?: number;
  ticket_number?: string;
}

export default defineComponent({
  components: { detailsTable, Modal, TroubleTicketManager, GoToAlarmConfig },
  name: "NCE-alarm-details",
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
  setup(props) {
    const Alarm = reactive({} as ILDISoftswitchEMSAlart);
    let config = reactive([]);
    const app = getCurrentInstance();
    const alarmFilterConfigId = ref<number>();
    const troubleTicketData = ref<troubleTicketInterface>({});

    const isLoading = ref(false);

    onMounted(async () => {
      isLoading.value = true;
      const response: ILDISoftswitchEMSAlart =
        await LDISoftswitchEMSAlarmService.getAlarmById(String(props.id));
      Object.assign(Alarm, response);
      if (
        response?.troubleTicket &&
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

      alarmFilterConfigId.value = Alarm.alarm_filter_config_id;

      const alarmDetailsConfig = [
        {
          label: "Alarm ID",
          value: Alarm?.ems_alarm_id,
        },
        {
          label: "Trunk Group",
          value: Alarm?.trunk_group,
        },
        {
          label: "Alarm Name",
          value: Alarm?.alarm_filter_config?.alarm_name,
        },
        {
          label: "State",
          value: Alarm?.message_state,
        },
        {
          label: "Severity",
          value: LDISoftswitchEMSAlarmSeverityBadge(Alarm.severity),
        },
        {
          label: "Type",
          value: Alarm?.type_txt,
        },
        {
          label: "Subtype",
          value: Alarm?.subtype_txt,
        },
        {
          label: "Error Code",
          value: Alarm?.error_code,
        },
        {
          label: "Occured On",
          value: formatTime(Alarm.created_on),
        },
        {
          label: "Ip Address",
          value: Alarm?.source_ip,
        },
        // {
        //   label: "Last Changed On",
        //   value: formatTime(Alarm.last_time_detected),
        // },
        {
          label: "Cleared On",
          value: formatTime(Alarm.cleared_on),
        },
        {
          label: "Category",
          value: Alarm?.category,
        },
      ];
      const trunkDetailsConfig = [
        {
          label: "Trunk Name",
          value: Alarm?.ldiSoftswitchTrunkGroup?.trunk_name,
        },
        {
          label: "Status",
          value: Alarm?.ldiSoftswitchTrunkGroup?.status,
        },
        {
          label: "LDI IP",
          value: Alarm?.ldiSoftswitchTrunkGroup?.ldi_ip,
        },
        {
          label: "Peer End IP",
          value: Alarm?.ldiSoftswitchTrunkGroup?.peer_end_ip,
        },
        // {
        //   label: "Parent Subnet Name",
        //   value: Alarm.nokiaTxnNetworkElement?.parent_subnet?.name,
        // },
        // {
        //   label: "Product Name",
        //   value: Alarm?.nokiaTxnNetworkElement?.product_name,
        // },
        // {
        //   label: "Alarm Source IP",
        //   value: Alarm?.ne_ip_address,
        // },
        // {
        //   label: "Region",
        //   value: Alarm?.nokiaTxnNetworkElement?.region?.name,
        // },
      ];
      Object.assign(config, [alarmDetailsConfig, trunkDetailsConfig]);
      isLoading.value = false;
    });

    const showModalLocal = ref(true);
    return {
      config,
      showModalLocal,
      isLoading,
      troubleTicketData,
      alarmFilterConfigId,
      appType: AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS,
      troubleTicketAccessPermission: permissions.troubleTicket.access,
    };
  },
});
</script>
