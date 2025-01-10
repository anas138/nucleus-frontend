<template>
  <crud-view-layout>
    <template v-slot:actions>
      <router-link
        to="./create"
        class="btn btn-primary btn-sm"
        v-if="$hasPermission(permissions.users.create)"
      >
        <span class="svg-icon svg-icon-2">
          <inline-svg src="/media/icons/duotune/arrows/arr075.svg" />
        </span>
        Add User
      </router-link>
    </template>
    <template v-slot:body>
      <KTDataTable
        :header="headerConfig"
        :searchPlaceholder="searchPlaceholder"
        :fetchCallBack="fetchData"
        :key="tableKey"
      >
        <template v-slot:full_name="{ row: customer }">
          <router-link
            :to="`/users/edit/${customer.id}`"
            class="text-gray-800 mb-1"
            :class="{
              'text-hover-primary': $hasPermission(permissions.users.edit),
              'disabled-link': !$hasPermission(permissions.users.edit),
            }"
            v-on:click.prevent="!$hasPermission(permissions.users.edit) && null"
          >
            <div class="mb-7 d-flex align-items-center">
              <div class="symbol symbol-50px me-5">
                <ProfileImage :imageUrl="customer.profile_picture" />
              </div>
              <div class="flex-grow-1">
                <span
                  class="text-dark fw-bold fs-6"
                  :class="{
                    'text-hover-primary': $hasPermission(
                      permissions.users.edit
                    ),
                  }"
                >
                  {{ customer.full_name }}
                </span>
                <span class="text-muted d-block fw-semibold">{{
                  customer.designation
                }}</span>
              </div>
            </div>
          </router-link>
        </template>
        <template v-slot:regions="{ row: customer }">
          <div>
            <template v-for="region in customer.regions" :key="region">
              <span v-html="RegionBadge(region.name)" class="pe-2"> </span>
            </template>
          </div>
        </template>
        <template v-slot:roles="{ row: customer }">
          <div>
            <template v-for="role in customer.roles" :key="role">
              <span :class="`badge badge-info`" class="me-1">
                {{ role.name }}
              </span>
            </template>
          </div>
        </template>
        <template v-slot:actions="{ row: department }">
          <button
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm mx-1"
            v-if="$hasPermission(permissions.users.edit)"
          >
            <router-link
              :to="`/users/edit/${department.id}`"
              class="text-gray-800 text-hover-primary mb-1"
            >
              <span class="svg-icon svg-icon-3">
                <inline-svg src="/media/icons/duotune/art/art005.svg" />
              </span>
            </router-link>
          </button>

          <button
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm mx-1"
            v-if="$hasPermission(permissions.permissions.edit)"
          >
            <router-link
              :to="`/users/edit-permissions/${department.id}`"
              class="text-gray-800 text-hover-primary mb-1"
            >
              <span class="svg-icon svg-icon-3">
                <i class="bi bi-shield-lock-fill"></i>
              </span>
            </router-link>
          </button>
        </template>
        <template v-slot:multi_sub_departments_assignment="{ row: user }">
          <!-- <div v-for="(item, index) in user?.userDepartments" :key="index">
            {{ item.sub_department_id }}
            <span
              v-html="RecordStatusBadge(item.sub_department_id)"
              class="pe-2"
              v-if="item.sub_department_id"
            >
            </span>
          </div> -->
          <div>
            <template
              v-for="(item, index) in user.userDepartments"
              :key="index"
            >
              <span :class="`badge badge-info`" class="me-1">
                {{ item.subDepartment.name }}
              </span>
            </template>
          </div>
        </template>
        <template v-slot:last_login="{ row: user }">
          {{ $format.datetimeFormat(user.last_login) }}
        </template>
        <template v-slot:record_status="{ row: user }">
          <div>
            <span v-html="RecordStatusBadge(user.record_status)" class="pe-2">
            </span>
          </div>
        </template>
      </KTDataTable>
    </template>
  </crud-view-layout>
  <!--end::Card-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import { imageUrl, RegionBadge, RecordStatusBadge } from "@/core/helpers/utils";
import CurdApiService from "@/core/services/CurdApiService";
import { QueryParams } from "@/core/interface/interfaces";
import { AlertForDelete } from "@/core/helpers/sweetAlert.utils";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import { permissions } from "@/constants/permissions-constants";
import ProfileImage from "@/components/shared/ProfileImage.vue";

export default defineComponent({
  name: "user-list",
  components: {
    KTDataTable,
    CrudViewLayout,
    ProfileImage,
  },
  setup() {
    const tableKey = ref(0);
    const headerConfig = ref([
      {
        columnLabel: "full name",
        key: "full_name",
      },
      {
        columnLabel: "Username",
        key: "username",
      },
      { key: "user_type" },
      {
        columnLabel: "Department",
        key: "department",
      },
      {
        columnLabel: "Sub Department",
        key: "sub_department",
      },
      {
        columnLabel: "Multiple Subdepartments Assignment",
        key: "multi_sub_departments_assignment",
      },
      {
        columnLabel: "Region/s",
        key: "regions",
      },
      {
        columnLabel: "Roles",
        key: "roles",
      },
      {
        columnLabel: "email",
        key: "email",
      },
      {
        columnLabel: "Last Logged-in",
        key: "last_login",
        sortEnabled: true,
      },
      {
        columnLabel: "Status",
        key: "record_status",
      },
      {
        columnLabel: "Actions",
        key: "actions",
      },
    ]);
    const searchPlaceholder = "Search Users";
    async function fetchData(queryParams?: QueryParams) {
      const response = await CurdApiService.getAll("users", {
        ...queryParams,
      });
      return response.data.data;
    }

    return {
      headerConfig,
      RegionBadge,
      imageUrl,
      searchPlaceholder,
      fetchData,
      tableKey,
      permissions,
      RecordStatusBadge,
    };
  },
});
</script>

<style scoped>
.no-hover {
  pointer-events: none;
}
.text-hover-primary:hover {
  color: var(--kt-primary); /* Bootstrap primary color */
}
.disabled-link {
  pointer-events: none;
  cursor: not-allowed;
  text-decoration: none;
  color: inherit;
}
</style>
