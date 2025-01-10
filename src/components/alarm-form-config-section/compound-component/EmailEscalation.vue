<template>
  <div class="row">
    <div class="col-6">
      <basic-switch-input
        :name="'is_email_escalation'"
        v-model="is_email_escalation"
        :disabled="disabled"
      />
    </div>
    <div class="col-6" v-if="is_email_escalation">
      <basic-number-input
        :name="'email_escalation_delay'"
        v-model="email_escalation_delay"
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
        is_email_escalation: boolean;
        email_escalation_delay: number;
      },
      required: false,
      default: () => ({
        is_email_escalation: false,
        email_escalation_delay: 0,
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
    const is_email_escalation = ref<boolean>(props.value.is_email_escalation);
    const email_escalation_delay = ref<number>(
      props.value.email_escalation_delay
    );

    watch([is_email_escalation, email_escalation_delay], () => {
      const changeData: any = {
        name: "is_email_escalation",
        value: is_email_escalation.value,
      };
      ctx.emit("change", changeData);

      if (is_email_escalation.value) {
        changeData.name = "email_escalation_delay";
        changeData.value = email_escalation_delay.value;
      } else {
        email_escalation_delay.value = 0;
        changeData.name = "email_escalation_delay";
        changeData.value = email_escalation_delay.value;
      }

      ctx.emit("change", changeData);
    });

    return {
      is_email_escalation,
      email_escalation_delay,
    };
  },
};
</script>
