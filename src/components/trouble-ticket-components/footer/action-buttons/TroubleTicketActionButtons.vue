<template>
  <div v-if="!isReOpened">
    <div class="dropdown d-inline-flex">
      <button
        class="btn btn-danger dropdown-toggle text-wrap mt-3 me-3"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        @click="() => validate()"
        :disabled="buttonLoadingStatus !== null"
        v-if="
          ticketPermissions?.can_leave_ticket ||
          ticketPermissions?.can_cancel ||
          ticketPermissions?.can_sent_back ||
          ticketPermissions?.can_reopen_ticket
        "
      >
        <ButtonSpinner
          v-if="
            buttonLoadingStatus === buttonStatus.LEAVE ||
            buttonLoadingStatus === buttonStatus.CANCEL ||
            buttonLoadingStatus === buttonStatus.SEND_BACK ||
            buttonLoadingStatus === buttonStatus.RE_OPEN
          "
        />
        Send Back Actions
      </button>
      <ul
        class="dropdown-menu action-button-dropdown"
        aria-labelledby="dropdownMenuButton1"
      >
        <li v-if="ticketPermissions?.can_leave_ticket">
          <a
            class="dropdown-item cursor-pointer"
            @click="emit('leaveTicket', buttonStatus.LEAVE)"
            >Leave</a
          >
        </li>
        <li v-if="ticketPermissions?.can_cancel">
          <a
            class="dropdown-item cursor-pointer"
            @click="emit('cancelTicket', buttonStatus.CANCEL)"
            >Cancel</a
          >
        </li>
        <li v-if="ticketPermissions?.can_sent_back">
          <a
            class="dropdown-item cursor-pointer"
            @click="emit('sendBackTicket', buttonStatus.SEND_BACK)"
            >Send Back</a
          >
        </li>
        <li v-if="ticketPermissions?.can_reopen_ticket">
          <a
            class="dropdown-item cursor-pointer"
            @click="emit('reopenTicket', buttonStatus.RE_OPEN)"
            >Re-Open</a
          >
        </li>
      </ul>
    </div>
  </div>
  <div v-if="!isReOpened">
    <div
      class="d-inline-block align-middle cursor-pointer pt-3"
      :style="{
        'pointer-events': buttonLoadingStatus !== null ? 'none' : 'auto',
      }"
      @click="emit('RCAAwaited')"
      v-if="ticketPermissions?.can_resolve_ticket"
    >
      <el-switch :value="isRCAAwaited" /><span
        class="fs-6 ms-2 me-3 align-middle"
        >RCA Awaited?</span
      >
    </div>
    <div
      class="d-inline-block align-middle cursor-pointer pt-3"
      :style="{
        'pointer-events': buttonLoadingStatus !== null ? 'none' : 'auto',
      }"
      @click="emit('RCARequired', buttonStatus.RCA_REQUIRED)"
      v-if="ticketPermissions?.can_request_rca"
    >
      <el-switch :value="isRCAFlag" /><span class="fs-6 ms-2 me-3 align-middle"
        >Is RCA required?</span
      >
    </div>
    <button
      type="button"
      class="btn btn-primary mt-3 me-3"
      @click="emit('updateTicket', buttonStatus.UPDATE)"
      :disabled="buttonLoadingStatus !== null"
      v-if="ticketPermissions?.can_update_ticket"
    >
      <ButtonSpinner v-if="buttonLoadingStatus === buttonStatus.UPDATE" />Update
    </button>
    <button
      type="button"
      class="btn btn-primary mt-3 me-3"
      @click="emit('RCASubmit', buttonStatus.RCA_SUBMIT)"
      :disabled="buttonLoadingStatus !== null"
      v-if="ticketPermissions?.can_submit_rca"
    >
      <ButtonSpinner
        v-if="buttonLoadingStatus === buttonStatus.RCA_SUBMIT"
      />Submit RCA
    </button>
    <button
      type="button"
      class="btn btn-primary mt-3 me-3"
      @click="emit('pauseRequestTicket', buttonStatus.PAUSE_REQUEST)"
      :disabled="buttonLoadingStatus !== null"
      v-if="ticketPermissions?.can_pause"
    >
      <ButtonSpinner
        v-if="buttonLoadingStatus === buttonStatus.PAUSE_REQUEST"
      />Pause Request
    </button>
    <div class="dropdown d-inline-flex">
      <!-- Pause Actions dropdown -->
      <div>
        <button
          class="btn btn-primary dropdown-toggle text-wrap mt-3 me-3"
          type="button"
          id="pauseActionsDropdownButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          @click="() => validate()"
          :disabled="buttonLoadingStatus !== null"
          v-if="
            ticketPermissions?.can_approve_pause ||
            ticketPermissions?.can_cancel_pause
          "
        >
          <ButtonSpinner
            v-if="
              buttonLoadingStatus === buttonStatus.PAUSE_REQUEST_APPROVE ||
              buttonLoadingStatus === buttonStatus.PAUSE_REQUEST_CANCEL
            "
          />
          Pause Actions
        </button>
        <ul
          class="dropdown-menu action-button-dropdown"
          aria-labelledby="pauseActionsDropdownButton"
        >
          <!-- Pause Actions options -->
          <li v-if="ticketPermissions?.can_approve_pause">
            <a
              class="dropdown-item cursor-pointer"
              @click="
                emit(
                  'pauseRequestApproveTicket',
                  buttonStatus.PAUSE_REQUEST_APPROVE
                )
              "
              >Approve Pause Request</a
            >
          </li>
          <li v-if="ticketPermissions?.can_cancel_pause">
            <a
              class="dropdown-item cursor-pointer"
              @click="
                emit(
                  'cancelPauseRequestTicket',
                  buttonStatus.PAUSE_REQUEST_CANCEL
                )
              "
              >Reject Pause Request</a
            >
          </li>
        </ul>
      </div>
    </div>
    <button
      type="button"
      class="btn btn-primary mt-3 me-3"
      @click="emit('resolvedTicket', buttonStatus.RESOLVE)"
      :disabled="buttonLoadingStatus !== null"
      v-if="ticketPermissions?.can_resolve_ticket"
    >
      <ButtonSpinner
        v-if="buttonLoadingStatus === buttonStatus.RESOLVE"
      />Resolve
    </button>
    <button
      type="button"
      class="btn btn-success mt-3"
      @click="emit('completeTicket', buttonStatus.COMPLETE)"
      :disabled="buttonLoadingStatus !== null"
      v-if="ticketPermissions?.can_complete_ticket"
    >
      <ButtonSpinner
        v-if="buttonLoadingStatus === buttonStatus.COMPLETE"
      />Complete
    </button>
  </div>

  <div v-if="isReOpened"></div>
  <div v-if="isReOpened">
    <button
      type="button"
      class="btn btn-secondary mt-3 me-3"
      :disabled="buttonLoadingStatus !== null"
      @click="emit('isReOpenedCancel')"
    >
      Cancel
    </button>
    <button
      type="button"
      class="btn btn-primary mt-3"
      @click="emit('reopenTicket', buttonStatus.RE_OPEN)"
      :disabled="buttonLoadingStatus !== null"
      v-if="ticketPermissions?.can_reopen_ticket"
    >
      <ButtonSpinner
        v-if="buttonLoadingStatus === buttonStatus.RE_OPEN"
      />Assign
    </button>
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent, computed, watch } from "vue";
import { ModuleName } from "@/store/enums/module-enum";
import ButtonSpinner from "@/components/shared/spinners/ButtonSpinner.vue";
import { useStore } from "vuex";
import { TroubleTicketContants } from "@/constants/app-constants";

export default defineComponent({
  components: { ButtonSpinner },
  props: {
    validate: {
      type: Function,
      required: true,
    },
    buttonLoadingStatus: {
      type: String,
      required: true,
      default: null,
    },
    isReOpened: {
      type: Boolean,
      required: false,
      default: false,
    },
    isRCAFlag: { type: Boolean, required: false, default: false },
    isRCAAwaited: { type: Boolean, default: false },
  },
  emits: [
    "leaveTicket",
    "updateTicket",
    "resolvedTicket",
    "reopenTicket",
    "sendBackTicket",
    "completeTicket",
    "isReOpenedCancel",
    "cancelTicket",
    "RCARequired",
    "RCAAwaited",
    "RCASubmit",
    "pauseRequestTicket",
    "pauseRequestApproveTicket",
    "cancelPauseRequestTicket",
  ],
  setup(props, { emit }) {
    const store = useStore();
    const isRCARequired = ref<boolean>(props.isRCAFlag);
    const ticketPermissions = computed(
      () =>
        store.getters[`${ModuleName.troubleTicket}/getTicketData`]?.permissions
    );

    return {
      ticketPermissions,
      emit,
      isRCARequired,
      buttonStatus: TroubleTicketContants.BUTTON_STATUS,
    };
  },
});
</script>
<style scoped>
.action-button-dropdown {
  border: 1px solid;
  border-color: var(--kt-gray-500);
}
</style>
