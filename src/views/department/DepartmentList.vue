<template>
  <crud-view-layout>
    <template v-slot:actions>
      <router-link
        to="./create"
        class="btn btn-primary"
        v-if="$hasPermission(permissions.department.create)"
      >
        <span class="svg-icon svg-icon-2">
          <inline-svg src="/media/icons/duotune/arrows/arr075.svg" />
        </span>
        Create Department
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
        <template v-slot:actions="{ row: department }">
          <button
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
            v-if="$hasPermission(permissions.department.edit)"
          >
            <router-link
              :to="`./edit/${department.id}`"
              class="text-gray-800 text-hover-primary mb-1"
            >
              <span class="svg-icon svg-icon-3">
                <inline-svg src="/media/icons/duotune/art/art005.svg" />
              </span>
            </router-link>
          </button>

          <button
            v-if="
              department.record_status.toLowerCase() !== 'deleted' &&
              $hasPermission(permissions.department.delete)
            "
            @click="deleteRow(department.id)"
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="/media/icons/duotune/general/gen027.svg" />
            </span>
          </button>
        </template>
      </KTDatatable>
    </template>
    <!--end::Card body-->
  </crud-view-layout>
  <!--end::Card-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import { AlertForDelete } from "@/core/helpers/sweetAlert.utils";
import CurdApiService from "@/core/services/CurdApiService";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import { permissions } from "@/constants/permissions-constants";

export default defineComponent({
  name: "Department-list",
  components: {
    KTDatatable,
    CrudViewLayout,
  },
  setup() {
    const tableKey = ref(0);

    const headerConfig = ref([
      {
        columnLabel: "Department",
        key: "name",
        sortEnabled: true,
      },
      {
        columnLabel: "Action",
        key: "actions",
      },
    ]);
    const searchPlaceholder = "Search Departments By Name";

    async function fetchData() {
      const resposne = await CurdApiService.getAll("department");
      return resposne.data.data;
    }

    async function deleteRow(id: string | number) {
      const response = await AlertForDelete("department", id);
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
