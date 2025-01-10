export const profileRoutes = [
  {
    path: "/account",
    name: "account",
    component: () => import("@/views/account/Account.vue"),
    meta: {
      breadcrumbs: ["Crafted", "Account"],
    },
    children: [
      {
        path: "overview",
        name: "account-overview",
        component: () => import("@/views/account/Overview.vue"),
        meta: {
          pageTitle: "Overview",
        },
      },
      {
        path: "settings",
        name: "account-settings",
        component: () => import("@/views/account/Settings.vue"),
        meta: {
          pageTitle: "Settings",
        },
      },
    ],
  },
];
