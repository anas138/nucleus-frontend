<template>
  <div class="card mb-2">
    <!--begin::Card header-->
    <div
      class="card-header cursor-pointer bg-secondary"
      role="button"
      data-bs-target="#advanceAlarmConfig"
      data-bs-toggle="collapse"
      aria-expanded="true"
      aria-controls="advanceAlarmConfig"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Advance Conditions</h3>
        <span class="fs-6 fst-italic hint-class fw-normal mx-1"
          >(You can configure multiple fields-level conditions for any rule be
          matched)</span
        >
      </div>
      <!--end::Card title-->
    </div>
    <!--begin::Card header-->

    <div id="advanceAlarmConfig" class="collapse show pt-3">
      <div
        class="d-flex justify-content-end align-items-end mb-3"
        v-if="!disabled"
      >
        <el-button
          type="primary"
          :icon="Plus"
          round
          :disabled="
            disabled ||
            !(data.length === 0 || data[data.length - 1]?.field_value)
          "
          @click="addCondition"
        >
          Add Condition
        </el-button>
      </div>
      <div
        class="row mb-2"
        v-for="(value, key) in data"
        :key="`${key}-advance-condition`"
      >
        <div class="col-xs-6 col-sm-6 col-md-3">
          <drop-down-from-server
            name="field_name"
            placeholder="Field"
            v-model="value.field_name"
            :clearable="false"
            :dropDownCatagory="
              appType === AppConstants.APP_TYPE.NCE
                ? dropDownsCategory.NCE_ALARM_FIELD_NAMES
                : appType === AppConstants.APP_TYPE.OBSERVIUM
                ? dropDownsCategory.OBS_ALARM_FIELD_NAMES
                : appType === AppConstants.APP_TYPE.NCE_GPON
                ? dropDownsCategory.GPON_ALARM_FIELD_NAMES
                : appType === AppConstants.APP_TYPE.NOKIA_TXN
                ? dropDownsCategory.NOKIA_TXN_ALARM_FIELD_NAMES
                : dropDownsCategory.LDI_SOFTSWITCH_ALARM_FIELD_NAME
            "
            @change="change(key, 'field_name')"
            :disabled="disabled"
          />
          <div class="fv-plugins-message-container" v-if="errorMessageToggled">
            <div class="fv-help-block">
              <div class="error-message">
                {{ errors[key]?.field_name }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3">
          <drop-down-from-server
            name="search_criteria"
            placeholder="Search Criteria"
            :disabled="disabled || !data[key].field_name"
            v-model="value.search_criteria"
            :dropDownCatagory="
              dropDownsCategory.ALARM_FILTER_ADVANCE_CONDITION_SEARCH_CRITERIA
            "
            @change="change(key, 'search_criteria')"
            :clearable="false"
          />
          <div class="fv-plugins-message-container" v-if="errorMessageToggled">
            <div class="fv-help-block">
              <div class="error-message">
                {{ errors[key]?.search_criteria }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6">
          <div class="row">
            <div class="col-md-10">
              <basic-text-input
                placeholder="Enter Conditions"
                name="field_value"
                :disabled="disabled || !data[key].search_criteria"
                v-model="value.field_value"
                @change="change(key, 'field_value')"
              />
              <div
                class="fv-plugins-message-container"
                v-if="errorMessageToggled"
              >
                <div class="fv-help-block">
                  <div class="error-message">
                    {{ errors[key]?.field_value }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-2" v-if="!disabled">
              <el-button
                type="primary"
                class="bg-danger"
                :icon="Delete"
                round
                v-show="data.length > 1 || data[data.length - 1].field_value"
                @click="deleteCondition(key)"
                :disabled="disabled"
              >
              </el-button>
            </div>
          </div>
          <div
            class="col-10 fs-6 fst-italic hint-class fw-normal"
            v-if="key == data.length - 1"
          >
            (Input single string or comma-separated strings to be matched in OR
            scenario for selected field)
          </div>
        </div>
      </div>
      <div class="fv-plugins-message-container" v-if="!isRowUnique">
        <div class="fv-help-block">
          <div class="error-message">Same Advance Condition Found</div>
        </div>
      </div>
      <hr />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from "vue";
import DropDownFromServer from "@/components/shared/dropdowns/DropDownFromServer.vue";
import { dropDownsCategory } from "@/constants/drop-down-from-server";
import BasicTextInput from "@/components/shared/inputs/basicTextInput.vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { proxyToObject } from "@/core/helpers/utils";
import * as _ from "lodash";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import { AdvanceConditionFormModel } from "@/core/model/advance-alarm-condition-form-model";
import AlarmConfigService from "@/core/services/AlarmConfigService";
import { ElNotification } from "element-plus";
import { FormValidationCommonRules } from "@/constants/FormValidationRules";
import { AppConstants } from "@/constants/app-constants";
export default {
  components: { DropDownFromServer, BasicTextInput },
  props: {
    name: {
      type: String,
      required: true,
    },
    appType: {
      type: String,
      required: true,
      validator: function (value) {
        return (
          value === AppConstants.APP_TYPE.NCE ||
          value === AppConstants.APP_TYPE.OBSERVIUM ||
          value === AppConstants.APP_TYPE.NCE_GPON ||
          value === AppConstants.APP_TYPE.NOKIA_TXN ||
          value === AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS
        );
      },
    },
    value: {
      type: Array,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    errorMessageToggled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["change", "isValid"],
  setup(props, ctx) {
    const data = ref<Array<any>>(
      props?.value?.length ? props.value : [{ ...AdvanceConditionFormModel }]
    );

    //sends validation as true on initail form load
    ctx.emit("isValid", {
      value: true,
      name: props.name,
    });

    //sends value as empty array on initail form load in case of create
    // or value in case of edit
    ctx.emit("change", {
      value: props.value || [],
      name: props.name,
    });

    const validationSchema = createYupValidationSchema({
      field_name: FormValidationCommonRules.commonText,
      search_criteria: FormValidationCommonRules.commonText,
      field_value: FormValidationCommonRules.commonText,
    });
    const errors = ref<Array<any>>([]);

    const isRowUnique = ref(true);
    function change(id: number, name: string) {
      const ArrayId = String(id);
      if (!errors.value[ArrayId] && !data.value[ArrayId].search_criteria) {
        // Initialize the object if it doesn't exist
        errors.value[ArrayId] = {
          field_name: "",
          search_criteria: "Selection is Required",
          field_value: "Conditions is Required",
        };
      }

      isRowUnique.value =
        _.uniqBy(data.value, "field_name").length === data.value.length ||
        _.uniqBy(data.value, "field_value").length === data.value.length ||
        _.uniqBy(data.value, "search_criteria").length === data.value.length;

      validationSchema
        .validateAt(name, data.value[ArrayId], { stripUnknown: true })
        .then(() => {
          // Validation successful, emit isValid with true
          // ctx.emit("isValid", { value: true, name: props.name });
          errors.value[ArrayId] && delete errors.value[ArrayId][name];
          const isValidResponse =
            _.every(errors.value, (obj) => _.isEmpty(obj)) && isRowUnique.value;
          ctx.emit("isValid", { value: isValidResponse, name: props.name });
        })
        .catch((error) => {
          // Validation failed, emit isValid with false and error messages
          ctx.emit("isValid", { value: false, name: props.name });
          errors.value[ArrayId][name] = error.errors[0];
        });
    }

    watch(data.value, (newData) => {
      newData[newData.length - 1]?.field_name &&
        ctx.emit("change", {
          name: props.name,
          value: proxyToObject(data.value),
        });
    });
    function addCondition() {
      isRowUnique.value && data.value.push({ ...AdvanceConditionFormModel });
    }
    async function deleteCondition(key) {
      data.value.splice(key, 1);
      ctx.emit("change", {
        name: props.name,
        value: proxyToObject(data.value),
      });
      isRowUnique.value =
        _.uniqBy(data.value, "field_name").length === data.value.length ||
        _.uniqBy(data.value, "field_value").length === data.value.length ||
        _.uniqBy(data.value, "search_criteria").length === data.value.length;

      if (errors.value[key]) {
        delete errors.value[key];
        ctx.emit("isValid", { value: true, name: props.name });
      }
      if (isRowUnique.value) {
        ctx.emit("isValid", { value: true, name: props.name });
      }
    }
    return {
      change,
      dropDownsCategory,
      data,
      addCondition,
      Plus,
      isRowUnique,
      errors,
      Delete,
      deleteCondition,
      AppConstants,
    };
  },
};
</script>

<style></style>
