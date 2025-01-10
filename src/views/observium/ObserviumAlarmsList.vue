<template>
  <crud-view-layout>
    <template v-slot:title-help>
      <span class="d-flex justify-content-center align-items-center">
        <realtime-alarms-icon />
        (Live Alerts from {{ $observiumPresentationName }} Monitoring)
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
        <div :class="{ 'col-md-8 border-end': sideAlarmId > 0 }">
          <KTDataTable
            :header="visibleFields"
            :fetchCallBack="fetchData"
            :inputWithToolTipEnabled="true"
            :searchPlaceholder="searchPlaceholder"
            toolTipContent="Device Name/Message"
            :filterDataManipulator="applyFilterDataManipulator"
            :filterOptions="ObserviumFilterConfig"
            :itemsPerPage="$dataTableSettings.PER_PAGE_LIMIT"
            :searchStringHandler="searchStringHandler"
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
                  AppConstants.TABLE_FILTER_COLUMN_KEYS.OBSERVIUM_ALARM_LIST
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
                      `/trouble-ticket/${AppConstants.APP_TYPE.OBSERVIUM.toLowerCase()}/create/${
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
            <template v-slot:alert_severity="{ row: alarm }">
              <span
                v-html="ObserviumAlarmSeverityBadge(alarm.alert_severity)"
              ></span>
            </template>
            <template v-slot:cleared_on="{ row: alarm }">
              <span>{{ $format.datetimeFormat(alarm.cleared_on) }}</span>
            </template>
            <template v-slot:device_hostname="{ row: alarm }">
              <router-link
                to=""
                @click.prevent="toggleModal(alarm.id)"
                class="text-underline"
              >
                <span>{{ alarm.device_hostname }}</span>
              </router-link>
            </template>
            <template v-slot:alert_timestamp="{ row: alarm }">
              <span>{{ $format.datetimeFormat(alarm.alert_timestamp) }}</span>
            </template>
          </KTDataTable>
        </div>
        <div :class="{ 'col-md-4': sideAlarmId > 0 }" v-if="sideAlarmId > 0">
          <observium-alarm-detail-side
            :id="sideAlarmId"
            :key="forceRerenderKey"
            @close-window="sideAlarmId = 0"
          />
        </div>
      </div>
    </template>
  </crud-view-layout>
  <observium-alarm-detail
    v-if="modalAlarmId"
    :id="modalAlarmId"
    :key="forceRerenderKey"
  />
  <alarm-emails
    v-if="alarmEmailData.alarmId"
    :subject="alarmEmailData.subject"
    :to="alarmEmailData.to"
    :cc="alarmEmailData.cc"
    :title="$observiumPresentationName + ' Alarm Email'"
    :htmlTemplate="
      alarmEmailService.getEmailTemplate('obs', alarmEmailData.alarmId)
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
import { defineComponent, ref, onUnmounted, onMounted, computed } from "vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import { QueryParams } from "@/core/interface/interfaces";
import { ObserviumFilterConfig } from "./filter-config";
import {
  getSeverityCellColorByAppType,
  ObserviumAlarmSeverityBadge,
  toastForSendEmail,
} from "@/core/helpers/utils";
import { useStore } from "vuex";
import {
  observiumActions,
  observiumMutations,
} from "@/store/enums/observium-enums";
import SocketIoService from "@/core/services/SocketIoService";
import { ALARM_CONFIG, AppConstants } from "@/constants/app-constants";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import ObserviumAlarmDetail from "@/components/observium-components/ObserviumAlarmDetailModal.vue";
import AlarmEmails from "@/components/emails/EmailTemplate.vue";
import AlarmEmailService from "@/core/services/AlarmEmailService";
import { ISendEmailBody } from "@/core/interface/send-email-body";
import ObserviumAlarmDetailSide from "@/components/observium-components/ObserviumAlarmDetailSide.vue";
import { useRefresh } from "@/core/hooks/refresh";
import RealtimeAlarmsIcon from "@/components/shared/RealtimeAlarmsIcon.vue";
import { alarmEmailModel } from "@/core/model/email-models";
import AlarmConfigService from "@/core/services/AlarmConfigService";
import ObserviumAlarmService from "@/core/services/ObserviumAlarmService";
import { permissions } from "@/constants/permissions-constants";
import TableColumnFiltration from "@/components/shared/TableColumnFiltration.vue";
import { themeMode } from "@/core/helpers/config";
import { ModuleName } from "@/store/enums/module-enum";
import { AppNotificationsMutations } from "@/store/enums/app-notifications-enum";

export default defineComponent({
  name: "Observium-Alarms-list",
  components: {
    KTDataTable,
    CrudViewLayout,
    ObserviumAlarmDetail,
    AlarmEmails,
    ObserviumAlarmDetailSide,
    RealtimeAlarmsIcon,
    TableColumnFiltration,
  },
  setup() {
    const alarmDataForEmail = ref([]);
    const headerConfig = ref([
      {
        columnLabel: "Actions",
        key: "actions",
      },
      {
        columnLabel: "Severity",
        key: "alert_severity",
        sortEnabled: true,
        boxColor: getSeverityCellColorByAppType(
          AppConstants.APP_TYPE.OBSERVIUM
        ),
      },
      {
        columnLabel: "Device Name",
        key: "device_hostname",
        sortEnabled: true,
      },
      {
        columnLabel: "Entity Name",
        key: "entity_name",
      },
      {
        columnLabel: "Entity Type",
        key: "entity_type",
      },
      {
        columnLabel: "Description",
        key: "entity_description",
        textOverflow: true,
      },
      {
        columnLabel: "Message",
        key: "alert_message",
      },
      {
        key: "alert_timestamp",
        columnLabel: "occured On",
        sortEnabled: true,
      },
      {
        columnLabel: "Cleared on",
        key: "cleared_on",
      },
    ]);

    const visibleFields = computed(() => {
      const selectedFields = headerConfig.value.filter(
        (val: any) => val.visible == true
      );
      return selectedFields;
    });

    const searchPlaceholder = `Search ${AppConstants.OBSERVIUM_PRESENTATION_NAME} Alarms`;
    const store = useStore();
    const modalAlarmId = ref<number>(0);
    const forceRerenderKey = ref(0);
    const alarmEmailService = new AlarmEmailService();
    const sideAlarmId = ref(0);
    const alarmEmailData = ref(alarmEmailModel);
    const troubleTicketCreatePermission = permissions.troubleTicket.create;
    const observiumAlarmsCount = computed(
      () => store.getters.getObserviumAlarmsCount
    );

    const unSeenAlarmNotificationCount = computed(
      () =>
        store.getters[
          `${ModuleName.appNotifications}/getAlarmNotificationCount`
        ]
    );

    onUnmounted(() => {
      store.commit("enableObserviumAlarmsBgMode");
    });

    onMounted(() => {
      if (unSeenAlarmNotificationCount.value > 0) {
        store.commit(
          `${ModuleName.appNotifications}/${AppNotificationsMutations.SUBTRACT_FROM_TOTAL_ALARMS_COUNTS}`,
          observiumAlarmsCount.value
        );
      }
      store.commit("disableObserviumAlarmsBgMode");
      store.commit("clearObserviumAlarmsCount");
    });

    async function fetchData(queryParams?: QueryParams) {
      await store.dispatch(
        observiumActions.GET_ALL_OBSERVIUM_ALARMS,
        queryParams
      );
      return store.getters.observiumAlarm;
    }

    function applyFilterDataManipulator(data) {
      store.commit(observiumMutations.SET_OBSERVIUM_FILTERS, data);
      return data;
    }

    // this is added because if in future we want to manipulate the results of
    // search or want to use it else where like in filter
    // e.g commiting it to store
    function searchStringHandler(search: string) {
      return search;
    }

    function toggleModal(id: number) {
      closeAllModal();
      modalAlarmId.value = id;
      forceRerenderKey.value++;
    }

    async function toggleEmailModal(alarm) {
      closeAllModal();
      alarmEmailData.value.subject = `[${alarm.device_hostname}] - ${alarm.entity_name}`;
      const recipients =
        await ObserviumAlarmService.getAlarmEmailRecipientsFromId(alarm.id);
      alarmEmailData.value.to = recipients.to;
      alarmEmailData.value.cc = recipients.cc;
      alarmEmailData.value.alarmId = alarm.id; // email opening logic
    }

    async function sendEmailFunction(data: ISendEmailBody) {
      const response = await alarmEmailService.sendEmail(
        "obs",
        alarmEmailData.value.alarmId,
        data
      );
      closeAllModal();
      toastForSendEmail(response, "Email Sent Successfully");
    }

    function sideAlarmtoggle(id: number) {
      closeAllModal();
      sideAlarmId.value = id;
      forceRerenderKey.value++;
    }

    function closeAllModal() {
      modalAlarmId.value = 0;
      alarmEmailData.value.alarmId = 0;
    }

    const canPlayAlarmSound = computed(
      () => store.getters.getCanPlayObserviumSound
    );
    const setPlayAlarmSound = () => store.commit("toggleCanPlayObserviumSound");

    return {
      headerConfig,
      searchPlaceholder,
      fetchData,
      applyFilterDataManipulator,
      troubleTicketCreatePermission,
      ObserviumFilterConfig,
      ObserviumAlarmSeverityBadge,
      searchStringHandler,
      toggleModal,
      modalAlarmId,
      forceRerenderKey,
      toggleEmailModal,
      alarmEmailData,
      alarmEmailService,
      sendEmailFunction,
      sideAlarmtoggle,
      sideAlarmId,
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
