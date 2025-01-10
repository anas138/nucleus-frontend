<template>
  <crud-view-layout>
    <template v-slot:title-help>
      <span class="d-flex justify-content-center align-items-center">
        <realtime-alarms-icon />
        (Live Alarms from {{ $LDISoftswitchEMSPresentationName }} Monitoring
        NMS)
        <button
          class="btn btn-primary btn-icon ms-3"
          type="button"
          @click="setPlayAlarmSound()"
        >
          <i
            class="fa"
            :class="canPlayAlarmSound ? 'fa-volume-high' : 'fa-volume-xmark'"
          ></i>
        </button>
      </span>
    </template>
    <template v-slot:actions>
      <button class="btn btn-primary me-3" @click="incrementRefresh">
        <i class="fa fa-refresh" aria-hidden="true"></i>
      </button>
    </template>
    <template v-slot:body>
      <div class="row">
        <div :class="{ 'col-md-8 border-end': rowAlarmId > 0 }">
          <KTDataTable
            :header="visibleFields"
            :fetchCallBack="fetchData"
            :inputWithToolTipEnabled="true"
            :searchPlaceholder="searchPlaceholder"
            toolTipContent="Trunk group, State, Type"
            :searchStringHandler="searchStringHandler"
            :filterOptions="LDISoftswitchEMSFilterConfig"
            :filterDataManipulator="applyFilterDataManipulator"
            :itemsPerPage="$dataTableSettings.PER_PAGE_LIMIT"
            :enableSearchInputLoading="true"
            :searchEnabled="false"
            :table-bordered="true"
            :table-hover="false"
            :refreshKey="refreshKey"
          >
            <template #custom-actions>
              <TableColumnFiltration
                class="me-3"
                :tableColumnFiltrationKey="
                  AppConstants.TABLE_FILTER_COLUMN_KEYS
                    .LDI_SOFTSWITCH_EMS_ALARM_LIST
                "
                :header-config-keys="headerConfig"
              />
            </template>
            <template v-slot:actions="{ row: alarm }">
              <div class="d-flex gap-2">
                <span class="icon-link" @click="toggleEmailModal(alarm)"
                  ><el-tooltip content="Send Email"
                    ><i class="bi-send-fill me-2"></i></el-tooltip
                ></span>
                <span
                  class="icon-link"
                  @click="
                    $router.push(
                      `/trouble-ticket/${AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS.toLowerCase()}/create/${
                        alarm.id
                      }`
                    )
                  "
                  v-if="$hasPermission(troubleTicketCreatePermission)"
                  ><el-tooltip content="Generate TT"
                    ><i class="fa-solid fa-file-medical me-2"></i></el-tooltip
                ></span>
                <span class="icon-link" @click="sideAlarmtoggle(alarm.id)"
                  ><el-tooltip content="Show Details"
                    ><i class="bi-eye-fill me-2"></i></el-tooltip
                ></span>
              </div>
            </template>
            <template v-slot:severity="{ row: alarm }">
              <span
                v-html="LDISoftswitchEMSAlarmSeverityBadge(alarm.severity)"
              ></span>
            </template>
            <template v-slot:alarm_name="{ row: alarm }">
              <TextOverflowHandler
                :text-to-handle="alarm?.alarm_filter_config?.alarm_name"
                :text-overflow-limit="60"
              />
            </template>
            <template v-slot:category="{ row: alarm }">
              <p>{{ alarm.category }}</p>
            </template>
            <template v-slot:trunk_group="{ row: alarm }">
              <router-link
                to=""
                @click="toggleModal(alarm.id)"
                class="text-underline"
              >
                <span>{{ alarm.trunk_group }}</span>
              </router-link>
            </template>
            <!-- <template v-slot:ip_address="{ row: alarm }">
              {{ alarm?.nceGponNetworkElement?.ip_address }}
            </template> -->
            <template v-slot:created_on="{ row: alarm }">
              {{ $format.datetimeFormat(alarm.created_on) }}
            </template>
            <template v-slot:cleared_on="{ row: alarm }">
              {{ $format.datetimeFormat(alarm.cleared_on) }}
            </template>
          </KTDataTable>
        </div>
        <div :class="{ 'col-md-4': rowAlarmId > 0 }" v-if="rowAlarmId > 0">
          <LDISoftswitchEMSAlarmDetailSide
            :id="rowAlarmId"
            :key="forceRerenderKey"
            @close-window="rowAlarmId = 0"
          />
        </div>
      </div>
    </template>
  </crud-view-layout>

  <LDISoftswitchEMSAlarmDetailModal
    v-if="modalAlarmId"
    :id="modalAlarmId"
    :key="forceRerenderKey"
  />
  <alarm-emails
    v-if="alarmEmailData.alarmId"
    :subject="alarmEmailData.subject"
    :to="alarmEmailData.to"
    :cc="alarmEmailData.cc"
    :title="`${$LDISoftswitchEMSPresentationName} Alarm Email`"
    :htmlTemplate="
      alarmEmailService.getEmailTemplate(
        'ldi-softswitch',
        alarmEmailData.alarmId
      )
    "
    :sendEmailFunction="
      (data) => {
        sendEmailFunction(data);
      }
    "
    @close="closeAllModal"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import { QueryParams } from "@/core/interface/interfaces";
import {
  getSeverityCellColorByAppType,
  LDISoftswitchEMSAlarmSeverityBadge,
  toastForSendEmail,
} from "@/core/helpers/utils";
import { LDISoftswitchEMSFilterConfig } from "./filter-config";
import { AppConstants } from "@/constants/app-constants";
import { useStore } from "vuex";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import AlarmEmails from "@/components/emails/EmailTemplate.vue";
import AlarmEmailService from "@/core/services/AlarmEmailService";
import { ISendEmailBody } from "@/core/interface/send-email-body";
import { useRefresh } from "@/core/hooks/refresh";
import RealtimeAlarmsIcon from "@/components/shared/RealtimeAlarmsIcon.vue";
import { alarmEmailModel } from "@/core/model/email-models";
import { permissions } from "@/constants/permissions-constants";
import TableColumnFiltration from "@/components/shared/TableColumnFiltration.vue";
import { ModuleName } from "@/store/enums/module-enum";
import { AppNotificationsMutations } from "@/store/enums/app-notifications-enum";
import {
  ldiSoftswitchEMSActions,
  ldiSoftswitchEMSMutations,
} from "@/store/enums/ldi-softswitch-ems-enums";
import LDISoftswitchEMSAlarmDetailModal from "@/components/ldi-softswitch-ems-components/LDISoftswitchEMSAlarmDetailModal.vue";
import LDISoftswitchEMSAlarmDetailSide from "@/components/ldi-softswitch-ems-components/LDISoftswitchEMSAlarmDetailSide.vue";
import TextOverflowHandler from "@/components/shared/TextOverflowHandler.vue";
import LDISoftswitchEMSAlarmService from "@/core/services/LDISoftswitchEMSAlarmService";

export default defineComponent({
  name: "ldi-softswitch-Alarms-list",
  components: {
    KTDataTable,
    CrudViewLayout,
    LDISoftswitchEMSAlarmDetailModal,
    AlarmEmails,
    LDISoftswitchEMSAlarmDetailSide,
    RealtimeAlarmsIcon,
    TableColumnFiltration,
    TextOverflowHandler,
  },
  setup() {
    const headerConfig = ref([
      {
        key: "actions",
        columnLabel: "Actions",
      },
      {
        columnLabel: "Severity",
        key: "severity",
        sortEnabled: true,
        boxColor: getSeverityCellColorByAppType(
          AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
        ),
      },
      {
        columnLabel: "Alarm ID",
        key: "ems_alarm_id",
      },
      {
        columnLabel: "Trunk Group",
        key: "trunk_group",
      },
      {
        columnLabel: "Alarm Name",
        key: "alarm_name",
      },
      {
        columnLabel: "Type",
        key: "type_txt",
      },
      {
        columnLabel: "Subtype",
        key: "subtype_txt",
      },
      {
        columnLabel: "State",
        key: "message_state",
      },
      {
        columnLabel: "Error Code",
        key: "error_code",
      },
      {
        columnLabel: "Ip Address",
        key: "source_ip",
        sortEnabled: true,
      },
      {
        key: "created_on",
        columnLabel: "Occured On",
        sortEnabled: true,
      },
      {
        key: "cleared_on",
        columnLabel: "Cleared On",
      },
    ]);

    const visibleFields = computed(() => {
      const selectedFields = headerConfig.value.filter(
        (val: any) => val.visible == true
      );
      return selectedFields;
    });

    const searchPlaceholder = `Search LDI Alarms`;
    const store = useStore();
    const modalAlarmId = ref<number>(0);
    const forceRerenderKey = ref(0);
    const alarmEmailService = new AlarmEmailService();
    const rowAlarmId = ref(0);
    const alarmEmailData = ref(alarmEmailModel);
    const troubleTicketCreatePermission = permissions.troubleTicket.create;
    const ldiSoftswitchEMSAlarmsCount = computed(
      () => store.getters.getLDISoftswitchEMSAlarmsCount
    );

    const unSeenAlarmNotificationCount = computed(
      () =>
        store.getters[
          `${ModuleName.appNotifications}/getAlarmNotificationCount`
        ]
    );

    onUnmounted(() => {
      store.commit("enableLDISoftswitchEMSAlarmsBgMode");
    });

    onMounted(() => {
      if (unSeenAlarmNotificationCount.value > 0) {
        store.commit(
          `${ModuleName.appNotifications}/${AppNotificationsMutations.SUBTRACT_FROM_TOTAL_ALARMS_COUNTS}`,
          ldiSoftswitchEMSAlarmsCount.value
        );
      }
      store.commit("disableLDISoftswitchEMSAlarmsBgMode");
      store.commit("clearLDISoftswitchEMSAlarmsCount");
    });

    async function fetchData(queryParams?: QueryParams) {
      await store.dispatch(
        ldiSoftswitchEMSActions.GET_ALL_LDI_SOFTSWITCH_EMS_ALARMS,
        queryParams
      );
      return store.getters.ldiSoftswitchEMSAlarms;
    }

    function applyFilterDataManipulator(data) {
      store.commit(
        ldiSoftswitchEMSMutations.SET_LDI_SOFTSWITCH_EMS_FILTERS,
        data
      );
      return data;
    }

    function toggleModal(id: number) {
      closeAllModal();
      modalAlarmId.value = id;
      forceRerenderKey.value++;
    }

    // this is added because if in future we want to manipulate the results of
    // search like in filter
    // e.g commiting it to store
    function searchStringHandler(search: string) {
      return search;
    }

    async function toggleEmailModal(alarm) {
      closeAllModal();
      alarmEmailData.value.subject = `[${alarm?.trunk_group}] - ${alarm?.alarm_filter_config?.alarm_name}`;
      const recipients =
        await LDISoftswitchEMSAlarmService.getAlarmEmailRecipientsFromId(
          alarm.id
        );
      alarmEmailData.value.to = recipients.to;
      alarmEmailData.value.cc = recipients.cc;
      alarmEmailData.value.alarmId = alarm.id; // email opening logic
    }

    async function sendEmailFunction(data: ISendEmailBody) {
      const response = await alarmEmailService.sendEmail(
        "ldi-softswitch",
        alarmEmailData.value.alarmId,
        data
      );
      // this will close modal
      alarmEmailData.value.alarmId = 0;
      toastForSendEmail(response, "Email Sent Successfully");
    }

    function sideAlarmtoggle(id: number) {
      closeAllModal();
      rowAlarmId.value = id;
      forceRerenderKey.value++;
    }

    function closeAllModal() {
      modalAlarmId.value = 0;
      alarmEmailData.value.alarmId = 0;
    }

    const canPlayAlarmSound = computed(
      () => store.getters.getCanPlayLDISoftswitchEMSSound
    );
    const setPlayAlarmSound = () =>
      store.commit("toggleCanPlayLDISoftswitchEMSSound");
    return {
      headerConfig,
      searchPlaceholder,
      fetchData,
      LDISoftswitchEMSAlarmSeverityBadge,
      LDISoftswitchEMSFilterConfig,
      applyFilterDataManipulator,
      troubleTicketCreatePermission,
      toggleModal,
      modalAlarmId,
      forceRerenderKey,
      searchStringHandler,
      toggleEmailModal,
      alarmEmailData,
      alarmEmailService,
      sendEmailFunction,
      sideAlarmtoggle,
      rowAlarmId,
      AppConstants,
      ...useRefresh(),
      closeAllModal,
      visibleFields,
      canPlayAlarmSound,
      setPlayAlarmSound,
    };
  },
});
</script>
