<template>
  <div>
    <button
      class="btn btn-primary me-2"
      @click="dialogFormVisible = true"
      type="button"
    >
      Save Template
    </button>
    <el-dialog v-model="dialogFormVisible" :show-close="false" width="30%">
      <template #header="{ close, titleId, titleClass }">
        <div class="d-flex justify-content-between">
          <h4 :id="titleId" :class="titleClass" class="text-white">
            Filter Template Management
          </h4>
          <ModalCloseButton @close="close" />
        </div>
      </template>
      <el-form :model="form" ref="formRef" label-position="left" :rules="rules">
        <el-form-item label="Template Name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Comments" :label-width="formLabelWidth">
          <el-input v-model="form.comments" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveTemplate(formRef)">
            Save
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { onBeforeMount, reactive, ref, watch } from "vue";
import { prepareDataForServer } from "@/core/helpers/utils";
import { FiltersTemplateActions } from "@/store/enums/StoreEnums";
import { FilterTemplateFormModel } from "@/core/model/filter-template-form-model";
import { FormInstance, FormRules } from "element-plus";
import { useStore } from "vuex";
import { ModuleName } from "@/store/enums/module-enum";
import ModalCloseButton from "@/components/shared/buttons/ModalCloseButton.vue";

export default {
  components: { ModalCloseButton },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    templateType: {
      type: String,
    },
    filtersForm: {
      type: Object,
    },
  },
  setup(props, context) {
    let dialogFormVisible = ref(true);
    let form = reactive({ ...FilterTemplateFormModel });
    let formRef = ref<FormInstance | null>(null);
    let formLabelWidth = "130px";
    const store = useStore();
    const rules = reactive<FormRules>({
      name: [{ required: true, message: "Name is required" }],
    });

    onBeforeMount(() => {
      dialogFormVisible.value = props.showDialog;
    });

    watch(
      () => props.showDialog,
      (value) => {
        dialogFormVisible.value = value;
      }
    );
    watch(dialogFormVisible, (value) => {
      // context.emit("update:showDialog", value);
    });

    const methods = {
      async saveTemplate(formEl: FormInstance | undefined) {
        if (!formEl) return;
        await formEl.validate(async (valid, fields) => {
          if (valid) {
            const payload = JSON.stringify(
              prepareDataForServer(props.filtersForm)
            );
            const savePayload = {
              name: form.name,
              template_type: props.templateType,
              filters_payload: payload,
            };
            await store
              .dispatch(
                `${ModuleName.filtersTemplate}/${FiltersTemplateActions.SAVE_FILTERS_TEMPLATE}`,
                savePayload
              )
              .finally(() => {
                dialogFormVisible.value = false;
              });
          }
        });
      },
    };

    return {
      ...methods,
      dialogFormVisible,
      form,
      formRef,
      formLabelWidth,
      rules,
    };
  },
};
</script>

<style></style>
