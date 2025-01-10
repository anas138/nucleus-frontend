<template>
  <crud-view-layout>
    <template v-slot:body>
      <div class="row">
        <LDISoftswitchEMSAlarmDetail
          :id="$route.params.id"
          :showHeader="false"
        ></LDISoftswitchEMSAlarmDetail>
      </div>
    </template>
  </crud-view-layout>
</template>

<script>
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import LDISoftswitchEMSAlarmDetail from "@/components/ldi-softswitch-ems-components/LDISoftswitchEMSAlarmDetail";
export default {
  components: { CrudViewLayout, LDISoftswitchEMSAlarmDetail },
};
</script>

<style></style>
