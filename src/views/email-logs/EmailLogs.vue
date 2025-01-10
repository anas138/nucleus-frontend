<template>
  <crud-view-layout>
    <template v-slot:body>
      <KTDataTable
        :header="headerConfig"
        :fetchCallBack="fetchData"
        :searchPlaceholder="searchPlaceholder"
        :key="tableKey"
      >
        <template v-slot:created_at="{ row: logs }">
          {{ $format.datetimeFormat(logs.created_at) }}
        </template>
        <template v-slot:actions="{ row: logs }">
          <div class="d-flex justify-content-center">
            <span class="icon-link" @click="toggleEmailModal(logs)"
              ><el-tooltip content="Show Details"
                ><i class="bi-eye-fill me-2"></i></el-tooltip
            ></span>
          </div>
        </template>
      </KTDataTable>
    </template>
  </crud-view-layout>

  <alarm-emails
    v-if="emailLogsData.logId"
    :subject="emailLogsData.subject"
    :to="emailLogsData.to"
    :cc="emailLogsData.cc"
    :title="' Email Log Details'"
    :htmlTemplate="emailLogsData.html_body"
    @close="closeAllModal"
    :readOnly="true"
  />
  <!--end::Card-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import CurdApiService from "@/core/services/CurdApiService";
import { QueryParams } from "@/core/interface/interfaces";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import AlarmEmails from "@/components/emails/EmailTemplate.vue";
import { emailLogsModel } from "@/core/model/email-models";
import { permissions } from "@/constants/permissions-constants";
import { EmailLog } from "@/core/interface/email-service-interface";

export default defineComponent({
  name: "email-logs-list",
  components: {
    KTDataTable,
    CrudViewLayout,
    AlarmEmails,
  },
  setup() {
    const tableKey = ref(0);
    const emailLogsData = ref<EmailLog>(emailLogsModel);
    const htmlBodyLog = ref("");
    const headerConfig = ref([
      {
        key: "actions",
      },
      {
        columnLabel: "To",
        key: "to",
      },
      {
        columnLabel: "Subject",
        key: "subject",
      },
      {
        columnLabel: "CC Recipients",
        key: "cc",
        textOverflow: true,
      },
      {
        columnLabel: "Sent At",
        key: "created_at",
      },
    ]);
    const searchPlaceholder = "Search Emails";
    async function fetchData(queryParams?: QueryParams) {
      const response = await CurdApiService.getAll("email-logs", {
        ...queryParams,
      });
      return response.data.data;
    }

    async function toggleEmailModal(logs) {
      closeAllModal();
      emailLogsData.value = { ...logs };
      emailLogsData.value.to = logs.to?.length ? logs.to?.split(",") : "";
      emailLogsData.value.cc = logs.cc?.length ? logs.cc?.split(",") : "";
      emailLogsData.value.logId = logs.id;
    }

    function closeAllModal() {
      emailLogsData.value.logId = 0;
    }

    return {
      headerConfig,
      searchPlaceholder,
      fetchData,
      tableKey,
      permissions,
      emailLogsData,
      toggleEmailModal,
      closeAllModal,
      htmlBodyLog,
    };
  },
});
</script>
