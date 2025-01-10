<template>
  <div class="row">
    <div class="col-6">
      <BasicSwitchInput
        :name="'record_status'"
        v-model="record_status"
        :disabled="disabled"
        :activeValue="'ACTIVE'"
        :inActiveValue="'INACTIVE'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from "vue";
import BasicSwitchInput from "@/components/shared/inputs/BasicSwitchInput.vue";
export default {
  components: {
    BasicSwitchInput,
  },
  props: {
    value: {
      type: Object as () => {
        record_status: string;
      },
      required: false,
      default: () => ({
        record_status: "ACTIVE",
      }), // Use a factory function
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["change"],
  setup(props, ctx) {
    const record_status = ref<string>(props.value.record_status);

    watch([record_status], () => {
      const changeData: any = {
        name: "record_status",
        value: record_status.value,
      };
      ctx.emit("change", changeData);
    });

    return {
      record_status,
    };
  },
};
</script>
