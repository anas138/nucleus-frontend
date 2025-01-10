<template>
  <crud-view-layout :key="refreshKey">
    <!-- <template #actions>
      <button
        class="btn btn-primary mx-3"
        @click="syncTrunks"
        v-if="$hasPermission(permissions.ldiSoftswitchEMS.trunkGroupSync)"
      >
        <i class="fa fa-refresh" aria-hidden="true"></i>
        Sync Trunk Groups
      </button>
    </template> -->
    <template v-slot:body>
      <KTDataTable
        :header="headerConfig"
        :fetchCallBack="fetchData"
        :itemsPerPage="$dataTableSettings.PER_PAGE_LIMIT"
        :paginationFromServer="false"
        dataKeyToSearchAgainst="trunk_name,peer_end_ip,ldi_ip,status"
        searchPlaceholder="Search Trunk Group"
      >
        <template v-slot:created_at="{ row: device }">
          {{ $format.datetimeFormat(device.created_at) }}
        </template>
        <template v-slot:updated_at="{ row: device }">
          {{ $format.datetimeFormat(device.updated_at) }}
        </template>
      </KTDataTable>
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import { useRefresh } from "@/core/hooks/refresh";
import { ElNotification } from "element-plus";
import { permissions } from "@/constants/permissions-constants";
import LDISoftswitchEMSService from "@/core/services/LDISoftswitchEMSService";

export default defineComponent({
  components: {
    KTDataTable,
    CrudViewLayout,
  },
  setup() {
    const data = ref([]);
    const { refreshKey, incrementRefresh } = useRefresh();
    const headerConfig = ref([
      {
        columnLabel: "Trunk Name",
        key: "trunk_name",
        sortEnabled: true,
      },
      {
        key: "peer_end_ip",
        sortEnabled: true,
      },
      {
        key: "ldi_ip",
        sortEnabled: true,
      },
      {
        key: "status",
        sortEnabled: true,
      },
    ]);
    async function fetchData() {
      return await LDISoftswitchEMSService.getAllTrunks();
    }
    async function syncTrunks() {
      LDISoftswitchEMSService.syncTrunks().then((response) => {
        ElNotification({
          type: "success",
          message: response,
        });
        incrementRefresh();
      });
    }
    return {
      data,
      headerConfig,
      fetchData,
      refreshKey,
      syncTrunks,
      permissions,
    };
  },
});
</script>
