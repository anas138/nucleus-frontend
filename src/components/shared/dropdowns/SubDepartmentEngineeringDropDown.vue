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
import { makeListForDropDowm } from "@/core/helpers/utils";

export default {
  props: {
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
  emits: ["change", "input", "returnSubDepName", "departmentId"],
  setup(props, ctx) {
    const data = ref([] as basicDropDownListValue[]);
    const selectedValue = ref(props.value);
    onMounted(async () => {
      const response =
        await ServerDropDownService.getAllSubDepartmentsOfEngineeringForDropDown();

      response?.sub_departments?.forEach((val) => {
        if (val.users && val.users.length) {
          val.name = `${val.name} ( ${val?.users[0]?.email} )`;
        }
        return val;
      });

      const transformedDataForSubDepartments: basicDropDownListValue[] =
        makeListForDropDowm(response.sub_departments);
      data.value = transformedDataForSubDepartments;
      ctx.emit("departmentId", response.id);
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
