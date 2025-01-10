<template>
  <div v-if="!isLoading">
    <div
      id="header"
      class="d-flex justify-content-between align-items-center py-4"
      v-if="showHeader"
    >
      <h2 class="fw-bold mb-0">
        {{ $observiumPresentationName }} Alarm Details
      </h2>
      <el-button
        :icon="Close"
        circle
        @click="closeWindow"
        v-if="showCloseButton"
      />
      <go-to-alarm-config
        v-else-if="!showCloseButton"
        appType="OBSERVIUM"
        :id="alarmConfigId"
        :outline="true"
      />
    </div>
    <div id="body">
      <div class="py-2">
        <h5>Alarm Detail</h5>
        <details-table-two-columns :data="alarmConfig" />
      </div>

      <hr class="p-1" />
      <div class="d-flex flex-wrap">
        <div class="flex-equal mb-3">
          <h5 class="mb-4">Entity Details</h5>
          <details-table-one-columns :data="entityConfig" />
        </div>

        <div class="flex-equal">
          <h5 class="mb-4">Device Details</h5>
          <details-table-one-columns :data="deviceConfig" />
        </div>
      </div>
      <div
        v-if="
          alarmDetails.entity_type === 'port' && $hasPermission(ipPermission)
        "
      >
        <hr class="p-1" />
        <port-bits-graphs :portId="alarmDetails.entity_id" />
      </div>
    </div>
  </div>
  <el-skeleton v-else :rows="15" animated />
</template>
<script lang="ts">
import DetailsTableOneColumns from "@/components/table/detailsTableOneColumns.vue";
import detailsTableTwoColumns from "@/components/table/detailsTableTwoColumns.vue";
import { ObserviumAlarmSeverityBadge } from "@/core/helpers/utils";
import { IobserviumAlert } from "@/core/interface/observium-alarm-interface";
import ObserviumAlarmService from "@/core/services/ObserviumAlarmService";
import {
  defineComponent,
  onMounted,
  getCurrentInstance,
  ref,
  reactive,
} from "vue";
import { Close } from "@element-plus/icons-vue";
import PortBitsGraphs from "@/components/obs-port-bits-graphs/PortBitsGraphs.vue";
import { useStore } from "vuex";
import { troubleTicketMutations } from "@/store/enums/trouble-ticket-enum";
import { ModuleName } from "@/store/enums/module-enum";
import AlarmService from "@/core/services/AlarmService";
import { permissions } from "@/constants/permissions-constants";
import GoToAlarmConfig from "../shared/buttons/GoToAlarmConfig.vue";

export default defineComponent({
  name: "observium-alarm-details-side",
  props: {
    id: {
      type: Number,
      required: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    alarmData: { type: Object, required: false, default: () => ({}) },
  },
  emits: ["close-window"],
  components: {
    detailsTableTwoColumns,
    DetailsTableOneColumns,
    PortBitsGraphs,
    GoToAlarmConfig,
  },
  setup(props, ctx) {
    const alarmConfigId = ref<number | undefined>();
    const alarmDetails = reactive({} as IobserviumAlert);
    const alarmConfig = ref();
    const deviceConfig = ref();
    const entityConfig = ref();
    const app = getCurrentInstance();
    const isLoading = ref(true);

    const ipPermission = permissions.observium.network;

    onMounted(async () => {
      const store = useStore();
      isLoading.value = true;
      if (props.alarmData && Object.keys(props.alarmData).length) {
        const region = await AlarmService.getAlarmRegion(String(props.id));
        Object.assign(alarmDetails, { ...props.alarmData, ...region });
      } else {
        const response: IobserviumAlert =
          await ObserviumAlarmService.getAlarmById(String(props.id));
        const region = await AlarmService.getAlarmRegion(String(props.id));
        Object.assign(alarmDetails, { ...response, ...region });
      }
      alarmConfigId.value = alarmDetails.alarm_filter_config_id;

      const formatTime =
        app?.appContext.config.globalProperties.$format.datetimeFormat;

      alarmConfig.value = [
        {
          label: "Severity",
          value: ObserviumAlarmSeverityBadge(alarmDetails.alert_severity),
        },
        {
          label: "Id",
          value: alarmDetails.alert_id,
        },
        {
          label: "Title",
          value: alarmDetails.title,
        },
        {
          label: "Message",
          value: alarmDetails.alert_message,
        },
        {
          label: "State",
          value: alarmDetails.alert_state,
        },
        {
          label: "Conditions",
          value: alarmDetails.conditions,
        },
        {
          label: "Metrics",
          value: alarmDetails.metrics,
        },
        {
          label: "Occured On",
          value: formatTime(alarmDetails.alert_timestamp),
        },
        {
          label: "Cleared on",
          value: formatTime(alarmDetails.cleared_on),
        },
      ];
      deviceConfig.value = [
        {
          label: "HostName",
          value: alarmDetails.device_hostname,
        },
        {
          label: "Hardware",
          value: alarmDetails.device_hardware,
        },
        {
          label: "Description",
          value: alarmDetails.device_description,
        },
        {
          label: "Location",
          value: alarmDetails.device_location,
        },
        {
          label: "Uptime",
          value: alarmDetails.device_uptime,
        },
        {
          label: "Region",
          value: alarmDetails?.region,
        },
      ];
      entityConfig.value = [
        {
          label: "Id",
          value: alarmDetails.entity_id,
        },
        {
          label: "Name",
          value: alarmDetails.entity_name,
        },
        {
          label: "Type",
          value: alarmDetails.entity_type,
        },
        {
          label: "Description",
          value: alarmDetails.entity_description,
        },
      ];
      isLoading.value = false;
      if (Object.keys(props.alarmData).length === 0) {
        store.commit(
          `${ModuleName.troubleTicket}/${troubleTicketMutations.SET_ALARM_DATA}`,
          alarmDetails
        );
      }
    });

    const showModalLocal = ref(true);

    function closeWindow() {
      ctx.emit("close-window");
    }
    return {
      alarmDetails,
      alarmConfig,
      deviceConfig,
      entityConfig,
      showModalLocal,
      alarmConfigId,
      isLoading,
      closeWindow,
      Close,
      ipPermission,
    };
  },
});
</script>
