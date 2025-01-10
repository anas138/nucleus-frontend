<template>
  <crud-view-layout>
    <template v-slot:actions>
      <router-link
        to="./create"
        class="btn btn-primary"
        v-if="$hasPermission(permissions.troubleTicketCategory.create)"
      >
        <span class="svg-icon svg-icon-2">
          <inline-svg src="/media/icons/duotune/arrows/arr075.svg" />
        </span>
        Create Category
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
        <template v-slot:tat="{ row: Category }">
          {{ Category.tat }} ({{ Category.tat_uom }})
        </template>
        <template v-slot:record_status="{ row: Category }">
          <div>
            <span
              v-html="RecordStatusBadge(Category.record_status)"
              class="pe-2"
            >
            </span>
          </div>
        </template>
        <template v-slot:actions="{ row: Category }">
          <router-link
            :to="`./edit/${Category.id}`"
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
            v-if="$hasPermission(permissions.troubleTicketCategory.edit)"
          >
            <span class="text-gray-800 text-hover-primary mb-1">
              <span class="svg-icon svg-icon-3">
                <inline-svg src="/media/icons/duotune/art/art005.svg" />
              </span>
            </span>
          </router-link>
          <button
            @click="() => $router.push(`/sub-category/list/${Category.id}`)"
            class="btn btn-bg-light btn-active-color-primary mx-1 py-3"
          >
            <span class="text-gray-800 text-hover-primary mb-1">
              <span class="d-flex align-items-center svg-icon svg-icon-3">
                <i class="fa-solid fa-list-ul mx-2"></i>
                Sub-Categories
              </span>
            </span>
          </button>
        </template>
      </KTDatatable>
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import { AlertForDelete } from "@/core/helpers/sweetAlert.utils";
import CurdApiService from "@/core/services/CurdApiService";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import { permissions } from "@/constants/permissions-constants";
import { RecordStatusBadge } from "@/core/helpers/utils";

export default defineComponent({
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
        columnLabel: "description",
        key: "description",
        textOverflow: true,
      },
      { columnLabel: "Turn Around Time", key: "tat" },
      { columnLabel: "Status", key: "record_status" },
      {
        columnLabel: "Action",
        key: "actions",
      },
    ]);
    const searchPlaceholder = "Search Name";

    async function fetchData() {
      const resposne = await CurdApiService.getAll("tt-category");
      return resposne.data.data;
    }

    async function deleteRow(id: string | number) {
      const response = await AlertForDelete("tt-category", id);
      if (response) tableKey.value++;
    }

    return {
      headerConfig,
      searchPlaceholder,
      deleteRow,
      fetchData,
      tableKey,
      permissions,
      RecordStatusBadge,
    };
  },
});
</script>
