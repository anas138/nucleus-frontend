<template>
  <div
    class="d-flex py-6 flex-column justify-content-center align-items-center"
  >
    <img
      class="h-200px theme-light-show"
      src="/media/auth/chart-graph.png"
      alt=""
    />
    <img
      class="h-200px theme-dark-show"
      src="/media/auth/chart-graph-dark.png"
      alt=""
    />
    <h3 class="text-muted fs-5">No data available</h3>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup(props, { emit }) {
    return {};
  },
});
</script>
