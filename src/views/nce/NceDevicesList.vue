<template>
  <crud-view-layout :key="refreshKey">
    <template #actions>
      <button
        class="btn btn-primary mx-3"
        @click="syncDevices"
        v-if="$hasPermission(permissions.nce.devicesSync)"
      >
        <i class="fa fa-refresh" aria-hidden="true"></i>
        Sync Network Elements
      </button>
    </template>
    <template v-slot:body>
      <KTDataTable
        :header="headerConfig"
        :fetchCallBack="fetchData"
        :itemsPerPage="$dataTableSettings.PER_PAGE_LIMIT"
        :paginationFromServer="false"
        dataKeyToSearchAgainst="name,product_name,ip_address"
        searchPlaceholder="Search Devices"
      >
        <template v-slot:nce_create_time="{ row: device }">
          {{ $format.datetimeFormat(device.nce_create_time) }}
        </template>
        <template v-slot:nce_last_modified="{ row: device }">
          {{ $format.datetimeFormat(device.nce_last_modified) }}
        </template>
      </KTDataTable>
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import NceService from "@/core/services/NceService";
import { useRefresh } from "@/core/hooks/refresh";
import { ElNotification } from "element-plus";
import { permissions } from "@/constants/permissions-constants";

export default defineComponent({
  name: "Nce-devices-list",
  components: {
    KTDataTable,
    CrudViewLayout,
  },
  setup() {
    const data = ref([]);
    const { refreshKey, incrementRefresh } = useRefresh();
    const headerConfig = ref([
      {
        columnLabel: "name",
        key: "name",
        sortEnabled: true,
      },
      {
        key: "product_name",
        sortEnabled: true,
      },
      {
        key: "ip_address",
        sortEnabled: true,
      },
      {
        columnLabel: "create time",
        key: "nce_create_time",
        sortEnabled: true,
      },
      {
        columnLabel: "last modified",
        key: "nce_last_modified",
        sortEnabled: true,
      },
    ]);
    async function fetchData() {
      return await NceService.getAllDevices();
    }
    async function syncDevices() {
      NceService.syncDevices().then((response) => {
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
      syncDevices,
      permissions,
    };
  },
});
</script>
