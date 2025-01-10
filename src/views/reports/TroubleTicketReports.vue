<template>
  <crud-view-layout>
    <template #body><TroubleTicketReportList /> </template>
  </crud-view-layout>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import TroubleTicketReportList from "@/components/trouble-ticket-components/trouble-ticket-list/TroubleTicketReportList.vue";

export default defineComponent({
  components: { CrudViewLayout, TroubleTicketReportList },
  setup() {
    return {};
  },
});
</script>
