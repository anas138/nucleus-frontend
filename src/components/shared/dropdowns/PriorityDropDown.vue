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
      :value="dropDownValue.id"
      :label="dropDownValue.label"
    >
      <span v-html="TroubleTicketPriorityBadge(dropDownValue.id)"></span>
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue";
import ServerDropDownService from "@/core/services/ServerDropDownService";
import { dropDownsCategory } from "@/constants/drop-down-from-server";
import { TroubleTicketPriorityBadge } from "@/core/helpers/utils";

interface DropdownItem {
  id: string | number; // Adjust this based on the actual type of `id`
  name: string; // Add other properties based on your object structure
}
export default {
  props: {
    placeholder: {
      type: String,
      required: false,
      default: "Select Priority",
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
      default: false,
    },
    autoPick: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["change", "input"],
  setup(props, ctx) {
    const data = ref<DropdownItem[]>([]);
    const selectedValue = ref(props.value);
    onMounted(async () => {
      const response: DropdownItem[] =
        await ServerDropDownService.getDropDownFromSever(
          dropDownsCategory.TROUBLE_TICKET_PRIORITY
        );
      data.value = response;
      if (!props.value && props.autoPick) {
        selectedValue.value = data.value[data.value?.length - 1]?.id;
      }
    });
    watch(selectedValue, (newValue) => {
      ctx.emit("change", { value: newValue, name: props.name });
      ctx.emit("input", newValue);
    });
    return {
      data,
      selectedValue,
      TroubleTicketPriorityBadge,
    };
  },
};
</script>

<style></style>
