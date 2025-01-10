import { AppConstants } from "@/constants/app-constants";
import { permissions } from "@/constants/permissions-constants";

export const ldiSoftswitchEMSRoutes = [
  {
    path: "/alarms/ldi-softswitch",
    name: "ldi-softswitch-alarm-list",
    component: () =>
      import("@/views/ldi-softswitch-ems/LDISoftswitchEMSAlarmsList.vue"),
    meta: {
      pageTitle: `${AppConstants.LDI_SOFTSWITCH_EMS_PRESENTATION_NAME} Network Alarms`,
      pageIcon: "fa-solid fa-bell",
      breadcrumbs: ["LDI-SOFTSWITCH Alarms"],
      permission: permissions.ldiSoftswitchEMS.alarms,
    },
  },
  {
    path: "/trunk-group/ldi-softswitch",
    name: "ldi-softswitch-trunk-group-list",
    component: () =>
      import("@/views/ldi-softswitch-ems/LDISoftswitchEMSTrunkGroupList.vue"),
    meta: {
      pageTitle: `${AppConstants.LDI_SOFTSWITCH_EMS_PRESENTATION_NAME} Trunk Group List`,
      pageIcon: "fa-solid fa-server",
      breadcrumbs: ["LDI-SOFTSWITCH Trunk Group List"],
      permission: permissions.ldiSoftswitchEMS.trunkGroup,
    },
  },
  {
    path: "/alarms/ldi-softswitch/details/:id",
    name: "ldi-softswitch-alarm-details",
    component: () =>
      import("@/views/ldi-softswitch-ems/LDISoftswitchEMSAlarmDetailsPage.vue"),
    meta: {
      pageTitle: `${AppConstants.LDI_SOFTSWITCH_EMS_PRESENTATION_NAME} Alarm Details`,
      pageIcon: "fa-solid fa-bell",
      breadcrumbs: ["LDI-SOFTSWITCH Alarm Details"],
    },
  },
];
