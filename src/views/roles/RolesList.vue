<template>
  <crud-view-layout>
    <template v-slot:actions>
      <router-link
        to="./create"
        class="btn btn-primary"
        v-if="$hasPermission(permissions.role.create)"
      >
        <span class="svg-icon svg-icon-2">
          <inline-svg src="/media/icons/duotune/arrows/arr075.svg" />
        </span>
        Create
      </router-link>
    </template>
    <template v-slot:body>
      <KTDatatable
        :header="headerConfig"
        :fetchCallBack="fetchData"
        :searchPlaceholder="searchPlaceholder"
        :paginationFromServer="false"
        dataKeyToSearchAgainst="name"
        :key="tableKey"
      >
        <template v-slot:actions="{ row: role }">
          <button
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
            v-if="$hasPermission(permissions.role.edit)"
          >
            <router-link
              :to="`./edit/${role.id}`"
              class="text-gray-800 text-hover-primary mb-1"
            >
              <span class="svg-icon svg-icon-3">
                <inline-svg src="/media/icons/duotune/art/art005.svg" />
              </span>
            </router-link>
          </button>
          <button
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
            v-if="$hasPermission(permissions.permissions.edit)"
          >
            <router-link
              :to="`./edit-permissions/${role.id}`"
              class="text-gray-800 text-hover-primary mb-1"
            >
              <span class="svg-icon svg-icon-3">
                <i class="bi bi-shield-lock-fill"></i>
              </span>
            </router-link>
          </button>
          <button
            v-if="$hasPermission(permissions.role.delete)"
            @click="deleteRow(role.id)"
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
import CurdApiService from "@/core/services/CurdApiService";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import { AlertForDelete } from "@/core/helpers/sweetAlert.utils";
import { permissions } from "@/constants/permissions-constants";

export default defineComponent({
  name: "Roles-list",
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
        columnLabel: "Actions",
        key: "actions",
      },
    ]);
    const searchPlaceholder = "Search By Name";

    async function fetchData() {
      const resposne = await CurdApiService.getAll("roles");
      return resposne.data.data;
    }

    async function deleteRow(id: string | number) {
      const response = await AlertForDelete("roles", id);
      if (response) tableKey.value++;
    }
    return {
      headerConfig,
      searchPlaceholder,
      fetchData,
      tableKey,
      deleteRow,
      permissions,
    };
  },
});
</script>
