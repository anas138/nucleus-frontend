<template>
  <i class="fa-solid fa-circle-xmark icon" @click="emit('close')"></i>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["close"],
  setup(props, { emit }) {
    return { emit };
  },
});
</script>
<style scoped>
.icon {
  font-size: 1.7rem;
  color: white;
  cursor: pointer;
  transition: color 0.3s ease;
}

.icon:hover {
  color: rgb(127, 127, 127);
}
</style>
