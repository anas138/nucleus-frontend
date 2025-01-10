<template>
  <DataTableCustomAppDashboard
    :header-config="headerConfig"
    :data-to-display="dataToDisplay"
    :loading="loading"
    :table-type="tableType"
  >
    <template v-slot:alert_severity="{ row: alarm }">
      <span v-html="ObserviumAlarmSeverityBadge(alarm.alert_severity)"></span>
    </template>
    <template v-slot:device_hostname="{ row: alarm }">
      <router-link
        to=""
        @click.prevent="toggleModal(alarm.id)"
        class="text-underline"
      >
        <span>{{ alarm.device_hostname }}</span>
      </router-link>
    </template>
    <template v-slot:alert_timestamp="{ row: alarm }">
      {{ $format.datetimeFormat(alarm.alert_timestamp) }}
    </template>
  </DataTableCustomAppDashboard>
  <observium-alarm-detail
    v-if="modalAlarmId"
    :id="modalAlarmId"
    :key="forceRerenderKey"
  />
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from "vue";
import DataTableCustomAppDashboard from "@/components/custom-dashboard/data-table-custom-app-dashboard/DataTableCustomAppDashboard.vue";
import { ObserviumAlarmSeverityBadge } from "@/core/helpers/utils";
import { AppConstants } from "@/constants/app-constants";
import ObserviumAlarmService from "@/core/services/ObserviumAlarmService";
import ObserviumAlarmDetail from "@/components/observium-components/ObserviumAlarmDetailModal.vue";
import { widgetAlarmsListenerFilter } from "@/core/helpers/utils";
import SocketIoService from "@/core/services/SocketIoService";

export default defineComponent({
  components: {
    DataTableCustomAppDashboard,
    ObserviumAlarmDetail,
  },
  props: {
    alarm_filter_config_id: {
      type: Number,
      required: false,
    },
    filterAgainst: { type: Object, required: false },
    filterAgainstSocket: { type: Object, required: false },
    socketToggled: {
      type: Boolean,
      required: false,
      default: true,
    },
    headerConfig: {
      type: Array,
      required: true,
    },
    queryParams: {
      type: Object,
      required: true,
    },
    tableType: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup(props) {
    const modalAlarmId = ref<number>(0);
    const forceRerenderKey = ref(0);

    const cardListDataParams = ref({
      ...props.queryParams,
      limit: AppConstants.CUSTOM_DASHBOARD_LIST.PER_PAGE_LIMIT,
    });
    const dataToDisplay = ref<any[]>([]);
    const loading = ref<boolean>(false);
    const fetchData = async () => {
      loading.value = true;

      const res = await ObserviumAlarmService.getAllAlarms(
        cardListDataParams.value
      );
      dataToDisplay.value = res.list;

      loading.value = false;
    };

    function toggleModal(id: number) {
      closeAllModal();
      modalAlarmId.value = id;
      forceRerenderKey.value++;
    }

    function closeAllModal() {
      modalAlarmId.value = 0;
    }

    onMounted(async () => {
      await fetchData();
      if (props.socketToggled) {
        socketAlarmListener();
      }
    });

    onUnmounted(() => {
      if (props.socketToggled) {
        SocketIoService.socket.off(
          AppConstants.SOCKET_EVENTS.OBSERVIUM_ALARMS,
          eventListenerCB
        );
      }
    });

    const eventListenerCB = (alarm) => {
      if (
        props.tableType == "Widget" &&
        alarm.alarm_filter_config_id === props.alarm_filter_config_id
      ) {
        dataFromSocket(alarm);
      } else if (!props.alarm_filter_config_id) {
        dataFromSocket(alarm);
      }
    };
    const socketAlarmListener = () => {
      SocketIoService.registerWidgetAlarmsListener(
        AppConstants.SOCKET_EVENTS.OBSERVIUM_ALARMS,
        eventListenerCB
      );
    };

    const dataFromSocket = async (alarm) => {
      if (alarm) {
        const existingIndex = dataToDisplay.value.findIndex(
          (item) => item.id === alarm.id
        );
        let data = await widgetAlarmsListenerFilter(
          props.filterAgainstSocket,
          alarm
        );

        if (data) {
          data.style = {
            class: "font-weight-bold bg-secondary",
          };
          data.onClick = function () {
            this.style.class = "";
          };
          dataToDisplay.value.unshift({ ...data });
          if (
            dataToDisplay.value.length >
            AppConstants.CUSTOM_DASHBOARD_LIST.PER_PAGE_LIMIT
          ) {
            dataToDisplay.value.pop();
          }
        } else if (existingIndex !== -1 && alarm.is_cleared) {
          dataToDisplay.value.splice(existingIndex, 1);
        }
      }
    };

    return {
      loading,
      dataToDisplay,
      fetchData,
      AppConstants,
      modalAlarmId,
      forceRerenderKey,
      toggleModal,
      ObserviumAlarmSeverityBadge,
    };
  },
});
</script>
