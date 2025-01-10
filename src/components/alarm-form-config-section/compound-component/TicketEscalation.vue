<template>
  <div class="row">
    <div class="col-6">
      <basic-switch-input
        :name="'is_ticket_escalation'"
        v-model="is_ticket_escalation"
        :disabled="disabled"
      />
    </div>
    <div class="col-6" v-if="is_ticket_escalation">
      <basic-number-input
        :name="'ticket_escalation_delay'"
        v-model="ticket_escalation_delay"
        :disabled="disabled"
        :min="0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import BasicNumberInput from "@/components/shared/inputs/BasicNumberInput.vue";
import { ref, watch } from "vue";
import BasicSwitchInput from "@/components/shared/inputs/BasicSwitchInput.vue";
export default {
  components: {
    BasicNumberInput,
    BasicSwitchInput,
  },
  props: {
    value: {
      type: Object as () => {
        is_ticket_escalation: boolean;
        ticket_escalation_delay: number;
      },
      required: false,
      default: () => ({
        is_ticket_escalation: false,
        ticket_escalation_delay: 0,
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
    const is_ticket_escalation = ref<boolean>(props.value.is_ticket_escalation);
    const ticket_escalation_delay = ref<number>(
      props.value.ticket_escalation_delay
    );

    watch([is_ticket_escalation, ticket_escalation_delay], () => {
      const changeData: any = {
        name: "is_ticket_escalation",
        value: is_ticket_escalation.value,
      };
      ctx.emit("change", changeData);

      if (is_ticket_escalation.value) {
        changeData.name = "ticket_escalation_delay";
        changeData.value = ticket_escalation_delay.value;
      } else {
        ticket_escalation_delay.value = 0;
        changeData.name = "ticket_escalation_delay";
        changeData.value = ticket_escalation_delay.value;
      }

      ctx.emit("change", changeData);
    });

    return {
      is_ticket_escalation,
      ticket_escalation_delay,
    };
  },
};
</script>
