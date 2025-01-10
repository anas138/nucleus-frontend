<template>
  <div class="card dashboard__card mb-3 card-bordered border-primary">
    <!-- @click="$router.push({ name: routeName })" -->
    <div class="p-5">
      <div class="d-flex flex-column">
        <!--Card Title && Period Type Buttons -->
        <div
          class="d-flex justify-content-between align-items-center flex-wrap border-bottom mb-3 pb-1"
        >
          <h3 class="title d-flex justify-content-center">
            {{ title }}
            <div class="online-icon mx-3"></div>
          </h3>
          <div class="d-flex justify-content-center align-items-center">
            <div
              class="btn__severity"
              :class="{
                'btn__severity-active': periodType.type === btn.type,
              }"
              @click="btn.onTap(btn.type)"
              v-for="btn in btnsPeriodTypes"
              :key="`btn-period-type-${networkType}-${btn.type}`"
            >
              {{ btn.label }}
            </div>
          </div>
        </div>
        <!-- COUNTS Content Start Here-->
        <div v-if="!isLoading" class="severityCount__container">
          <div class="d-flex justify-content-start">
            <div
              class="d-flex flex-wrap mx-2"
              v-for="sCount in severityTypeCounts"
              :key="`severity-counts-${networkType}-${sCount.type}`"
            >
              <div
                class="card card-bordered border-secondary severityCount__card"
              >
                <div class="card-body p-5">
                  <div class="d-flex flex-column">
                    <span class="count fw-bold me-2 lh-1 ls-n2 mb-2">{{
                      sCount.count
                    }}</span>
                    <span
                      class="subtitle fw-semibold text-capitalize"
                      :style="{ fontSize: '.9rem' }"
                      v-html="
                        appType === appTypes.NCE
                          ? NceAlarmSeverityBadge(sCount.type)
                          : appType === appTypes.OBSERVIUM
                          ? ObserviumAlarmSeverityBadge(sCount.type)
                          : appType === appTypes.NCE_GPON
                          ? NceGponAlarmSeverityBadge(sCount.type)
                          : appType === appTypes.NOKIA_TXN
                          ? NokiaTXNAlarmSeverityBadge(sCount.type)
                          : LDISoftswitchEMSAlarmSeverityBadge(sCount.type)
                      "
                    >
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="online-icon"></div> -->
          <p class="description mt-3">{{ description }}</p>
        </div>
        <custom-spinner padding=".65rem" type="bounce" v-else />
      </div>
    </div>
  </div>
</template>

<script>
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { getDashboardStatsCounts } from "@/core/services/DashboardStatsService";
import CustomSpinner from "../shared/CustomSpinner.vue";
import { AppConstants } from "@/constants/app-constants";
import {
  NceAlarmSeverityBadge,
  ObserviumAlarmSeverityBadge,
  NceGponAlarmSeverityBadge,
  NokiaTXNAlarmSeverityBadge,
  LDISoftswitchEMSAlarmSeverityBadge,
} from "@/core/helpers/utils";
import SocketIoService from "@/core/services/SocketIoService";
import { watchDebounced } from "@vueuse/core";
import { useStore } from "vuex";
export default {
  components: { CustomSpinner },
  props: {
    routeName: String,
    title: String,
    subtitle: String,
    description: String,
    networkType: String,
    appType: String,
    status: String,
  },
  setup(props) {
    const store = useStore();
    const networkTypes = AppConstants.NETWORK_TYPE;
    const appTypes = AppConstants.APP_TYPE;
    const isLoading = ref(true);
    const count = ref(0);
    const periodTypes = AppConstants.DASHBOARD_STATS.COUNTS_PERIOD_TYPES;
    const periodType = ref({
      type: periodTypes.LAST_24_HOURS,
      label: "Last 24 Hours",
    }); // default count-period-type
    const onTapPeriodType = (type) => {
      periodType.value.type = type;
    };
    const btnsPeriodTypes = [
      {
        type: periodTypes.LAST_24_HOURS,
        label: "Last 24 Hours",
        onTap: onTapPeriodType,
      },
      {
        type: periodTypes.LAST_WEEK,
        label: "Week",
        onTap: onTapPeriodType,
      },
      {
        type: periodTypes.LAST_MONTH,
        label: "Month",
        onTap: onTapPeriodType,
      },
    ];
    // const severityTypeCounts = ref < { type: "", count: 0 } > []([]);
    const severityTypeCounts = ref([]);
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
      callDataApis();
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
    const callDataApis = () => {
      getDashboardStatsCounts(
        props.networkType,
        {
          period: periodType.value.type,
          status: props.status,
        },
        props.appType
      ).then((data) => {
        count.value = data?.total || 0;
        severityTypeCounts.value = [];
        // get all severity wise counts into reactive array
        Object.keys(data).map((dataKey) => {
          if (dataKey !== "total") {
            severityTypeCounts.value.push({
              type: dataKey,
              count: data[dataKey],
            });
          }
        });
        isLoading.value = false;
      });
    };
    watch(
      periodType,
      () => {
        isLoading.value = true;
        callDataApis();
      },
      { deep: true }
    );
    watchDebounced(
      refreshKey,
      () => {
        callDataApis();
      },
      {
        debounce: AppConstants.DATA_FETCH_RATE_LIMITING.DEBOUNCE,
        maxWait: AppConstants.DATA_FETCH_RATE_LIMITING.MAXWAIT,
      }
    );
    return {
      count,
      isLoading,
      periodTypes,
      periodType,
      btnsPeriodTypes,
      severityTypeCounts,
      NceAlarmSeverityBadge,
      ObserviumAlarmSeverityBadge,
      NceGponAlarmSeverityBadge,
      NokiaTXNAlarmSeverityBadge,
      LDISoftswitchEMSAlarmSeverityBadge,
      networkTypes,
      appTypes,
    };
  },
};
</script>

<style scoped>
/* .dashboard__card:hover {
  transform: scale(1.03);
  transition: ease-in-out;
  transition-duration: 300ms;
  cursor: pointer;
} */
/* .dashboard__card .count {
  font-size: 1.6rem;
  color: var(--kt-primary);
} */
.dashboard__card .title {
  font-size: 1.5rem;
}

.btn__severity {
  border-radius: 12px;
  border: 1px solid var(--kt-primary);
  padding: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  padding-left: 6px;
  padding-right: 6px;
  margin-right: 4px;
}
.btn__severity:hover {
  background: var(--kt-primary);
  color: var(--kt-primary-inverse);
  /* transform: scale(1.1); */
  transition: ease-in-out;
  transition-duration: 300ms;
}
.btn__severity-active {
  background: var(--kt-primary);
  color: var(--kt-primary-inverse);
}

.severityCount__card .count {
  font-size: 1.6rem;
  color: var(--kt-primary) !important;
}
.severityCount__card:hover {
  background: var(--kt-primary);
  transition: ease-in-out;
  transition-duration: 300ms;
  cursor: pointer;
}
.severityCount__card:hover .count {
  color: var(--kt-primary-inverse) !important;
}
.severityCount__card:hover .subtitle {
  color: var(--kt-primary-inverse) !important;
}

.severityCount__container {
  overflow: auto;
  overflow-y: hidden;
}
</style>
