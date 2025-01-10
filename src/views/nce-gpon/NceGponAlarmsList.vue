<template>
  <crud-view-layout>
    <template v-slot:title-help>
      <span class="d-flex justify-content-center align-items-center">
        <realtime-alarms-icon />
        (Live Alarms from {{ $nceGponPresentationName }} Monitoring NMS)
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
            toolTipContent="Alarm Name/NE Name"
            :searchStringHandler="searchStringHandler"
            :filterOptions="NceGponFilterConfig"
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
                  AppConstants.TABLE_FILTER_COLUMN_KEYS.NCE_GPON_ALARM_LIST
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
                      `/trouble-ticket/${AppConstants.APP_TYPE.NCE_GPON.toLowerCase()}/create/${
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
              <span v-html="NceGponAlarmSeverityBadge(alarm.severity)"></span>
            </template>
            <template v-slot:category="{ row: alarm }">
              <p>{{ alarm.category }}</p>
            </template>
            <template v-slot:native_probable_cause="{ row: alarm }">
              <router-link
                to=""
                @click="toggleModal(alarm.id)"
                class="text-underline"
              >
                <span>{{ alarm.native_probable_cause }}</span>
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
          <nce-gpon-alarm-detail-side
            :id="rowAlarmId"
            :key="forceRerenderKey"
            @close-window="rowAlarmId = 0"
          />
        </div>
      </div>
    </template>
  </crud-view-layout>

  <nce-gpon-alarm-detail
    v-if="modalAlarmId"
    :id="modalAlarmId"
    :key="forceRerenderKey"
  />
  <alarm-emails
    v-if="alarmEmailData.alarmId"
    :subject="alarmEmailData.subject"
    :to="alarmEmailData.to"
    :cc="alarmEmailData.cc"
    :title="`${$nceGponPresentationName} Alarm Email`"
    :htmlTemplate="
      alarmEmailService.getEmailTemplate('nce-gpon', alarmEmailData.alarmId)
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
  getNetworkTypeByAppType,
  getSeverityCellColorByAppType,
  NceGponAlarmSeverityBadge,
  toastForSendEmail,
} from "@/core/helpers/utils";
import { NceGponFilterConfig } from "./filter-config";
import SocketIoService from "@/core/services/SocketIoService";
import { ALARM_CONFIG, AppConstants } from "@/constants/app-constants";
import { useStore } from "vuex";
import { nceActions, nceMutations } from "@/store/enums/nce-enums";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import NceGponAlarmDetail from "@/components/nce-gpon-components/NceGponAlarmDetailModal.vue";
import AlarmEmails from "@/components/emails/EmailTemplate.vue";
import AlarmEmailService from "@/core/services/AlarmEmailService";
import { ISendEmailBody } from "@/core/interface/send-email-body";
import NceGponAlarmDetailSide from "@/components/nce-gpon-components/NceGponAlarmDetailSide.vue";
import { useRefresh } from "@/core/hooks/refresh";
import RealtimeAlarmsIcon from "@/components/shared/RealtimeAlarmsIcon.vue";
import { alarmEmailModel } from "@/core/model/email-models";
import AlarmConfigService from "@/core/services/AlarmConfigService";
import NceAlarmService from "@/core/services/NceAlarmService";
import { permissions } from "@/constants/permissions-constants";
import TableColumnFiltration from "@/components/shared/TableColumnFiltration.vue";
import { themeMode } from "@/core/helpers/config";
import { nceGponActions, nceGponMutations } from "@/store/enums/nce-gpon-enum";
import NceGponAlarmService from "@/core/services/NceGponAlarmService";
import { ModuleName } from "@/store/enums/module-enum";
import { AppNotificationsMutations } from "@/store/enums/app-notifications-enum";

export default defineComponent({
  name: "Nce-Gpon-Alarms-list",
  components: {
    KTDataTable,
    CrudViewLayout,
    NceGponAlarmDetail,
    AlarmEmails,
    NceGponAlarmDetailSide,
    RealtimeAlarmsIcon,
    TableColumnFiltration,
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
        boxColor: getSeverityCellColorByAppType(AppConstants.APP_TYPE.NCE_GPON),
      },
      {
        columnLabel: "Alarm Id",
        key: "nce_alarm_id",
        sortEnabled: true,
      },
      {
        columnLabel: "Alarm Name",
        key: "native_probable_cause",
        sortEnabled: true,
      },
      {
        columnLabel: "NE Name",
        key: "ne_name",
        sortEnabled: true,
      },
      {
        columnLabel: "Alarm Text",
        key: "alarm_text",
        sortEnabled: true,
        textOverflow: true,
      },
      {
        columnLabel: "Location Info",
        key: "location_info",
        sortEnabled: true,
      },
      {
        columnLabel: "Other Information",
        key: "other_info",
        sortEnabled: true,
        textOverflow: true,
      },
      // {
      //   columnLabel: "IP Address",
      //   key: "ip_address",
      // },
      {
        columnLabel: "Event Type",
        key: "event_type",
      },
      {
        columnLabel: "NE TYPE",
        key: "product_type",
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

    const searchPlaceholder = `Search ${AppConstants.NCE_GPON_PRESENTATION_NAME} Alarms`;
    const store = useStore();
    const modalAlarmId = ref<number>(0);
    const forceRerenderKey = ref(0);
    const alarmEmailService = new AlarmEmailService();
    const rowAlarmId = ref(0);
    const alarmEmailData = ref(alarmEmailModel);
    const troubleTicketCreatePermission = permissions.troubleTicket.create;
    const nceGponAlarmsCount = computed(
      () => store.getters.getNceGponAlarmsCount
    );

    const unSeenAlarmNotificationCount = computed(
      () =>
        store.getters[
          `${ModuleName.appNotifications}/getAlarmNotificationCount`
        ]
    );

    onUnmounted(() => {
      store.commit("enableNceGponAlarmsBgMode");
    });

    onMounted(() => {
      if (unSeenAlarmNotificationCount.value > 0) {
        store.commit(
          `${ModuleName.appNotifications}/${AppNotificationsMutations.SUBTRACT_FROM_TOTAL_ALARMS_COUNTS}`,
          nceGponAlarmsCount.value
        );
      }
      store.commit("disableNceGponAlarmsBgMode");
      store.commit("clearNceGponAlarmsCount");
    });

    async function fetchData(queryParams?: QueryParams) {
      await store.dispatch(nceGponActions.GET_ALL_NCE_GPON_ALARMS, queryParams);
      return store.getters.nceGponAlarms;
    }

    function applyFilterDataManipulator(data) {
      store.commit(nceGponMutations.SET_NCE_GPON_FILTERS, data);
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
      alarmEmailData.value.subject = `[${alarm.ne_name}] - ${alarm.native_probable_cause}`;
      const recipients =
        await NceGponAlarmService.getAlarmEmailRecipientsFromId(alarm.id);
      alarmEmailData.value.to = recipients.to;
      alarmEmailData.value.cc = recipients.cc;
      alarmEmailData.value.alarmId = alarm.id; // email opening logic
    }

    async function sendEmailFunction(data: ISendEmailBody) {
      const response = await alarmEmailService.sendEmail(
        "nce-gpon",
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
      () => store.getters.getCanPlayNceGponSound
    );
    const setPlayAlarmSound = () => store.commit("toggleCanPlayNceGponSound");
    return {
      headerConfig,
      searchPlaceholder,
      fetchData,
      NceGponAlarmSeverityBadge,
      NceGponFilterConfig,
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
