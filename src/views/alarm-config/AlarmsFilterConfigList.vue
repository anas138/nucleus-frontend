<template>
  <crud-view-layout>
    <template #actions>
      <router-link
        to="./create"
        class="btn btn-primary"
        v-if="$hasPermission(createPermission)"
      >
        <span class="svg-icon svg-icon-2">
          <inline-svg src="/media/icons/duotune/arrows/arr075.svg" />
        </span>
        Add Alarm Config
      </router-link>
    </template>
    <template v-slot:body>
      <KTDataTable
        :header="headerConfig"
        :fetchCallBack="fetchData"
        :itemsPerPage="$dataTableSettings.PER_PAGE_LIMIT"
        :paginationFromServer="false"
        :inputWithToolTipEnabled="true"
        dataKeyToSearchAgainst="alarm_name,severity,last_modified_by"
        toolTipContent="Alarm Name/Severity/Last modified by"
        searchPlaceholder="Search Alarms"
        :filterOptions="alarmFilterConfig"
        :key="keyForForceRerender"
      >
        <template v-slot:actions="{ row: alarm }">
          <button
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm mx-1"
            v-if="$hasPermission(editPremission)"
          >
            <router-link
              :to="`./edit/${alarm.id}`"
              class="text-gray-800 text-hover-primary mb-1"
            >
              <span class="svg-icon svg-icon-3">
                <inline-svg src="/media/icons/duotune/art/art005.svg" />
              </span>
            </router-link>
          </button>
        </template>
        <template v-slot:alarm_filter_advanced_conditions="{ row: alarm }">
          <span
            v-for="(item, index) in alarm?.alarm_filter_advanced_conditions"
            :key="index"
            class="d-flex d-column"
            >{{ item?.field_name }}: "{{ item?.field_value }}"</span
          >
        </template>
        <template v-slot:is_change_in_display_severity="{ row: alarm }">
          <div class="d-flex align-items-center">
            <span
              v-html="StatusBadge(alarm.is_change_in_display_severity)"
              class="pe-2"
            ></span>
            <span class="ms-1" v-if="alarm?.severity_to_be_displayed"
              >| {{ alarm?.severity_to_be_displayed }}</span
            >
          </div>
        </template>
        <template v-slot:email_escalation_delay="{ row: alarm }">
          <div class="d-flex align-items-center">
            <span
              v-html="StatusBadge(alarm.is_email_escalation)"
              class="pe-2"
            ></span>
            <span>({{ alarm.email_escalation_delay }} min)</span>
          </div>
        </template>
        <template v-slot:ticket_escalation_delay="{ row: alarm }">
          <div class="d-flex align-items-center">
            <span
              v-html="StatusBadge(alarm.is_ticket_escalation)"
              class="pe-2"
            ></span>
            <span>({{ alarm.ticket_escalation_delay }} min)</span>
          </div>
        </template>
        <template v-slot:can_revert_ticket_on_alarm_recovery="{ row: alarm }">
          <div class="d-flex align-items-center">
            <span
              v-html="
                StatusBadge(
                  alarm?.can_revert_ticket_on_alarm_recovery
                    ? alarm?.can_revert_ticket_on_alarm_recovery
                    : false
                )
              "
              class="pe-2"
            ></span>
          </div>
        </template>
        <template v-slot:record_status="{ row: alarm }">
          <div>
            <span v-html="RecordStatusBadge(alarm.record_status)" class="pe-2">
            </span>
          </div>
        </template>
        <template v-slot:last_modified_by="{ row: alarm }">
          <span>{{
            alarm.last_modified_by ? `${alarm.last_modified_by} | ` : ""
          }}</span>
          <span>{{ $format.datetimeFormat(alarm.updated_at) }}</span>
        </template>
        <template v-slot:updated_at="{ row: alarm }">
          {{ $format.datetimeFormat(alarm?.updated_at) }}
        </template>
      </KTDataTable>
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import AlarmConfigService from "@/core/services/AlarmConfigService";
import { useRoute } from "vue-router";
import { permissions } from "@/constants/permissions-constants";
import { RecordStatusBadge, StatusBadge } from "@/core/helpers/utils";
import { alarmFilterConfig } from "./alarms-filter-config";
import { QueryParams } from "@/core/interface/interfaces";
import { AppConstants } from "@/constants/app-constants";

export default defineComponent({
  name: "Nce-Alarms-list",
  components: {
    KTDataTable,
    CrudViewLayout,
  },
  setup() {
    const data = ref([]);
    const route = useRoute();
    let appType = String(route.meta.appType);

    const ldiSoftswitchTableKeys = [
      {
        columnLabel: "Advanced Conditions",
        key: "alarm_filter_advanced_conditions",
        sortEnabled: true,
      },
      {
        columnLabel: "Is Actual Severity Changed",
        key: "is_change_in_display_severity",
        sortEnabled: true,
      },
      // {
      //   columnLabel: "Conditional Severity",
      //   key: "conditional_severity",
      //   sortEnabled: true,
      // },
      // {
      //   columnLabel: "Severity To Be Displayed",
      //   key: "severity_to_be_displayed",
      //   sortEnabled: true,
      // },
    ];

    const createPermission = computed(() => {
      if (route.meta.appType === AppConstants.APP_TYPE.NCE) {
        return permissions.nceAlarmConfig.create;
      } else if (route.meta.appType === AppConstants.APP_TYPE.OBSERVIUM) {
        return permissions.observiumAlarmConfig.create;
      } else if (route.meta.appType === AppConstants.APP_TYPE.NCE_GPON) {
        return permissions.nceGponAlarmConfig.create;
      } else if (route.meta.appType === AppConstants.APP_TYPE.NOKIA_TXN) {
        return permissions.nokiaTXNAlarmConfig.create;
      } else if (
        route.meta.appType === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
      ) {
        return permissions.ldiSoftswitchEMSAlarmConfig.create;
      } else {
        return false;
      }
    });

    const editPremission = computed(() => {
      if (route.meta.appType === AppConstants.APP_TYPE.NCE) {
        return permissions.nceAlarmConfig.edit;
      } else if (route.meta.appType === AppConstants.APP_TYPE.OBSERVIUM) {
        return permissions.observiumAlarmConfig.edit;
      } else if (route.meta.appType === AppConstants.APP_TYPE.NCE_GPON) {
        return permissions.nceGponAlarmConfig.edit;
      } else if (route.meta.appType === AppConstants.APP_TYPE.NOKIA_TXN) {
        return permissions.nokiaTXNAlarmConfig.edit;
      } else if (
        route.meta.appType === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
      ) {
        return permissions.ldiSoftswitchEMSAlarmConfig.edit;
      } else {
        return false;
      }
    });

    const keyForForceRerender = ref(0);
    watch(
      () => route.meta.appType,
      (newAppType) => {
        appType = String(newAppType);
        keyForForceRerender.value++;
      }
    );
    const headerConfig = ref([
      {
        key: "actions",
      },
      {
        columnLabel: "severity",
        key: "severity",
        sortEnabled: true,
      },
      {
        columnLabel: "alarm name",
        key: "alarm_name",
        sortEnabled: true,
      },
      {
        columnLabel: "Email Escalation (min)",
        key: "email_escalation_delay",
        sortEnabled: true,
      },
      {
        columnLabel: "ticket Escalation (min)",
        key: "ticket_escalation_delay",
        sortEnabled: true,
      },
      {
        columnLabel: "TT auto Cancelation",
        key: "can_revert_ticket_on_alarm_recovery",
      },
      {
        key: "last_modified_by",
        sortEnabled: true,
      },
      {
        columnLabel: "Status",
        key: "record_status",
        sortEnabled: true,
      },
    ]);

    const showAdvanceCondition = (app_type) => {
      switch (app_type) {
        case AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS:
          headerConfig.value.splice(3, 0, ...ldiSoftswitchTableKeys);
          return;
        default:
          if (
            headerConfig.value.findIndex(
              (item) => item.key === "alarm_filter_advanced_conditions"
            ) >= 0
          ) {
            headerConfig.value.splice(3, 2);
          }
          return;
      }
    };

    watch(
      () => route.meta.appType,
      (newAppType) => {
        showAdvanceCondition(newAppType);
      },
      { immediate: true }
    );

    async function fetchData(queryParams?: QueryParams) {
      let response = await AlarmConfigService.getAllAlarmsConfig(
        appType,
        queryParams
      );
      if (typeof response === "object") {
        return response?.map((data) => {
          const last_modified_by = data?.updatedByUser?.full_name;
          return { ...data, last_modified_by };
        });
      }
    }
    return {
      data,
      headerConfig,
      fetchData,
      createPermission,
      editPremission,
      keyForForceRerender,
      permissions,
      RecordStatusBadge,
      StatusBadge,
      alarmFilterConfig,
    };
  },
});
</script>
