<template>
  <crud-view-layout>
    <template #body>
      <ReuseableForm
        v-if="userFormConfig"
        :fields="userFormConfig.fields"
        :validationSchema="userFormConfig.validationSchema"
        @submit="submit"
      />
    </template>
  </crud-view-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import ReuseableForm from "@/components/forms/ReuseableForm.vue";
import { getuserFormConfig } from "./create-user-form-config";
import CurdApiService from "@/core/services/CurdApiService";
import { AlertForCreate } from "@/core/helpers/sweetAlert.utils";
import { replaceSpacesInKeysWithUnderScore } from "@/core/helpers/utils";
import CrudViewLayout from "@/layouts/crud-layout/CrudViewLayout.vue";

export default defineComponent({
  name: "Add-User",
  components: {
    ReuseableForm,
    CrudViewLayout,
  },
  setup() {
    const userFormConfig = ref();

    onMounted(async () => {
      userFormConfig.value = await getuserFormConfig();
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

      const resposne = await CurdApiService.createResource(
        replaceSpacesInKeysWithUnderScore(data),
        "users"
      );
      AlertForCreate(resposne, "users");
    }
    return {
      userFormConfig,
      submit,
    };
  },
});
</script>
