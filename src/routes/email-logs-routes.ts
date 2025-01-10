import { permissions } from "@/constants/permissions-constants";

export const emailLogsRoutes = [
  {
    path: "/email-logs/list",
    name: "email-logs-list",
    component: () => import("@/views/email-logs/EmailLogs.vue"),
    meta: {
      pageTitle: "Email Logs",
      pageIcon: "fa-solid fa-envelope",
      breadCurmbs: ["Email Logs"],
      permission: permissions.emailLogs.access,
    },
  },
];
