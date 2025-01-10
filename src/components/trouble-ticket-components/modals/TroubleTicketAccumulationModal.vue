<template>
  <el-dialog v-model="dialogFormVisible" :show-close="false" width="80%">
    <template #header="{ close, titleId, titleClass }">
      <div
        class="d-flex justify-content-between align-items-center py-2"
        v-if="Object.keys(headerDetails).length"
      >
        <div
          class="d-flex align-items-center"
          :id="titleId"
          :class="titleClass"
        >
          <i class="fa-solid fa-plug-circle-xmark fs-2 text-white mb-1"></i>
          <h2 class="fw-bold mx-3 mb-1 text-white">
            {{ headerDetails?.headerPresentationName }} Outage
          </h2>
          <span class="fw-semobold fs-5 text-white"
            >(Circuit ID # {{ headerDetails?.nmsCircuitId }})</span
          >
        </div>
        <ModalCloseButton @close="close" />
      </div>
      <div class="row col-12 align-items-center" v-else>
        <el-skeleton :rows="0" :count="1" animated />
      </div>
    </template>

    <CustomSpinner
      title="Please wait, loading accumulated list details"
      v-if="isLoading"
    />
    <TroubleTicketOutageAlarmsList :showHeader="false" v-else />

    <template #footer> </template>
  </el-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  computed,
  onUnmounted,
} from "vue";
import { AppConstants } from "@/constants/app-constants";
import ModalCloseButton from "@/components/shared/buttons/ModalCloseButton.vue";
import _ from "lodash";
import { useStore } from "vuex";
import { ModuleName } from "@/store/enums/module-enum";
import {
  troubleTicketActions,
  troubleTicketMutations,
} from "@/store/enums/trouble-ticket-enum";
import CustomSpinner from "@/components/shared/CustomSpinner.vue";
import TroubleTicketOutageAlarmsList from "../trouble-ticket-list/TroubleTicketOutageAlarmsList.vue";

interface headerDetailsInterface {
  headerPresentationName?: string;
  nmsCircuitId?: string | number;
}

export default defineComponent({
  components: {
    ModalCloseButton,
    CustomSpinner,
    TroubleTicketOutageAlarmsList,
  },
  props: {
    troubleTicketId: {
      type: Number,
      required: true,
    },
    modalVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  emits: ["modalDisable"],
  setup(props, { emit }) {
    const store = useStore();
    let config = reactive([]);
    const dialogFormVisible = ref(props.modalVisible);
    const isLoading = ref<boolean>(true);

    const headerDetails = ref<headerDetailsInterface>({});

    const outageAlarmAppType = {
      [AppConstants.APP_TYPE.OBSERVIUM]: {
        headerPresentationName: AppConstants.OBSERVIUM_PRESENTATION_NAME,
      },
    };

    const fetchData = async () => {
      if (props.troubleTicketId) {
        await store.dispatch(
          `${ModuleName.troubleTicket}/${troubleTicketActions.GET_TROUBLE_TICKET}`,
          props.troubleTicketId
        );
        isLoading.value = false;
      }
    };

    // onUnmounted(() => {
    //   store.commit(
    //     `${ModuleName.troubleTicket}/${troubleTicketMutations.CLEAR_DATA}`
    //   );
    // });

    onMounted(() => {
      fetchData();
    });

    watch(
      () => dialogFormVisible.value,
      (val) => {
        if (!val) {
          emit("modalDisable");
        }
      }
    );

    watch(
      () => store.getters[`${ModuleName.troubleTicket}/getTicketData`],
      (data) => {
        if (data) {
          Object.assign(headerDetails.value, {
            headerPresentationName:
              outageAlarmAppType[data?.app_type].headerPresentationName,
            nmsCircuitId: data?.alarm_detail?.nms_circuit_id,
          });
        }
      }
    );

    const showModalLocal = ref(true);
    return {
      config,
      isLoading,
      headerDetails,
      showModalLocal,
      dialogFormVisible,
      AppConstants,
    };
  },
});
</script>
