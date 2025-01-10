<template>
  <el-dialog
    v-model="showModalLocal"
    :width="modalWidth"
    destroy-on-close
    center
    :show-close="false"
    @close="$emit('close')"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="header">
        <div :id="titleId" :class="titleClass"><slot name="header"></slot></div>

        <ModalCloseButton @close="close" />
      </div>
    </template>
    <template v-if="!loading">
      <slot name="body"></slot>
    </template>
    <el-skeleton v-else :rows="10" animated />
    <template v-slot:footer>
      <slot name="footer" v-if="!loading"></slot>
      <el-skeleton v-else :rows="2" animated />
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import ModalCloseButton from "@/components/shared/buttons/ModalCloseButton.vue";

export default defineComponent({
  name: "modal",
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    showModal: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  components: {
    ModalCloseButton,
  },
  emits: ["close"],
  setup(props, context) {
    const showModalLocal = ref(props.showModal);

    const modalWidth = ref("80%");

    const breakpoints = {
      small: "80%",
      medium: "60%",
      large: "50%",
    };

    let screenSize = "medium";
    const updateModalWidth = () => {
      if (window.innerWidth < 768) {
        screenSize = "small";
      } else if (window.innerWidth >= 1800) {
        screenSize = "large";
      }
      modalWidth.value = breakpoints[screenSize];
    };

    const windowResizeHandler = () => {
      updateModalWidth();
    };

    onMounted(() => {
      updateModalWidth();
      window.addEventListener("resize", windowResizeHandler);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", windowResizeHandler);
    });
    return {
      showModalLocal,
      modalWidth,
    };
  },
});
</script>
<style scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: normal;
}
.header__icon {
  font-size: 1.5rem;
  color: white;
}
</style>
