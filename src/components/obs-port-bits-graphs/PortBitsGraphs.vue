<template>
  <div class="row">
    <h5 class="mb-3">Port Bits Traffic</h5>
    <div class="d-flex flex-wrap overflow-auto">
      <div
        class="flex-equal"
        v-for="(item, index) in graphPeriodTypes"
        :key="`graph-period-${index}`"
      >
        <port-bits-single-graph :periodType="item" :portId="portId" />
      </div>
    </div>
  </div>
</template>

<script>
import PortBitsSingleGraph from "./PortBitsSingleGraph.vue";
export default {
  components: { PortBitsSingleGraph },
  props: {
    portId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      graphPeriodTypes: [
        {
          period: "3600",
          label: "Last Hour",
        },
        {
          period: "86400",
          label: "Last Day",
        },
        {
          period: "604800",
          label: "1 Week",
        },
      ],
    };
  },
};
</script>

<style></style>
