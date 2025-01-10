<template>
  <el-steps
    :active="activeIndex"
    finish-status="finish"
    process-status="wait"
    align-center
    v-if="tt_status?.length"
  >
    <el-step
      v-for="(group, index) in tt_status"
      :key="group.key"
      :title="group.name"
      :description="
        group.timeStamp && index <= activeIndex - 1
          ? `at ${$format.datetimeFormat(group.timeStamp)} `
          : null
      "
    ></el-step>
  </el-steps>
  <div class="row col-12 justify-content-center" v-else>
    <div class="col-9">
      <el-skeleton :rows="1" animated>
        <template #template>
          <el-skeleton-item variant="text"></el-skeleton-item>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script lang="ts">
import ServerDropDownService from "@/core/services/ServerDropDownService";
import { dropDownsCategory } from "@/constants/drop-down-from-server";
import { useStore } from "vuex";
import { ModuleName } from "@/store/enums/module-enum";

import {
  ref,
  reactive,
  watch,
  onBeforeUnmount,
  computed,
  onMounted,
  defineComponent,
  Ref,
} from "vue";
import { TroubleTicketContants } from "@/constants/app-constants";

interface StatusLog {
  status: number;
  statusLog: {
    label: string;
  };
  created_at: string;
}

interface StepperData {
  id: number;
  label: string;
  timeStamp?: string;
}

interface TimeStampData {
  key: number;
  name: string;
  timeStamp: string | null;
}

interface TTStatus {
  key: number;
  name: string;
  timeStamp: string | null;
}

export default defineComponent({
  props: {
    selectedTicket: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  setup(props) {
    const store = useStore();

    const currentStatus = ref("");
    const statusLog: Ref<StatusLog[]> = ref([]);
    const stepperData: Ref<StepperData[]> = ref([]);
    const timeStampData: Ref<TimeStampData[]> = ref([]);
    const tt_status: Ref<TTStatus[]> = ref([]);
    const activeIndex = ref(0);

    // Fetch data from the store
    const fetchStoreData = () => {
      currentStatus.value =
        store.getters[
          `${ModuleName.troubleTicket}/getTicketData`
        ]?.currentStatus?.label?.toLowerCase() || "";
      statusLog.value =
        store.getters[`${ModuleName.troubleTicket}/getTicketData`]?.statusLog ||
        [];
      stepperData.value =
        store.getters[`${ModuleName.troubleTicket}/getStepper`] || [];
    };

    // Compute timeStampData
    const computeTimeStampData = () => {
      timeStampData.value = stepperData.value.map((val) => {
        statusLog.value.map((status) => {
          if (status.status === val.id) {
            val.timeStamp = status?.created_at;
          }
        });
        return {
          key: val.id,
          name: val.label,
          timeStamp: val?.timeStamp || null,
        };
      });
    };

    // Check status conditions
    const isStatus = (status) =>
      currentStatus.value ===
      TroubleTicketContants.STATUS[status].toLowerCase();

    // Compute tt_status
    const computeTTStatus = () => {
      if (isStatus("CANCELLED")) {
        tt_status.value = timeStampData.value.filter(
          (val) =>
            val.name.toLowerCase() ===
            TroubleTicketContants.STATUS.CANCELLED.toLowerCase()
        );
      } else if (isStatus("PAUSE")) {
        tt_status.value = timeStampData.value.filter(
          (val) =>
            val.name.toLowerCase() ===
            TroubleTicketContants.STATUS.PAUSE.toLowerCase()
        );
      } else if (
        statusLog.value.some(
          (status) =>
            status?.statusLog?.label.toLowerCase() ===
            TroubleTicketContants.STATUS.REOPENED.toLowerCase()
        )
      ) {
        const RCA_AWAITED = statusLog.value.some(
          (status) =>
            status?.statusLog?.label.toLowerCase() ===
            TroubleTicketContants.STATUS.RCA_AWAITED.toLowerCase()
        );
        if (RCA_AWAITED) {
          tt_status.value = timeStampData.value.filter(
            (val) =>
              val.name.toLowerCase() !==
                TroubleTicketContants.STATUS.CANCELLED.toLowerCase() &&
              val.name.toLowerCase() !==
                TroubleTicketContants.STATUS.PAUSE.toLowerCase()
          );
        } else {
          tt_status.value = timeStampData.value.filter(
            (val) =>
              val.name.toLowerCase() !==
                TroubleTicketContants.STATUS.RCA_AWAITED.toLowerCase() &&
              val.name.toLowerCase() !==
                TroubleTicketContants.STATUS.CANCELLED.toLowerCase() &&
              val.name.toLowerCase() !==
                TroubleTicketContants.STATUS.PAUSE.toLowerCase()
          );
        }
      } else {
        const RCA_AWAITED = statusLog.value.some(
          (status) =>
            status?.statusLog?.label.toLowerCase() ===
            TroubleTicketContants.STATUS.RCA_AWAITED.toLowerCase()
        );
        if (RCA_AWAITED) {
          tt_status.value = timeStampData.value.filter(
            (val) =>
              val.name.toLowerCase() !==
                TroubleTicketContants.STATUS.REOPENED.toLowerCase() &&
              val.name.toLowerCase() !==
                TroubleTicketContants.STATUS.CANCELLED.toLowerCase() &&
              val.name.toLowerCase() !==
                TroubleTicketContants.STATUS.PAUSE.toLowerCase()
          );
        } else {
          tt_status.value = timeStampData.value.filter(
            (val) =>
              val.name.toLowerCase() !==
                TroubleTicketContants.STATUS.RCA_AWAITED.toLowerCase() &&
              val.name.toLowerCase() !==
                TroubleTicketContants.STATUS.REOPENED.toLowerCase() &&
              val.name.toLowerCase() !==
                TroubleTicketContants.STATUS.CANCELLED.toLowerCase() &&
              val.name.toLowerCase() !==
                TroubleTicketContants.STATUS.PAUSE.toLowerCase()
          );
        }
      }
    };

    // Compute activeIndex
    const computeActiveIndex = () => {
      activeIndex.value =
        tt_status.value.findIndex(
          (val) => currentStatus.value === val.name.toLowerCase()
        ) + 1;
    };

    // Watch for changes in store data
    watch(
      () => store.getters[`${ModuleName.troubleTicket}/getStepper`],
      () => {
        fetchStoreData();
        computeTimeStampData();
        computeTTStatus();
      }
    );

    // Initialize the data
    fetchStoreData();
    computeTimeStampData();
    computeTTStatus();
    computeActiveIndex();

    return {
      activeIndex,
      tt_status,
    };
  },
});
</script>

<style>
.el-step__description {
  font-size: 11px;
}
</style>
