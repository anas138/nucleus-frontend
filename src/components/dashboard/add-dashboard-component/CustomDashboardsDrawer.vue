<template>
  <div
    class="d-flex justify-content-start align-items-center dd__filters-container"
  >
    <button
      class="btn btn-outline btn-outline-primary"
      @click="openDrawer = true"
      style="position: relative"
    >
      <div class="d-flex justify-content-center align-items-center">
        <span class="mx-2">My Custom Dashboards</span>

        <span><i class="fa fa-chevron-down"></i></span>
      </div>
    </button>
    <el-drawer
      v-model="openDrawer"
      :size="'420px'"
      :close-on-click-modal="true"
    >
      <div class="card">
        <div class="card-header bg-primary text-white">
          <div class="card-title">
            <h3 class="text-white text-wrap">Your custom dashboards</h3>
          </div>
        </div>
        <div class="card-body">
          <div>
            <p class="tip text-wrap">
              You can save multiple Dashboard from `Add New Dashboard` button.
            </p>
            <div
              class="d-flex flex-column flex-lg-row justify-content-between mb-3"
            >
              <span class="text-wrap"
                ><i class="fa fa-list"></i> My Dashboards</span
              >
              <span
                class="text-wrap add_more_button-text"
                @click="() => (openAddDashboardDrawer = true)"
                ><i class="fa-solid fa-plus text-gray me-2"></i>Add New
                Dashboard</span
              >
            </div>
            <ul
              class="filters__list list-group"
              v-if="dashboardListFromStore.length"
            >
              <li
                :class="[
                  {
                    'filters__list__selected-item':
                      selectedDashboard.key === item.key,
                  },
                  'filters__list-item',
                  'list-group-item',
                ]"
                v-for="(item, index) in dashboardListFromStore"
                :key="`filter-item-${item.key}`"
              >
                <span
                  :class="[
                    {
                      'filters__list__selected-item-text':
                        selectedDashboard.key === item.key,
                    },
                    'filters__list-item-text text-wrap',
                  ]"
                  @click="
                    () => {
                      if (index !== 0) onSelectDrawerOption(item.key);
                    }
                  "
                >
                  {{ item.label }}</span
                >
                <span>
                  <i
                    class="fa fa-check-circle text-success"
                    v-if="selectedDashboard.key === item.key"
                  ></i>
                  <el-popconfirm
                    confirm-button-text="Yes"
                    cancel-button-text="No"
                    :icon="InfoFilled"
                    icon-color="#626AEF"
                    title="Are you sure to delete this?"
                    @confirm="deleteitem(item.key, index)"
                    v-if="index !== 0"
                  >
                    <template #reference>
                      <span class="ms-2"><i class="fa fa-trash"></i></span>
                    </template>
                  </el-popconfirm>
                </span>
              </li>
            </ul>
          </div>
          <div
            class="d-flex flex-column justify-content-center align-items-center"
            v-if="dashboardListFromStore.length == 0"
          >
            <img class="h-150px h-lg-300px" :src="$emptyDataImageUrl" alt="" />
            <h5 class="text-wrap">No Dashboard Saved Yet</h5>
            <button
              class="btn btn-primary mt-3"
              @click="() => (openAddDashboardDrawer = true)"
            >
              <i class="fa-solid fa-plus"></i> Add New
            </button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
  <add-dashboard-drawer
    :open-add-dashboard-drawer="openAddDashboardDrawer"
    @on-close="() => (openAddDashboardDrawer = false)"
    :key="openAddDashboardDrawer"
  />
</template>

<script lang="ts">
import { ref, watch, onMounted, computed, onUnmounted } from "vue";
import {
  deleteDashboard,
  getDashboardListData,
} from "@/core/services/CustomAppDashboardService";
import AddDashboardDrawer from "@/components/dashboard/add-dashboard-component/AddDashboardDrawer.vue";
import router from "@/router";
import { swalSuccess } from "@/core/helpers/sweetAlert.utils";
import { useStore } from "vuex";
import { ModuleName } from "@/store/enums/module-enum";
import { dashboardActions } from "@/store/enums/dashboard-enum";
import { ElNotificationSuccess } from "@/core/helpers/ElNotification.utils";

interface DashboardList {
  key: number;
  label: string;
}
export default {
  components: { AddDashboardDrawer },
  setup() {
    const store = useStore();
    const openDrawer = ref(false);
    const openAddDashboardDrawer = ref(false);
    const dashboardList = ref<DashboardList[]>([
      { key: 0, label: "Default Dashboard" },
    ]);
    const selectedDashboard = ref<DashboardList>({
      key: 0,
      label: "Default Dashboard",
    });

    const dashboardListFromStore = computed(
      () => store.getters[`${ModuleName.Dashboard}/getDashboardDrawerList`]
    );

    const methods = {
      async updateDashboardList() {
        await store.dispatch(
          `${ModuleName.Dashboard}/${dashboardActions.GET_ALL_DASHBOARDS}`
        );
      },

      onSelectDrawerOption(id) {
        router.push({
          name: "custom-dashboard",
          params: { id },
        });
      },

      async deleteitem(id, index) {
        const res = await deleteDashboard(id);
        this.updateDashboardList();
        ElNotificationSuccess(res.message);
      },
    };

    return {
      ...methods,
      openAddDashboardDrawer,
      dashboardList,
      dashboardListFromStore,
      selectedDashboard,
      openDrawer,
    };
  },
};
</script>

<style scoped>
.dd__filters-container {
  border-radius: 8px;
  padding: 4px 0;
  white-space: nowrap;
  /* background: #f5daab; */
}
.filters__list {
  list-style: none;
  margin-top: 0.8rem;
}
.filters__list-item {
  padding: 8px;
  display: flex;
  justify-content: space-between;
}
.filters__list__selected-item {
  background: var(--kt-light);
  cursor: pointer;
}
.filters__list__selected-item-text {
  font-weight: bold;
  color: var(--kt-dark);
}
.filters__list-item:hover {
  background: var(--kt-light);
  cursor: pointer;
}
.filters__list-item-text:hover {
  color: var(--kt-primary);
}

.add_more_button-text:hover {
  color: var(--kt-primary);
  cursor: pointer;
}

.add_more_button-text:hover .fa-solid {
  color: var(--kt-primary) !important;
}
</style>
