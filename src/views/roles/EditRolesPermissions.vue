<template>
  <div class="card mb-5 mb-xl-10">
    <div
      class="card-header border-0 bg-primary"
      data-bs-target="#kt_account_profile_details"
      aria-expanded="true"
      aria-controls="kt_account_profile_details"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0 text-white">{{ roleName }}</h3>
      </div>
      <!--end::Card title-->
    </div>
    <div class="card-body">
      <el-tree
        v-if="data"
        ref="treeRef"
        :data="data.tree"
        show-checkbox
        node-key="id"
        :default-checked-keys="data.currentPermissionsIdsArray"
        :default-expanded-keys="data.rootId"
      />
      <el-skeleton v-else :rows="10" animated />
    </div>
    <div class="card-footer d-flex justify-content-end py-6 px-9">
      <button class="btn btn-primary" @click="updatePermissions">
        <span class="indicator-label"> Update Permissions </span>
        <span class="indicator-progress">
          Please wait...
          <span
            class="spinner-border spinner-border-sm align-middle ms-2"
          ></span>
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { AlertForEdit } from "@/core/helpers/sweetAlert.utils";
import { getRolePermissionsTree, proxyToObject } from "@/core/helpers/utils";
import { IPermission } from "@/core/interface/permission-interface";
import CurdApiService from "@/core/services/CurdApiService";
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "edit-role-permissions",
  components: {},
  setup() {
    const id = useRoute().params.id;
    const data = ref();
    const roleName = ref("");
    let permissions: number[] = [];
    const treeRef = ref();

    onMounted(async () => {
      const response = await CurdApiService.getById("roles", String(id));
      const currentPermissions: IPermission[] = response.data.data.permissions;
      const remainingPermissions: IPermission[] = (
        await CurdApiService.getById("roles", `${id}/remaining-permissions`)
      ).data.data;

      data.value = getRolePermissionsTree(
        currentPermissions,
        remainingPermissions
      );
      roleName.value = response.data.data.name;

      permissions = proxyToObject(data.value.currentPermissionsIdsArray);
    });

    async function updatePermissions() {
      permissions = getCheckedKeys();
      const response = await CurdApiService.editResource(
        { permissionIds: Array.from(new Set([...permissions])) },
        `roles`,
        `${String(id)}/permissions`
      );
      AlertForEdit(response, "roles");
    }
    const getCheckedKeys = () => {
      return treeRef.value!.getCheckedKeys(true);
    };

    return {
      data,
      roleName,
      updatePermissions,
      treeRef,
    };
  },
});
</script>
