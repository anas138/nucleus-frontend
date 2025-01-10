<template>
  <crud-view-layout>
    <template v-slot:actions>
      <router-link
        to="./create"
        class="btn btn-primary btn-sm"
        v-if="$hasPermission(permissions.permissions.create)"
      >
        <span class="svg-icon svg-icon-2">
          <inline-svg src="/media/icons/duotune/arrows/arr075.svg" />
        </span>
        Create Permission
      </router-link>
    </template>
    <template v-slot:body>
      <KTDatatable
        :header="headerConfig"
        :searchPlaceholder="searchPlaceholder"
        :fetchCallBack="fetchData"
        :paginationFromServer="false"
        dataKeyToSearchAgainst="name"
      >
        <template v-slot:created_at="{ row: Permission }">
          <p>
            {{ $format.dateFormat(Permission.created_at) }}
          </p>
        </template>
      </KTDatatable>
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import CurdApiService from "@/core/services/CurdApiService";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import { permissions } from "@/constants/permissions-constants";

export default defineComponent({
  name: "Permissions-list",
  components: {
    KTDatatable,
    CrudViewLayout,
  },
  setup() {
    const headerConfig = ref([
      {
        columnLabel: "Permission",
        key: "name",
        sortEnabled: true,
      },
      {
        columnLabel: "Created At",
        key: "created_at",
      },
    ]);
    const searchPlaceholder = "Search Permission";

    async function fetchData() {
      const resposne = await CurdApiService.getAll("permissions");
      return resposne.data.data;
    }

    return {
      headerConfig,
      searchPlaceholder,
      fetchData,
      permissions,
    };
  },
});
</script>
