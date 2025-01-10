<template>
  <crud-view-layout>
    <template v-slot:actions>
      <router-link
        to="./create"
        class="btn btn-primary"
        v-if="$hasPermission(permissions.designation.create)"
      >
        <span class="svg-icon svg-icon-2">
          <inline-svg src="/media/icons/duotune/arrows/arr075.svg" />
        </span>
        Create Designation
      </router-link>
    </template>

    <template v-slot:body>
      <KTDatatable
        :header="headerConfig"
        :fetchCallBack="fetchData"
        :searchPlaceholder="searchPlaceholder"
        dataKeyToSearchAgainst="name"
        :paginationFromServer="false"
        :key="tableKey"
      >
        <template v-slot:actions="{ row: designation }">
          <button
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
            v-if="$hasPermission(permissions.designation.edit)"
          >
            <router-link
              :to="`./edit/${designation.id}`"
              class="text-gray-800 text-hover-primary mb-1"
            >
              <span class="svg-icon svg-icon-3">
                <inline-svg src="/media/icons/duotune/art/art005.svg" />
              </span>
            </router-link>
          </button>

          <button
            v-if="
              designation.record_status.toLowerCase() !== 'deleted' &&
              $hasPermission(permissions.designation.delete)
            "
            @click="deleteRow(designation.id)"
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="/media/icons/duotune/general/gen027.svg" />
            </span>
          </button>
        </template>
      </KTDatatable>
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import { AlertForDelete } from "@/core/helpers/sweetAlert.utils";
import CurdApiService from "@/core/services/CurdApiService";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import { permissions } from "@/constants/permissions-constants";

export default defineComponent({
  name: "designation-list",
  components: {
    KTDatatable,
    CrudViewLayout,
  },
  setup() {
    const tableKey = ref(0);

    const headerConfig = ref([
      {
        columnLabel: "name",
        key: "name",
        sortEnabled: true,
      },
      {
        columnLabel: "Action",
        key: "actions",
      },
    ]);
    const searchPlaceholder = "Search Name";

    async function fetchData() {
      const resposne = await CurdApiService.getAll("designation");
      return resposne.data.data;
    }

    async function deleteRow(id: string | number) {
      const response = await AlertForDelete("designation", id);
      if (response) tableKey.value++;
    }

    return {
      headerConfig,
      searchPlaceholder,
      deleteRow,
      fetchData,
      tableKey,
      permissions,
    };
  },
});
</script>
