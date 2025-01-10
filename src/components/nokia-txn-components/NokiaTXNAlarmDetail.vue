<template>
  <div v-if="!isLoading">
    <div
      id="header"
      class="d-flex justify-content-between align-items-center py-4"
      v-if="showHeader"
    >
      <h2 class="fw-bold mb-0">
        {{ $nokiaTXNPresentationName }} Alarm Details
      </h2>
      <el-button
        :icon="Close"
        circle
        @click="closeWindow"
        v-if="showCloseButton"
      />
      <go-to-alarm-config
        v-else-if="!showCloseButton"
        appType="NOKIA_TXN"
        :id="alarmConfigId"
        :outline="true"
      />
    </div>
    <div id="body">
      <h5 class="py-2">Alarm Details</h5>
      <details-table :data="config[0]" />
    </div>

    <hr class="p-1" />
    <div class="mb-10">
      <h5 class="mb-4">NE Details</h5>
      <details-table :data="config[1]" />
    </div>
  </div>
  <el-skeleton v-else :rows="15" animated />
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
import { Close } from "@element-plus/icons-vue";
import { useStore } from "vuex";
import { troubleTicketMutations } from "@/store/enums/trouble-ticket-enum";
import { ModuleName } from "@/store/enums/module-enum";
import GoToAlarmConfig from "@/components/shared/buttons/GoToAlarmConfig.vue";
import AlarmService from "@/core/services/AlarmService";
import NceGponAlarmService from "@/core/services/NceGponAlarmService";
import { INceGponAlert } from "@/core/interface/nce-gpon-alarm-interface";
import NokiaTXNAlarmService from "@/core/services/NokiaTXNAlarmService";
import { INokiaTXNAlart } from "@/core/interface/nokia-txn-alarm-interface";

export default defineComponent({
  components: { detailsTable, GoToAlarmConfig },
  name: "NCE-alarm-details",
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
  setup(props, ctx) {
    const Alarm = reactive({} as INokiaTXNAlart);
    const alarmConfigId = ref<number | undefined>();
    let config = reactive([]);
    const app = getCurrentInstance();
    const isLoading = ref(true);

    const store = useStore();

    onMounted(async () => {
      isLoading.value = true;
      if (props.alarmData && Object.keys(props.alarmData).length) {
        Object.assign(Alarm, { ...props.alarmData });
      } else {
        const response: INokiaTXNAlart =
          await NokiaTXNAlarmService.getAlarmById(String(props.id));
        Object.assign(Alarm, { ...response });
      }
      alarmConfigId.value = Alarm.alarm_filter_config_id;

      const formatTime =
        app?.appContext.config.globalProperties.$format.datetimeFormat;
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
      if (Object.keys(props.alarmData).length === 0) {
        store.commit(
          `${ModuleName.troubleTicket}/${troubleTicketMutations.SET_ALARM_DATA}`,
          Alarm
        );
      }
    });

    const showModalLocal = ref(true);

    function closeWindow() {
      ctx.emit("close-window");
    }
    return {
      config,
      showModalLocal,
      alarmConfigId,
      isLoading,
      Close,
      closeWindow,
    };
  },
});
</script>
