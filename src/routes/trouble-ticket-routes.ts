import { permissions } from "@/constants/permissions-constants";

export const troubleTicketRoutes = [
  {
    path: "/trouble-ticket/:appType/create/:id",
    name: "trouble-ticket-create",
    component: () => import("@/views/trouble-ticket/CreateTroubleTicket.vue"),
    meta: {
      pageTitle: "Create Trouble Ticket",
      breadcrumbs: ["Trouble", "Ticket", "Create"],
      permission: permissions.troubleTicket.create,
    },
  },
  {
    path: "/trouble-ticket/list",
    name: "trouble-ticket-list",
    component: () => import("@/views/trouble-ticket/TroubleTicketTabs.vue"),
    meta: {
      pageTitle: "Trouble Ticket List",
      pageIcon: "fa-solid fa-flag",
      breadcrumbs: ["tickets-list"],
      permission: permissions.troubleTicket.access,
    },
  },
  {
    path: "/trouble-ticket/view/:id",
    name: "trouble-ticket-view",
    component: () => import("@/views/trouble-ticket/ViewTroubleTicket.vue"),
    meta: {
      pageTitle: "Trouble Ticket Details",
      pageIcon: "fa-regular fa-paper-plane",
      breadcrumbs: ["Trouble", "Ticket", "Details"],
      permission: permissions.troubleTicket.access,
    },
  },
  {
    path: "/trouble-ticket/update/:id",
    name: "trouble-ticket-update",
    component: () => import("@/views/trouble-ticket/UpdateTroubleTicket.vue"),
    meta: {
      pageTitle: "Update Trouble Ticket",
      pageIcon: "fa-regular fa-paper-plane",
      breadcrumbs: ["Trouble", "Ticket", "Update"],
      permission: permissions.troubleTicket.access,
      closeSideBar: true,
    },
  },
  {
    path: "/trouble-ticket-dashboard",
    name: "trouble-ticket-dashboard",
    component: () =>
      import("@/views/trouble-ticket/TroubleTicketDashboard.vue"),
    meta: {
      pageTitle: "Trouble Ticket Dashboard",
      pageIcon: "fa-solid fa-chart-simple",
      breadcrumbs: ["Trouble", "Ticket", "Dashboard"],
      permission: permissions.troubleTicket.access,
    },
  },
];
