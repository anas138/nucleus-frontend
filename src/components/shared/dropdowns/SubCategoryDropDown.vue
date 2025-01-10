<template>
  <el-select
    v-model="selectedValue"
    filterable
    :multiple="multiSelect"
    default-first-option
    :placeholder="placeholder"
    autocomplete="on"
    :disabled="disabled"
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
import { onMounted, ref, watch } from "vue";
import ServerDropDownService from "@/core/services/ServerDropDownService";
import { basicDropDownListValue } from "@/core/interface/interfaces";
export default {
  props: {
    categoryId: {
      type: Number,
      required: true,
    },
    placeholder: {
      type: String,
      required: false,
      default: "Select Sub Category",
    },
    name: {
      type: String,
      required: true,
    },
    clearDropDownValue: {
      type: Boolean,
      required: false,
      default: false,
    },
    multiSelect: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {
      required: false,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ["change", "input"],
  setup(props, ctx) {
    const data = ref([] as basicDropDownListValue[]);
    const selectedValue = ref(props.value);

    const reloadData = async () => {
      if (props.categoryId) {
        const response: basicDropDownListValue[] =
          await ServerDropDownService.getAllSubCategoriesForDropDown(
            props.categoryId
          );
        data.value = response;
      }
    };

    watch(
      () => props.categoryId,
      async (val) => {
        reloadData();
      },
      { immediate: true }
    );
    watch(
      () => props.clearDropDownValue,
      (val) => {
        selectedValue.value = null;
      }
    );
    watch(
      () => selectedValue.value,
      (newValue) => {
        ctx.emit("change", {
          value: typeof newValue === "string" ? null : newValue,
          name: props.name,
        });
        ctx.emit("input", typeof newValue === "string" ? null : newValue);
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
