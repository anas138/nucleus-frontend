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
      {{ `${alarm?.app_type}: ${alarm?.alarm_name}` }}
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue";
import NceService from "@/core/services/NceService";
import AlarmService from "@/core/services/AlarmService";

export default {
  props: {
    placeholder: {
      type: String,
      required: false,
      default: "Network Element",
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      required: false,
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
    const Alarms = ref([] as string[]);
    const selectedValue = ref(props.value);
    onMounted(async () => {
      const response = await AlarmService.getAllAlarmsNameDropDown();
      console.log({ response });

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
