<template>
  <el-input
    v-model="selectedValue"
    :placeholder="placeholder"
    :disabled="disabled"
  />
</template>

<script lang="ts">
import { ref, watch } from "vue";
import { string } from "yup/lib/locale";
export default {
  props: {
    placeholder: {
      type: String,
      required: false,
      default: "Enter Text",
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
      type: String,
      required: false,
      default: "",
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
