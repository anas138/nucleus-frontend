<template>
  <el-input-number
    v-model="selectedValue"
    :placeholder="placeholder"
    :min="min"
    :disabled="disabled"
  />
</template>

<script lang="ts">
import { ref, watch } from "vue";
export default {
  props: {
    placeholder: {
      type: String,
      required: false,
      default: "Enter Number",
    },
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
      type: Number,
      required: false,
      default: 0,
    },
    min: {
      type: Number,
      required: false,
      default: 0,
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
