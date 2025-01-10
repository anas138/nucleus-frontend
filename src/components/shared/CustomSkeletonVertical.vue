<template>
  <el-skeleton animated>
    <template #template>
      <div class="d-flex justify-content-center">
        <el-skeleton-item
          v-for="item in numberOfItems"
          :key="`el-skl-item-${item}`"
          variant="h3"
          :style="{ width: itemWidth, height: itemHeight }"
          class="mx-7"
        />
      </div>
    </template>
  </el-skeleton>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    itemWidth: String,
    itemHeight: String,
    numberOfItems: Number,
  },
});
</script>
