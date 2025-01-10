<template>
  <el-select
    v-model="selectedValue"
    filterable
    :multiple="multiSelect"
    default-first-option
    :placeholder="placeholder"
    autocomplete="on"
    :clearable="clearable"
  >
    <el-option
      v-for="(alarm, alarmIndex) in Alarms"
      :key="alarmIndex"
      :value="alarm?.id"
      :label="alarm?.alarm_name"
    >
      {{ alarm?.alarm_name }}
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue";
import NceService from "@/core/services/NceService";
import NceGponService from "@/core/services/NceGponService";
import NokiaTXNService from "@/core/services/NokiaTXNService";
import LDISoftswitchEMSService from "@/core/services/LDISoftswitchEMSService";

export default {
  props: {
    placeholder: {
      type: String,
      required: false,
      default: "Select Alarms",
    },
    name: {
      type: String,
      required: true,
    },
    multiSelect: {
      type: Boolean,
      required: false,
      default: false,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ["change", "input"],
  setup(props, ctx) {
    const Alarms = ref([]);
    const selectedValue = ref();
    onMounted(async () => {
      const response = await LDISoftswitchEMSService.getAllAlarm();
      Alarms.value = response;
    });

    watch(selectedValue, (newValue) => {
      ctx.emit("change", { value: newValue, name: props.name });
      ctx.emit("input", newValue);
    });
    return {
      Alarms,
      selectedValue,
    };
  },
};
</script>

<style></style>
