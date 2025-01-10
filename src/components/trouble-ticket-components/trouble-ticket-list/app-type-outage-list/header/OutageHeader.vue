<template>
  <div class="d-flex align-items-center pt-7 pb-4">
    <i class="fa-solid fa-plug-circle-xmark fs-2 mb-1"></i>
    <h2 class="fw-bold mx-3 mb-0">{{ headerPresentationName }} Outage</h2>
    <span class="text-muted fw-semobold fs-5"
      >(Circuit ID # {{ nmsCircuitId }})</span
    >
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  components: {},
  props: {
    headerPresentationName: { type: String, required: true, default: "" },
    nmsCircuitId: { type: Number, required: true },
  },
  setup(props, { emit }) {
    return {};
  },
});
</script>
