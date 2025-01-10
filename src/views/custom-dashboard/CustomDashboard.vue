<template>
  <crud-view-layout
    :pageTitle="dashboardName"
    :editPageTitle="editPageTitle"
    :pageTitleFutherInfo="networkTypeToDisplay"
    :is-loading="isLoading"
    page-icon="fa-solid fa-chart-bar"
  >
    <template v-slot:actions>
      <div class="d-flex flex-stack w-100">
        <el-input
          class="w-250px me-5"
          type="textinput"
          placeholder="Edit Dashboard Name"
          :name="editDashboardName"
          v-model="editDashboardName"
          @keyup.enter="changeCustomDashboardName"
          v-if="editPageTitle"
        />
        <div v-show="!editPageTitle">
          <button
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm mx-3"
            @click="() => (editPageTitle = true)"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="/media/icons/duotune/art/art005.svg" />
            </span>
          </button>
          <AddWidgetForm
            :widget-id="id"
            :networkType="widgetDashboardData?.app_type"
            @widget-added="getDashboard"
          />
        </div>
        <div v-show="editPageTitle">
          <button
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm mx-1"
            @click="changeCustomDashboardName"
          >
            <i class="fa-solid fa-floppy-disk"></i>
          </button>
          <button
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm mx-1"
            @click="
              () => {
                editPageTitle = false;
                editDashboardName = dashboardName;
              }
            "
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </template>
    <template #body>
      <div class="row">
        <div
          class="col-12 col-xl-6 mb-3"
          v-for="(chartCard, index) in chartCards"
          :key="`chart-card-ip-${chartCard.title}`"
        >
          <CustomDashboardChartCard
            :widget-id="chartCards[index]?.widgetId"
            :title="chartCard.title"
            :alarm-name="chartCards[index]?.alarm_name"
            :is_cleared="chartCardParams.is_cleared"
            :networkType="types.networkType"
            :appType="types.appType"
            :alarm_filter_config_id="chartCards[index]?.alarm_config_id"
            custom-series-name="Alarms"
            :show-x-axis-labels="true"
            @widget-deleted="getDashboard"
            v-if="chartCard.widgetType == 'Trend'"
          />
          <CustomDashboardListCard
            :widget-id="chartCards[index]?.widgetId"
            :title="chartCard.title"
            :alarm-name="chartCards[index]?.alarm_name"
            :filter-against="filterAgainst"
            :networkType="types.networkType"
            :appType="types.appType"
            :alarm_filter_config_id="chartCards[index]?.alarm_config_id"
            @widget-deleted="getDashboard"
            v-else
          />
        </div>
      </div>
    </template>
  </crud-view-layout>
</template>
<script lang="ts">
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  onUnmounted,
  watch,
} from "vue";
import CustomDashboardChartCard from "@/components/custom-dashboard/CustomDashboardChartCard.vue";
import CustomDashboardListCard from "@/components/custom-dashboard/CustomDashboardListCard.vue";
import AddWidgetForm from "@/components/custom-dashboard/AddWidgetForm.vue";
import { AppConstants } from "@/constants/app-constants";
import {
  getWidgetByDashboard,
  updateDashboard,
} from "@/core/services/CustomAppDashboardService";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { ElNotificationSuccess } from "@/core/helpers/ElNotification.utils";
import SocketIoService from "@/core/services/SocketIoService";
import { ModuleName } from "@/store/enums/module-enum";
import { dashboardActions } from "@/store/enums/dashboard-enum";
import { PermissionsService } from "@/core/services/PermissionsService";
import router from "@/router";
import { appTypetoPresentationLayer } from "@/core/helpers/utils";

export default defineComponent({
  components: {
    CrudViewLayout,
    CustomDashboardChartCard,
    CustomDashboardListCard,
    AddWidgetForm,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const isLoading = ref<boolean>(true);
    const dashboardName = ref<string>("");
    const editPageTitle = ref<boolean>(false);

    const editDashboardName = ref<string>("");

    const widgetDashboardData = ref({});

    const chartCardParams = {
      is_cleared: 0,
    };

    // table card filter data object

    const filterAgainst = {
      alarmStatus: "uncleared",
    };

    // table card filter data object

    const types = ref({ networkType: "", appType: "" });

    const networkTypeToDisplay = computed(() => {
      return appTypetoPresentationLayer(types.value.appType);
    });

    const id = computed(() => route.params?.id);

    const getDashboard = async () => {
      try {
        const res = await getWidgetByDashboard(id.value);
        widgetDashboardData.value = res;
        if (
          res
          //  &&
          // (await PermissionsService.permissionChecker(res.network_type))
        ) {
          types.value = {
            networkType: res.network_type,
            appType: res.app_type,
          };
          dashboardName.value = res.name;
          editDashboardName.value = res.name;
          isLoading.value = false;

          chartCards.value = res?.app_dashboard_widget?.map((val) => {
            return {
              widgetId: val.id,
              title: val.name,
              widgetType: val.widgetType.label,
              alarm_config_id: val.alarm_config_id,
              alarm_name: val.alarmFilterConfig.alarm_name,
            };
          });
        }
        // else if (
        //   res &&
        //   !(await PermissionsService.permissionChecker(res.network_type))
        // ) {
        //   router.replace({ name: "403" });
        // }
        else {
          isLoading.value = false;
          // router.replace({ name: "404" });
        }
      } catch (error) {
        isLoading.value = false;
        console.log({ error });
      }
    };

    const changeCustomDashboardName = async () => {
      try {
        const res = await updateDashboard(id.value, {
          name: editDashboardName.value,
        });
        dashboardName.value = res.data.name;
        editDashboardName.value = res.data.name;
        await store.dispatch(
          `${ModuleName.Dashboard}/${dashboardActions.GET_ALL_DASHBOARDS}`
        );
        ElNotificationSuccess(res.message);
      } catch (error) {
        console.log(error);
      }
      editPageTitle.value = false;
    };

    watch(
      () => id.value,
      async () => {
        if (id.value) {
          isLoading.value = true;
          await getDashboard();
        }
      },
      { immediate: true }
    );

    const chartCards = ref([]);

    return {
      id,
      types,
      isLoading,
      chartCards,
      filterAgainst,
      dashboardName,
      editPageTitle,
      editDashboardName,
      networkTypeToDisplay,
      chartCardParams,
      getDashboard,
      changeCustomDashboardName,
      widgetDashboardData,
    };
  },
});
</script>
