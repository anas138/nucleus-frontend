<template>
  <crud-view-layout :key="refreshKey">
    <template #actions>
      <button
        class="btn btn-primary mx-3"
        @click="syncDevices"
        v-if="$hasPermission(permissions.observium.devicesSync)"
      >
        <i class="fa fa-refresh" aria-hidden="true"></i>
        Sync Devices
      </button>
    </template>
    <template v-slot:body>
      <KTDataTable
        :header="headerConfig"
        :fetchCallBack="fetchData"
        :itemsPerPage="$dataTableSettings.PER_PAGE_LIMIT"
        :paginationFromServer="false"
        dataKeyToSearchAgainst="hostname,sys_name,location,purpose,ip"
        searchPlaceholder="Search Devices"
      >
      </KTDataTable>
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import ObserviumService from "@/core/services/ObserviumService";
import { useRefresh } from "@/core/hooks/refresh";
import { ElNotification } from "element-plus";
import { permissions } from "@/constants/permissions-constants";

export default defineComponent({
  name: "Observium-devices-list",
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
        key: "hostname",
        sortEnabled: true,
      },
      {
        columnLabel: "system name",
        key: "sys_name",
        sortEnabled: true,
      },
      {
        columnLabel: "Location",
        key: "location",
        sortEnabled: true,
        textOverflow: true,
      },
      {
        columnLabel: "purpose",
        key: "purpose",
        sortEnabled: true,
      },
      {
        key: "ip",
        sortEnabled: true,
      },
    ]);
    async function fetchData() {
      return await ObserviumService.getAllDevices();
    }
    function syncDevices() {
      ObserviumService.syncDevices().then((response) => {
        console.log(response);
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
