import { AppConstants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";

export const nceGponRoutes = [
  {
    path: "/alarms/nce-gpon",
    name: "nce-gpon-alarm-list",
    component: () => import("@/views/nce-gpon/NceGponAlarmsList.vue"),
    meta: {
      pageTitle: `${AppConstants.NCE_GPON_PRESENTATION_NAME} Network Alarms`,
      pageIcon: "fa-solid fa-bell",
      breadcrumbs: ["NCE GPON Alarms"],
      permission: permissions.nceGpon.alarms,
    },
  },
  {
    path: "/devices/nce-gpon",
    name: "nce-gpon-devices-list",
    component: () => import("@/views/nce-gpon/NceGponDevicesList.vue"),
    meta: {
      pageTitle: `${AppConstants.NCE_GPON_PRESENTATION_NAME} Devices`,
      pageIcon: "fa-solid fa-server",
      breadcrumbs: ["NCE GPON Devices"],
      permission: permissions.nceGpon.devices,
    },
  },
  {
    path: "/alarms/nce-gpon/details/:id",
    name: "nce-gpon-alarm-details",
    component: () => import("@/views/nce-gpon/NceGponAlarmDetailsPage.vue"),
    meta: {
      pageTitle: `${AppConstants.NCE_GPON_PRESENTATION_NAME} Alarm Details`,
      pageIcon: "fa-solid fa-bell",
      breadcrumbs: ["NCE GPON Alarm Details"],
    },
  },
];
