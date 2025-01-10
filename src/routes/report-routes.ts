import { permissions } from "@/constants/permissions-constants";

export const reportRoutes = [
  {
    path: "/reports/trouble-ticket",
    name: "trouble-ticket-report",
    component: () => import("@/views/reports/TroubleTicketReports.vue"),
    meta: {
      pageTitle: "Trouble Tickets Report",
      pageIcon: "fa-solid fa-list-ul",
      breadcrumbs: ["tickets-report"],
      permission: permissions.troubleTicket.access,
    },
  },
];
