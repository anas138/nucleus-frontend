<template>
  <div v-if="!isLoading">
    <div
      id="header"
      class="d-flex justify-content-between align-items-center py-4"
      v-if="showHeader"
    >
      <h2 class="fw-bold mb-0">
        {{ $LDISoftswitchEMSPresentationName }} Alarm Details
      </h2>
      <el-button
        :icon="Close"
        circle
        @click="closeWindow"
        v-if="showCloseButton"
      />
      <go-to-alarm-config
        v-else-if="!showCloseButton"
        :appType="appType"
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
      <h5 class="mb-4">Trunk Details</h5>
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
import { LDISoftswitchEMSAlarmSeverityBadge } from "@/core/helpers/utils";
import detailsTable from "@/components/table/detailsTableTwoColumns.vue";
import { Close } from "@element-plus/icons-vue";
import { useStore } from "vuex";
import { troubleTicketMutations } from "@/store/enums/trouble-ticket-enum";
import { ModuleName } from "@/store/enums/module-enum";
import GoToAlarmConfig from "@/components/shared/buttons/GoToAlarmConfig.vue";
import { AppConstants } from "@/constants/app-constants";
import LDISoftswitchEMSAlarmService from "@/core/services/LDISoftswitchEMSAlarmService";
import { ILDISoftswitchEMSAlart } from "@/core/interface/ldi-softswitch-ems-alarm-interface";

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
    const Alarm = reactive({} as ILDISoftswitchEMSAlart);
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
        const response: ILDISoftswitchEMSAlart =
          await LDISoftswitchEMSAlarmService.getAlarmById(String(props.id));
        Object.assign(Alarm, { ...response });
      }
      alarmConfigId.value = Alarm.alarm_filter_config_id;

      const formatTime =
        app?.appContext.config.globalProperties.$format.datetimeFormat;
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
      appType: AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS,
    };
  },
});
</script>
