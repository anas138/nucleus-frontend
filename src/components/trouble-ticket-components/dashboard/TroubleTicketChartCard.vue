<template>
  <div class="card card-bordered border-primary">
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">{{ title }}</span>
        <span class="text-muted fw-semobold fs-7">{{
          subtitle || localSubtitle || `Showing weekly data`
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
      <EmptyChartComponent class="card-body" v-else-if="isChartEmpty" />
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
    <!-- <alarm-list-modal
      v-if="modalVisible"
      :key="forceRerenderKey"
      :queryParams="queryParams"
      :networkType="networkType"
      :modalVisible="modalVisible"
      @modalDisable="() => (modalVisible = false)"
    /> -->
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
import CustomSkeletonVertical from "@/components/shared/CustomSkeletonVertical.vue";
import { chartOptions } from "@/core/services/DashboardStatsService";
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
import TroubleTicketService from "@/core/services/TroubleTicketService";
import moment from "moment";
import EmptyChartComponent from "@/components/shared/EmptyChartComponent.vue";

interface SeriesItem {
  name: string | undefined; // Change to the appropriate type for 'name'
  data: []; // Change to the appropriate type for 'data'
}
interface GraphQueryParams {
  trend_type: string | "top_ten_alarms" | "top_ten_devices" | "severity";
  from_date?: Date | string;
  to_date?: Date | string;
}

export default {
  components: {
    CustomSkeletonVertical,
    EmptyChartComponent,
    // AlarmListModal,
  },
  props: {
    title: {
      required: true,
      type: String,
    },
    subtitle: {
      required: false,
      type: String,
    },
    networkType: {
      required: true,
      type: String,
      description: "transmission | ip",
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
    refreshkey: {
      type: Number,
    },
  },
  setup(props) {
    const isLoading = ref(true);
    const isChartEmpty = ref<boolean>(false);
    const labels = ref([]);
    const values = ref([]);
    const chartRef = ref<typeof VueApexCharts | null>(null);
    const series = ref<SeriesItem[]>([]);
    const localSubtitle = ref(props.subtitle);
    let graphQueryParams: GraphQueryParams = {
      trend_type: props.trendType,
      from_date: moment(getDatetimeOneWeekAgo().from_date).format(
        AppConstants.DATE_FORMATS.ISO_DATE
      ),
      to_date: moment(getDatetimeOneWeekAgo().to_date).format(
        AppConstants.DATE_FORMATS.ISO_DATE
      ),
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
    onBeforeMount(() => {
      fetchGraphsData();
    });

    const fetchGraphsData = async () => {
      isLoading.value = true;
      isChartEmpty.value = false;
      let data;
      data = await TroubleTicketService.getTroubleTicketDashboard(
        graphQueryParams
      );
      if (data?.labels?.length === 0 && data?.values?.length === 0) {
        isChartEmpty.value = true;
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
      if (durationType === "weekly") {
        const { from_date, to_date } = getDatetimeOneWeekAgo();
        range = {
          from_date: moment(from_date).format(
            AppConstants.DATE_FORMATS.ISO_DATE
          ),
          to_date: moment(to_date).format(AppConstants.DATE_FORMATS.ISO_DATE),
        };
      } else {
        const { from_date, to_date } = getDatetimeOneMonthAgo();
        range = {
          from_date: moment(from_date).format(
            AppConstants.DATE_FORMATS.ISO_DATE
          ),
          to_date: moment(to_date).format(AppConstants.DATE_FORMATS.ISO_DATE),
        };
      }
      graphQueryParams = {
        ...graphQueryParams,
        from_date: range.from_date,
        to_date: range.to_date,
      };
      localSubtitle.value = `Showing ${durationType} data`;
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
      // toggleModal({
      //   [props.onClickKeyPass]: labels.value[config.dataPointIndex],
      // });
    };
    watch(themeMode, () => {
      refreshChart();
    });
    watch(
      () => props.refreshkey,
      () => {
        fetchGraphsData();
      }
    );

    return {
      isLoading,
      isChartEmpty,
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
