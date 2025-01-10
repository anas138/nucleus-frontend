import { AppConstants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";
import { upperFirst } from "lodash";

function appTypeValidator(to) {
  if (
    to.params.appType ===
      AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.TRANSMISSION_NCE ||
    to.params.appType ===
      AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.IP_OBSERVIUM ||
    to.params.appType ===
      AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.GPON_NCE_GPON ||
    to.params.appType ===
      AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS
        .TRANSMISSION_NOKIA_TXN ||
    AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.LDI_SOFTSWITCH_EMS
  ) {
    return true;
  } else {
    // Redirect to an error page or handle invalid parameter
    return false;
  }
}

export const alarmConfigRoutes = [
  {
    path: "/alarm-config/:appType/create",
    name: "alarm-config-create",
    component: () => import("@/views/alarm-config/AddFilterConfig.vue"),
    meta: {
      pageTitle: `Create Alarms Config`,
      permission: [
        permissions.nceAlarmConfig.create,
        permissions.observiumAlarmConfig.create,
        permissions.nceGponAlarmConfig.create,
        permissions.nokiaTXNAlarmConfig.create,
        permissions.ldiSoftswitchEMSAlarmConfig.create,
      ],
    },
    beforeEnter: (to, from, next) => {
      if (appTypeValidator(to)) {
        to.meta = {
          pageTitle: `Create ${
            to.params.appType ===
            AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.TRANSMISSION_NCE
              ? AppConstants.NCE_PRESENTATION_NAME
              : to.params.appType ===
                AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.IP_OBSERVIUM
              ? AppConstants.OBSERVIUM_PRESENTATION_NAME
              : to.params.appType ===
                AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.GPON_NCE_GPON
              ? AppConstants.NCE_GPON_PRESENTATION_NAME
              : to.params.appType ===
                AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS
                  .TRANSMISSION_NOKIA_TXN
              ? AppConstants.NOKIA_TXN_PRESENTATION_NAME
              : to.params.appType ===
                AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS
                  .LDI_SOFTSWITCH_EMS
              ? AppConstants.LDI_SOFTSWITCH_EMS_PRESENTATION_NAME
              : ""
          } Alarms Config`,
          pageIcon: "fa-solid fa-cog",
          breadcrumbs: [
            `${upperFirst(to.params.appType)} Alarms Config Create`,
          ],
        };
        next();
      } else {
        next("/error");
      }
    },
  },
  {
    path: "/alarm-config/:appType/edit/:id",
    name: "alarm-config-edit",
    component: () => import("@/views/alarm-config/EditFilterConfig.vue"),
    meta: {
      pageTitle: `Edit Alarms Config`,
      permission: [
        permissions.nceAlarmConfig.edit,
        permissions.observiumAlarmConfig.edit,
        permissions.nceGponAlarmConfig.edit,
        permissions.nokiaTXNAlarmConfig.edit,
        permissions.ldiSoftswitchEMSAlarmConfig.edit,
      ],
    },
    beforeEnter: (to, from, next) => {
      if (appTypeValidator(to)) {
        to.meta = {
          pageTitle: `Edit ${upperFirst(to.params.appType)} Alarms Config`,
          pageIcon: "fa-solid fa-cog",
          breadcrumbs: [`${upperFirst(to.params.appType)} Alarms Config Edit`],
        };
        next();
      } else {
        next("/error");
      }
    },
  },
  {
    path: `/alarm-config/${AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.TRANSMISSION_NCE}/list`,
    name: "alarm-config-NCE-list",
    component: () => import("@/views/alarm-config/AlarmsFilterConfigList.vue"),
    meta: {
      pageTitle: `${AppConstants.NCE_PRESENTATION_NAME} Alarms Config`,
      pageIcon: "fa-solid fa-cog",
      breadcrumbs: [`Transmission Alarms Config`],
      appType: AppConstants.APP_TYPE.NCE,
      permission: permissions.nceAlarmConfig.access,
    },
  },
  {
    path: `/alarm-config/${AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.IP_OBSERVIUM}/list`,
    name: "alarm-config-OBSERVIUM-list",
    component: () => import("@/views/alarm-config/AlarmsFilterConfigList.vue"),
    meta: {
      pageTitle: `${AppConstants.OBSERVIUM_PRESENTATION_NAME} Alarms Config`,
      pageIcon: "fa-solid fa-cog",
      breadcrumbs: [`Ip Alarms Config`],
      appType: AppConstants.APP_TYPE.OBSERVIUM,
      permission: permissions.observiumAlarmConfig.access,
    },
  },
  {
    path: `/alarm-config/${AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.GPON_NCE_GPON}/list`,
    name: "alarm-config-NCE_GPON-list",
    component: () => import("@/views/alarm-config/AlarmsFilterConfigList.vue"),
    meta: {
      pageTitle: `${AppConstants.NCE_GPON_PRESENTATION_NAME} Alarms Config`,
      pageIcon: "fa-solid fa-cog",
      breadcrumbs: [`GPON-LTE Alarms Config`],
      appType: AppConstants.APP_TYPE.NCE_GPON,
      permission: permissions.nceGponAlarmConfig.access,
    },
  },
  {
    path: `/alarm-config/${AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.TRANSMISSION_NOKIA_TXN}/list`,
    name: "alarm-config-NOKIA_TXN-list",
    component: () => import("@/views/alarm-config/AlarmsFilterConfigList.vue"),
    meta: {
      pageTitle: `${AppConstants.NOKIA_TXN_PRESENTATION_NAME} Alarms Config`,
      pageIcon: "fa-solid fa-cog",
      breadcrumbs: [`NOKIA-TXN Alarms Config`],
      appType: AppConstants.APP_TYPE.NOKIA_TXN,
      permission: permissions.nokiaTXNAlarmConfig.access,
    },
  },
  {
    path: `/alarm-config/${AppConstants.NETWORK_TYPE_APP_TYPE_BASE64_STRINGS.LDI_SOFTSWITCH_EMS}/list`,
    name: "alarm-config-LDI_SOFTSWITCH_EMS-list",
    component: () => import("@/views/alarm-config/AlarmsFilterConfigList.vue"),
    meta: {
      pageTitle: `${AppConstants.LDI_SOFTSWITCH_EMS_PRESENTATION_NAME} Alarms Config`,
      pageIcon: "fa-solid fa-cog",
      breadcrumbs: [`NOKIA-TXN Alarms Config`],
      appType: AppConstants.APP_TYPE.LDI_SOFTSWITCH_EMS,
      permission: permissions.ldiSoftswitchEMSAlarmConfig.access,
    },
  },
];
