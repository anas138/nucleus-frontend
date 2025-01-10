<template>
  <div class="card-header">
    <div class="card-title" v-if="title">
      <h3 class="card-label fw-bold">Create Trouble Ticket</h3>
      <span class="text-muted fw-semobold fs-5"
        >( {{ title }} | {{ networkPresentationLayer }} Network )</span
      >
    </div>
    <div class="row col-12 align-items-center" v-else>
      <el-skeleton :rows="0" :count="1" animated />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent, computed } from "vue";
import { ModuleName } from "@/store/enums/module-enum";
import { useStore } from "vuex";
import { AppConstants } from "@/constants/app-constants";
import { appTypetoPresentationLayer } from "@/core/helpers/utils";

export default defineComponent({
  setup(props) {
    const store = useStore();
    const title = computed(() => {
      const alarm = store.getters[`${ModuleName.troubleTicket}/getAlarm`];
      return alarm?.native_probable_cause
        ? alarm.native_probable_cause
        : alarm?.device_hostname
        ? alarm?.device_hostname
        : alarm?.alarm_name
        ? alarm?.alarm_name
        : alarm?.alarm_filter_config?.alarm_name
        ? alarm?.alarm_filter_config?.alarm_name
        : "";
    });

    const networkPresentationLayer = computed(() => {
      const alarmDetail = store.getters[`${ModuleName.troubleTicket}/getAlarm`];
      return appTypetoPresentationLayer(
        alarmDetail?.alarm_filter_config?.app_type
      );
    });

    return { title, networkPresentationLayer };
  },
});
</script>
