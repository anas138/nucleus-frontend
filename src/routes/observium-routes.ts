import { AppConstants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";

export const observiumRoutes = [
  {
    path: "/alarms/ip",
    name: "observium-alarm-list",
    component: () => import("@/views/observium/ObserviumAlarmsList.vue"),
    meta: {
      pageTitle: `${AppConstants.OBSERVIUM_PRESENTATION_NAME} Network Alarms`,
      pageIcon: "fa-solid fa-bell",
      breadcrumbs: ["Observium Alarms"],
      permission: permissions.observium.alarms,
    },
  },
  {
    path: "/devices/ip",
    name: "observium-devices-list",
    component: () => import("@/views/observium/ObserviumDevicesList.vue"),
    meta: {
      pageTitle: `${AppConstants.OBSERVIUM_PRESENTATION_NAME} Devices`,
      pageIcon: "fa-solid fa-server",
      breadcrumbs: ["Observium Devices"],
      permission: permissions.observium.devices,
    },
  },
  {
    path: "/alarms/ip/details/:id",
    name: "observium-alarm-details",
    component: () => import("@/views/observium/ObsAlarmDetailsPage.vue"),
    meta: {
      pageTitle: `${AppConstants.OBSERVIUM_PRESENTATION_NAME} Alarm Details`,
      pageIcon: "fa-solid fa-bell",
      breadcrumbs: ["Observium Alarm Details"],
    },
  },
];
