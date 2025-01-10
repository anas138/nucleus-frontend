<template>
  <div class="card card-bordered border-primary">
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">{{ title }}</span>
        <span class="text-muted fw-semobold fs-7">{{
          subtitle || localSubtitle || `Showing weekly trends`
        }}</span>
      </h3>
      <div class="card-toolbar">
        <button
          class="btn btn-sm btn-primary"
          type="button"
          @click="reloadTrendByDurationType('weekly')"
        >
          Weekly
        </button>
        <button
          class="btn btn-sm btn-primary mx-3"
          @click="reloadTrendByDurationType('monthly')"
        >
          Monthly
        </button>
      </div>
    </div>
    <div class="card-body">
      <custom-skeleton-vertical
        v-if="isLoading"
        itemHeight="250px"
        itemWidth="4%"
        :numberOfItems="8"
      />
      <apexchart
        v-else
        ref="chartRef"
        type="bar"
        :options="chart"
        :series="series"
        :height="250"
        @dataPointSelection="handleDataPointClick"
      ></apexchart>
    </div>
    <alarm-list-modal
      v-if="modalVisible"
      :key="forceRerenderKey"
      :queryParams="queryParams"
      :networkType="networkType"
      :appType="appType"
      :modalVisible="modalVisible"
      @modalDisable="() => (modalVisible = false)"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  reactive,
  watch,
} from "vue";
import CustomSkeletonVertical from "../shared/CustomSkeletonVertical.vue";
import {
  chartOptions,
  getGponDashboardStatsGraphsData,
  getIpDashboardStatsGraphsData,
  getLDISoftswitchEMSDashboardStatsGraphsData,
  getNokiaTXNDashboardStatsGraphsData,
  getTxDashboardStatsGraphsData,
} from "@/core/services/DashboardStatsService";
import { AppConstants } from "@/constants/app-constants";
import { ApexOptions } from "apexcharts";
import { useStore } from "vuex";
import VueApexCharts from "vue3-apexcharts";
import {
  getDatetimeOneMonthAgo,
  getDatetimeOneWeekAgo,
} from "@/core/helpers/utils";
import router from "@/router";
import { watchDebounced } from "@vueuse/core";
import SocketIoService from "@/core/services/SocketIoService";
import AlarmListModal from "@/components/dashboard/AlarmListModal.vue";

interface SeriesItem {
  name: string | undefined; // Change to the appropriate type for 'name'
  data: []; // Change to the appropriate type for 'data'
}
interface GraphQueryParams {
  trend_type: string | "top_ten_alarms" | "top_ten_devices" | "severity";
  from_date?: Date;
  to_date?: Date;
  status: string;
}

export default {
  components: {
    CustomSkeletonVertical,
    AlarmListModal,
  },
  props: {
    title: {
      required: true,
      type: String,
    },
    subtitle: {
      required: true,
      type: String,
    },
    networkType: {
      required: true,
      type: String,
      description: "transmission | ip",
    },
    appType: {
      required: true,
      type: String,
    },
    trendType: {
      required: true,
      type: String,
      description: "top_ten_alarms | top_ten_alarm_sources | severity",
    },
    showXAxisLabels: {
      type: Boolean,
      default: false,
    },
    showDataLabels: {
      type: Boolean,
      default: false,
    },
    customSeriesName: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    onClickKeyPass: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup(props) {
    const isLoading = ref(true);
    const labels = ref([]);
    const values = ref([]);
    const chartRef = ref<typeof VueApexCharts | null>(null);
    const series = ref<SeriesItem[]>([]);
    const localSubtitle = ref(props.subtitle);
    let graphQueryParams: GraphQueryParams = {
      trend_type: props.trendType,
      status: props.status,
      from_date: getDatetimeOneWeekAgo().from_date,
      to_date: getDatetimeOneWeekAgo().to_date,
    };

    const alarmStatus = "uncleared";

    const queryParams = ref({
      alarmStatus,
    });
    const modalVisible = ref(false);

    const forceRerenderKey = ref(0);

    function toggleModal(params) {
      queryParams.value = { ...params, alarmStatus };
      modalVisible.value = true;
      forceRerenderKey.value++;
    }

    let chart: ApexOptions = {};
    const store = useStore();
    const themeMode = computed(() => {
      return store.getters.getThemeMode;
    });
    // To handle auto-refresh on realtime-alarms-updates
    const refreshKey = computed(() => {
      return props.appType === AppConstants.APP_TYPE.OBSERVIUM
        ? store.getters.getObsDashboardRefreshKey
        : props.appType === AppConstants.APP_TYPE.NCE
        ? store.getters.getNceDashboardRefreshKey
        : props.appType === AppConstants.APP_TYPE.NCE_GPON
        ? store.getters.getNceGponDashboardRefreshKey
        : props.appType === AppConstants.APP_TYPE.NOKIA_TXN
        ? store.getters.getNokiaTXNDashboardRefreshKey
        : store.getters.getLDISoftswitchEMSDashboardRefreshKey;
    });
    onBeforeMount(() => {
      console.log("props.trendType", props.trendType);
      fetchGraphsData();
    });
    // On Mount, register dashboard-refresh WS-events listening
    onMounted(() => {
      SocketIoService.registerDashboardRefreshListenerNetworkWise(
        props.networkType,
        props.appType
      );
    });
    onUnmounted(() => {
      SocketIoService.unRegisterDashboardRefreshListener(
        props.networkType,
        props.appType
      );
    });

    const fetchGraphsData = async () => {
      let data;
      if (props.networkType === AppConstants.NETWORK_TYPE.TRANSMISSION) {
        if (props.appType === AppConstants.APP_TYPE.NCE) {
          data = await getTxDashboardStatsGraphsData(graphQueryParams);
        } else {
          data = await getNokiaTXNDashboardStatsGraphsData(graphQueryParams);
        }
      } else if (props.networkType === AppConstants.NETWORK_TYPE.IP) {
        data = await getIpDashboardStatsGraphsData(graphQueryParams);
      } else if (props.networkType === AppConstants.NETWORK_TYPE.GPON) {
        data = await getGponDashboardStatsGraphsData(graphQueryParams);
      } else if (
        props.networkType === AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH
      ) {
        data = await getLDISoftswitchEMSDashboardStatsGraphsData(
          graphQueryParams
        );
      }
      labels.value = data.labels;
      values.value = data.values;
      series.value = [{ name: props.customSeriesName, data: data.values }];
      Object.assign(
        chart,
        chartOptions(
          labels.value,
          props.showXAxisLabels,
          props.customSeriesName,
          props.showDataLabels
        )
      );
      isLoading.value = false;
    };

    const reloadTrendByDurationType = (durationType) => {
      if (isLoading.value === true) return;
      let range;
      if (durationType === "weekly") range = getDatetimeOneWeekAgo();
      else range = getDatetimeOneMonthAgo();
      graphQueryParams = {
        ...graphQueryParams,
        from_date: range.from_date,
        to_date: range.to_date,
      };
      localSubtitle.value = `Showing ${durationType} trends`;
      fetchGraphsData();
    };

    const refreshChart = () => {
      if (!chartRef.value) {
        return;
      }
      Object.assign(
        chart,
        chartOptions(
          labels.value,
          props.showXAxisLabels,
          props.customSeriesName,
          props.showDataLabels
        )
      );
      chartRef.value.refresh();
      console.log("refreshed");
    };

    const handleDataPointClick = (event, chartContext, config) => {
      toggleModal({
        [props.onClickKeyPass]: labels.value[config.dataPointIndex],
      });
    };
    watch(themeMode, () => {
      refreshChart();
    });
    watchDebounced(
      refreshKey,
      () => {
        fetchGraphsData();
      },
      {
        debounce: AppConstants.DATA_FETCH_RATE_LIMITING.DEBOUNCE,
        maxWait: AppConstants.DATA_FETCH_RATE_LIMITING.MAXWAIT,
      }
    );

    return {
      isLoading,
      series,
      chart,
      chartRef,
      reloadTrendByDurationType,
      localSubtitle,
      handleDataPointClick,
      forceRerenderKey,
      queryParams,
      modalVisible,
    };
  },
};
</script>
