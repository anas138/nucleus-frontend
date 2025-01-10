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
      :value="
        typeof emitDataType == 'number' ? dropDownValue.id : dropDownValue.label
      "
      :label="dropDownValue.label"
    >
      {{ dropDownValue.label }}
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue";
import ServerDropDownService from "@/core/services/ServerDropDownService";
import { number } from "yup";
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
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    dropDownCatagory: {
      type: String,
      required: true,
    },
    value: {
      required: false,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: true,
    },
    emitDataType: {
      type: [Number, String],
      description:
        "string | integer (Emit circuit id if datatype is integer and circuit refrence no if data type is string)",
      default: "string",
    },
  },
  emits: ["change", "input"],
  setup(props, ctx) {
    const data = ref([] as string[]);
    const selectedValue = ref(props.value);
    onMounted(async () => {
      const response: string[] =
        await ServerDropDownService.getDropDownFromSever(
          props.dropDownCatagory
        );
      data.value = response;
    });
    watch(selectedValue, (newValue) => {
      ctx.emit("change", { value: newValue, name: props.name });
      ctx.emit("input", newValue);
    });
    return {
      data,
      selectedValue,
    };
  },
};
</script>

<style></style>
