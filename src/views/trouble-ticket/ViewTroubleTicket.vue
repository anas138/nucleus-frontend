<template>
  <CrudViewLayout
    :isLoading="isLoading"
    :show-app-toolbar="false"
    :custom-header="true"
  >
    <template #custom-header>
      <ViewTroubleTicketHeader
        trouble-ticket-title="Trouble Ticket Details"
        :is-view-page="true"
        @refresh-view-page="refreshUpdateHeaderHandler"
      />
    </template>
    <template #body>
      <TroubleTicketDetails :ticketId="ticketId" />
    </template>
  </CrudViewLayout>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  computed,
  watch,
} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { ModuleName } from "@/store/enums/module-enum";
import {
  troubleTicketActions,
  troubleTicketMutations,
} from "@/store/enums/trouble-ticket-enum";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import TroubleTicketDetails from "@/components/trouble-ticket-components/details/TroubleTicketDetails.vue";
import ViewTroubleTicketHeader from "@/components/trouble-ticket-components/header/ViewTroubleTicketHeader.vue";

export default defineComponent({
  components: {
    CrudViewLayout,
    TroubleTicketDetails,
    ViewTroubleTicketHeader,
  },
  setup(props) {
    const route = useRoute();
    const store = useStore();
    const ticketId = computed(() => route.params?.id);
    const isLoading = ref(true);

    const getTroubleTicket = async () => {
      isLoading.value = true;
      await store.dispatch(
        `${ModuleName.troubleTicket}/${troubleTicketActions.GET_TROUBLE_TICKET}`,
        ticketId.value
      );
      isLoading.value = false;
    };

    onUnmounted(() => {
      store.commit(
        `${ModuleName.troubleTicket}/${troubleTicketMutations.CLEAR_DATA}`
      );
    });

    watch(
      () => ticketId.value,
      async () => {
        if (ticketId.value) {
          await getTroubleTicket();
        }
      },
      { immediate: true }
    );

    const refreshUpdateHeaderHandler = async () => {
      await getTroubleTicket();
    };

    return {
      isLoading,
      ticketId,
      refreshUpdateHeaderHandler,
    };
  },
});
</script>
