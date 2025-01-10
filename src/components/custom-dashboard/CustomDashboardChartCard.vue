<template>
  <div class="card card-bordered border-primary" style="height: 390px">
    <CardsHeader
      :widget-id="widgetId"
      :widget-title="title"
      :alarm-name="alarmName"
      :subtitle="localSubtitle"
      widget-type="Trend"
      @refresh-widget="reloadTrendByDurationType('weekly')"
      @widget-deleted="() => emit('widgetDeleted')"
    />
    <div class="card-body">
      <custom-skeleton-vertical
        v-if="isLoading"
        itemHeight="250px"
        itemWidth="4%"
        :numberOfItems="8"
      />
      <apexchart
        v-else-if="labels.length && values.length && !isLoading"
        ref="chartRef"
        type="bar"
        :options="chart"
        :series="series"
        :height="250"
      ></apexchart>
      <empty :displayForCard="true" v-else />
    </div>
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
import CardsHeader from "@/components/custom-dashboard/widget-card-components/CardsHeader.vue";
import router from "@/router";
import Empty from "@/layouts/main-layout/search/partials/Empty.vue";

interface SeriesItem {
  name: string | undefined; // Change to the appropriate type for 'name'
  data: []; // Change to the appropriate type for 'data'
}
interface GraphQueryParams {
  trend_type?: string | "top_ten_alarms" | "top_ten_devices" | "severity";
  alarm_filter_config_id?: number;
  from_date?: Date;
  to_date?: Date;
  status?: string;
  is_cleared?: number;
}

export default {
  components: {
    CustomSkeletonVertical,
    CardsHeader,
    Empty,
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
      type: String,
      required: true,
    },
    alarmName: {
      type: String,
      required: true,
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
    customSeriesName: {
      type: String,
    },
    alarm_filter_config_id: {
      type: Number,
      required: false,
    },
    widgetId: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    is_cleared: {
      type: Number,
      required: true,
    },
  },
  emits: ["widgetDeleted"],
  setup(props, { emit }) {
    const isLoading = ref(true);
    const labels = ref([]);
    const values = ref([]);
    const chartRef = ref<typeof VueApexCharts | null>(null);
    const series = ref<SeriesItem[]>([]);
    const localSubtitle = ref(props.subtitle);
    let graphQueryParams: GraphQueryParams = props.alarm_filter_config_id
      ? {
          alarm_filter_config_id: props.alarm_filter_config_id,
          is_cleared: props.is_cleared,
        }
      : { trend_type: props.trendType, status: props.status };

    let chart: ApexOptions = {};
    const store = useStore();
    const themeMode = computed(() => {
      return store.getters.getThemeMode;
    });
    // To handle auto-refresh on realtime-alarms-updates
    // const refreshKey = computed(() => {
    //   return props.networkType === AppConstants.NETWORK_TYPE.IP
    //     ? store.getters.getObsDashboardRefreshKey
    //     : store.getters.getNceDashboardRefreshKey;
    // });
    onBeforeMount(() => {
      console.log("props.trendType", props.trendType);
      reloadTrendByDurationType("weekly");
    });
    // On Mount, register dashboard-refresh WS-events listening
    // onMounted(() => {
    //   SocketIoService.registerDashboardRefreshListenerNetworkWise(
    //     props.networkType
    //   );
    // });
    // onUnmounted(() => {
    //   SocketIoService.unRegisterDashboardRefreshListener(props.networkType);
    // });

    const fetchGraphsData = async () => {
      isLoading.value = true;
      let data;
      if (
        props.alarm_filter_config_id &&
        props.networkType === AppConstants.NETWORK_TYPE.TRANSMISSION
      ) {
        if (props.appType === AppConstants.APP_TYPE.NCE) {
          data = await getTxDashboardStatsGraphsData(graphQueryParams);
        } else if (props.appType === AppConstants.APP_TYPE.NOKIA_TXN) {
          data = await getNokiaTXNDashboardStatsGraphsData(graphQueryParams);
        }
      } else if (
        props.alarm_filter_config_id &&
        props.networkType === AppConstants.NETWORK_TYPE.IP
      ) {
        data = await getIpDashboardStatsGraphsData(graphQueryParams);
      } else if (
        props.alarm_filter_config_id &&
        props.networkType === AppConstants.NETWORK_TYPE.GPON
      ) {
        data = await getGponDashboardStatsGraphsData(graphQueryParams);
      } else if (
        props.alarm_filter_config_id &&
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
          props.customSeriesName
        )
      );
      isLoading.value = false;
    };

    const reloadTrendByDurationType = (durationType) => {
      //   if (isLoading.value === true) return;
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
          props.customSeriesName
        )
      );
      chartRef.value.refresh();
      console.log("refreshed");
    };

    const handleDataPointClick = (event, chartContext, config) => {
      router.push({
        path: `/alarms/${props.networkType}`,
        query: { alarm_name: labels.value[config.dataPointIndex] },
      });
    };
    watch(themeMode, () => {
      refreshChart();
    });
    // watchDebounced(
    //   refreshKey,
    //   () => {
    //     fetchGraphsData();
    //   },
    //   {
    //     debounce: AppConstants.DATA_FETCH_RATE_LIMITING.DEBOUNCE,
    //     maxWait: AppConstants.DATA_FETCH_RATE_LIMITING.MAXWAIT,
    //   }
    // );

    return {
      isLoading,
      series,
      chart,
      chartRef,
      labels,
      values,
      emit,
      reloadTrendByDurationType,
      localSubtitle,
      handleDataPointClick,
    };
  },
};
</script>
