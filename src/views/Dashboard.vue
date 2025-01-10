<template>
  <crud-view-layout pageTitle="Dashboard | Network Statistics">
    <template v-slot:actions>
      <CustomDashboardsDrawer />
    </template>
    <template #body>
      <div class="mt-3 position-relative">
        <!-- Scroll Buttons -->
        <button
          v-if="checkCardsCount() >= 3"
          class="scroll-btn scroll-left"
          @click="scrollContainer('left')"
        >
          &#8592;
        </button>
        <button
          v-if="checkCardsCount() >= 3"
          class="scroll-btn scroll-right"
          @click="scrollContainer('right')"
        >
          &#8594;
        </button>

        <!-- Scrollable Container -->
        <div
          class="mt-3"
          ref="scrollableContainer"
          :class="[
            checkCardsCount() > 1 && checkCardsCount() < 3 && 'row',
            checkCardsCount() >= 3 && 'd-flex scrollable-container',
          ]"
        >
          <div
            v-for="card in cards"
            :key="`card-key-${card.title}`"
            :class="{
              'col-md-6': checkCardsCount() > 1 && checkCardsCount() < 3,
              'd-none': !$hasPermission(card.permission),
              'scrollable-card': checkCardsCount() >= 3,
            }"
          >
            <dashboard-counts-card
              :title="card.title"
              :description="card.description"
              :subtitle="card.subtitle"
              :routeName="card.routeName"
              :count="card.last24HoursAlarmsCount"
              :networkType="card.networkType"
              :appType="card?.appType"
              :status="card.status"
              v-if="$hasPermission(card.permission)"
            />
          </div>
        </div>
      </div>
      <hr class="my-3" />
      <el-tabs>
        <el-tab-pane label="LH-TXN" lazy v-if="$hasPermission(ncePermission)">
          <div class="row">
            <div
              class="col-12 col-xl-6 mb-3"
              v-for="chartCard in chartCards"
              :key="`chart-card-tx-${chartCard.title}`"
            >
              <DashboardCartCard
                :title="chartCard.title"
                :networkType="AppConstants.NETWORK_TYPE.TRANSMISSION"
                :appType="AppConstants.APP_TYPE.NCE"
                :trendType="chartCard.trendType"
                :status="chartCard.status"
                :showXAxisLabels="true"
                :showDataLabels="true"
                :on-click-key-pass="chartCard.onClickKeyPass"
                custom-series-name="Alarms"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="IP" lazy v-if="$hasPermission(ipPermission)">
          <div class="row">
            <div
              class="col-12 col-xl-6 mb-3"
              v-for="chartCard in chartCards"
              :key="`chart-card-ip-${chartCard.title}`"
            >
              <DashboardCartCard
                :title="chartCard.title"
                :networkType="AppConstants.NETWORK_TYPE.IP"
                :appType="AppConstants.APP_TYPE.OBSERVIUM"
                :trendType="chartCard.trendType"
                :status="chartCard.status"
                :showXAxisLabels="true"
                :showDataLabels="true"
                :on-click-key-pass="chartCard.onClickKeyPass"
                custom-series-name="Alarms"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="GPON" lazy v-if="$hasPermission(gponPermission)">
          <div class="row">
            <div
              class="col-12 col-xl-6 mb-3"
              v-for="chartCard in chartCards"
              :key="`chart-card-gpon-${chartCard.title}`"
            >
              <DashboardCartCard
                :title="chartCard.title"
                :networkType="AppConstants.NETWORK_TYPE.GPON"
                :appType="AppConstants.APP_TYPE.NCE_GPON"
                :trendType="chartCard.trendType"
                :status="chartCard.status"
                :showXAxisLabels="true"
                :showDataLabels="true"
                :on-click-key-pass="chartCard.onClickKeyPass"
                custom-series-name="Alarms"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="Nokia-TXN"
          lazy
          v-if="$hasPermission(nokiaTXNPermission)"
        >
          <div class="row">
            <div
              class="col-12 col-xl-6 mb-3"
              v-for="chartCard in chartCards"
              :key="`chart-card-nokia-txn-${chartCard.title}`"
            >
              <DashboardCartCard
                :title="chartCard.title"
                :networkType="AppConstants.NETWORK_TYPE.TRANSMISSION"
                :appType="AppConstants.APP_TYPE.NOKIA_TXN"
                :trendType="chartCard.trendType"
                :status="chartCard.status"
                :showXAxisLabels="true"
                :showDataLabels="true"
                :on-click-key-pass="chartCard.onClickKeyPass"
                custom-series-name="Alarms"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="LDI-Softswitch"
          lazy
          v-if="$hasPermission(ldiSoftswitchEMSPermission)"
        >
          <div class="row">
            <div
              class="col-12 col-xl-6 mb-3"
              v-for="chartCard in chartCardsForLDI"
              :key="`chart-card-ldi-Softswitch-${chartCard.title}`"
            >
              <DashboardCartCard
                :title="chartCard.title"
                :networkType="AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH"
                :appType="AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS"
                :trendType="chartCard.trendType"
                :status="chartCard.status"
                :showXAxisLabels="true"
                :showDataLabels="true"
                :on-click-key-pass="chartCard.onClickKeyPass"
                custom-series-name="Alarms"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </crud-view-layout>
</template>
<script lang="ts">
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import { defineComponent, onMounted, ref } from "vue";
import CustomDashboardsDrawer from "@/components/dashboard/add-dashboard-component/CustomDashboardsDrawer.vue";
import DashboardCartCard from "@/components/dashboard/DashboardChartCard.vue";
import DashboardCountsCard from "@/components/dashboard/DashboardCountsCard.vue";
import { AppConstants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";
import { PermissionsService } from "@/core/services/PermissionsService";
export default defineComponent({
  components: {
    CrudViewLayout,
    DashboardCartCard,
    DashboardCountsCard,
    CustomDashboardsDrawer,
  },
  setup() {
    const ncePermission = permissions.nce.network;
    const ipPermission = permissions.observium.network;
    const gponPermission = permissions.nceGpon.network;
    const nokiaTXNPermission = permissions.nokiaTXN.network;
    const ldiSoftswitchEMSPermission = permissions.ldiSoftswitchEMS.network;
    const cards = ref([
      {
        network: "lh-tx",
        title: "Long-Haul Transmission",
        subtitle: "Last 24 Hours",
        description: "Realtime alarms incoming from NCE Huawei NMS",
        routeName: "nce-alarm-list",
        last24HoursAlarmsCount: 230,
        networkType: AppConstants.NETWORK_TYPE.TRANSMISSION,
        appType: AppConstants.APP_TYPE.NCE,
        permission: ncePermission,
        status: "uncleared",
      },
      {
        network: "ip",
        title: "IP",
        subtitle: "Last 24 Hours",
        description: "Realtime alarms incoming from Observium NMS",
        routeName: "observium-alarm-list",
        last24HoursAlarmsCount: 340,
        networkType: AppConstants.NETWORK_TYPE.IP,
        appType: AppConstants.APP_TYPE.OBSERVIUM,
        permission: ipPermission,
        status: "uncleared",
      },
      {
        network: "gpon",
        title: "GPON",
        subtitle: "Last 24 Hours",
        description: "Realtime alarms incoming from NCE Gpon NMS",
        routeName: "gpon-alarm-list",
        last24HoursAlarmsCount: 340,
        networkType: AppConstants.NETWORK_TYPE.GPON,
        appType: AppConstants.APP_TYPE.NCE_GPON,
        permission: gponPermission,
        status: "uncleared",
      },
      {
        network: "nokia-txn",
        title: "Nokia-TXN",
        subtitle: "Last 24 Hours",
        description: "Realtime alarms incoming from Nokia-TXN NMS",
        routeName: "nokia-txn-alarm-list",
        last24HoursAlarmsCount: 340,
        networkType: AppConstants.NETWORK_TYPE.TRANSMISSION,
        appType: AppConstants.APP_TYPE.NOKIA_TXN,
        permission: nokiaTXNPermission,
        status: "uncleared",
      },
      {
        network: "ldi-Softswitch",
        title: "LDI-Softswitch",
        subtitle: "Last 24 Hours",
        description: "Realtime alarms incoming from LDI-Softswitch NMS",
        routeName: "ldi-softswitch-alarm-list",
        last24HoursAlarmsCount: 340,
        networkType: AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH,
        appType: AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS,
        permission: ldiSoftswitchEMSPermission,
        status: "uncleared",
      },
    ]);
    const chartCards = [
      {
        title: "Top 10 Alarms",
        // networkType: "TRANSMISSION",
        trendType: "top_ten_alarms",
        onClickKeyPass: "alarmName",
        status: "uncleared",
      },
      {
        title: "Top 10 Alarm Sources",
        trendType: "top_ten_devices",
        onClickKeyPass: "deviceName",
        status: "uncleared",
      },
      {
        title: "Top Alarms By Severity",
        trendType: "severity",
        onClickKeyPass: "severity",
        status: "uncleared",
      },
    ];

    const chartCardsForLDI = [
      {
        title: "Top 10 Alarms",
        // networkType: "TRANSMISSION",
        trendType: "top_ten_alarms",
        onClickKeyPass: "alarmName",
        status: "uncleared",
      },
      {
        title: "Top 10 Alarm Sources",
        trendType: "top_ten_trunk_group",
        onClickKeyPass: "trunkGroup",
        status: "uncleared",
      },
      {
        title: "Top Alarms By Severity",
        trendType: "severity",
        onClickKeyPass: "severity",
        status: "uncleared",
      },
    ];

    onMounted(() => {
      checkCardsCount();
    });

    const checkCardsCount = () => {
      let count = 0;
      if (PermissionsService.hasPermission(ncePermission)) {
        count++;
      }
      if (PermissionsService.hasPermission(ipPermission)) {
        count++;
      }
      if (PermissionsService.hasPermission(gponPermission)) {
        count++;
      }
      if (PermissionsService.hasPermission(nokiaTXNPermission)) {
        count++;
      }
      if (PermissionsService.hasPermission(ldiSoftswitchEMSPermission)) {
        count++;
      }
      return count;
    };

    // Reference to the scrollable container
    const scrollableContainer = ref<any>(null);

    // Function to handle scrolling
    function scrollContainer(direction) {
      if (scrollableContainer.value) {
        const scrollAmount = 400; // Set the scroll step size
        scrollableContainer.value.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth", // Enable smooth scrolling
        });
      }
    }

    return {
      cards,
      chartCards,
      chartCardsForLDI,
      ncePermission,
      ipPermission,
      gponPermission,
      nokiaTXNPermission,
      ldiSoftswitchEMSPermission,
      AppConstants,
      checkCardsCount,
      scrollContainer,
      scrollableContainer,
    };
  },
});
</script>

<style>
.scrollable-container {
  overflow-x: auto; /* Enable horizontal scrolling */
  display: flex; /* Align items in a row */
  gap: 1rem; /* Add spacing between cards */
  padding: 10px; /* Add padding for aesthetics */
  position: relative;
}

.scrollable-card {
  min-width: 600px; /* Set card width when scrollable */
  flex: 0 0 auto; /* Prevent shrinking or growing */
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: var(--kt-light);
  color: var(--kt-dark);
  border: 1px solid var(--kt-primary);
  padding: 8px 13px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.scroll-left {
  left: -18px; /* Position left button */
}

.scroll-right {
  right: -18px; /* Position right button */
}

.scroll-btn:hover {
  background: var(--kt-primary);
  color: var(--kt-primary-inverse);
  scale: 1.1;
  transition: ease-in-out;
  transition-duration: 300ms;
}
</style>
