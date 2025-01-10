<template>
  <crud-view-layout pageTitle="Trouble Ticket Statistics">
    <template v-slot:actions>
      <MarkAsDefaultDashboard />
    </template>
    <template #body>
      <div class="row my-3">
        <TroubleTicketCounts :refreshkey="refreshHook.refreshKey" />
      </div>
      <div class="mb-3">
        <span class="fs-7 fst-italic hint-class fw-normal">
          Trends are based on In-Progress and Closed tickets only.
        </span>
      </div>
      <div class="row">
        <div
          class="col-12 col-xl-6 mb-3"
          v-for="chartCard in chartCards"
          :key="`chart-card-tx-${chartCard.title}`"
        >
          <TroubleTicketChartCard
            :refreshkey="refreshHook.refreshKey"
            :title="chartCard.title"
            networkType="transmission"
            :showXAxisLabels="true"
            :showDataLabels="true"
            :trendType="chartCard.trendType"
            :status="chartCard.status"
            :on-click-key-pass="chartCard.onClickKeyPass"
            custom-series-name="Tickets"
          />
        </div>
      </div>
    </template>
  </crud-view-layout>
</template>
<script lang="ts">
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import TroubleTicketChartCard from "@/components/trouble-ticket-components/dashboard/TroubleTicketChartCard.vue";
import { AppConstants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";
import { useRefresh } from "@/core/hooks/refresh";
import TroubleTicketCounts from "@/components/trouble-ticket-components/dashboard/TroubleTicketCounts.vue";
import MarkAsDefaultDashboard from "@/components/shared/MarkAsDefaultDashboard.vue";
export default defineComponent({
  components: {
    CrudViewLayout,
    TroubleTicketChartCard,
    TroubleTicketCounts,
    MarkAsDefaultDashboard,
  },
  setup() {
    const refreshHook = ref(useRefresh());
    const autoRefreshTimer = ref();

    const txPermission = permissions.nce.network;
    const ipPermission = permissions.observium.network;
    const cards = ref([
      {
        network: "lh-tx",
        title: "LH-Transmission Network",
        subtitle: "Last 24 Hours",
        description: "Overall Trouble Ticket stats for Transmission",
        routeName: "nce-alarm-list",
        last24HoursAlarmsCount: 230,
        networkType: AppConstants.NETWORK_TYPE.TRANSMISSION,
        permission: txPermission,
        status: "uncleared",
      },
      {
        network: "ip",
        title: "IP Network",
        subtitle: "Last 24 Hours",
        description: "Overall Trouble Ticket stats for IP",
        routeName: "observium-alarm-list",
        last24HoursAlarmsCount: 340,
        networkType: AppConstants.NETWORK_TYPE.IP,
        permission: ipPermission,
        status: "uncleared",
      },
    ]);
    const chartCards = [
      {
        title: "Tickets by Priority",
        // networkType: "TRANSMISSION",
        trendType: "priority",
        onClickKeyPass: "priority",
      },
      {
        title: "Tickets by Sub-Departments",
        // networkType: "TRANSMISSION",
        trendType: "sub-department",
        onClickKeyPass: "sub-department",
      },
      {
        title: "Tickets by Category",
        trendType: "category",
        onClickKeyPass: "category",
      },
      {
        title: "Tickets by Network",
        // networkType: "TRANSMISSION",
        trendType: "network",
        onClickKeyPass: "network",
      },
      // {
      //   title: "Tickets by Alarm",
      //   // networkType: "TRANSMISSION",
      //   trendType: "Alarms",
      //   onClickKeyPass: "Alarms",
      // },
      {
        title: "Tickets by Status",
        trendType: "Status",
        onClickKeyPass: "Status",
      },
      // {
      //   title: "Tickets by Region",
      //   trendType: "Region",
      //   onClickKeyPass: "Region",
      // },
    ];

    onMounted(() => {
      autoReloadData();
    }),
      onUnmounted(() => {
        clearInterval(autoRefreshTimer.value);
      });

    const autoReloadData = () => {
      autoRefreshTimer.value = setInterval(() => {
        refreshHook.value.incrementRefresh();
      }, 60000 * 3); // 3 minute
    };

    return {
      cards,
      chartCards,
      txPermission,
      ipPermission,
      refreshHook,
    };
  },
});
</script>
