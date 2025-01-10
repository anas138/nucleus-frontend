<template>
  <el-date-picker
    v-model="value"
    type="datetimerange"
    start-placeholder="Start date"
    end-placeholder="End date"
    :default-time="defaultTime"
    :format="AppConstants.DATE_FORMATS.DATETIME_FOR_FROM_TO_SELECTOR"
    style="width: auto"
    :disabled="disabled"
  />
</template>

<script lang="ts">
import { ref, watch, onMounted } from "vue";
import moment from "moment";
import { AppConstants } from "@/constants/app-constants";

interface TurnAroundTime {
  tat_start_time: Date;
  tat_end_time: Date;
}

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    turnAroundTime: {
      type: Object as () => TurnAroundTime,
      required: false,
      default: () => ({}),
    },
  },
  emits: ["change", "input"],
  setup(props, ctx) {
    const value = ref<TurnAroundTime[]>([]);
    const defaultTime = ref<[Date, Date]>([new Date(), new Date()]);

    // watch(
    //   () => props.turnAroundTime,
    //   (val: TurnAroundTime | null) => {
    //     if (val) {
    //       value.value = [val.tat_start_time, val.tat_end_time];
    //     }
    //   }
    // );

    // watch(value, (newValue) => {
    //   ctx.emit("change", {
    //     value: newValue && moment(newValue[0]).format(""),
    //     name: props.name + "From",
    //   });
    //   ctx.emit("change", {
    //     value: newValue && moment(newValue[1]).format(""),
    //     name: props.name + "To",
    //   });
    //   ctx.emit("input", newValue);
    // });
    return {
      value,
      defaultTime,
      AppConstants,
    };
  },
};
</script>

<style></style>
