<template>
  <crud-view-layout>
    <template v-slot:body>
      <div class="row">
        <nce-gpon-alarm-detail-side
          :id="$route.params.id"
          :showHeader="false"
        ></nce-gpon-alarm-detail-side>
      </div>
    </template>
  </crud-view-layout>
</template>

<script>
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import NceAlarmDetailSide from "@/components/nce-components/NceAlarmDetailSide.vue";
import NceGponAlarmDetailSide from "@/components/nce-gpon-components/NceGponAlarmDetail.vue";
export default {
  components: { CrudViewLayout, NceGponAlarmDetailSide },
};
</script>

<style></style>
