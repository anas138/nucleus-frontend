<template>
  <div class="card card-bordered border-primary" style="height: 390px">
    <CardsHeader
      :widget-id="widgetId"
      :widget-title="title"
      :alarm-name="alarmName"
      subtitle="Recent 15 alarms"
      widget-type="List"
      @refresh-widget="refreshList"
      @widget-deleted="() => emit('widgetDeleted')"
    />
    <div class="card-body">
      <CustomNceAlarmsList
        v-if="
          networkType === AppConstants.NETWORK_TYPE.TRANSMISSION &&
          appType === AppConstants.APP_TYPE.NCE
        "
        ref="nceChildRef"
        :header-config="nceHeaderConfig"
        :queryParams="queryParams"
        :filter-against-socket="filterSocket"
        :alarm_filter_config_id="alarm_filter_config_id"
        table-type="Widget"
      />
      <CustomNokiaTXNAlarmsList
        v-else-if="
          networkType === AppConstants.NETWORK_TYPE.TRANSMISSION &&
          appType === AppConstants.APP_TYPE.NOKIA_TXN
        "
        ref="nokiaTXNChildRef"
        :header-config="nokiaTXNHeaderConfig"
        :queryParams="queryParams"
        :filter-against-socket="filterSocket"
        :alarm_filter_config_id="alarm_filter_config_id"
        table-type="Widget"
      />
      <CustomObserviumAlarmsList
        v-else-if="networkType === AppConstants.NETWORK_TYPE.IP"
        ref="observiumChildRef"
        :header-config="observiumHeaderConfig"
        :queryParams="queryParams"
        :filter-against-socket="filterSocket"
        :alarm_filter_config_id="alarm_filter_config_id"
        table-type="Widget"
      />
      <CustomNceGponAlarmsList
        v-else-if="networkType === AppConstants.NETWORK_TYPE.GPON"
        ref="nceGponChildRef"
        :header-config="nceGponHeaderConfig"
        :queryParams="queryParams"
        :filter-against-socket="filterSocket"
        :alarm_filter_config_id="alarm_filter_config_id"
        table-type="Widget"
      />
      <CustomLDISoftswitchEMSAlarmsList
        v-else-if="networkType === AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH"
        ref="ldiSoftswitchEMSChildRef"
        :header-config="ldiSoftswitchEMSHeaderConfig"
        :queryParams="queryParams"
        :filter-against-socket="filterSocket"
        :alarm_filter_config_id="alarm_filter_config_id"
        table-type="Widget"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { AppConstants } from "@/constants/app-constants";
import CardsHeader from "@/components/custom-dashboard/widget-card-components/CardsHeader.vue";
import CustomNceAlarmsList from "@/components/custom-dashboard/custom-alarm-list-datatable/CustomNceAlarmsList.vue";
import CustomObserviumAlarmsList from "@/components/custom-dashboard/custom-alarm-list-datatable/CustomObserviumAlarmsList.vue";
import {
  paramsConversionAppType,
  paramsConversionNetworkType,
} from "@/core/helpers/utils";
import CustomNceGponAlarmsList from "./custom-alarm-list-datatable/CustomNceGponAlarmsList.vue";
import CustomNokiaTXNAlarmsList from "./custom-alarm-list-datatable/CustomNokiaTXNAlarmsList.vue";
import CustomLDISoftswitchEMSAlarmsList from "./custom-alarm-list-datatable/CustomLDISoftswitchEMSAlarmsList.vue";

export default defineComponent({
  components: {
    CustomNceAlarmsList,
    CustomObserviumAlarmsList,
    CustomNceGponAlarmsList,
    CustomNokiaTXNAlarmsList,
    CustomLDISoftswitchEMSAlarmsList,
    CardsHeader,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    networkType: {
      type: String,
      required: true,
    },
    appType: {
      type: String,
      required: true,
    },
    alarmName: {
      type: String,
      required: true,
    },
    alarm_filter_config_id: {
      type: Number,
      required: false,
    },
    filterAgainst: { type: Object, required: false },
    widgetId: {
      type: Number,
      required: true,
    },
  },
  emits: ["widgetDeleted"],
  setup(props, { emit }) {
    const nceChildRef = ref<any>(null);
    const observiumChildRef = ref<any>(null);
    const nceGponChildRef = ref<any>(null);
    const nokiaTXNChildRef = ref<any>(null);
    const ldiSoftswitchEMSChildRef = ref<any>(null);

    const queryParams = ref({
      alarmFilterConfigId: props.alarm_filter_config_id,
      ...props.filterAgainst,
    });

    const filterSocket = ref({
      is_cleared: false,
    });

    const nceHeaderConfig = ref([
      {
        columnLabel: "severity",
        key: "severity",
      },
      {
        columnLabel: "alarm",
        key: "native_probable_cause",
      },
      {
        columnLabel: "ne",
        key: "ne_name",
      },
      {
        columnLabel: "alarm text",
        key: "alarm_text",
      },
      {
        columnLabel: "Occured On",
        key: "created_on",
      },
    ]);
    const observiumHeaderConfig = ref([
      {
        columnLabel: "severity",
        key: "alert_severity",
      },
      {
        columnLabel: "device",
        key: "device_hostname",
      },
      {
        columnLabel: "entity",
        key: "entity_name",
      },
      {
        columnLabel: "Description",
        key: "entity_description",
        textOverflow: true,
      },
      {
        columnLabel: "message",
        key: "alert_message",
        textOverflow: false,
      },
      {
        columnLabel: "occured On",
        key: "alert_timestamp",
      },
    ]);
    const nceGponHeaderConfig = ref([
      {
        columnLabel: "severity",
        key: "severity",
      },
      {
        columnLabel: "alarm",
        key: "native_probable_cause",
      },
      {
        columnLabel: "ne",
        key: "ne_name",
      },
      {
        columnLabel: "alarm text",
        key: "alarm_text",
        textOverflow: true,
      },
      {
        columnLabel: "Occured On",
        key: "created_on",
      },
    ]);

    const nokiaTXNHeaderConfig = ref([
      {
        columnLabel: "Severity",
        key: "severity",
      },
      {
        columnLabel: "Alarm Id",
        key: "nokia_alarm_id",
      },
      {
        columnLabel: "Alarm Name",
        key: "alarm_name",
      },
      {
        columnLabel: "NE Name",
        key: "ne_name",
      },
      {
        columnLabel: "IP Address",
        key: "ne_ip_address",
      },
      {
        key: "created_on",
        columnLabel: "Occured On",
      },
    ]);

    const ldiSoftswitchEMSHeaderConfig = ref([
      {
        columnLabel: "Severity",
        key: "severity",
      },
      {
        columnLabel: "Alarm ID",
        key: "id",
      },
      {
        columnLabel: "Trunk Group",
        key: "trunk_group",
      },
      {
        columnLabel: "Alarm Name",
        key: "alarm_name",
      },
      {
        columnLabel: "Type",
        key: "type_txt",
      },
      {
        columnLabel: "Subtype",
        key: "subtype_txt",
      },
      {
        columnLabel: "State",
        key: "message_state",
      },
      {
        columnLabel: "Error Code",
        key: "error_code",
      },
      {
        columnLabel: "Ip Address",
        key: "source_ip",
      },
      {
        key: "created_on",
        columnLabel: "Occured On",
      },
    ]);

    const refreshList = () => {
      if (props.networkType === AppConstants.NETWORK_TYPE.TRANSMISSION) {
        if (props.appType === AppConstants.APP_TYPE.NCE) {
          nceChildRef.value.fetchData();
        } else if (props.appType === AppConstants.APP_TYPE.NOKIA_TXN) {
          nokiaTXNChildRef.value.fetchData();
        }
      } else if (props.networkType === AppConstants.NETWORK_TYPE.IP) {
        observiumChildRef.value.fetchData();
      } else if (props.networkType === AppConstants.NETWORK_TYPE.GPON) {
        nceGponChildRef.value.fetchData();
      } else if (
        props.networkType === AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH
      ) {
        ldiSoftswitchEMSChildRef.value.fetchData();
      }
    };

    onMounted(async () => {
      filterSocket.value = {
        ...filterSocket.value,
        ...paramsConversionAppType(props.appType, props.filterAgainst),
      };
    });

    return {
      AppConstants,
      emit,
      refreshList,
      filterSocket,
      nceChildRef,
      observiumChildRef,
      nceGponChildRef,
      nokiaTXNChildRef,
      ldiSoftswitchEMSChildRef,
      queryParams,
      nceHeaderConfig,
      observiumHeaderConfig,
      nceGponHeaderConfig,
      nokiaTXNHeaderConfig,
      ldiSoftswitchEMSHeaderConfig,
    };
  },
});
</script>
