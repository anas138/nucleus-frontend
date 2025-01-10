<template>
  <custom-spinner padding=".65rem" type="bounce" v-if="isLoading" />
  <TroubleTicketCountsCard :cardData="cards" v-else />
</template>
<script>
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import CustomSpinner from "@/components/shared/CustomSpinner.vue";
import TroubleTicketCountsCard from "./TroubleTicketCountsCard.vue";
import TroubleTicketService from "@/core/services/TroubleTicketService";

export default defineComponent({
  components: { CustomSpinner, TroubleTicketCountsCard },
  props: {
    refreshkey: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    const isLoading = ref(true);

    const cards = reactive({});

    const getTroubleTicketStatsCounts = async () => {
      try {
        const res = await TroubleTicketService.getTroubleTicketStatsCounts();

        Object.assign(cards, res);
      } catch (error) {
        console.log(error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      getTroubleTicketStatsCounts();
    });

    watch(
      () => props.refreshkey,
      () => {
        getTroubleTicketStatsCounts();
      }
    );

    return { isLoading, cards };
  },
});
</script>
