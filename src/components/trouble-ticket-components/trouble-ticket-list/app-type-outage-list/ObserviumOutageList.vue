<template>
  <DataTable
    :header-config="headerConfig"
    :data-to-display="dataToDisplay"
    :loading="false"
  >
    <template v-slot:alert_severity="{ row: alarm }">
      <span v-html="ObserviumAlarmSeverityBadge(alarm?.alert_severity)"></span>
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
      <span>{{ $format.datetimeFormat(alarm?.alert_timestamp) }}</span>
    </template>
    <template v-slot:cleared_on="{ row: alarm }">
      <span>{{ $format.datetimeFormat(alarm?.cleared_on) }}</span>
    </template>
  </DataTable>
  <observium-alarm-detail
    v-if="modalAlarmId"
    :id="modalAlarmId"
    :key="forceRerenderKey"
    :showTroubleTicketManager="false"
  />
</template>
<script lang="ts">
import DataTable from "@/components/custom-dashboard/data-table-custom-app-dashboard/DataTableCustomAppDashboard.vue";
import { defineComponent, ref } from "vue";
import { ObserviumAlarmSeverityBadge } from "@/core/helpers/utils";
import ObserviumAlarmDetail from "@/components/observium-components/ObserviumAlarmDetailModal.vue";

export default defineComponent({
  components: { DataTable, ObserviumAlarmDetail },
  props: {
    headerConfig: { type: Object, required: true },
    dataToDisplay: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const modalAlarmId = ref<number>(0);
    const forceRerenderKey = ref<number>(0);

    function toggleModal(id: number) {
      modalAlarmId.value = id;
      forceRerenderKey.value++;
    }

    return {
      modalAlarmId,
      forceRerenderKey,
      toggleModal,
      ObserviumAlarmSeverityBadge,
    };
  },
});
</script>
