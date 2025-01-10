<script lang="ts">
import { defineComponent, onBeforeMount, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { dashboardActions } from "@/store/enums/dashboard-enum";
import { ModuleName } from "@/store/enums/module-enum";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();

    const getAllDashboardList = async () => {
      await store.dispatch(
        `${ModuleName.Dashboard}/${dashboardActions.GET_ALL_DASHBOARDS}`
      );
    };

    onBeforeMount(async () => {
      getAllDashboardList();
    });

    // watch(
    //   () => route.path,
    //   () => {
    //     getAllDashboardList();
    //   },
    //   {
    //     immediate: true,
    //   }
    // );
  },
});
</script>
