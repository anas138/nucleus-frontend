import { AppConstants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";

export const nceRoutes = [
  {
    path: "/alarms/transmission",
    name: "nce-alarm-list",
    component: () => import("@/views/nce/NceAlarmsList.vue"),
    meta: {
      pageTitle: `${AppConstants.NCE_PRESENTATION_NAME} Network Alarms`,
      pageIcon: "fa-solid fa-bell",
      breadcrumbs: ["NCE Alarms"],
      permission: permissions.nce.alarms,
    },
  },
  {
    path: "/devices/transmission",
    name: "nce-devices-list",
    component: () => import("@/views/nce/NceDevicesList.vue"),
    meta: {
      pageTitle: `${AppConstants.NCE_PRESENTATION_NAME} Devices`,
      pageIcon: "fa-solid fa-server",
      breadcrumbs: ["NCE Devices"],
      permission: permissions.nce.devices,
    },
  },
  {
    path: "/alarms/transmission/details/:id",
    name: "nce-alarm-details",
    component: () => import("@/views/nce/NceAlarmDetailsPage.vue"),
    meta: {
      pageTitle: `${AppConstants.NCE_PRESENTATION_NAME} Alarm Details`,
      pageIcon: "fa-solid fa-bell",
      breadcrumbs: ["NCE Alarm Details"],
    },
  },
];
