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
      v-for="(dropDownValue, index) in data"
      :key="index"
      :value="dropDownValue.key"
      :label="dropDownValue.label"
    >
      {{ dropDownValue.label }}
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { ref, watch } from "vue";

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
    multiSelect: {
      type: Boolean,
      required: false,
      default: false,
    },
    list: {
      type: Array,
      required: true,
    },
    value: {
      required: false,
      default: "",
    },
    clearable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ["change", "input"],
  setup(props, ctx) {
    const data = ref(props.list);
    const selectedValue = ref(props.value);
    watch(selectedValue, (newValue) => {
      ctx.emit("change", { value: newValue, name: props.name });
      ctx.emit("input", newValue);
    });

    watch(
      () => props.list,
      (newVal) => {
        data.value = newVal;
      }
    );

    return {
      data,
      selectedValue,
    };
  },
};
</script>

<style></style>
