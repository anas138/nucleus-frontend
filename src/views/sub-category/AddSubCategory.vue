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
import { getSubCategoryFormConfig } from "./sub-category-form-config";
import CurdApiService from "@/core/services/CurdApiService";
import { AlertForCreate } from "@/core/helpers/sweetAlert.utils";
import { IFormConfig } from "@/core/interface/form-config-interface";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    ReuseableForm,
    CrudViewLayout,
  },
  setup() {
    const route = useRoute();
    const parent_id = Number(route.params.id);
    const formConfig = ref({} as IFormConfig);
    onMounted(async () => {
      formConfig.value = await getSubCategoryFormConfig();
    });
    async function submit(data) {
      const response = await CurdApiService.createResource(
        { ...data, parent_id },
        "tt-category"
      );
      AlertForCreate(response, "sub-category");
    }
    return {
      formConfig,
      submit,
    };
  },
});
</script>
