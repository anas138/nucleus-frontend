<template>
  <el-drawer
    v-model="openDrawer"
    :size="width > 1000 ? '1000px' : '80%'"
    :close-on-click-modal="true"
  >
    <AddDashboardForm :isDrawer="true" @on-close="onCloseDrawer" />
  </el-drawer>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  computed,
  watch,
} from "vue";
import AddDashboardForm from "@/views/custom-dashboard/AddDashboardForm.vue";

export default defineComponent({
  components: { AddDashboardForm },
  props: {
    openAddDashboardDrawer: { type: Boolean, required: false, default: false },
  },
  emits: ["onClose"],
  setup(props, { emit }) {
    // ---------- logic for determining size of window
    const windowWidth = ref(window.innerWidth);
    const onWidthChange = () => (windowWidth.value = window.innerWidth);
    onUnmounted(() => window.removeEventListener("resize", onWidthChange));
    const width = computed(() => windowWidth.value);
    const openDrawer = ref(props.openAddDashboardDrawer);

    onMounted(() => {
      window.addEventListener("resize", onWidthChange);
    });

    const onCloseDrawer = () => {
      emit("onClose");
    };

    watch(
      () => props.openAddDashboardDrawer,
      (val) => {
        openDrawer.value = val;
      }
    );

    watch(
      () => openDrawer.value,
      (val) => {
        if (!val) {
          onCloseDrawer();
        }
      }
    );

    return {
      openDrawer,
      onCloseDrawer,
      width,
    };
  },
});
</script>
