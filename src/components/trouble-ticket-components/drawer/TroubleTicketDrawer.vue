<template>
  <el-drawer v-model="openDrawer" :size="'90%'" :close-on-click-modal="true">
    <CustomSpinner
      title="Please wait, loading trouble ticket details"
      v-if="isLoading"
    />
    <TroubleTicketDetails
      :isDrawerView="true"
      :ticketId="ticketId"
      :networkType="networkType"
      v-else
    />
  </el-drawer>
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
import CustomSpinner from "@/components/shared/CustomSpinner.vue";
import { useStore } from "vuex";
import { ModuleName } from "@/store/enums/module-enum";
import {
  troubleTicketActions,
  troubleTicketMutations,
} from "@/store/enums/trouble-ticket-enum";
import TroubleTicketDetails from "@/components/trouble-ticket-components/details/TroubleTicketDetails.vue";

export default defineComponent({
  components: { CustomSpinner, TroubleTicketDetails },
  props: {
    ticketId: {
      type: Number,
      required: true,
    },
    networkType: { type: String },
    openTroubleTicketDrawer: { type: Boolean, required: false, default: false },
  },
  emits: ["update:openDrawer"],
  setup(props, { emit }) {
    const store = useStore();
    // ---------- logic for determining size of window
    const windowWidth = ref(window.innerWidth);
    const onWidthChange = () => (windowWidth.value = window.innerWidth);
    onUnmounted(() => window.removeEventListener("resize", onWidthChange));
    const width = computed(() => windowWidth.value);
    const openDrawer = ref(props.openTroubleTicketDrawer);
    const isLoading = ref(true);

    const getTroubleTicket = async () => {
      if (props.ticketId) {
        await store.dispatch(
          `${ModuleName.troubleTicket}/${troubleTicketActions.GET_TROUBLE_TICKET}`,
          props.ticketId
        );
        isLoading.value = false;
      }
    };

    onUnmounted(() => {
      store.commit(
        `${ModuleName.troubleTicket}/${troubleTicketMutations.CLEAR_DATA}`
      );
    });

    onMounted(async () => {
      window.addEventListener("resize", onWidthChange);
      await getTroubleTicket();
    });

    watch(
      () => props.openTroubleTicketDrawer,
      (val) => {
        openDrawer.value = val;
      }
    );

    watch(
      () => openDrawer.value,
      (val) => {
        emit("update:openDrawer", val);
      }
    );

    return {
      isLoading,
      openDrawer,
      width,
    };
  },
});
</script>
