<template>
  <crud-view-layout>
    <template #body>
      <ReuseableForm
        v-if="formConfig.fields"
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
import { getCategoryFormConfig } from "./category-form-config";
import CurdApiService from "@/core/services/CurdApiService";
import { AlertForCreate } from "@/core/helpers/sweetAlert.utils";
import { IFormConfig } from "@/core/interface/form-config-interface";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";

export default defineComponent({
  components: {
    ReuseableForm,
    CrudViewLayout,
  },
  setup() {
    const formConfig = ref({} as IFormConfig);
    onMounted(async () => {
      formConfig.value = await getCategoryFormConfig();
    });
    async function submit(data) {
      const response = await CurdApiService.createResource(data, "tt-category");
      AlertForCreate(response, "category");
    }
    return {
      formConfig,
      submit,
    };
  },
});
</script>
