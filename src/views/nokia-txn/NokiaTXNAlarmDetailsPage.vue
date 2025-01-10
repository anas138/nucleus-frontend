<template>
  <crud-view-layout>
    <template v-slot:body>
      <div class="row">
        <nokia-t-x-n-alarm-detail
          :id="$route.params.id"
          :showHeader="false"
        ></nokia-t-x-n-alarm-detail>
      </div>
    </template>
  </crud-view-layout>
</template>

<script>
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import NokiaTXNAlarmDetail from "@/components/nokia-txn-components/NokiaTXNAlarmDetail.vue";
export default {
  components: { CrudViewLayout, NokiaTXNAlarmDetail },
};
</script>

<style></style>
