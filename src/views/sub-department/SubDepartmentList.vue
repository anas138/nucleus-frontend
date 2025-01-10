<template>
  <!--begin::Card-->
  <crud-view-layout>
    <!--begin::Card header-->
    <template v-slot:actions>
      <router-link
        to="./create"
        class="btn btn-primary"
        v-if="$hasPermission(permissions.subDepartment.create)"
      >
        <span class="svg-icon svg-icon-2">
          <inline-svg src="/media/icons/duotune/arrows/arr075.svg" />
        </span>
        Create
      </router-link>
    </template>
    <!--end::Card header-->

    <!--begin::Card body-->
    <template v-slot:body>
      <KTDatatable
        :fetchCallBack="fetchData"
        :header="headerConfig"
        :searchPlaceholder="searchPlaceholder"
        dataKeyToSearchAgainst="name"
        :key="tableKey"
        :paginationFromServer="false"
      >
        <template v-slot:actions="{ row: department }">
          <button
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
            v-if="$hasPermission(permissions.subDepartment.edit)"
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
              $hasPermission(permissions.users.delete)
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
import CurdApiService from "@/core/services/CurdApiService";
import { AlertForDelete } from "@/core/helpers/sweetAlert.utils";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import { permissions } from "@/constants/permissions-constants";

export default defineComponent({
  name: "Sub-Department-list",
  components: {
    KTDatatable,
    CrudViewLayout,
  },
  setup() {
    const tableKey = ref(0);
    const headerConfig = ref([
      {
        key: "name",
        sortEnabled: true,
      },
      {
        columnLabel: "Department",
        key: "department",
      },
      {
        columnLabel: "Action",
        key: "actions",
      },
    ]);
    const searchPlaceholder = "Search by name";

    async function fetchData() {
      const resposne = await CurdApiService.getAll("subdepartment");
      return resposne.data.data.map((subDepart) => {
        subDepart.department = subDepart.department.name;
        return subDepart;
      });
    }

    async function deleteRow(id: string | number) {
      const response = await AlertForDelete("subDepartment", id);
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
