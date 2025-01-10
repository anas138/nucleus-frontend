import { AppConstants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";

export const nokiaTXNRoutes = [
  {
    path: "/alarms/nokia-txn",
    name: "nokia-txn-alarm-list",
    component: () => import("@/views/nokia-txn/NokiaTXNAlarmsList.vue"),
    meta: {
      pageTitle: `${AppConstants.NOKIA_TXN_PRESENTATION_NAME} Network Alarms`,
      pageIcon: "fa-solid fa-bell",
      breadcrumbs: ["NCE GPON Alarms"],
      permission: permissions.nokiaTXN.alarms,
    },
  },
  {
    path: "/devices/nokia-txn",
    name: "nokia-txn-devices-list",
    component: () => import("@/views/nokia-txn/NokiaTXNDevicesList.vue"),
    meta: {
      pageTitle: `${AppConstants.NOKIA_TXN_PRESENTATION_NAME} Devices`,
      pageIcon: "fa-solid fa-server",
      breadcrumbs: ["NCE GPON Devices"],
      permission: permissions.nokiaTXN.devices,
    },
  },
  {
    path: "/alarms/nokia-txn/details/:id",
    name: "nokia-txn-alarm-details",
    component: () => import("@/views/nokia-txn/NokiaTXNAlarmDetailsPage.vue"),
    meta: {
      pageTitle: `${AppConstants.NOKIA_TXN_PRESENTATION_NAME} Alarm Details`,
      pageIcon: "fa-solid fa-bell",
      breadcrumbs: ["NCE GPON Alarm Details"],
    },
  },
];
