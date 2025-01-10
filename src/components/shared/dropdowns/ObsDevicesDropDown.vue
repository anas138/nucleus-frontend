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
      v-for="(device, deviceIndex) in devices"
      :key="deviceIndex"
      :value="device.device_id"
      :label="device.hostname"
    >
      {{ device.hostname }}
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue";
import ObserviumService from "@/core/services/ObserviumService";

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
    value: { type: [Number || String], required: false },
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
    const devices = ref([]);
    const selectedValue = ref(props.value);
    onMounted(async () => {
      const response = await ObserviumService.getAllDevices();
      devices.value = response;
    });

    watch(selectedValue, (newValue) => {
      ctx.emit("change", {
        value: newValue,
        name: props.name,
      });
      ctx.emit("input", newValue);
    });
    return {
      devices,
      selectedValue,
    };
  },
};
</script>

<style></style>
