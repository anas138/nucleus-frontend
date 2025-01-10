<template>
  <modal :loading="isLoading">
    <template v-slot:header>
      <h2 class="fw-bold text-white">
        {{ $nceGponPresentationName }} Alarm Details
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
          appType="NCE_GPON"
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
} from "@/core/helpers/utils";
import detailsTable from "@/components/table/detailsTableTwoColumns.vue";
import Modal from "@/components/shared/modal/Modal.vue";
import GoToAlarmConfig from "@/components/shared/buttons/GoToAlarmConfig.vue";
import TroubleTicketManager from "@/components/shared/buttons/TroubleTicketManager.vue";
import { AppConstants, TroubleTicketContants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";
import NceGponAlarmService from "@/core/services/NceGponAlarmService";
import { INceGponAlert } from "@/core/interface/nce-gpon-alarm-interface";

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
    const Alarm = reactive({} as INceGponAlert);
    let config = reactive([]);
    const app = getCurrentInstance();
    const alarmFilterConfigId = ref<number>();
    const troubleTicketData = ref<troubleTicketInterface>({});

    const isLoading = ref(false);

    onMounted(async () => {
      isLoading.value = true;
      const response: INceGponAlert = await NceGponAlarmService.getAlarmById(
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
        {
          label: "Serial Number",
          value: Alarm.alarm_serial_number,
        },
        {
          label: "Alarm Name",
          value: Alarm?.native_probable_cause,
        },
        {
          label: "Alarm Text",
          value: Alarm?.alarm_text,
        },
        {
          label: "Severity",
          value: NceGponAlarmSeverityBadge(Alarm.severity),
        },
        {
          label: "Location Info",
          value: Alarm?.location_info,
        },
        {
          label: "Occured On",
          value: formatTime(Alarm.created_on),
        },
        {
          label: "Cleared On",
          value: formatTime(Alarm.cleared_on),
        },
        {
          label: "Last Changed On",
          value: formatTime(Alarm.last_changed_on),
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
        {
          label: "Parent Subnet Name",
          value: Alarm?.nceGponNetworkElement?.parent_subnet?.name,
        },
        {
          label: "Alarm Source IP",
          value: Alarm?.nceGponNetworkElement?.ip_address,
        },
        {
          label: "Product Name",
          value: Alarm?.nceGponNetworkElement?.product_name,
        },
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
      appType: AppConstants.APP_TYPE.NCE_GPON,
      troubleTicketAccessPermission: permissions.troubleTicket.access,
    };
  },
});
</script>
