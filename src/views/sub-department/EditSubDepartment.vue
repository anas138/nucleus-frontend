<template>
  <crud-view-layout>
    <template #body>
      <ReuseableForm
        v-if="formConfig"
        :key="formKey"
        :fields="formConfig.fields"
        :validationSchema="formConfig.validationSchema"
        @submit="submit"
      />
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ReuseableForm from "@/components/forms/ReuseableForm.vue";
import { getformConfig } from "./sub-depatment-form-config";
import { useRoute } from "vue-router";
import CurdApiService from "@/core/services/CurdApiService";
import { AlertForEdit } from "@/core/helpers/sweetAlert.utils";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
export default defineComponent({
  name: "Edit-Sub-Departmant",
  components: {
    ReuseableForm,
    CrudViewLayout,
  },
  setup() {
    const route = useRoute();
    const formKey = ref(0); // Add a reactive key to force re-rendering
    const formConfig = ref();

    async function fetchData() {
      formConfig.value = await getformConfig(true, String(route.params.id));
      formKey.value++;
    }

    fetchData();
    async function submit(data) {
      const response = await CurdApiService.editResource(
        data,
        "subdepartment",
        String(route.params.id)
      );
      AlertForEdit(response, "sub-department");
    }

    return {
      formKey,
      formConfig,
      submit,
    };
  },
});
</script>
