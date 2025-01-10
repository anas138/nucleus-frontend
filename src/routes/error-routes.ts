export const errorRoutes = [
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        path: "/404",
        name: "404",
        component: () => import("@/views/error/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/403",
        name: "403",
        component: () => import("@/views/error/Error403.vue"),
        meta: {
          pageTitle: "Error 403",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];
