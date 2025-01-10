<template>
  <crud-view-layout>
    <template #body>
      <ReuseableForm
        v-if="formConfig"
        :fields="formConfig.fields"
        :validationSchema="formConfig.validationSchema"
        @submit="submit"
        :actionButton="formConfig.actionButton"
      />
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import ReuseableForm from "@/components/forms/ReuseableForm.vue";
import { getformConfig } from "./role-form-config";
import CurdApiService from "@/core/services/CurdApiService";
import { AlertForCreate } from "@/core/helpers/sweetAlert.utils";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";

export default defineComponent({
  name: "Add-Role",
  components: {
    ReuseableForm,
    CrudViewLayout,
  },
  setup() {
    const formConfig = ref();
    onMounted(async () => {
      formConfig.value = await getformConfig();
    });
    async function submit(data) {
      const response = await CurdApiService.createResource(data, "roles");
      AlertForCreate(response, "roles");
    }
    return {
      formConfig,
      submit,
    };
  },
});
</script>
