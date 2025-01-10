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
import { AppConstants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";
import { PermissionsService } from "@/core/services/PermissionsService";
import { ref, watch, onMounted } from "vue";

interface NetworkType {
  key: string;
  label: string;
}

export default {
  props: {
    placeholder: {
      type: String,
      required: false,
      default: "Select a Network Type",
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
    const txPermission = permissions.nce.network;
    const ipPermission = permissions.observium.network;
    const gponPermission = permissions.nceGpon.network;
    const ldiSoftswitchEMSPermission = permissions.ldiSoftswitchEMS.network;
    const data = ref<NetworkType[]>([]);
    const selectedValue = ref(props.value);

    const TRANSMISSION = {
      key: AppConstants.NETWORK_TYPE.TRANSMISSION,
      label: AppConstants.NETWORK_TYPE.TRANSMISSION.toUpperCase(),
    };

    const OBSERVIUM = {
      key: AppConstants.NETWORK_TYPE.IP,
      label: AppConstants.NETWORK_TYPE.IP.toUpperCase(),
    };

    const NCE_GPON = {
      key: AppConstants.NETWORK_TYPE.GPON,
      label: AppConstants.NETWORK_TYPE.GPON.toUpperCase(),
    };

    const LDI_SOFTSWITCH_EMS = {
      key: AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH,
      label: AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH.toUpperCase(),
    };

    watch(selectedValue, (newValue) => {
      ctx.emit("change", { value: newValue, name: props.name });
      ctx.emit("input", newValue);
    });

    onMounted(() => {
      if (PermissionsService.hasPermission(txPermission)) {
        data.value.push(TRANSMISSION);
      }
      if (PermissionsService.hasPermission(ipPermission)) {
        data.value.push(OBSERVIUM);
      }
      if (PermissionsService.hasPermission(gponPermission)) {
        data.value.push(NCE_GPON);
      }
      if (PermissionsService.hasPermission(ldiSoftswitchEMSPermission)) {
        data.value.push(LDI_SOFTSWITCH_EMS);
      }
    });

    return {
      data,
      selectedValue,
    };
  },
};
</script>

<style></style>
