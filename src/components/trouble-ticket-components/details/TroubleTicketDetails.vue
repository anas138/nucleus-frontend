<template>
  <div :class="isDrawerView && `card pt-3`">
    <ViewTroubleTicketHeader
      trouble-ticket-title="Trouble Ticket"
      v-if="isDrawerView"
    />
    <div class="my-6 col-12">
      <TroubleTicketElSteps />
    </div>
    <div class="card" :class="isDrawerView && `mx-5`">
      <div class="card-body row p-5">
        <div
          class="mt-5 border-end"
          :class="!ticketData?.is_outage_occurred ? 'col-lg-8' : 'col-lg-7'"
        >
          <TroubleTicketViewForm
            :alarm-id="alarmId"
            :network-type="alarmType"
          />
        </div>
        <div
          class="col-lg-4 overflow-auto h-800px"
          v-if="!ticketData?.is_outage_occurred"
        >
          <component
            :is="alarmComponent"
            :id="alarmId"
            :alarmData="alarmData"
            :key="forceRerenderKey"
            :show-close-button="false"
            v-if="alarmId !== 0"
          />
        </div>
        <div class="col-lg-5" v-else>
          <TroubleTicketOutageAlarmsList />
        </div>
      </div>
    </div>

    <div class="card" :class="isDrawerView && `mx-5`">
      <div class="card-body row p-5">
        <div class="col-lg-6"><TroubleTicketActivityLog /></div>
        <div class="col-lg-6"><CommentsTimeline /></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onUnmounted, watch } from "vue";
import TroubleTicketViewForm from "@/components/trouble-ticket-components/forms/TroubleTicketViewForm.vue";
import TroubleTicketElSteps from "@/components/trouble-ticket-components/header/TroubleTicketElSteps.vue";
import { AppConstants } from "@/constants/app-constants";
import NceAlarmDetailSide from "@/components/nce-components/NceAlarmDetailSide.vue";
import ObserviumAlarmDetailSide from "@/components/observium-components/ObserviumAlarmDetailSide.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { ModuleName } from "@/store/enums/module-enum";
import { troubleTicketMutations } from "@/store/enums/trouble-ticket-enum";
import TroubleTicketActivityLog from "@/components/trouble-ticket-components/footer/TroubleTicketActivityLog.vue";
import CommentsTimeline from "@/components/trouble-ticket-components/footer/CommentsTimeline.vue";
import ViewTroubleTicketHeader from "@/components/trouble-ticket-components/header/ViewTroubleTicketHeader.vue";
import TroubleTicketOutageAlarmsList from "../trouble-ticket-list/TroubleTicketOutageAlarmsList.vue";
import { getTroubleTicketSideAlarmComponent } from "@/core/helpers/utils";

export default defineComponent({
  components: {
    TroubleTicketViewForm,
    NceAlarmDetailSide,
    ObserviumAlarmDetailSide,
    TroubleTicketElSteps,
    TroubleTicketActivityLog,
    CommentsTimeline,
    ViewTroubleTicketHeader,
    TroubleTicketOutageAlarmsList,
  },
  props: {
    ticketId: { type: Number, required: true },
    networkType: { type: String, required: true },
    isDrawerView: { type: Boolean, required: true, default: false },
  },
  setup(props) {
    const store = useStore();

    const ticketData = computed(
      () => store.getters[`${ModuleName.troubleTicket}/getTicketData`]
    );

    const alarmId = computed(() =>
      store.getters[`${ModuleName.troubleTicket}/getAlarm`]?.id
        ? store.getters[`${ModuleName.troubleTicket}/getAlarm`].id
        : 0
    );
    const alarmData = computed(
      () => store.getters[`${ModuleName.troubleTicket}/getAlarm`]
    );

    const alarmComponent = ref(
      getTroubleTicketSideAlarmComponent(ticketData.value.app_type)
    );

    const alarmType = ref(
      ticketData.value.network_type === AppConstants.NETWORK_TYPE.TRANSMISSION
    );
    const forceRerenderKey = ref(0);
    return {
      alarmType,
      alarmId,
      alarmData,
      ticketData,
      alarmComponent,
      forceRerenderKey,
    };
  },
});
</script>
