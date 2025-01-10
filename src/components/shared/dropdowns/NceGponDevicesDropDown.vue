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
      :value="device.resource_id"
      :label="device.name"
    >
      {{ device.name }}
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue";
import NceService from "@/core/services/NceService";
import { INceNetworkElement } from "@/core/interface/nce-network-element-interface";
import NceGponService from "@/core/services/NceGponService";

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
    const devices = ref([] as INceNetworkElement[]);
    const selectedValue = ref(props.value);
    onMounted(async () => {
      const response: INceNetworkElement[] =
        await NceGponService.getAllDevices();
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
