<template>
  <el-date-picker
    v-model="value"
    type="datetimerange"
    start-placeholder="Start date"
    end-placeholder="End date"
    :default-time="defaultTime"
    :format="AppConstants.DATE_FORMATS.DATETIME_FOR_FROM_TO_SELECTOR"
    v-if="!QuickOptions"
  />
  <el-date-picker
    v-model="value"
    type="datetimerange"
    start-placeholder="Start date"
    end-placeholder="End date"
    :default-time="defaultTime"
    :format="AppConstants.DATE_FORMATS.DATETIME_FOR_FROM_TO_SELECTOR"
    :shortcuts="dateRangeQuickOptions"
    v-else
  />
</template>

<script lang="ts">
import { ref, watch } from "vue";
import moment from "moment";
import { AppConstants } from "@/constants/app-constants";
import { dateRangeQuickOptions } from "@/constants/date-range-constant";

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    QuickOptions: {
      type: Boolean,
      required: false,
      default: false,
    },
    prefix: {
      type: Boolean,
      required: false,
      default: false,
    },
    singleKey: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["change", "input"],
  setup(props, ctx) {
    const value = ref("");
    const defaultTime = ref<[Date, Date]>([new Date(), new Date()]);
    watch(value, (newValue) => {
      if (props.singleKey) {
        ctx.emit("change", { value: newValue, name: props.name });
      } else {
        ctx.emit("change", {
          value: newValue && moment(newValue[0]).format(""),
          name: props.prefix ? "from" + props.name : props.name + "From",
        });
        ctx.emit("change", {
          value: newValue && moment(newValue[1]).format(""),
          name: props.prefix ? "to" + props.name : props.name + "To",
        });
      }
      ctx.emit("input", newValue);
    });
    return {
      value,
      defaultTime,
      AppConstants,
      dateRangeQuickOptions,
    };
  },
};
</script>

<style></style>
