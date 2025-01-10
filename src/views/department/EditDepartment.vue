<template>
  <crud-view-layout>
    <template #body>
      <ReuseableForm
        v-if="formConfig.fields"
        :key="formKey"
        :fields="formConfig.fields"
        :validationSchema="formConfig.validationSchema"
        :actionButton="formConfig.actionButton"
        @submit="submit"
      />
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ReuseableForm from "@/components/forms/ReuseableForm.vue";
import { getDepartmentFormConfig } from "./depatment-form-config";
import { useRoute } from "vue-router";
import CurdApiService from "@/core/services/CurdApiService";
import { AlertForEdit } from "@/core/helpers/sweetAlert.utils";
import { IFormConfig } from "@/core/interface/form-config-interface";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";

export default defineComponent({
  name: "edit-Departmant",
  components: {
    ReuseableForm,
    CrudViewLayout,
  },
  setup() {
    const route = useRoute();
    const formKey = ref(0); // Add a reactive key to force re-rendering
    const formConfig = ref({} as IFormConfig);

    async function fetchData() {
      formConfig.value = await getDepartmentFormConfig(
        true,
        String(route.params.id)
      );
      formKey.value++;
    }
    fetchData();

    async function submit(data) {
      const response = await CurdApiService.editResource(
        data,
        "department",
        String(route.params.id)
      );

      AlertForEdit(response, "department");
    }

    return {
      formKey,
      formConfig,
      submit,
    };
  },
});
</script>
