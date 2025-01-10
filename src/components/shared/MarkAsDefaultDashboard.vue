<template>
  <div class="d-flex border border-2 rounded align-items-center p-2">
    <el-switch v-model="markAsDefaultDashboard" size="small" /><span
      class="fs-7 ms-2"
      >{{ markAsDefaultDashboard ? "Unset" : "Set" }} as Default Dashboard</span
    >
  </div>
</template>
<script>
import { Mutations } from "@/store/enums/StoreEnums";
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    const defaultDashboardRoute = store.getters.getDefaultDashboard;

    const markAsDefaultDashboard = ref(
      defaultDashboardRoute === route.path ? true : false
    );
    watch(
      () => markAsDefaultDashboard.value,
      (val) => {
        if (val) {
          store.commit(Mutations.SET_DEFAULT_DASHBOARD, route.path);
        } else {
          store.commit(Mutations.SET_DEFAULT_DASHBOARD, "");
        }
      }
    );
    return { markAsDefaultDashboard };
  },
});
</script>
