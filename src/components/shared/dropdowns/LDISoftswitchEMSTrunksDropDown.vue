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
      v-for="(trunkGroup, trunkGroupIndex) in trunkGroups"
      :key="trunkGroupIndex"
      :value="
        typeof emitDataType == 'number' ? trunkGroup.id : trunkGroup.trunk_name
      "
      :label="trunkGroup.trunk_name"
    >
      {{ trunkGroup.trunk_name }}
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue";
import NceService from "@/core/services/NceService";
import { INceNetworkElement } from "@/core/interface/nce-network-element-interface";
import NceGponService from "@/core/services/NceGponService";
import NokiaTXNService from "@/core/services/NokiaTXNService";
import { INokiaTXNNetworkElement } from "@/core/interface/nokia-txn-network-element-interface";
import LDISoftswitchEMSService from "@/core/services/LDISoftswitchEMSService";
import { ILDISoftswitchEMSTrunkGroup } from "@/core/interface/ldi-softswitch-ems-trunk-group-interface";

export default {
  props: {
    placeholder: {
      type: String,
      required: false,
      default: "Select Trunks",
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
    emitDataType: {
      type: [Number, String],
      default: "string",
    },
  },
  emits: ["change", "input"],
  setup(props, ctx) {
    const trunkGroups = ref([] as ILDISoftswitchEMSTrunkGroup[]);
    const selectedValue = ref(props.value);
    onMounted(async () => {
      const response: ILDISoftswitchEMSTrunkGroup[] =
        await LDISoftswitchEMSService.getAllTrunks();
      trunkGroups.value = response;
    });

    watch(selectedValue, (newValue) => {
      ctx.emit("change", {
        value: newValue,
        name: props.name,
      });
      ctx.emit("input", newValue);
    });
    return {
      trunkGroups,
      selectedValue,
    };
  },
};
</script>

<style></style>
