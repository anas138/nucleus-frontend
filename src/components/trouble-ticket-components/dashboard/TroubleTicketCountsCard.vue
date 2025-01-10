<template>
  <div class="card dashboard__card mb-3">
    <!-- @click="$router.push({ name: routeName })" -->
    <div>
      <div class="d-flex flex-column">
        <!--Card Title && Period Type Buttons -->

        <!-- COUNTS Content Start Here-->
        <div
          class="severityCount__container"
          v-if="ticketStatusCounts?.length > 0"
        >
          <div class="d-flex">
            <div
              class="d-flex flex-wrap me-4"
              v-for="sCount in ticketStatusCounts"
              :key="`severity-counts-${sCount}`"
              @click="
                $router.push(`/trouble-ticket/list?status=${sCount.type}`)
              "
            >
              <div
                class="card card-bordered w-150px severityCount__card"
                :class="`border-${sCount.color}`"
                style="height: 125px"
              >
                <div class="d-flex h-100">
                  <div
                    class="d-flex flex-column align-item-center justify-content-center px-4"
                  >
                    <i
                      class="mb-4"
                      :class="TroubleTicketStatsIcon(cardData.ids[sCount.type])"
                      :style="{ fontSize: '1.4rem' }"
                    ></i>
                    <span
                      class="count fw-bold me-2 lh-1 ls-n2 mb-2"
                      :style="{ fontSize: '2rem' }"
                      >{{ sCount.count }}</span
                    >
                    <span
                      class="subtitle fw-semibold text-capitalize"
                      :style="{ fontSize: '1.1rem' }"
                    >
                      {{ sCount.type }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="online-icon"></div> -->
          <p class="description mt-3">{{ description }}</p>
        </div>
        <h1 class="text-muted empty-count-card" v-else>No ticket</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { AppConstants } from "@/constants/app-constants";
import {
  TroubleTicketStatsCountColor,
  TroubleTicketStatsIcon,
} from "@/core/helpers/utils";
import { useStore } from "vuex";
import { themeMode } from "@/core/helpers/config";
export default {
  components: {},
  props: {
    cardData: { type: Object },
  },
  setup(props) {
    const store = useStore();
    const networkTypes = AppConstants.NETWORK_TYPE;
    const isLoading = ref(false);
    const count = ref(0);
    const periodTypes = AppConstants.DASHBOARD_STATS.COUNTS_PERIOD_TYPES;
    const periodType = ref({
      type: periodTypes.LAST_24_HOURS,
      label: "Last 24 Hours",
    }); // default count-period-type
    const onTapPeriodType = (type) => {
      periodType.value.type = type;
    };
    const ticketStatusCounts = ref([]);

    onMounted(() => {
      callDataApis();
    });
    const callDataApis = () => {
      Object.keys(props.cardData?.stats).map((dataKey) => {
        if (dataKey !== "total") {
          ticketStatusCounts.value.push({
            type: dataKey,
            count: props.cardData?.stats[dataKey],
            color: TroubleTicketStatsCountColor(dataKey),
          });
        }
      });
    };
    return {
      count,
      themeMode,
      isLoading,
      periodTypes,
      periodType,
      TroubleTicketStatsIcon,
      // btnsPeriodTypes,
      ticketStatusCounts,
      networkTypes,
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

.empty-count-card {
  align-self: center;
  padding: 3.4rem 0rem;
}
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
}
.severityCount__card:hover {
  cursor: pointer;
}
.severityCount__card:hover .count {
  transition: ease-in-out;
  transition-duration: 300ms;
  /* color: var(--kt-primary) !important; */
}
.severityCount__card:hover .subtitle {
  transition: ease-in-out;
  transition-duration: 300ms;
  /* color: var(--kt-primary) !important; */
  text-decoration: underline;
}

.severityCount__container {
  overflow: auto;
  overflow-y: hidden;
}
</style>
