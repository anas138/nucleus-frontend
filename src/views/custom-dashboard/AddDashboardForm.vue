<template>
  <div class="card mb-5 mb-xl-10">
    <div
      class="card-header border-0 bg-primary"
      data-bs-target="#kt_account_profile_details"
      aria-expanded="true"
      aria-controls="kt_account_profile_details"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0 text-white">Create custom dashboard</h3>
      </div>
      <!--end::Card title-->
    </div>

    <form @submit.prevent="submit">
      <div class="row m-5">
        <div
          v-for="(field, index) in fields"
          :key="index"
          class="col-md-4 mb-3"
        >
          <div class="d-flex mb-3 align-items-center">
            <div class="me-3">{{ field.title }}</div>
            <el-tooltip
              :content="field.message"
              :placement="'top'"
              v-if="field.message"
            >
              <i
                class="fa-solid fa-info bg-primary rounded-circle px-2 py-1 text-white fs-9"
              ></i
            ></el-tooltip>
          </div>
          <el-input
            :type="field.component"
            :placeholder="field.placeholder"
            :name="field.name"
            v-model="form[field.name]"
            @input="
              (text) => {
                field.value = text;
                field.error = '';
              }
            "
            v-if="field.component == 'textinput'"
          />
          <el-switch
            v-model="form[field.name]"
            @input="
              (val) => {
                field.value = val;
                field.error = '';
              }
            "
            v-else-if="field.component == 'switch'"
          />
          <el-select
            v-model="form[field.name]"
            :name="field.name"
            @change="
              (text) => {
                field.value = text;
                field.error = '';
              }
            "
            :placeholder="field.placeholder"
            :clearable="false"
            v-else-if="field.component == 'dropdown'"
          >
            <el-option
              v-for="(dropDownValue, index) in field.options"
              :key="index"
              :value="dropDownValue.key"
              :label="dropDownValue.label"
            >
              {{ dropDownValue.label }}
            </el-option>
          </el-select>

          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <div class="error-message">
                {{ field.error }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div class="mt-5">
        <div
          class="fw-bold fs-4 mx-8"
          v-if="fields[findIndexADW].app_dashboard_widget"
        >
          Dashboard Widget
        </div>
        <div
          v-for="(field, index) in fields[findIndexADW].app_dashboard_widget"
          :key="index"
          class="row m-5"
        >
          <div
            v-for="(item, index2) in field"
            :key="index2"
            class="col-md-3 mt-3"
          >
            <div class="mb-3">{{ item.title }}</div>
            <el-input
              :type="item.component"
              :placeholder="item.placeholder"
              :name="item.name"
              v-model="item.value"
              @change="onChangeForm"
              @input="() => (item.error = '')"
              v-if="item.component == 'textinput'"
            />
            <el-switch
              v-model="item.value"
              ;@change="onChangeForm"
              @input="() => (item.error = '')"
              v-else-if="item.component == 'switch'"
            />
            <basic-drop-down
              :key="item.value"
              :name="item.name"
              v-model="item.value"
              :placeholder="item.placeholder"
              :list="item.options"
              :clearable="false"
              v-else-if="item.component == 'dropdown'"
              @change="
                (Data) => {
                  item.error = '';
                  onChangeForm();
                }
              "
            />
            <drop-down-from-server
              :name="item.name"
              :placeholder="item.placeholder"
              v-model="item.value"
              :dropDownCatagory="item['dropDownCatagory']"
              :clearable="false"
              :emitDataType="0"
              @change="
                () => {
                  item.error = '';
                  onChangeForm();
                }
              "
              v-else
            />
            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <div class="error-message">
                  {{ item.error }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-2 mt-12" v-show="index != 0">
            <el-button
              type="danger"
              class="bg-danger"
              :icon="Delete"
              round
              @click="RemoveRow(index)"
            >
            </el-button>
          </div>
        </div>
        <button class="btn btn-primary mx-8" type="button" @click="AddRow">
          <i class="fa-solid fa-plus"></i>
          Add More
        </button>
      </div>
      <hr />
      <div class="d-flex justify-content-end mx-8 my-5">
        <button class="btn btn-primary" type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  computed,
  watch,
  reactive,
} from "vue";
import BasicDropDown from "@/components/shared/dropdowns/BasicDropDown.vue";
import { createYupValidationSchema } from "@/core/helpers/FormValidationBuilder";
import * as yup from "yup";
import { object } from "yup";
import { FormValidationCommonRules } from "@/constants/FormValidationRules";
import { useStore } from "vuex";
import { Delete } from "@element-plus/icons-vue";
import { AppConstants } from "@/constants/app-constants";
import AlarmConfigService from "@/core/services/AlarmConfigService";
import { createCustomDashboard } from "@/core/services/CustomAppDashboardService";
import DropDownFromServer from "@/components/shared/dropdowns/DropDownFromServer.vue";
import router from "@/router";
import {
  swalConfirmation,
  swalSuccessConfirmation,
} from "@/core/helpers/sweetAlert.utils";
import { ModuleName } from "@/store/enums/module-enum";
import { dashboardActions } from "@/store/enums/dashboard-enum";
import { permissions } from "@/constants/permissions-constants";
import { PermissionsService } from "@/core/services/PermissionsService";

interface NetworkType {
  key: string;
  label: string;
}

interface AppType {
  key: string;
  label: string;
}

export default defineComponent({
  components: {
    BasicDropDown,
    DropDownFromServer,
  },
  props: {
    openAddDashboardDrawer: { type: Boolean, required: false, default: false },
    isDrawer: { type: Boolean, required: false, default: false },
  },
  emits: ["onClose"],
  setup(props, { emit }) {
    // ---------- logic for determining size of window
    const openDrawer = ref(props.openAddDashboardDrawer);
    const store = useStore();

    const validationSchema = yup.object().shape({
      name: yup.string().required("Dashboard name is required"),
      comment: yup.string().required("Comment is required"),
      is_shared: yup.boolean().required("Is shared is required"),
      app_type: yup.string().required("App type is required"),
    });

    const validationSchema2 = yup.object().shape({
      name: yup.string().required("Widget name is required"),
      widget_type_id: yup.number().required("Widget type is required"),
      alarm_config_id: yup.number().required("Alarm name is required"),
    });

    onMounted(() => {
      permissionNetworkTypeCheck();
    });

    const alarmsName = ref([]);

    const ncePermission = permissions.nce.network;
    const ipPermission = permissions.observium.network;
    const gponPermission = permissions.nceGpon.network;
    const nokiaTXNPermission = permissions.nokiaTXN.network;
    const ldiSoftswitchEMSPermission = permissions.ldiSoftswitchEMS.network;

    const transmissionNetworkType = {
      key: AppConstants.NETWORK_TYPE.TRANSMISSION,
      label: AppConstants.NETWORK_TYPE.TRANSMISSION,
    };

    const ipNetworkType = {
      key: AppConstants.NETWORK_TYPE.IP,
      label: AppConstants.NETWORK_TYPE.IP,
    };

    const gponNetworkType = {
      key: AppConstants.NETWORK_TYPE.GPON,
      label: AppConstants.NETWORK_TYPE.GPON,
    };

    const ldiSoftswitchEMSNetworkType = {
      key: AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH,
      label: AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH,
    };

    const nceAppType = {
      key: AppConstants.APP_TYPE.NCE,
      label: AppConstants.APP_TYPE.NCE,
    };

    const ipAppType = {
      key: AppConstants.APP_TYPE.OBSERVIUM,
      label: AppConstants.APP_TYPE.OBSERVIUM,
    };

    const gponAppType = {
      key: AppConstants.APP_TYPE.NCE_GPON,
      label: AppConstants.APP_TYPE.NCE_GPON,
    };

    const nokiaTXNAppType = {
      key: AppConstants.APP_TYPE.NOKIA_TXN,
      label: AppConstants.APP_TYPE.NOKIA_TXN,
    };

    const ldiSoftswitchEMSAppType = {
      key: AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS,
      label: AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS,
    };

    const networkTypeAccessable = ref<NetworkType[]>([]);
    const appTypeAccessable = ref<AppType[]>([]);

    const permissionNetworkTypeCheck = () => {
      if (
        PermissionsService.hasPermission(ncePermission) ||
        PermissionsService.hasPermission(nokiaTXNPermission)
      ) {
        networkTypeAccessable.value.push(transmissionNetworkType);
      }
      if (PermissionsService.hasPermission(ipPermission)) {
        networkTypeAccessable.value.push(ipNetworkType);
      }
      if (PermissionsService.hasPermission(gponPermission)) {
        networkTypeAccessable.value.push(gponNetworkType);
      }
      if (PermissionsService.hasPermission(ldiSoftswitchEMSPermission)) {
        networkTypeAccessable.value.push(ldiSoftswitchEMSNetworkType);
      }
    };

    let fields = reactive([
      {
        title: "Name",
        name: "name",
        value: "",
        is_required: true,
        component: "textinput",
        placeholder: "Enter dashboard name",
        error: "",
      },
      {
        title: "Network Type",
        name: "network_type",
        message: "Select your network type",
        value: "",
        is_required: true,
        options: networkTypeAccessable,
        component: "dropdown",
        placeholder: "Select Network type",
        error: "",
      },
      {
        title: "NMS",
        name: "app_type",
        message: "Select your NMS",
        value: "",
        is_required: true,
        options: appTypeAccessable,
        component: "dropdown",
        placeholder: "Select NMS",
        error: "",
      },
      {
        title: "Comment",
        name: "comment",
        placeholder: "Enter comment",
        value: "",
        is_required: false,
        component: "textinput",
        error: "",
      },
      {
        title: "Is shared",
        name: "is_shared",
        message: "Share dashboard with others",
        value: false,
        is_required: true,
        component: "switch",
        error: "",
      },
      {
        app_dashboard_widget: [
          {
            name: {
              title: "Widget name",
              name: "name",
              value: "",
              component: "textinput",
              placeholder: "Enter widget name",
              error: "",
            },
            type: {
              title: "Widget Type",
              name: "widget_type_id",
              value: "",
              dropDownCatagory: AppConstants.DASHBOARD_WIDGET_TYPE,
              component: DropDownFromServer,
              placeholder: "Select Widget type",
              error: "",
            },
            alarmName: {
              title: "Alarm Name",
              name: "alarm_config_id",
              value: "",
              component: "dropdown",
              options: alarmsName.value,
              placeholder: "Select alarm name",
              error: "",
            },
          },
        ],
      },
    ]);

    const findIndexADW = fields.findIndex((val) => val.app_dashboard_widget);

    const findIndexNetworkType = fields.findIndex(
      (val) => val.name == "network_type"
    );

    const findIndexAppType = fields.findIndex((val) => val.name == "app_type");

    let form = ref({ is_shared: false, comment: "" });

    const onChangeForm = () => {
      form.value["app_dashboard_widget"] = fields[
        findIndexADW
      ].app_dashboard_widget?.map((val) => {
        return {
          name: val?.name?.value,
          widget_type_id: val?.type?.value,
          alarm_config_id: val?.alarmName?.value,
          comment: "",
        };
      });
    };

    const AddRow = () => {
      fields[findIndexADW].app_dashboard_widget?.push({
        name: {
          title: "Widget name",
          name: "name",
          value: "",
          component: "textinput",
          placeholder: "Enter widget name",
          error: "",
        },
        type: {
          title: "Widget Type",
          name: "widget_type_id",
          value: "",
          dropDownCatagory: AppConstants.DASHBOARD_WIDGET_TYPE,
          component: DropDownFromServer,
          placeholder: "Select Widget type",
          error: "",
        },
        alarmName: {
          title: "Alarm Name",
          name: "alarm_config_id",
          value: "",
          component: "dropdown",
          options: alarmsName.value,
          placeholder: "Select alarm name",
          error: "",
        },
      });
      form.value["app_dashboard_widget"] = fields[
        findIndexADW
      ].app_dashboard_widget?.map((val, index) => {
        return {
          name: val?.name?.value,
          widget_type_id: val?.type?.value,
          alarm_config_id: val?.alarmName?.value,
          comment: "",
        };
      });
    };

    const RemoveRow = (index) => {
      fields[findIndexADW]?.app_dashboard_widget?.splice(index, 1);
      form.value["app_dashboard_widget"].splice(index, 1);
    };

    const updateDashboardList = async () => {
      await store.dispatch(
        `${ModuleName.Dashboard}/${dashboardActions.GET_ALL_DASHBOARDS}`
      );
      if (props.isDrawer) {
        emit("onClose");
      } else {
        router.back();
      }
    };

    const validateForm = async () => {
      let count = 0;
      try {
        // fields.map((val) => {
        //   // if (!val.value && typeof val.value == "string" && val.name) {
        //   if (val.name) {
        //     validationSchema
        //       .validateAt(val.name, form.value, { abortEarly: false })
        //       .then((val) => {
        //         console.log("ok");
        //       })
        //       .catch((error) => {
        //         console.log({ error: error.errors[0] });
        //         val.error = error.errors[0];
        //         count++;
        //       });
        //   }
        //   // }
        //   if (val.app_dashboard_widget?.length) {
        //     val.app_dashboard_widget.map((val2) => {
        //       Object.values(val2).map((subField) => {
        //         validationSchema2
        //           .validateAt(subField["name"], form.value, {
        //             abortEarly: false,
        //           })
        //           .then((val) => {
        //             console.log("ok");
        //           })
        //           .catch((error) => {
        //             console.log({ error: error.errors[0] });
        //             subField["error"] = error.errors[0];
        //             count++;
        //           });
        //       });
        //       if (!val2.name.value) {
        //         validationSchema2
        //           .validateAt(val2.name.name, form.value, { abortEarly: false })
        //           .then((val) => {
        //             console.log("ok");
        //           })
        //           .catch((error) => {
        //             console.log({ error: error.errors[0] });
        //             val2.name.error = error.errors[0];
        //             count++;
        //           });
        //       }
        //       if (!val2.type.value) {
        //         validationSchema2
        //           .validateAt(val2.name.name, form.value, { abortEarly: false })
        //           .then((val) => {
        //             console.log("ok");
        //           })
        //           .catch((error) => {
        //             console.log({ error: error.errors[0] });
        //             val2.name.error = error.errors[0];
        //             count++;
        //           });
        //       }
        //       if (!val2.alarmName.value) {
        //         validationSchema2
        //           .validateAt(val2.name.name, form.value, { abortEarly: false })
        //           .then((val) => {
        //             console.log("ok");
        //           })
        //           .catch((error) => {
        //             console.log({ error: error.errors[0] });
        //             val2.name.error = error.errors[0];
        //             count++;
        //           });
        //       }
        //     });
        //   }
        // });
        fields.map((val) => {
          if (
            !val.value &&
            typeof val.value == "string" &&
            val.name &&
            val.is_required
          ) {
            val.error = `${val.title} is Required`;
            count++;
          }
          if (val.app_dashboard_widget?.length) {
            val.app_dashboard_widget.map((val2) => {
              if (!val2.name.value) {
                val2.name.error = `${val2.name.title} is required`;
                count++;
              }
              if (!val2.type.value) {
                val2.type.error = `${val2.type.title} is required`;
                count++;
              }
              if (!val2.alarmName.value) {
                val2.alarmName.error = `${val2.alarmName.title} is required`;
                count++;
              }
            });
          }
        });
        return count;
      } catch (error) {
        console.log(error);
        return (count = 1);
      }
    };

    const cleanAppwidgetArray = (setAlarmsName) => {
      try {
        fields[findIndexADW].app_dashboard_widget = fields[
          findIndexADW
        ].app_dashboard_widget?.map((val) => {
          val.alarmName.value = "";
          val.alarmName.options = setAlarmsName;
          return val;
        });
        if (form.value["app_dashboard_widget"])
          form.value["app_dashboard_widget"] = form.value[
            "app_dashboard_widget"
          ]?.map((val) => {
            val.alarm_config_id = "";
            return val;
          });
      } catch (error) {
        console.log(error);
      }
    };

    watch(
      () => fields?.[findIndexAppType]?.value,
      async (val) => {
        try {
          if (AppConstants.APP_TYPE.NCE == val) {
            const res = await AlarmConfigService.getAllAlarmsConfig(
              String(val)
            );
            if (res.length) {
              alarmsName.value = res.map((val) => {
                return { key: val.id, label: val.alarm_name };
              });
            } else {
              alarmsName.value = [];
            }
          } else if (AppConstants.APP_TYPE.OBSERVIUM == val) {
            const res = await AlarmConfigService.getAllAlarmsConfig(
              String(val)
            );
            if (res.length) {
              alarmsName.value = res.map((val) => {
                return { key: val.id, label: val.alarm_name };
              });
            } else {
              alarmsName.value = [];
            }
          } else if (AppConstants.APP_TYPE.NCE_GPON == val) {
            const res = await AlarmConfigService.getAllAlarmsConfig(
              String(val)
            );
            if (res.length) {
              alarmsName.value = res.map((val) => {
                return { key: val.id, label: val.alarm_name };
              });
            } else {
              alarmsName.value = [];
            }
          } else if (AppConstants.APP_TYPE.NOKIA_TXN == val) {
            const res = await AlarmConfigService.getAllAlarmsConfig(
              String(val)
            );
            if (res.length) {
              alarmsName.value = res.map((val) => {
                return { key: val.id, label: val.alarm_name };
              });
            } else {
              alarmsName.value = [];
            }
          } else if (AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS == val) {
            const res = await AlarmConfigService.getAllAlarmsConfig(
              String(val)
            );
            if (res.length) {
              alarmsName.value = res.map((val) => {
                return { key: val.id, label: val.alarm_name };
              });
            } else {
              alarmsName.value = [];
            }
          } else {
            alarmsName.value = [];
          }
          cleanAppwidgetArray(alarmsName.value);
        } catch (error) {
          console.log(error);
        }
      }
    );

    watch(
      () => fields?.[findIndexNetworkType]?.value,
      (val) => {
        if (val) {
          appTypeAccessable.value = [];
          fields[findIndexAppType].value = "";
          if (form.value["app_type"]) {
            form.value["app_type"] = "";
          }
          if (AppConstants.NETWORK_TYPE.TRANSMISSION == val) {
            if (PermissionsService.hasPermission(ncePermission)) {
              appTypeAccessable.value.push(nceAppType);
            }
            if (PermissionsService.hasPermission(nokiaTXNPermission)) {
              appTypeAccessable.value.push(nokiaTXNAppType);
            }
          } else if (
            AppConstants.NETWORK_TYPE.IP == val &&
            PermissionsService.hasPermission(ipPermission)
          ) {
            appTypeAccessable.value.push(ipAppType);
          } else if (
            AppConstants.NETWORK_TYPE.GPON == val &&
            PermissionsService.hasPermission(gponPermission)
          ) {
            appTypeAccessable.value.push(gponAppType);
          } else if (
            AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH == val &&
            PermissionsService.hasPermission(ldiSoftswitchEMSPermission)
          ) {
            appTypeAccessable.value.push(ldiSoftswitchEMSAppType);
          }
        }
      }
    );

    const submit = async () => {
      try {
        // validationSchema
        //   .validate(form.value, { abortEarly: false })
        //   .then((val) => {
        //     console.log({ val });
        //   })
        //   .catch((error) => {
        //     console.log({ error });
        //   });
        // validationSchema2
        //   .validate(form.value["app_dashboard_widget"], {
        //     abortEarly: false,
        //   })
        //   .then((val2) => {
        //     console.log({ val2 });
        //   })
        //   .catch((error) => {
        //     console.log({ error });
        //   });
        const validate = await validateForm();

        if (validate == 0) {
          swalConfirmation("", async () => {
            const res = await createCustomDashboard(form.value);
            openDrawer.value = false;
            await updateDashboardList();
            swalSuccessConfirmation(res.message, null, "Go there", "Ok", () => {
              router.push({
                name: "custom-dashboard",
                params: { id: res.data.id },
              });
            });
          });
        }
        // console.log({ form, fields });
      } catch (error) {
        console.log(error);
      }
    };

    return {
      openDrawer,
      fields,
      form,
      findIndexADW,
      submit,
      onChangeForm,
      AddRow,
      RemoveRow,
      Delete,
      validationSchema,
    };
  },
});
</script>
