<template>
  <el-tooltip
    v-if="textToHandle?.length > textOverflowLimit"
    :content="textToHandle"
    :placement="contentPosition"
  >
    <span>{{ `${textToHandle?.slice(0, textOverflowLimit)} ....` }}</span>
  </el-tooltip>
  <span v-else>{{ textToHandle }}</span>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    textOverflowLimit: { type: Number, required: false, default: 30 },
    textToHandle: { type: String, required: true, default: "" },
    contentPosition: { type: String, default: "top" },
  },
});
</script>
