export const customDashboardRoutes = [
  {
    path: "/custom-dashboard/create",
    name: "custom-dashboard-create",
    component: () => import("@/views/custom-dashboard/AddDashboardForm.vue"),
    meta: {
      pageTitle: "Create Dashboard",
      breadcrumbs: ["Create Dashboard"],
      // remove this if you wan to stop redirecting
      // redirectTo: "/alarms/transmission",
    },
  },
  {
    path: "/dashboard/:id",
    name: "custom-dashboard",
    component: () => import("@/views/custom-dashboard/CustomDashboard.vue"),
    meta: {
      pageTitle: "Custom Dashboard",
      breadcrumbs: ["Custom Dashboard"],
      // remove this if you wan to stop redirecting
      // redirectTo: "/alarms/transmission",
    },
  },
];
