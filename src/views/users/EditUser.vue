<template>
  <crud-view-layout>
    <template v-slot:actions>
      <button
        class="btn btn-primary d-flex flex-stack"
        @click="() => (openEditUserPermissionDrawer = true)"
        v-if="$hasPermission(permissions.permissions.edit)"
      >
        <i class="bi bi-shield-lock-fill mb-1 me-1"></i>
        <span> Edit Permissions </span>
      </button>
    </template>
    <template #body>
      <ReuseableForm
        v-if="userFormConfig"
        :fields="userFormConfig.fields"
        :validationSchema="userFormConfig.validationSchema"
        @submit="submit"
        :key="formKey"
      />
      <EditUserPermissionDrawer
        :key="id"
        :ticketId="id"
        :openEditUserPermissionDrawer="openEditUserPermissionDrawer"
        v-model:openDrawer="openEditUserPermissionDrawer"
      />
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import ReuseableForm from "@/components/forms/ReuseableForm.vue";
import { getuserFormConfig } from "./create-user-form-config";
import { useRoute } from "vue-router";
import CurdApiService from "@/core/services/CurdApiService";
import { AlertForEdit } from "@/core/helpers/sweetAlert.utils";
import { AxiosResponse } from "axios";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import EditUserPermissionDrawer from "@/components/user-components/EditUserPermissionDrawer.vue";
import { permissions } from "@/constants/permissions-constants";

export default defineComponent({
  name: "Edit-User",
  components: {
    ReuseableForm,
    CrudViewLayout,
    EditUserPermissionDrawer,
  },
  setup() {
    const route = useRoute();
    const userFormConfig = ref();
    const formKey = ref(0);
    const id = route.params.id;
    const openEditUserPermissionDrawer = ref(false);

    onMounted(async () => {
      userFormConfig.value = await getuserFormConfig(true, String(id));
      formKey.value++;
    });
    async function submit(data) {
      data = {
        ...data,
        role_ids: data.role,
        region_ids: data.region,
        department_id: data.department,
        designation_id: data.designation,
        sub_department_id: data["sub department"],
      };
      delete data.department;
      delete data.designation;
      const response: AxiosResponse = await CurdApiService.editResource(
        data,
        "users",
        String(id)
      );
      AlertForEdit(response, "users");
    }
    return {
      id,
      userFormConfig,
      formKey,
      submit,
      permissions,
      openEditUserPermissionDrawer,
    };
  },
});
</script>
