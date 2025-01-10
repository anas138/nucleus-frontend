<template>
  <KTDatatable
    ref="tableRef"
    :header="visibleFields"
    :header-capitalize="true"
    :fetchCallBack="fetchData"
    :toolTipContent="toolTipContent"
    searchPlaceholder="Search Tickets"
    :key="tableKey"
    :showLoadingSpinner="showLoadingSpinner"
    :refreshKey="refreshKey"
    v-model:total-count="totalCount"
    :filter-options="ticketFilterConfig"
    :inputWithToolTipEnabled="true"
    :itemsPerPage="$dataTableSettings.PER_PAGE_LIMIT"
  >
    <template #custom-actions>
      <div
        class="d-flex border border-2 rounded align-items-center ps-3 me-3"
        v-if="showBulkUpdate && $hasPermission(bulkUpdatePermission)"
      >
        <el-switch
          v-model="isShowBulkUpdate"
          size="small"
          @change="
            (val) => {
              if (val === false) {
                bulkUpdateIdsArray = [];
              }
            }
          "
        /><span class="fs-6 ms-2 me-3 align-middle col-form-label"
          >{{ isShowBulkUpdate ? "Disable" : "Enable" }} Bulk Update</span
        >
        <el-badge
          :value="bulkUpdateIdsArray.length"
          :max="99"
          class="item"
          :type="'primary'"
          :hidden="bulkUpdateIdsArray.length > 0 ? false : true"
        >
          <span
            class="icon-link me-3"
            v-if="isShowBulkUpdate && bulkUpdateIdsArray.length"
            @click="() => (bulkUpdationModalVisible = true)"
            ><el-tooltip content="Update Bulk Tickets">
              <i
                class="fa-solid fa-circle-check text-success fs-2"
              ></i></el-tooltip
          ></span>
        </el-badge>
      </div>
      <TableColumnFiltration
        class="me-3"
        :tableColumnFiltrationKey="
          AppConstants.TABLE_FILTER_COLUMN_KEYS.TROUBLE_TICKET_LIST
        "
        :header-config-keys="headerConfig"
      />
    </template>
    <template v-slot:actions="{ row: troubleTicket }">
      <div class="d-flex gap-2">
        <span
          class="icon-link"
          @click="
            toggleTicketDrawer({
              id: troubleTicket.id,
              networkType: troubleTicket.network_type,
            })
          "
          ><el-tooltip content="Show Details"
            ><i class="bi-eye-fill me-2"></i></el-tooltip
        ></span>
        <span
          class="icon-link"
          @click="
            resumeTicket({
              id: troubleTicket?.id,
              current_pause_id: troubleTicket?.current_pause_id,
            })
          "
          v-if="
            troubleTicket?.status === pauseId &&
            troubleTicket?.createdByUser?.sub_department_id ===
              userInfo?.sub_department_id
          "
          ><el-tooltip content="Resume Ticket"
            ><ButtonSpinner v-if="loadingRowId === troubleTicket.id" /><i
              class="fa-solid fa-play"
              v-else
            ></i></el-tooltip
        ></span>
        <span
          class="icon-link"
          @click="$router.push(`/trouble-ticket/update/${troubleTicket.id}`)"
          v-if="handlePermissions(troubleTicket)"
          ><el-tooltip content="Update Ticket"
            ><i class="bi-pencil-square me-2"></i></el-tooltip
        ></span>
        <span
          class="icon-link"
          @click="assignToMe(troubleTicket.id)"
          v-if="$troubleTicketPermission(troubleTicket, userInfo)"
          ><el-tooltip content="Start Working"
            ><ButtonSpinner v-if="loadingRowId === troubleTicket.id" /><i
              class="fa-solid fa-briefcase me-2"
              v-else
            ></i></el-tooltip
        ></span>
        <span
          class="icon-link"
          :class="
            !$troubleTicketPermission(troubleTicket, userInfo) &&
            !handlePermissions(troubleTicket) &&
            'ms-8'
          "
          v-if="
            bulkUpdateIdsArray.findIndex((val) => val == troubleTicket.id) ==
              -1 && isShowBulkUpdate
          "
          @click="() => bulkUpdateIdsArray.push(troubleTicket.id)"
        >
          <i class="fa-regular fa-square"></i>
        </span>
        <span
          class="icon-link"
          :class="
            !$troubleTicketPermission(troubleTicket, userInfo) &&
            !handlePermissions(troubleTicket) &&
            'ms-8'
          "
          v-if="
            bulkUpdateIdsArray.findIndex((val) => val == troubleTicket.id) >=
              0 && isShowBulkUpdate
          "
          @click="
            () => {
              const index = bulkUpdateIdsArray.findIndex(
                (val) => val == troubleTicket.id
              );
              bulkUpdateIdsArray.splice(index, 1);
            }
          "
        >
          <i class="fa-solid fa-square-check"></i>
        </span>
      </div>
    </template>
    <template v-slot:priority_Level="{ row: troubleTicket }">
      <span
        v-html="TroubleTicketPriorityBadge(troubleTicket?.priorityLevel?.id)"
      ></span>
    </template>
    <template v-slot:ticket_generation_type="{ row: troubleTicket }">
      {{ troubleTicket?.ticketGenerationType?.label }}
    </template>
    <template v-slot:is_outage_occurred="{ row: troubleTicket }">
      <span
        class="badge badge-info cursor-pointer underline-hover"
        @click="() => toggleAccumulationModal(troubleTicket.id)"
        v-if="troubleTicket?.is_outage_occurred"
        >Accumulated</span
      >
      <span class="badge bg-light-danger text-danger" v-else>No</span>
    </template>
    <template v-slot:alarm_name="{ row: troubleTicket }">
      <div
        v-if="
          troubleTicket.app_type === AppConstants.APP_TYPE.NCE ||
          troubleTicket.app_type === AppConstants.APP_TYPE.NCE_GPON
        "
      >
        <TextOverflowHandler
          :text-to-handle="troubleTicket?.alarm_detail?.native_probable_cause"
          :text-overflow-limit="alarmTextLength"
        />
      </div>
      <div
        v-else-if="troubleTicket.app_type === AppConstants.APP_TYPE.OBSERVIUM"
      >
        <TextOverflowHandler
          :text-to-handle="troubleTicket?.alarm_detail?.alert_message"
          :text-overflow-limit="alarmTextLength"
        />
      </div>
      <div
        v-else-if="troubleTicket.app_type === AppConstants.APP_TYPE.NOKIA_TXN"
      >
        <TextOverflowHandler
          :text-to-handle="troubleTicket?.alarm_detail?.alarm_name"
          :text-overflow-limit="alarmTextLength"
        />
      </div>
      <div
        v-else-if="
          troubleTicket.app_type === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
        "
      >
        <TextOverflowHandler
          :text-to-handle="troubleTicket?.alarmFilterConfig?.alarm_name"
          :text-overflow-limit="alarmTextLength"
        />
      </div>
    </template>
    <template v-slot:device="{ row: troubleTicket }">
      <div
        v-if="
          troubleTicket.app_type === AppConstants.APP_TYPE.NCE ||
          troubleTicket.app_type === AppConstants.APP_TYPE.NCE_GPON ||
          troubleTicket.app_type === AppConstants.APP_TYPE.NOKIA_TXN
        "
      >
        {{ troubleTicket?.alarm_detail?.ne_name }}
      </div>
      <div
        v-else-if="troubleTicket.app_type === AppConstants.APP_TYPE.OBSERVIUM"
      >
        {{ troubleTicket?.alarm_detail?.device_hostname }}
      </div>
      <div
        v-else-if="
          troubleTicket.app_type === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
        "
      >
        {{ troubleTicket?.alarm_detail?.trunk_group }}
      </div>
    </template>
    <template v-slot:assigned_dept="{ row: troubleTicket }">
      {{ troubleTicket?.subDepartment?.name }}
    </template>
    <template v-slot:assigned_user="{ row: troubleTicket }">
      {{ troubleTicket?.assignedToUser?.full_name }}
    </template>
    <template v-slot:status="{ row: troubleTicket }">
      <div>
        <span
          v-html="
            TroubleTicketStatusBadge(
              troubleTicket?.currentStatus?.id,
              troubleTicket?.currentStatus?.label
            )
          "
          class="pe-2"
        >
        </span>
      </div>
    </template>
    <template v-slot:medium="{ row: troubleTicket }">
      {{ troubleTicket?.troubleTicketMedium?.label }}
    </template>
    <template v-slot:created_at="{ row: troubleTicket }">
      {{ $format.datetimeFormat(troubleTicket?.created_at) }}
    </template>
    <template v-slot:updated_at="{ row: troubleTicket }">
      {{ $format.datetimeFormat(troubleTicket?.updated_at) }}
    </template>
    <template v-slot:category="{ row: troubleTicket }">
      {{ troubleTicket?.troubleTicketCategory?.name }}
    </template>
    <template v-slot:sub_category="{ row: troubleTicket }">
      {{ troubleTicket?.troubleTicketSubCategory?.name }}
    </template>
    <template v-slot:total_tat="{ row: troubleTicket }">
      {{ troubleTicket?.total_tat }} ({{ troubleTicket?.tat_uom }})
    </template>
    <template v-slot:over_tat="{ row: troubleTicket }">
      <div>
        <span v-html="StatusBadge(troubleTicket?.over_tat)" class="pe-2">
        </span>
      </div>
    </template>
  </KTDatatable>
  <TroubleTicketAccumulationModal
    v-if="accumulationModalVisible"
    :key="forceRerenderKey"
    :trouble-ticket-id="accumulationTTId"
    :modalVisible="accumulationModalVisible"
    @modalDisable="() => (accumulationModalVisible = false)"
  />
  <TroubleTicketBulkUpdation
    :key="forceRerenderKeybulkUpdationModal"
    :modal-visible="bulkUpdationModalVisible"
    v-model:modal-disable="bulkUpdationModalVisible"
    :bulkUpdationButtonDisable="bulkUpdationButtonDisable"
    @bulkUpdationSubmit="bulkUpdationSubmit"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, VNodeRef, watch } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import {
  AlertForDelete,
  swalConfirmation,
} from "@/core/helpers/sweetAlert.utils";
import CurdApiService from "@/core/services/CurdApiService";
import { permissions } from "@/constants/permissions-constants";
import { AppConstants } from "@/constants/app-constants";
import ButtonSpinner from "@/components/shared/spinners/ButtonSpinner.vue";
import {
  TroubleTicketStatusBadge,
  TroubleTicketPriorityBadge,
  StatusBadge,
} from "@/core/helpers/utils";
import { QueryParams } from "@/core/interface/interfaces";
import { useStore } from "vuex";
import router from "@/router";
import TroubleTicketService from "@/core/services/TroubleTicketService";
import { ElNotificationSuccess } from "@/core/helpers/ElNotification.utils";
import { TroubleTicketContants } from "@/constants/app-constants";
import TroubleTicketAccumulationModal from "@/components/trouble-ticket-components/modals/TroubleTicketAccumulationModal.vue";
import TroubleTicketBulkUpdation from "../modals/TroubleTicketBulkUpdation.vue";
import TableColumnFiltration from "@/components/shared/TableColumnFiltration.vue";
import TextOverflowHandler from "@/components/shared/TextOverflowHandler.vue";

export default defineComponent({
  components: {
    KTDatatable,
    ButtonSpinner,
    TroubleTicketAccumulationModal,
    TroubleTicketBulkUpdation,
    TableColumnFiltration,
    TextOverflowHandler,
  },
  props: {
    ticketFilterConfig: { type: Object },
    refreshKey: { type: Number },
    status: { type: Number },
    requestParams: { type: String },
    showLoadingSpinner: { type: Boolean },
    showBulkUpdate: { type: Boolean },
  },
  emits: [
    "openTicketDrawer",
    "refreshKeyEmit",
    "update:totalCount",
    "enableAutoRefresh",
    "disableAutoRefresh",
  ],
  setup(props, { emit }) {
    const store = useStore();
    const isShowBulkUpdate = ref(false);
    const bulkUpdationModalVisible = ref(false);
    const bulkUpdationButtonDisable = ref(false);
    const bulkUpdateIdsArray = ref([]);
    const forceRerenderKeybulkUpdationModal = ref(0);
    const userInfo = computed(() => {
      const { id, sub_department_id } = store.getters.currentUser;
      return { id, sub_department_id };
    });

    const loadingRowId = ref<number | null>(null);
    const accumulationTTId = ref<number | null>(null);
    const accumulationModalVisible = ref<boolean>(false);
    const forceRerenderKey = ref<number>(0);

    const tableKey = ref(0);
    const tableRef = ref();

    const headerConfig = ref([
      {
        columnLabel: "Action",
        key: "actions",
      },
      {
        columnLabel: "Priority",
        key: "priority_Level",
      },
      {
        columnLabel: "Ticket No.",
        key: "ticket_number",
        sortEnabled: true,
      },
      {
        columnLabel: "Case Title",
        key: "case_title",
        textOverflow: true,
        textOverflowLimit: 60,
      },
      {
        columnLabel: "Generation Type",
        key: "ticket_generation_type",
      },
      { columnLabel: "Accumulated", key: "is_outage_occurred" },
      {
        columnLabel: "Created At",
        key: "created_at",
        sortEnabled: true,
      },
      {
        columnLabel: "Assigned to dept.",
        key: "assigned_dept",
      },
      {
        columnLabel: "Assigned To Resource",
        key: "assigned_user",
      },
      {
        columnLabel: "Status",
        key: "status",
        sortEnabled: true,
      },
      {
        columnLabel: "Alarm",
        key: "alarm_name",
        sortEnabled: true,
        textOverflow: true,
      },
      {
        columnLabel: "Device/Trunk Group",
        key: "device",
        sortEnabled: true,
        textOverflow: true,
      },
      {
        columnLabel: "Network Type",
        key: "network_type",
        sortEnabled: true,
      },
      {
        columnLabel: "Updated At",
        key: "updated_at",
      },
      {
        columnLabel: "Medium",
        key: "medium",
      },
      {
        columnLabel: "Category",
        key: "category",
      },
      {
        columnLabel: "Sub-Category",
        key: "sub_category",
      },
      { columnLabel: "Over TAT", key: "over_tat" },
      { columnLabel: "Total TAT", key: "total_tat" },
    ]);

    const visibleFields = computed(() => {
      const selectedFields = headerConfig.value.filter(
        (val: any) => val.visible == true
      );
      return selectedFields;
    });

    const toolTipContent =
      "Ticket no, Case Title, Network Type, Status, Alarm/Device name, Trunk Group";

    const totalCount = ref(0);

    watch(
      () => totalCount.value,
      (total) => {
        emit("update:totalCount", total);
      }
    );

    function toggleAccumulationModal(id: number) {
      accumulationTTId.value = id;
      accumulationModalVisible.value = true;
      forceRerenderKey.value++;
    }

    async function fetchData(queryParams?: QueryParams) {
      if (!queryParams?.status && props.status) {
        Object.assign(queryParams, { statusColumn: props.status });
      } else {
        if (queryParams?.status) {
          Object.assign(queryParams, {
            statusColumn: JSON.stringify([queryParams?.status]),
          });
          delete queryParams?.status;
        } else if (props.requestParams) {
          Object.assign(queryParams, { [props.requestParams]: true });
        }
      }

      if (queryParams?.search) {
        queryParams["searchColumn"] = queryParams?.search;
        delete queryParams?.search;
      }

      const resposne = await CurdApiService.getAll(
        `trouble-ticket`,
        queryParams
      );
      return resposne.data.data;
    }

    const handlePermissions = (troubleTicket) => {
      switch (troubleTicket.currentStatus.id) {
        case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.OPEN:
          return false;
        // return (
        //   troubleTicket?.createdByUser?.sub_department_id ===
        //   userInfo?.value?.sub_department_id
        // );
        case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.ASSIGNED:
          return (
            troubleTicket?.assigned_to_id === userInfo?.value?.id &&
            (troubleTicket?.sub_department_id ===
              userInfo?.value?.sub_department_id ||
              troubleTicket?.createdByUser?.sub_department_id ===
                userInfo?.value?.sub_department_id)
          );
        case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.RESOLVED:
          return (
            troubleTicket?.assigned_to_id === userInfo?.value?.id &&
            troubleTicket?.sub_department_id ===
              userInfo?.value?.sub_department_id
          );
        case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.RCA_AWAITED:
          return (
            troubleTicket?.assigned_to_id === userInfo?.value?.id &&
            (troubleTicket?.sub_department_id ===
              userInfo?.value?.sub_department_id ||
              troubleTicket?.createdByUser?.sub_department_id ===
                userInfo?.value?.sub_department_id)
          );
        case TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.REOPEN:
          return (
            troubleTicket?.assigned_to_id === userInfo?.value?.id &&
            (troubleTicket?.sub_department_id ===
              userInfo?.value?.sub_department_id ||
              troubleTicket?.createdByUser?.sub_department_id ===
                userInfo?.value?.sub_department_id)
          );
        default:
          return false;
      }
    };

    const bulkUpdationSubmit = async (val) => {
      try {
        const payload = {
          ids: bulkUpdateIdsArray.value,
          ...val,
        };

        bulkUpdationButtonDisable.value = true;

        const res = await TroubleTicketService.completeTicketInBulk(payload);

        ElNotificationSuccess(res.message);
        bulkUpdationButtonDisable.value = false;
        bulkUpdationModalVisible.value = false;
        isShowBulkUpdate.value = false;
        bulkUpdateIdsArray.value = [];
        forceRerenderKeybulkUpdationModal.value++;
        emit("refreshKeyEmit");
      } catch (error) {
        console.log(error);
        bulkUpdationButtonDisable.value = false;
      }
    };

    const assignToMe = async (id: number) => {
      swalConfirmation(
        "Are you sure you want to start working on this ticket?",
        async () => {
          try {
            loadingRowId.value = id;
            const res = await TroubleTicketService.assignToMe(id);
            ElNotificationSuccess(res.message);
            router.push({ path: `/trouble-ticket/update/${id}` });
          } catch (error) {
            loadingRowId.value = null;
          } finally {
            loadingRowId.value = null;
          }
        }
      );
    };

    const resumeTicket = async (payload) => {
      swalConfirmation(
        "Are you sure you want to resume this ticket ?",
        async () => {
          try {
            loadingRowId.value = payload?.id;
            const res = await TroubleTicketService.resumeTicket(
              payload?.current_pause_id,
              {
                ticketId: payload?.id,
              }
            );
            ElNotificationSuccess(res.message);
            emit("refreshKeyEmit");
            loadingRowId.value = null;
          } catch (error) {
            loadingRowId.value = null;
          } finally {
            loadingRowId.value = null;
          }
        }
      );
    };

    const toggleTicketDrawer = (data: any) => {
      emit("openTicketDrawer", data);
    };

    watch(
      () => props.refreshKey,
      (val) => {
        if (loadingRowId.value) {
          loadingRowId.value = null;
        }
      }
    );

    watch(
      () => isShowBulkUpdate.value,
      (val) => {
        if (val) {
          emit("disableAutoRefresh");
        } else {
          emit("enableAutoRefresh");
        }
      }
    );

    return {
      AppConstants,
      headerConfig,
      isShowBulkUpdate,
      bulkUpdationModalVisible,
      bulkUpdationButtonDisable,
      bulkUpdationSubmit,
      bulkUpdateIdsArray,
      toolTipContent,
      loadingRowId,
      totalCount,
      toggleTicketDrawer,
      assignToMe,
      resumeTicket,
      fetchData,
      tableKey,
      tableRef,
      permissions,
      userInfo,
      StatusBadge,
      visibleFields,
      accumulationTTId,
      toggleAccumulationModal,
      accumulationModalVisible,
      forceRerenderKey,
      handlePermissions,
      TroubleTicketStatusBadge,
      TroubleTicketPriorityBadge,
      forceRerenderKeybulkUpdationModal,
      bulkUpdatePermission: permissions.troubleTicket.bulk_update,
      pauseId: TroubleTicketContants.TROUBLE_TICKET_STATUS_IDS.PAUSE,
      alarmTextLength: AppConstants.TROUBLE_TICKET_LIST_ALARM_LENGTH,
    };
  },
});
</script>

<style scoped>
.underline-hover {
  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.underline-hover:hover {
  color: var(--kt-primary);
  text-decoration: underline;
}
</style>
