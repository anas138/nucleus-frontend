<template>
  <el-switch
    v-model="selectedValue"
    :disabled="disabled"
    :style="style"
    :active-value="activeValue"
    :inactive-value="inActiveValue"
  />
</template>

<script lang="ts">
import { ref, watch } from "vue";
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {
      type: [Boolean, String],
      required: false,
      default: false,
    },
    style: {
      type: String,
      required: false,
      default: "",
    },
    activeValue: {
      required: false,
      type: [Boolean, String],
      default: true,
    },
    inActiveValue: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
  },
  emits: ["change", "input"],
  setup(props, ctx) {
    const selectedValue = ref(props.value);

    watch(selectedValue, (newValue) => {
      ctx.emit("change", { value: newValue, name: props.name });
      ctx.emit("input", newValue);
    });
    return {
      selectedValue,
    };
  },
};
</script>

<style></style>
