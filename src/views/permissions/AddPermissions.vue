<template>
  <crud-view-layout>
    <template #body>
      <ReuseableForm
        :fields="formConfig.fields"
        :validationSchema="formConfig.validationSchema"
        @submit="submit"
        :actionButton="formConfig.actionButton"
      />
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ReuseableForm from "@/components/forms/ReuseableForm.vue";
import { formConfig } from "./permissions-form-config";
import CurdApiService from "@/core/services/CurdApiService";
import { AlertForCreate } from "@/core/helpers/sweetAlert.utils";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";

export default defineComponent({
  name: "Add-Permissions",
  components: {
    ReuseableForm,
    CrudViewLayout,
  },
  setup() {
    async function submit(data) {
      const response = await CurdApiService.createResource(data, "Permissions");
      AlertForCreate(response, "permissions");
    }
    return {
      formConfig,
      submit,
    };
  },
});
</script>
