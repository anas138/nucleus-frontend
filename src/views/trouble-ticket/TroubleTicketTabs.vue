<template>
  <CrudViewLayout>
    <template v-slot:actions>
      <button
        class="btn btn-primary mx-3"
        @click="
          () => {
            ticketId = null;
            showLoadingSpinner = true;
            refreshHook.incrementRefresh();
          }
        "
      >
        <i class="fa fa-refresh" aria-hidden="true"></i>
      </button>
    </template>
    <template #body>
      <el-tabs v-model="selectedTab">
        <el-tab-pane
          v-for="(tab, index) in troubleTicketList"
          lazy
          :key="index"
        >
          <template #label>
            {{ tab.title }} &nbsp;
            <span
              v-if="tab.showCount && tab.total"
              class="badge-primary text-white rounded px-1"
              >{{ tab.total }}
            </span>
          </template>
          <component
            :is="tab.component"
            :status="tab.status"
            :requestParams="tab.requestParams"
            :ticketFilterConfig="tab.ticketFilterConfig"
            :key="`${tab.component}-${toggler}`"
            :refreshKey="refreshHook.refreshKey"
            :showLoadingSpinner="showLoadingSpinner"
            :showBulkUpdate="tab.showBulkUpdate"
            :isClosedTicketGrid="tab.title === 'Closed Tickets'"
            v-model:totalCount="tab.total"
            @openTicketDrawer="toggleTicketDrawer"
            @refreshKeyEmit="refreshHook.incrementRefresh"
            @enableAutoRefresh="autoReloadData"
            @disableAutoRefresh="disableAutoRefresh"
          />
        </el-tab-pane>
      </el-tabs>
      <TroubleTicketDrawer
        :key="ticketId"
        :ticketId="ticketId"
        :networkType="networkType"
        :openTroubleTicketDrawer="openDrawer"
        v-model:openDrawer="openDrawer"
      />
    </template>
  </CrudViewLayout>
</template>
<script lang="ts">
import { AppConstants, TroubleTicketContants } from "@/constants/app-constants";
import TroubleTicketService from "@/core/services/TroubleTicketService";
import TroubleTicketList from "@/components/trouble-ticket-components/trouble-ticket-list/TroubleTicketList.vue";
import TroubleTicketDrawer from "@/components/trouble-ticket-components/drawer/TroubleTicketDrawer.vue";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import {
  ref,
  defineComponent,
  Component,
  onBeforeMount,
  watch,
  onUnmounted,
  onMounted,
} from "vue";
import {
  ClosedTicketsConfig,
  OpenTicketsConfig,
  CancelledTicketsConfig,
  PauseTicketsConfig,
  PauseRequestTicketsConfig,
  RCARequestsTicketsConfig,
} from "./filter-configs/filter-config";
import { useRefresh } from "@/core/hooks/refresh";
import { useRoute } from "vue-router";
import _ from "lodash";

interface TTList {
  title: string;
  component: Component;
  showCount: boolean;
  total: number | null;
  status?: number | number[] | string;
  showBulkUpdate?: boolean;
  requestParams?: string;
  ticketFilterConfig?: object;
}

export default defineComponent({
  components: { CrudViewLayout, TroubleTicketDrawer },
  setup(props) {
    const route = useRoute();
    const openDrawer = ref<boolean>(false);
    const toggler = ref(0);
    const selectedTab = ref("0");
    const ticketId = ref();
    const networkType = ref();
    const refreshHook = ref(useRefresh());
    const showLoadingSpinner = ref(true);
    const autoRefreshTimer = ref();
    const OpenTicketsConfigRef = ref(_.cloneDeep(OpenTicketsConfig));
    const ClosedTicketsConfigRef = ref(_.cloneDeep(ClosedTicketsConfig));
    const CancelledTicketsConfigRef = ref(_.cloneDeep(CancelledTicketsConfig));
    const PauseTicketsConfigRef = ref(_.cloneDeep(PauseTicketsConfig));

    const troubleTicketList = ref<TTList[]>([
      {
        title: "In-Progress Tickets",
        component: TroubleTicketList,
        showCount: true,
        total: null,
        showBulkUpdate: true,
        status: JSON.stringify(
          TroubleTicketService.getOpenTicketsStatusArray()
        ),
        ticketFilterConfig: OpenTicketsConfigRef.value,
      },
      {
        title: "Closed Tickets",
        component: TroubleTicketList,
        showCount: false,
        total: null,
        status: JSON.stringify([
          TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.COMPLETED,
        ]),
        ticketFilterConfig: ClosedTicketsConfigRef.value,
      },
      {
        title: "Cancelled Tickets",
        component: TroubleTicketList,
        showCount: false,
        total: null,
        status: JSON.stringify([
          TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.CANCELLED,
        ]),
        ticketFilterConfig: CancelledTicketsConfigRef.value,
      },
      {
        title: "RCA Requests",
        component: TroubleTicketList,
        showCount: false,
        total: null,
        requestParams: TroubleTicketContants.TAB_QUERYPARAMS.RCA_REQUEST,
        ticketFilterConfig: RCARequestsTicketsConfig,
      },
      {
        title: "Pause Requests",
        component: TroubleTicketList,
        showCount: false,
        total: null,
        requestParams: TroubleTicketContants.TAB_QUERYPARAMS.PAUSE_REQUEST,
        ticketFilterConfig: PauseRequestTicketsConfig,
      },
      {
        title: "Pause Tickets",
        component: TroubleTicketList,
        showCount: false,
        total: null,
        status: JSON.stringify([
          TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.PAUSE,
        ]),
        ticketFilterConfig: PauseTicketsConfigRef.value,
      },
    ]);

    onMounted(() => {
      const status = String(route.query?.status).toLowerCase();
      let statusKey = Object.keys(
        TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS
      ).find(
        (key) => key.toLowerCase() === String(route.query?.status).toLowerCase()
      );
      if (
        String(route.query?.status).toLowerCase() ===
        TroubleTicketContants.STATUS.RCA_AWAITED.toLowerCase()
      ) {
        statusKey = TroubleTicketContants.BUTTON_STATUS.RCA_AWAITED;
      }

      switch (status) {
        case TroubleTicketContants.STATUS.COMPLETED.toLowerCase():
          selectedTab.value = "1";
          updateConfigFields(ClosedTicketsConfigRef, null);
          break;
        case TroubleTicketContants.STATUS.CANCELLED.toLowerCase():
          selectedTab.value = "2";
          updateConfigFields(CancelledTicketsConfigRef, null);
          break;
        case TroubleTicketContants.STATUS.PAUSE.toLowerCase():
          selectedTab.value = "5";
          updateConfigFields(PauseTicketsConfigRef, null);
          break;
        default:
          if (route.query?.status) {
            updateConfigFields(
              OpenTicketsConfigRef,
              TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS[statusKey!]
            );
          }
          break;
      }
      autoReloadData();
    });

    onUnmounted(() => {
      clearInterval(autoRefreshTimer.value);
    });

    const disableAutoRefresh = () => {
      clearInterval(autoRefreshTimer.value);
    };

    const autoReloadData = () => {
      autoRefreshTimer.value = setInterval(() => {
        showLoadingSpinner.value = false;
        refreshHook.value.incrementRefresh();
        setTimeout(() => {
          showLoadingSpinner.value = true;
        }, 1000);
      }, 60000); // 1 minute
    };

    const updateConfigFields = (configRef, status) => {
      configRef.value?.formConfig.fields.forEach((val) => {
        if (val.name === "status") {
          val.value = status;
          configRef.value.formConfig.queryParams[val.name] = status;
        }
      });
    };

    const toggleTicketDrawer = (data) => {
      openDrawer.value = true;
      ticketId.value = data.id;
      networkType.value = data.networkType;
    };

    return {
      troubleTicketList,
      toggler,
      selectedTab,
      openDrawer,
      ticketId,
      networkType,
      refreshHook,
      autoReloadData,
      disableAutoRefresh,
      showLoadingSpinner,
      toggleTicketDrawer,
    };
  },
});
</script>
