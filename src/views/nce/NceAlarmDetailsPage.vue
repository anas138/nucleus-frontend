<template>
  <crud-view-layout>
    <template v-slot:body>
      <div class="row">
        <nce-alarm-detail-side
          :id="$route.params.id"
          :showHeader="false"
        ></nce-alarm-detail-side>
      </div>
    </template>
  </crud-view-layout>
</template>

<script>
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import NceAlarmDetailSide from "@/components/nce-components/NceAlarmDetailSide.vue";
export default {
  components: { CrudViewLayout, NceAlarmDetailSide },
};
</script>

<style></style>
