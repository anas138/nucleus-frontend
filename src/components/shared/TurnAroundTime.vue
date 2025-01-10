<template>
  <div class="row col-12 mb-6">
    <label class="col-form-label fw-semobold fs-6 required col-md-2">TAT</label>
    <div
      class="col-md-8 d-flex align-items-center"
      v-if="troubleTicketCategoryId && !isLoading"
    >
      <span class="badge badge-info">
        {{ tatData.tat }} {{ tatData.tatType }}
      </span>
      <span class="col-form-label fs-7 ms-1"
        >| {{ $format.datetimeFormat(tatData.tat_start_time) }} -
        {{ $format.datetimeFormat(tatData.tat_end_time) }}</span
      >
    </div>
    <div class="col-md-4 fv-plugins-message-container" v-else>
      <div class="fv-help-block">No category Selected</div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, watch, onMounted, defineComponent } from "vue";
import TroubleTicketService from "@/core/services/TroubleTicketService";

interface Tat {
  tat_start_time: Date | null;
  tat_end_time: Date | null;
  tat: number | null;
  tatType: string;
}

export default defineComponent({
  components: {},
  props: {
    troubleTicketCategoryId: { type: Number, required: true },
  },
  setup(props) {
    const isLoading = ref(true);
    const tatData = ref<Tat>({
      tat_start_time: null,
      tat_end_time: null,
      tat: null,
      tatType: "",
    });

    const getTat = async () => {
      try {
        const res = await TroubleTicketService.getCategoryTurnAroundTime(
          props.troubleTicketCategoryId
        );
        tatData.value = res;
        isLoading.value = false;
      } catch (error) {
        console.log(error);
      }
    };

    watch(
      () => props.troubleTicketCategoryId,
      (val) => {
        if (val) {
          getTat();
        }
      }
    );

    return { tatData, isLoading };
  },
});
</script>
