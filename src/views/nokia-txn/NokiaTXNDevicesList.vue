<template>
  <crud-view-layout :key="refreshKey">
    <template #actions>
      <button
        class="btn btn-primary mx-3"
        @click="syncDevices"
        v-if="$hasPermission(permissions.nokiaTXN.devicesSync)"
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
        dataKeyToSearchAgainst="gui_label,product_name,ip_address"
        searchPlaceholder="Search Devices"
      >
        <template v-slot:creation_date="{ row: device }">
          {{ $format.datetimeFormat(device.creation_date) }}
        </template>
        <template v-slot:modified_date="{ row: device }">
          {{ $format.datetimeFormat(device.modified_date) }}
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
import NceGponService from "@/core/services/NceGponService";
import NokiaTXNService from "@/core/services/NokiaTXNService";

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
        key: "gui_label",
        sortEnabled: true,
      },
      {
        key: "product_name",
        sortEnabled: true,
      },
      {
        key: "eml_ne_type",
        sortEnabled: true,
      },
      {
        key: "node_type",
        sortEnabled: true,
      },
      {
        key: "ip_address",
        sortEnabled: true,
      },
      {
        columnLabel: "create time",
        key: "creation_date",
        sortEnabled: true,
      },
      {
        columnLabel: "last modified",
        key: "modified_date",
        sortEnabled: true,
      },
    ]);
    async function fetchData() {
      return await NokiaTXNService.getAllDevices();
    }
    async function syncDevices() {
      NokiaTXNService.syncDevices().then((response) => {
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
