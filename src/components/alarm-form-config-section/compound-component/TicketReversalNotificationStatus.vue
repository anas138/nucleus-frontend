<template>
  <div class="row">
    <div class="col-6">
      <BasicSwitchInput
        :name="'can_revert_ticket_on_alarm_recovery'"
        v-model="can_revert_ticket_on_alarm_recovery"
        :disabled="disabled"
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
        can_revert_ticket_on_alarm_recovery: boolean;
      },
      required: false,
      default: () => ({
        can_revert_ticket_on_alarm_recovery: false,
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
    const can_revert_ticket_on_alarm_recovery = ref<boolean>(
      props.value.can_revert_ticket_on_alarm_recovery
    );

    watch([can_revert_ticket_on_alarm_recovery], () => {
      const changeData: any = {
        name: "can_revert_ticket_on_alarm_recovery",
        value: can_revert_ticket_on_alarm_recovery.value,
      };
      ctx.emit("change", changeData);
    });

    return {
      can_revert_ticket_on_alarm_recovery,
    };
  },
};
</script>
