<template>
  <crud-view-layout>
    <template v-slot:body>
      <div class="row">
        <observium-alarm-detail-side
          :id="$route.params.id"
          :showHeader="false"
        />
      </div>
    </template>
  </crud-view-layout>
</template>

<script>
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import ObserviumAlarmDetailSide from "@/components/observium-components/ObserviumAlarmDetailSide.vue";
export default {
  components: { CrudViewLayout, ObserviumAlarmDetailSide },
};
</script>

<style></style>
