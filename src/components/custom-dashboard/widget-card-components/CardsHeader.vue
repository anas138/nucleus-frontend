<template>
  <div class="card-header border-0 pt-5">
    <h3
      class="card-title align-items-start flex-column"
      v-if="!widgetTitleObject.editable"
    >
      <div class="d-flex align-items-center justify-content-center">
        <i
          class="fa-solid fa-arrow-trend-up me-3"
          v-if="widgetType == 'Trend'"
        ></i>
        <i class="fa-solid fa-list-ul me-3" v-else></i>
        <span class="card-label fw-bold fs-3 mb-1">{{
          widgetTitleObject.name || widgetType
        }}</span>
      </div>
      <div class="d-flex justify-content-center align-items-center">
        <el-tooltip
          v-if="alarmName?.length > alarmTextLength && width < 1700"
          :content="alarmName"
          placement="top"
        >
          <span class="text-muted fw-semobold fs-5">{{
            `${alarmName.slice(0, alarmTextLength)} ....... |`
          }}</span>
        </el-tooltip>
        <span v-else class="text-muted fw-semobold fs-5">{{
          `${alarmName} |`
        }}</span>
        <span class="text-muted fw-semobold fs-7 ms-1">{{
          subtitle || localSubtitle || `Showing overall data`
        }}</span>
      </div>
    </h3>
    <div v-else>
      <el-input
        class="w-250px me-5"
        type="textinput"
        placeholder="Edit Widget Name"
        :name="widgetTitleObject.editedName"
        v-model="widgetTitleObject.editedName"
        @keyup.enter="changeWidgetName"
      />
      <button
        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm mx-1"
        @click="changeWidgetName"
      >
        <i class="fa-solid fa-floppy-disk"></i>
      </button>
      <button
        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm mx-1"
        @click="
          () => {
            Object.assign(widgetTitleObject, {
              editedName: widgetTitleObject.name,
              editable: false,
            });
          }
        "
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div v-if="!widgetTitleObject.editable">
      <!-- Ellipsis button -->
      <button
        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
        type="button"
        id="widgetActionsDropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </button>

      <!-- Dropdown menu -->
      <div class="dropdown-menu" aria-labelledby="widgetActionsDropdown">
        <!-- Your actions buttons go here -->
        <button
          class="dropdown-item d-flex align-items-center"
          @click="() => (widgetTitleObject.editable = true)"
        >
          <i class="fa-solid fa-pen me-2" aria-hidden="true"></i>
          Edit Title
        </button>
        <button
          class="dropdown-item d-flex align-items-center"
          @click="() => emit('refreshWidget')"
        >
          <i class="fa fa-refresh me-2" aria-hidden="true"></i>
          Refresh
        </button>
        <button
          class="dropdown-item d-flex align-items-center"
          @click="deleteWidgetApi"
        >
          <i class="fa-solid fa-trash-can me-2" aria-hidden="true"></i>
          Delete Widget
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AppConstants } from "@/constants/app-constants";
import { ElNotificationSuccess } from "@/core/helpers/ElNotification.utils";
import { swalConfirmation } from "@/core/helpers/sweetAlert.utils";
import {
  deleteWiget,
  updateWidgetName,
} from "@/core/services/CustomAppDashboardService";
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onUnmounted,
  onMounted,
  watch,
} from "vue";

interface WidgetTitle {
  name: string;
  editedName: string;
  editable: boolean;
}

export default defineComponent({
  props: {
    widgetId: { type: Number, required: false },
    widgetTitle: { type: String, required: true },
    alarmName: { type: String, required: true },
    subtitle: { type: String, required: false, default: "" },
    widgetType: { type: String, required: true },
  },
  emits: ["refreshWidget", "widgetDeleted"],
  setup(props, { emit }) {
    const windowWidth = ref(window.innerWidth);
    const onWidthChange = () => (windowWidth.value = window.innerWidth);
    const width = computed(() => windowWidth.value);
    const localSubtitle = ref<string>("");

    const widgetTitleObject = reactive<WidgetTitle>({
      name: props.widgetTitle,
      editedName: props.widgetTitle,
      editable: false,
    });

    onUnmounted(() => window.removeEventListener("resize", onWidthChange));
    onMounted(() => {
      window.addEventListener("resize", onWidthChange);
    });
    const deleteWidgetApi = async () => {
      swalConfirmation("", async () => {
        const res = await deleteWiget(props.widgetId);
        ElNotificationSuccess(res.message);
        emit("widgetDeleted");
      });
    };

    const changeWidgetName = async () => {
      try {
        const res = await updateWidgetName(props.widgetId, {
          name: widgetTitleObject.editedName,
        });
        ElNotificationSuccess(res.message);
        Object.assign(widgetTitleObject, {
          name: res.data.name,
          editedName: res.data.name,
          editable: false,
        });
      } catch (error) {
        console.log(error);
      }
    };

    return {
      widgetTitleObject,
      localSubtitle,
      emit,
      width,
      deleteWidgetApi,
      changeWidgetName,
      alarmTextLength: AppConstants.CUSTOM_DASHBOARD_HEADER_ALARM_LENGTH,
    };
  },
});
</script>
