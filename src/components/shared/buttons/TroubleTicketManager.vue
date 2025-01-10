<template>
  <button
    class="d-flex align-items-center btn btn-outline btn-outline-primary me-3"
    @click="() => openTicket()"
    v-if="Object.keys(troubleTicketData).length"
  >
    <i class="fa-solid fa-flag fs-6 me-2"></i>
    <span class="fs-6 me-1">View Ticket </span>
    <span class="fs-6">( {{ troubleTicketData.ticket_number }} )</span>
  </button>
  <button
    class="d-flex align-items-center btn btn-outline btn-outline-primary me-3"
    @click="() => createTicket()"
    v-else-if="$hasPermission(troubleTicketCreatePermission)"
  >
    <i class="fa-solid fa-file-medical fs-6 me-2"></i>
    <span class="fs-6">Create Trouble Ticket</span>
  </button>
</template>
<script lang="ts">
import { permissions } from "@/constants/permissions-constants";
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    alarmId: { type: Number, required: true },
    appType: { type: String, required: true },
    troubleTicketData: { type: Object, required: true, default: () => ({}) },
  },
  setup(props) {
    // Open TT in new windows
    const openTicket = () => {
      window.open(
        `/trouble-ticket/view/${props.troubleTicketData?.id}`,
        "_blank"
      );
    };

    // Open create TT in new windows
    const createTicket = () => {
      window.open(
        `/trouble-ticket/${props.appType.toLowerCase()}/create/${props.alarmId}`
      );
    };

    return {
      openTicket,
      createTicket,
      troubleTicketCreatePermission: permissions.troubleTicket.create,
    };
  },
});
</script>
