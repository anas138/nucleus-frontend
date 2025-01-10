<template>
  <div class="card mt-3">
    <CreateTroubleTicketHeader />
    <div class="my-6 col-12">
      <TroubleTicketElSteps />
    </div>
    <div class="card card-bordered border-primary m-5">
      <div class="card-body row p-5">
        <div class="col-lg-8 mt-5 border-end">
          <CreateTroubleTicketForm :alarm-id="alarmId" />
        </div>
        <div class="col-lg-4 overflow-auto h-700px">
          <component
            :is="alarmComponent"
            :id="alarmId"
            :key="forceRerenderKey"
            :show-close-button="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onBeforeMount, onUnmounted } from "vue";
import CreateTroubleTicketForm from "@/components/trouble-ticket-components/forms/CreateTroubleTicketForm.vue";
import TroubleTicketElSteps from "@/components/trouble-ticket-components/header/TroubleTicketElSteps.vue";
import { AppConstants } from "@/constants/app-constants";
import NceAlarmDetailSide from "@/components/nce-components/NceAlarmDetailSide.vue";
import ObserviumAlarmDetailSide from "@/components/observium-components/ObserviumAlarmDetailSide.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import CreateTroubleTicketHeader from "@/components/trouble-ticket-components/header/CreateTroubleTicketHeader.vue";
import { ModuleName } from "@/store/enums/module-enum";
import {
  troubleTicketActions,
  troubleTicketMutations,
} from "@/store/enums/trouble-ticket-enum";
import {
  getAppTypeByNetworkType,
  getTroubleTicketSideAlarmComponent,
} from "@/core/helpers/utils";
import NceGponAlarmDetailSide from "@/components/nce-gpon-components/NceGponAlarmDetailSide.vue";

export default defineComponent({
  components: {
    CreateTroubleTicketHeader,
    CreateTroubleTicketForm,
    TroubleTicketElSteps,
  },
  props: {},
  setup(props) {
    const route = useRoute();
    const store = useStore();

    onBeforeMount(() => {
      store.dispatch(
        `${ModuleName.troubleTicket}/${troubleTicketActions.GET_STEPPER_DATA}`
      );
    });

    onUnmounted(() => {
      store.commit(
        `${ModuleName.troubleTicket}/${troubleTicketMutations.CLEAR_DATA}`
      );
    });

    const { appType, id } = route.params;

    const alarmComponent = ref(
      getTroubleTicketSideAlarmComponent(String(appType).toUpperCase())
    );

    const alarmId = ref(id);
    const forceRerenderKey = ref(0);
    return { alarmId, forceRerenderKey, alarmComponent };
  },
});
</script>
