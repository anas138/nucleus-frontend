<template>
  <div class="card mb-2">
    <!--begin::Card header-->
    <div
      class="card-header cursor-pointer bg-secondary"
      role="button"
      data-bs-target="#AlarmRecipient"
      data-bs-toggle="collapse"
      aria-expanded="true"
      aria-controls="AlarmRecipient"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0 required">Alarm Recipients</h3>
        <span class="fs-6 fst-italic hint-class fw-normal mx-1"
          >(You can setup multiple email recipients for alarm's
          escalation)</span
        >
      </div>
      <!--end::Card title-->
    </div>
    <!--begin::Card header-->

    <div id="AlarmRecipient" class="collapse show pt-3">
      <div class="d-flex justify-content-end align-items-end mb-3">
        <el-button
          type="primary"
          :icon="Plus"
          round
          :disabled="
            disabled || !Number.isInteger(data[data.length - 1].recipient_id)
          "
          @click="addRecipient"
          v-if="!disabled"
        >
          Add Recipient
        </el-button>
      </div>
      <div v-for="(row, key) in data" :key="key">
        <div class="row mb-2">
          <div class="col-xs-6 col-sm-6 col-md-3">
            <basic-drop-down
              v-model="row.recipient_type"
              name="recipient_type"
              :disabled="disabled || key === 0"
              :list="recipientType"
              :clearable="false"
              @change="
                (Data) => {
                  change(key, Data);
                }
              "
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-3" v-if="toggledValue">
            <basic-drop-down
              :name="'recipient'"
              v-model="row.recipient"
              placeholder="Select User Type"
              :disabled="disabled"
              :list="userType"
              :clearable="false"
              @change="
                (Data) => {
                  change(key, Data);
                }
              "
            />
            <div
              class="fv-plugins-message-container"
              v-if="errorMessageToggled"
            >
              <div class="fv-help-block">
                <div class="error-message">
                  {{ errors[key]?.recipient }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="row">
              <div class="col-md-10">
                <sub-department-name-drop-down
                  v-if="row.recipient === UserTypeEnum.sub_department_id"
                  :name="'recipient_id'"
                  v-model="data[key].recipient_id"
                  :disabled="disabled || !(Object.keys(data[key]).length >= 2)"
                  :clearable="false"
                  @change="
                    (Data) => {
                      change(key, Data);
                    }
                  "
                />
                <employee-drop-down
                  v-else-if="row.recipient === UserTypeEnum.single_user_id"
                  :name="'recipient_id'"
                  v-model="data[key].recipient_id"
                  :clearable="false"
                  :disabled="disabled || !(Object.keys(data[key]).length >= 2)"
                  @change="
                    (Data) => {
                      change(key, Data);
                    }
                  "
                />
                <group-user-drop-down
                  v-else-if="row.recipient === UserTypeEnum.group_user_id"
                  :name="'recipient_id'"
                  v-model="data[key].recipient_id"
                  :clearable="false"
                  :disabled="disabled || !(Object.keys(data[key]).length >= 2)"
                  @change="
                    (Data) => {
                      change(key, Data);
                    }
                  "
                />
              </div>
              <div class="col-md-2" v-if="!disabled">
                <el-button
                  type="primary"
                  class="bg-danger"
                  :icon="Delete"
                  round
                  v-show="key !== 0"
                  @click="deleteRecipient(key)"
                  :disabled="disabled"
                >
                  <!-- v-show="row.recipient_type === 'CC'" -->
                </el-button>
              </div>
            </div>
            <div
              class="fv-plugins-message-container"
              v-if="errorMessageToggled"
            >
              <div class="fv-help-block">
                <div class="error-message">
                  {{ errors[key]?.recipient_id }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="fv-plugins-message-container" v-if="!isRowUnique">
        <div class="fv-help-block">
          <div class="error-message">Same Recipient Found</div>
        </div>
      </div> -->
      <hr />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from "vue";
import BasicTextInput from "@/components/shared/inputs/basicTextInput.vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { proxyToObject } from "@/core/helpers/utils";
import BasicDropDown from "@/components/shared/dropdowns/BasicDropDown.vue";
import { basicDropDownListValue } from "@/core/interface/interfaces";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import * as _ from "lodash";
import SubDepartmentNameDropDown from "@/components/shared/dropdowns/SubDepartmentNamesDropDown.vue";
import EmployeeDropDown from "@/components/shared/dropdowns/EmployeeDropDown.vue";
import GroupUserDropDown from "@/components/shared/dropdowns/GroupUserDropDown.vue";
import AlarmConfigService from "@/core/services/AlarmConfigService";
import { ElNotification } from "element-plus";

export default {
  components: {
    BasicDropDown,
    SubDepartmentNameDropDown,
    EmployeeDropDown,
    GroupUserDropDown,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      required: false,
      type: Array,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    toggledValue: {
      type: Boolean,
      required: false,
    },
    errorMessageToggled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["change", "isValid", "resetFromParent"],
  setup(props, ctx) {
    const data = ref(
      props.value?.length > 0 ? props.value : [{ recipient_type: "To" }]
    );
    const recipientType = [
      { key: "To", label: "To" },
      { key: "CC", label: "CC" },
    ];
    const UserTypeEnum = {
      single_user_id: "single_user_id",
      group_user_id: "group_user_id",
      sub_department_id: "sub_department_id",
    };
    // for getting the user Type
    const userType = [
      { key: UserTypeEnum.single_user_id, label: " Single User" },
      { key: UserTypeEnum.group_user_id, label: " Group User" },
      { key: UserTypeEnum.sub_department_id, label: "Sub-Department" },
    ];

    // for getting the userIds
    const UserIds = ref([] as Array<basicDropDownListValue[]>);

    //sends validation as false/true on initail form load
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
      recipient: "required",
      recipient_id: "required&&numberRequired",
    });
    const errors = ref<Array<any>>([]);

    // const isRowUnique = ref(true);

    async function change(id: number, newValue: { name: string; value: any }) {
      const ArrayId = String(id);

      // Initialize the object if it doesn't exist
      if (
        !errors.value[ArrayId] &&
        !(newValue.name === "recipient_id") &&
        newValue.name !== "recipient_type"
      ) {
        errors.value[ArrayId] = {
          recipient: "Selection is Required",
          recipient_id: "Selection is Required",
        };
      }

      if (newValue.name === "recipient") {
        data.value[ArrayId].recipient_id = "";
        //if value of recipient is changed then
        //add error
        errors.value[ArrayId] = {
          recipient_id: "Selection is Required",
        };
      }
      ctx.emit("change", {
        name: props.name,
        value: proxyToObject(data.value),
      });

      // isRowUnique.value =
      //   _.uniqBy(data.value, "recipient_id").length === data.value.length;
      validationSchema
        .validateAt(newValue.name, data.value[ArrayId])
        .then(() => {
          // Validation successful, emit isValid with true
          // ctx.emit("isValid", { value: true, name: props.name });

          errors.value[ArrayId] && delete errors.value[ArrayId][newValue.name];

          const isValidResponse = _.every(errors.value, (obj) =>
            _.isEmpty(obj)
          );
          ctx.emit("isValid", { value: isValidResponse, name: props.name });
        })
        .catch((error) => {
          // Validation failed, emit isValid with false and error messages
          ctx.emit("isValid", { value: false, name: props.name });
          errors.value[ArrayId][newValue.name] = error.errors[0];
        });
    }
    function addRecipient() {
      // if (isRowUnique.value) {
      data.value.push({ recipient_type: "CC" });
      data.value?.map((item, index) => {
        if (!item.recipient) {
          errors.value[index] = {
            recipient: "User type is Required",
          };
          ctx.emit("isValid", { value: false, name: props.name });
        }
      });
      // }
    }
    async function deleteRecipient(key) {
      data.value.splice(key, 1);
      ctx.emit("change", {
        name: props.name,
        value: proxyToObject(data.value),
      });
      // isRowUnique.value =
      //   _.uniqBy(data.value, "recipient_id").length === data.value.length;
      if (errors.value[key]) {
        delete errors.value[key];
        ctx.emit("isValid", { value: true, name: props.name });
      }

      // if (isRowUnique.value) {
      //   ctx.emit("isValid", { value: true, name: props.name });
      // }
    }

    watch(
      () => props.toggledValue,
      (val) => {
        if (!val) {
          data.value = [{ recipient_type: "To" }];
          errors.value = [];
          ctx.emit("isValid", { value: true, name: props.name });
          ctx.emit("resetFromParent");
        } else {
          if (!data.value[0].recipient) {
            errors.value.push({ recipient: "User type is Required" });
            ctx.emit("isValid", { value: false, name: props.name });
          }
        }
      },
      {
        immediate: true,
      }
    );

    return {
      change,
      data,
      recipientType,
      addRecipient,
      Plus,
      userType,
      UserIds,
      errors,
      // isRowUnique,
      UserTypeEnum,
      Delete,
      deleteRecipient,
    };
  },
};
</script>

<style>
/* .no-gutters {
  margin-left: 0;
  margin-right: 0;
}

.no-gutters > [class^="col-"] {
  padding-left: 0;
  padding-right: 0;
} */
</style>
