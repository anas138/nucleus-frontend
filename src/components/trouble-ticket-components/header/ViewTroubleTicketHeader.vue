<template>
  <div class="card-header">
    <div class="card-title" v-if="headerInfo">
      <i class="fa-regular fa-paper-plane mx-3 fs-3" />
      <h3 class="card-label fw-bold">{{ troubleTicketTitle }}</h3>
      <span class="text-muted fw-semobold fs-5 me-3">
        <el-tooltip
          v-if="
            headerInfo?.alarmName?.length > troubleTicketAlarmTextLength &&
            width < 1700
          "
          :content="headerInfo?.alarmName"
          placement="top"
        >
          <span class="text-muted fw-semobold fs-5 me-1">{{
            `( ${headerInfo?.alarmName.slice(
              0,
              troubleTicketAlarmTextLength
            )} .......`
          }}</span>
        </el-tooltip>
        <span v-else class="text-muted fw-semobold fs-5 me-1">{{
          `( ${headerInfo?.alarmName}`
        }}</span>
        | {{ networkPresentationLayer }} Network )</span
      >
      <span class="badge badge-info" v-if="troubleTicket?.is_outage_occurred">
        Accumulated Ticket | Outage Alarms:
        {{ troubleTicket?.outageAlarms?.length }}
      </span>
    </div>
    <div class="row col-5 align-items-center" v-else>
      <el-skeleton :rows="0" :count="4" animated />
    </div>
    <div class="d-flex justify-content-end align-items-center text-wrap">
      <button
        class="btn btn-primary me-3"
        type="button"
        :disabled="isSubmitting"
        @click="assignToMe"
        v-if="ticketAssignedMePermission"
      >
        Start Working
      </button>
      <button
        class="btn btn-danger me-3"
        type="button"
        :disabled="isSubmitting"
        @click="() => (cancelationModal = true)"
        v-if="ticketCancelPermission && !isUpdatePage"
      >
        Cancel Ticket
      </button>
      <button
        class="btn btn-primary"
        type="button"
        :disabled="isSubmitting"
        @click="resumeTicket"
        v-if="ticketResumePermission"
      >
        Resume Ticket
      </button>
    </div>
  </div>
  <TroubleTicketCancelModal
    :modal-visible="cancelationModal"
    v-model:modal-disable="cancelationModal"
    @cancelationSubmit="cancelTicket"
  />
</template>

<script lang="ts">
import {
  ref,
  reactive,
  defineComponent,
  computed,
  onUnmounted,
  onMounted,
} from "vue";
import { ModuleName } from "@/store/enums/module-enum";
import { useStore } from "vuex";
import { AppConstants, TroubleTicketContants } from "@/constants/app-constants";
import { swalConfirmation } from "@/core/helpers/sweetAlert.utils";
import TroubleTicketService from "@/core/services/TroubleTicketService";
import { ElNotificationSuccess } from "@/core/helpers/ElNotification.utils";
import router from "@/router";
import ButtonSpinner from "@/components/shared/spinners/ButtonSpinner.vue";
import TroubleTicketCancelModal from "@/components/trouble-ticket-components/modals/TroubleTicketCancelModal.vue";
import { PermissionsService } from "@/core/services/PermissionsService";
import { appTypetoPresentationLayer } from "@/core/helpers/utils";

export default defineComponent({
  components: { TroubleTicketCancelModal },
  props: {
    troubleTicketTitle: {
      type: String,
      default: "",
    },
    isUpdatePage: {
      type: Boolean,
      default: false,
    },
    isViewPage: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["refreshUpdatePage", "refreshViewPage"],
  setup(props, { emit }) {
    const store = useStore();
    const windowWidth = ref(window.innerWidth);
    const onWidthChange = () => (windowWidth.value = window.innerWidth);
    const width = computed(() => windowWidth.value);
    const headerInfo = computed(() => {
      try {
        const alarm = store.getters[`${ModuleName.troubleTicket}/getAlarm`];
        const ticketNumber =
          store.getters[`${ModuleName.troubleTicket}/getTicketData`]
            ?.ticket_number;
        return {
          ticketNumber,
          alarmName: alarm?.native_probable_cause
            ? alarm.native_probable_cause
            : alarm?.device_hostname
            ? alarm?.device_hostname
            : alarm?.alarm_name
            ? alarm?.alarm_name
            : alarm?.alarm_filter_config?.alarm_name
            ? alarm?.alarm_filter_config?.alarm_name
            : "",
        };
      } catch (error) {
        return null;
      }
    });

    onUnmounted(() => window.removeEventListener("resize", onWidthChange));
    onMounted(() => {
      window.addEventListener("resize", onWidthChange);
    });

    const cancelationModal = ref(false);

    const isSubmitting = ref(false);

    const userInfo = computed(() => {
      const { id, sub_department_id } = store.getters.currentUser;
      return { id, sub_department_id };
    });

    const troubleTicket = computed(
      () => store.getters[`${ModuleName.troubleTicket}/getTicketData`]
    );

    const networkPresentationLayer = computed(() => {
      return appTypetoPresentationLayer(troubleTicket.value?.app_type);
    });

    const ticketAssignedMePermission = computed(() => {
      return PermissionsService.troubleTicketPermission(
        troubleTicket.value,
        userInfo.value
      );
    });

    const ticketResumePermission = computed(() => {
      return (
        troubleTicket?.value?.status ===
          TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.PAUSE &&
        troubleTicket?.value?.createdByUser?.sub_department_id ===
          userInfo.value?.sub_department_id
      );
    });

    const ticketCancelPermission = computed(
      () => troubleTicket.value?.permissions?.can_cancel
    );

    const assignToMe = async () => {
      swalConfirmation(
        "Are you sure you want to start working on this ticket?",
        async () => {
          isSubmitting.value = true;
          const res = await TroubleTicketService.assignToMe(
            Number(troubleTicket?.value?.id)
          );
          ElNotificationSuccess(res.message);
          if (props.isUpdatePage) {
            emit("refreshUpdatePage");
          } else {
            router.push({
              path: `/trouble-ticket/update/${troubleTicket?.value?.id}`,
            });
          }
          isSubmitting.value = false;
        }
      );
    };

    const resumeTicket = async (payload) => {
      swalConfirmation(
        "Are you sure you want to resume this ticket ?",
        async () => {
          isSubmitting.value = true;
          const res = await TroubleTicketService.resumeTicket(
            troubleTicket?.value?.current_pause_id,
            {
              ticketId: troubleTicket?.value?.id,
            }
          );
          ElNotificationSuccess(res.message);
          if (props.isUpdatePage) {
            emit("refreshUpdatePage");
          } else {
            router.push({
              path: `/trouble-ticket/update/${troubleTicket?.value?.id}`,
            });
          }
          isSubmitting.value = false;
        }
      );
    };

    const cancelTicket = async (payload) => {
      swalConfirmation("Are you sure to cancel this ticket?", async () => {
        cancelationModal.value = false;
        isSubmitting.value = true;
        const res = await TroubleTicketService.cancelTicket(
          Number(troubleTicket?.value?.id),
          payload
        );
        ElNotificationSuccess(res.message);
        if (props.isViewPage) {
          emit("refreshViewPage");
        } else {
          router.push({
            path: `/trouble-ticket/view/${troubleTicket?.value?.id}`,
          });
        }
        isSubmitting.value = false;
      });
    };

    return {
      width,
      troubleTicket,
      headerInfo,
      assignToMe,
      resumeTicket,
      cancelTicket,
      isSubmitting,
      cancelationModal,
      networkPresentationLayer,
      ticketCancelPermission,
      ticketResumePermission,
      ticketAssignedMePermission,
      troubleTicketAlarmTextLength:
        AppConstants.TROUBLE_TICKET_HEADER_ALARM_LENGTH,
    };
  },
});
</script>
