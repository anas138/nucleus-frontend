<template>
  <OutageHeader
    :headerPresentationName="compomentChecker.headerPresentationName"
    :nmsCircuitId="nmsCircuitId"
    v-if="showHeader"
  />
  <component
    :is="compomentChecker.component"
    :header-config="headerConfig"
    :data-to-display="dataToDisplay"
  />
</template>
<script lang="ts">
import { ModuleName } from "@/store/enums/module-enum";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { OutageAlarmsHeaderConfig } from "./header-config/outage-alarms-header-config";
import { AppConstants } from "@/constants/app-constants";
import ObserviumOutageList from "@/components/trouble-ticket-components/trouble-ticket-list/app-type-outage-list/ObserviumOutageList.vue";
import OutageHeader from "@/components/trouble-ticket-components/trouble-ticket-list/app-type-outage-list/header/OutageHeader.vue";
export default defineComponent({
  components: { OutageHeader },
  props: { showHeader: { type: Boolean, default: true } },
  setup(props, { emit }) {
    const store = useStore();

    const nmsCircuitId =
      store.getters[`${ModuleName.troubleTicket}/getTicketData`]?.alarm_detail
        ?.nms_circuit_id;

    const outageAlarmAppType = {
      [AppConstants.APP_TYPE.OBSERVIUM]: {
        component: ObserviumOutageList,
        key: "observiumAlert",
        headerPresentationName: AppConstants.OBSERVIUM_PRESENTATION_NAME,
      },
    };

    const compomentChecker = computed(() => {
      const appType =
        store.getters[`${ModuleName.troubleTicket}/getTicketData`]?.app_type;
      return outageAlarmAppType[appType];
    });

    const headerConfig = computed(() => {
      const appType =
        store.getters[`${ModuleName.troubleTicket}/getTicketData`]?.app_type;
      return OutageAlarmsHeaderConfig[appType];
    });

    const dataToDisplay = computed(() => {
      try {
        const appType =
          store.getters[`${ModuleName.troubleTicket}/getTicketData`]?.app_type;
        const filterDataKey = outageAlarmAppType[appType].key;

        const data = store.getters[
          `${ModuleName.troubleTicket}/getTicketData`
        ]?.outageAlarms?.map((data: any) => {
          return data[filterDataKey];
        });

        return data;
      } catch (error) {
        return [];
      }
    });

    return {
      nmsCircuitId,
      headerConfig,
      dataToDisplay,
      compomentChecker,
    };
  },
});
</script>
