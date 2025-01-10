<template>
  <KTDatatable
    :header="visibleFields"
    :header-capitalize="true"
    :table-bordered="true"
    :fetchCallBack="fetchData"
    :searchPlaceholder="searchPlaceholder"
    :key="tableKey"
    :downloadEnabled="true"
    :is-downloading="isDownloading"
    :filter-options="ticketsReportConfig"
    :search-enabled="true"
    :isReportModule="true"
    :isDateSelected="isDateSelected"
    :itemsPerPage="$dataTableSettings.PER_PAGE_LIMIT"
    @on-download-click="downloadCSV"
  >
    <!-- <template v-slot:status="{ row: troubleTicket }">
      <div>
        <span
          v-html="TroubleTicketReportStatusBadge(troubleTicket?.status)"
          class="pe-2"
        >
        </span>
      </div>
    </template> -->

    <template #custom-actions>
      <TableColumnFiltration
        :tableColumnFiltrationKey="
          AppConstants.TABLE_FILTER_COLUMN_KEYS.TROUBLE_TICKET_REPORT_LIST
        "
        :header-config-keys="headerConfig"
      />
    </template>

    <template v-slot:resolved_date="{ row: troubleTicket }">
      {{ $format.datetimeFormat(troubleTicket?.resolved_date) }}
    </template>
    <template v-slot:ticket_open_date="{ row: troubleTicket }">
      {{ $format.datetimeFormat(troubleTicket?.ticket_open_date) }}
    </template>
    <template v-slot:completed_date="{ row: troubleTicket }">
      {{ $format.datetimeFormat(troubleTicket?.completed_date) }}
    </template>
    <template v-slot:TAT="{ row: troubleTicket }">
      {{ troubleTicket?.TAT?.toUpperCase() }}
    </template>
    <template v-slot:RCA_Awaited="{ row: troubleTicket }">
      {{ troubleTicket?.RCA_Awaited }}
    </template>

    <template v-slot:rca_start_time="{ row: troubleTicket }">
      {{ $format.datetimeFormat(troubleTicket?.rca_start_time) }}
    </template>

    <template v-slot:rca_end_time="{ row: troubleTicket }">
      {{ $format.datetimeFormat(troubleTicket?.rca_end_time) }}
    </template>

    <template v-slot:rca_reason="{ row: troubleTicket }">
      {{ troubleTicket?.rca_reason }}
    </template>
  </KTDatatable>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import CurdApiService from "@/core/services/CurdApiService";
import { AppConstants } from "@/constants/app-constants";
import { QueryParams } from "@/core/interface/interfaces";
import { ticketsReportConfig } from "@/views/trouble-ticket/filter-configs/filter-config";
import ReportService from "@/core/services/ReportService";
import moment from "moment";
import TableColumnFiltration from "@/components/shared/TableColumnFiltration.vue";

export default defineComponent({
  components: {
    KTDatatable,
    TableColumnFiltration,
  },
  setup(props, { emit }) {
    const isDateSelected = ref(false);

    const tableKey = ref(0);
    const isDownloading = ref(false);
    const dataForCSV = ref([]);
    const payload = ref({});

    const headerConfig = ref([
      { key: "ticket_number", columnLabel: "Ticket Number" },
      { key: "status", columnLabel: "Status" },
      { key: "alarm_name", columnLabel: "Alarm Name", textOverflow: true },
      {
        key: "device_name",
        columnLabel: "Device/Trunk Group",
        textOverflow: true,
      },
      {
        key: "assigned_to_dept",
        columnLabel: "Assigned To Dept",
        textOverflow: true,
      },
      { key: "ticket_open_date", columnLabel: "Ticket Open Date" },
      { key: "completed_date", columnLabel: "Completed Date" },
      { key: "ticket_category", columnLabel: "Category" },
      { key: "ticket_sub_category", columnLabel: "Sub-Category" },
      { key: "TAT", columnLabel: "Out of TAT" },
      { key: "tat_exceed_time", columnLabel: "TAT Exceed Time" },
      {
        key: "resolved_duration_in_min",
        columnLabel: "Resolved Duration In Min",
      },
      { key: "pause_time_in_min", columnLabel: "Pause Time In Min" },
      {
        key: "resolved_by_sub_department",
        columnLabel: "Resolved By Sub Department",
        textOverflow: true,
      },
      { key: "RCA_Awaited", columnLabel: "RCA Awaited", textOverflow: true },
      { key: "rca_submitted", columnLabel: "RCA Submitted" },
      {
        key: "rca_start_time",
        columnLabel: "RCA Start Time",
        textOverflow: true,
      },
      {
        key: "rca_end_time",
        columnLabel: "RCA End Time",
        textOverflow: true,
      },
      {
        key: "rca_reason",
        columnLabel: "RCA Reason",
        textOverflow: true,
      },

      //is_rca_awaited
      // { key: "created_by" },
      // { key: "medium" },
      // { key: "ticket_category" },
      // { key: "ticket_sub_category" },
      // { key: "network_type" },
      // { key: "turn_out_time" },
      // { key: "resolved_date" },
      // { key: "completed_duration_in_min" },
    ]);
    const searchPlaceholder = "Search by any parameter";

    const visibleFields = computed(() => {
      const selectedFields = headerConfig.value.filter(
        (val: any) => val.visible == true
      );
      return selectedFields;
    });

    const convertTableFieldsIntoExcelColumns = (tableFields) => {
      let columns = [];
      columns = tableFields.map((item, index) => {
        return {
          field: item.key,
          label: item.label,
        };
      });
      return columns;
    };

    const downloadCSV = async () => {
      isDownloading.value = true;
      delete payload?.value["limit"];
      delete payload?.value["page"];
      payload.value["columns"] = visibleFields.value;
      await ReportService.downloadTroubleTicketReport(payload.value);
      isDownloading.value = false;
    };

    async function fetchData(queryParams?: QueryParams) {
      if (queryParams?.Date) {
        queryParams["fromDate"] = moment(queryParams?.Date[0]).format("");
        queryParams["toDate"] = moment(queryParams?.Date[1]).format("");
        delete queryParams["Date"];
      }

      if (queryParams?.fromDate && queryParams?.toDate) {
        const resposne = await CurdApiService.getAll(
          `report/trouble-ticket`,
          queryParams
        );
        if (resposne.data.data?.list.length) {
          isDateSelected.value = true;
        } else {
          isDateSelected.value = false;
        }

        dataForCSV.value = resposne.data.data?.list;
        payload.value = queryParams;

        return resposne.data.data;
      } else {
        isDateSelected.value = false;
        return [];
      }
    }

    return {
      AppConstants,
      headerConfig,
      ticketsReportConfig,
      searchPlaceholder,
      isDateSelected,
      fetchData,
      tableKey,
      isDownloading,
      downloadCSV,
      visibleFields,
    };
  },
});
</script>
