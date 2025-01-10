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
        <h3 class="fw-bold m-0 text-white">
          Update Permissions {{ name ? `( ${name} )` : "" }}
        </h3>
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
import { ElNotificationSuccess } from "@/core/helpers/ElNotification.utils";
import { AlertForEdit } from "@/core/helpers/sweetAlert.utils";
import { getRolePermissionsTree } from "@/core/helpers/utils";
import { IPermission } from "@/core/interface/permission-interface";
import CurdApiService from "@/core/services/CurdApiService";
import _ from "lodash";
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";

export default defineComponent({
  name: "edit-user-permissions",
  components: {},
  emits: ["close-drawer"],
  props: {
    id: { type: Number, required: false },
    isDrawer: { type: Boolean, required: false, default: false },
  },
  setup(props, { emit }) {
    const id = useRoute().params.id || props.id;
    const data = ref();
    const name = ref("");
    let permissions: number[] = [];
    let disabledPermissions: IPermission[];
    const treeRef = ref();

    onMounted(async () => {
      const response = await CurdApiService.getById("users", String(id));
      const currentPermissions: IPermission[] = response.data.data.permissions;

      const remainingPermissions: IPermission[] = (
        await CurdApiService.getById("users", `${id}/remaining-permissions`)
      ).data.data;

      disabledPermissions = response.data.data.role_permissions;

      data.value = getRolePermissionsTree(
        currentPermissions,
        remainingPermissions,
        disabledPermissions
      );
      name.value = response.data.data.full_name;
    });

    async function updatePermissions() {
      permissions = getCheckedKeys();
      permissions = _.difference(
        permissions,
        disabledPermissions.map((permission) => {
          return permission.id;
        })
      );
      console;
      const response = await CurdApiService.editResource(
        { permissionIds: permissions },
        `users`,
        `${String(id)}/permissions`
      );
      ElNotificationSuccess(response.data.message);
      if (props.isDrawer) {
        emit("close-drawer");
      } else {
        router.push({ name: `users-list` });
      }
    }
    const getCheckedKeys = () => {
      return treeRef.value!.getCheckedKeys(true);
    };
    return {
      data,
      name,
      updatePermissions,
      treeRef,
    };
  },
});
</script>
