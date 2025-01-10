<template>
  <modal :loading="isLoading">
    <template v-slot:header>
      <h2 class="fw-bold text-white">
        {{ $nokiaTXNPresentationName }} Alarm Details
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
          appType="NOKIA_TXN"
          :id="alarmFilterConfigId"
        />
      </div>

      <div class="">
        <h5 class="">Alarm Details</h5>
        <details-table :data="config[0]" />
      </div>

      <hr class="p-1" />
      <div class="mb-10">
        <h5 class="mb-4">NE Details</h5>
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
import NceAlarmService from "@/core/services/NceAlarmService";
import { INceAlert } from "@/core/interface/nce-alarm-interface";
import {
  NceAlarmSeverityBadge,
  NceGponAlarmSeverityBadge,
  NokiaTXNAlarmSeverityBadge,
} from "@/core/helpers/utils";
import detailsTable from "@/components/table/detailsTableTwoColumns.vue";
import Modal from "@/components/shared/modal/Modal.vue";
import GoToAlarmConfig from "@/components/shared/buttons/GoToAlarmConfig.vue";
import TroubleTicketManager from "@/components/shared/buttons/TroubleTicketManager.vue";
import { AppConstants, TroubleTicketContants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";
import NceGponAlarmService from "@/core/services/NceGponAlarmService";
import { INceGponAlert } from "@/core/interface/nce-gpon-alarm-interface";
import NokiaTXNAlarmService from "@/core/services/NokiaTXNAlarmService";
import { INokiaTXNAlart } from "@/core/interface/nokia-txn-alarm-interface";

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
    const Alarm = reactive({} as INokiaTXNAlart);
    let config = reactive([]);
    const app = getCurrentInstance();
    const alarmFilterConfigId = ref<number>();
    const troubleTicketData = ref<troubleTicketInterface>({});

    const isLoading = ref(false);

    onMounted(async () => {
      isLoading.value = true;
      const response: INokiaTXNAlart = await NokiaTXNAlarmService.getAlarmById(
        String(props.id)
      );
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
        // {
        //   label: "Serial Number",
        //   value: Alarm.alarm_serial_number,
        // },
        {
          label: "Alarm Name",
          value: Alarm?.alarm_name,
        },
        // {
        //   label: "Alarm Text",
        //   value: Alarm?.alarm_text,
        // },
        {
          label: "Alarm Type",
          value: Alarm?.alarm_type,
        },
        // {
        //   label: "Location Info",
        //   value: Alarm?.location_info,
        // },
        {
          label: "Severity",
          value: NokiaTXNAlarmSeverityBadge(Alarm.severity),
        },
        {
          label: "Occured On",
          value: formatTime(Alarm.created_on),
        },
        {
          label: "Last Changed On",
          value: formatTime(Alarm.last_time_detected),
        },
        {
          label: "Cleared On",
          value: formatTime(Alarm.cleared_on),
        },
        {
          label: "Probable Cause",
          value: Alarm?.probable_cause,
        },
        {
          label: "Category",
          value: Alarm?.category,
        },
      ];
      const neDetailsConfig = [
        {
          label: "Name",
          value: Alarm?.ne_name,
        },
        // {
        //   label: "Parent Subnet Name",
        //   value: Alarm.nokiaTxnNetworkElement?.parent_subnet?.name,
        // },
        {
          label: "Product Name",
          value: Alarm?.nokiaTxnNetworkElement?.product_name,
        },
        {
          label: "Alarm Source IP",
          value: Alarm?.ne_ip_address,
        },
        // {
        //   label: "Region",
        //   value: Alarm?.nokiaTxnNetworkElement?.region?.name,
        // },
      ];
      Object.assign(config, [alarmDetailsConfig, neDetailsConfig]);
      isLoading.value = false;
    });

    const showModalLocal = ref(true);
    return {
      config,
      showModalLocal,
      isLoading,
      troubleTicketData,
      alarmFilterConfigId,
      appType: AppConstants.APP_TYPE.NOKIA_TXN,
      troubleTicketAccessPermission: permissions.troubleTicket.access,
    };
  },
});
</script>
