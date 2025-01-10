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
    departmentId: {
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
  emits: ["change", "input", "returnSubDepName"],
  setup(props, ctx) {
    const data = ref([] as basicDropDownListValue[]);
    const selectedValue = ref(props.value);
    onMounted(async () => {
      if (props.departmentId) {
        const response: basicDropDownListValue[] =
          await ServerDropDownService.getAllSubDepartmentsOfDepartmentForDropDown(
            props.departmentId
          );
        data.value = response;
      }
    });
    watch(selectedValue, (newValue) => {
      ctx.emit("change", { value: newValue, name: props.name });
      ctx.emit("input", newValue);
      ctx.emit(
        "returnSubDepName",
        data.value?.find((val) => val.key == newValue)?.label
      );
    });
    return {
      data,
      selectedValue,
    };
  },
};
</script>

<style></style>
