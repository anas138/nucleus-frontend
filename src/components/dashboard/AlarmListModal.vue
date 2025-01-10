<template>
  <el-dialog v-model="dialogFormVisible" :show-close="false" width="80%">
    <template #header="{ close, titleId, titleClass }">
      <div class="d-flex justify-content-between align-items-center">
        <h4 :id="titleId" :class="titleClass" class="text-white">
          <i class="fa-solid fa-list-ul fs-3 text-white me-2"></i>
          {{ title.value }} (Alarms)
        </h4>
        <ModalCloseButton @close="close" />
      </div>
    </template>
    <div class="text-muted fw-semobold fs-5 mb-5">{{ `Recent 15 alarms` }}</div>
    <CustomNceAlarmsList
      v-if="
        networkType === AppConstants.NETWORK_TYPE.TRANSMISSION &&
        appType === AppConstants.APP_TYPE.NCE
      "
      :header-config="nceHeaderConfig"
      :queryParams="queryParams"
      :filter-against-socket="filterSocket"
      :socket-toggled="socketToggled"
    />
    <CustomNokiaTXNAlarmsList
      v-else-if="
        networkType === AppConstants.NETWORK_TYPE.TRANSMISSION &&
        appType === AppConstants.APP_TYPE.NOKIA_TXN
      "
      :header-config="nokiaTXNHeaderConfig"
      :queryParams="queryParams"
      :filter-against-socket="filterSocket"
      :socket-toggled="socketToggled"
    />
    <CustomObserviumAlarmsList
      v-else-if="networkType === AppConstants.NETWORK_TYPE.IP"
      :header-config="observiumHeaderConfig"
      :queryParams="queryParams"
      :filter-against-socket="filterSocket"
      :socket-toggled="socketToggled"
    />
    <CustomNceGponAlarmsList
      v-else-if="networkType === AppConstants.NETWORK_TYPE.GPON"
      :header-config="nceGponHeaderConfig"
      :queryParams="queryParams"
      :filter-against-socket="filterSocket"
      :socket-toggled="socketToggled"
    />
    <CustomLDISoftswitchEMSAlarmsList
      v-else-if="networkType === AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH"
      :header-config="ldiSoftswitchEMSHeaderConfig"
      :queryParams="queryParams"
      :filter-against-socket="filterSocket"
      :socket-toggled="socketToggled"
    />
    <template #footer> </template>
  </el-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  computed,
} from "vue";
import CustomNceAlarmsList from "@/components/custom-dashboard/custom-alarm-list-datatable/CustomNceAlarmsList.vue";
import CustomObserviumAlarmsList from "@/components/custom-dashboard/custom-alarm-list-datatable/CustomObserviumAlarmsList.vue";
import { AppConstants } from "@/constants/app-constants";
import {
  paramsConversionAppType,
  paramsConversionNetworkType,
} from "@/core/helpers/utils";
import ModalCloseButton from "@/components/shared/buttons/ModalCloseButton.vue";
import _ from "lodash";
import CustomNceGponAlarmsList from "../custom-dashboard/custom-alarm-list-datatable/CustomNceGponAlarmsList.vue";
import CustomNokiaTXNAlarmsList from "../custom-dashboard/custom-alarm-list-datatable/CustomNokiaTXNAlarmsList.vue";
import CustomLDISoftswitchEMSAlarmsList from "../custom-dashboard/custom-alarm-list-datatable/CustomLDISoftswitchEMSAlarmsList.vue";

export default defineComponent({
  components: {
    CustomNceAlarmsList,
    CustomObserviumAlarmsList,
    CustomNceGponAlarmsList,
    CustomNokiaTXNAlarmsList,
    CustomLDISoftswitchEMSAlarmsList,
    ModalCloseButton,
  },
  name: "NCE-alarm-details",
  props: {
    queryParams: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    modalVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    networkType: {
      type: String,
      required: true,
    },
    appType: {
      required: true,
      type: String,
    },
  },
  emits: ["modalDisable"],
  setup(props, { emit }) {
    let config = reactive([]);
    const dialogFormVisible = ref(props.modalVisible);

    const title = computed(() => {
      const key = Object.keys(props.queryParams);
      return {
        type: key[0] === "alarmName" ? "Alarm Name" : _.capitalize(key[0]),
        value: props.queryParams[key[0]],
      };
    });

    const socketToggled = false;

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

    watch(
      () => dialogFormVisible.value,
      (val) => {
        if (!val) {
          emit("modalDisable");
        }
      }
    );

    onMounted(async () => {
      filterSocket.value = {
        ...filterSocket.value,
        ...paramsConversionAppType(props.appType, props.queryParams),
      };
    });

    const showModalLocal = ref(true);
    return {
      config,
      showModalLocal,
      nceHeaderConfig,
      observiumHeaderConfig,
      nceGponHeaderConfig,
      nokiaTXNHeaderConfig,
      ldiSoftswitchEMSHeaderConfig,
      filterSocket,
      dialogFormVisible,
      AppConstants,
      socketToggled,
      title,
    };
  },
});
</script>
