import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import { userRoutes } from "@/routes/user-routes";
import { departmentRoutes } from "@/routes/department-routes";
import { permissionRoutes } from "@/routes/permission-routes";
import { subDepartmentRoutes } from "@/routes/sub-department-routes";
import { designationRoutes } from "@/routes/designation-routes";
import { roleRoutes } from "@/routes/role-routes";
import { nceRoutes } from "@/routes/nce-routes";
import { observiumRoutes } from "@/routes/observium-routes";
import { profileRoutes } from "@/routes/profile-routes";
import { signInRoute } from "@/routes/authentication-routes";
import { errorRoutes } from "@/routes/error-routes";
import { alarmConfigRoutes } from "@/routes/alarm-config-routes";
import { PermissionsService } from "@/core/services/PermissionsService";
import { emailLogsRoutes } from "@/routes/email-logs-routes";
import { customDashboardRoutes } from "@/routes/custom-dashboard-routes";
import { categoryRoutes } from "@/routes/category-routes";
import { subCategoryRoutes } from "../routes/sub-category-routes";
import { troubleTicketRoutes } from "@/routes/trouble-ticket-routes";
import { reportRoutes } from "@/routes/report-routes";
import { ROUTES } from "@/constants/app-constants";
import { nceGponRoutes } from "@/routes/nce-gpon-routes";
import { nokiaTXNRoutes } from "@/routes/nokia-txn-routes";
import { ldiSoftswitchEMSRoutes } from "@/routes/ldi-softswitch-ems-routes";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
          // remove this if you wan to stop redirecting
          // redirectTo: "/alarms/transmission",
        },
      },
      ...customDashboardRoutes,
      ...userRoutes,
      ...emailLogsRoutes,
      ...departmentRoutes,
      ...troubleTicketRoutes,
      ...reportRoutes,
      ...categoryRoutes,
      ...subCategoryRoutes,
      // ...permissionRoutes,
      ...subDepartmentRoutes,
      ...designationRoutes,
      ...roleRoutes,
      ...nceRoutes,
      ...observiumRoutes,
      ...nceGponRoutes,
      ...nokiaTXNRoutes,
      ...ldiSoftswitchEMSRoutes,
      ...profileRoutes,
      ...alarmConfigRoutes,
    ],
  },
  signInRoute,
  ...errorRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // current page view title
  document.title = `${process.env.VUE_APP_NAME} - ${to.meta.pageTitle}`;
  // reset config to initial state
  store.commit(Mutations.RESET_LAYOUT_CONFIG);

  // ======= redirect logic =========== //

  //this will check if redirectTo exist if meta
  if (to.meta.redirectTo && typeof to.meta.redirectTo === "string") {
    // this will redirect
    return next(to.meta.redirectTo);
  }

  // ======================================================= });

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (store.getters.isUserAuthenticated) {
      if (PermissionsService.hasPermission(to.meta.permission)) {
        next();
      } else {
        return next({ name: "403" });
      }
    } else {
      next({ name: "sign-in", query: { redirect: to.fullPath } });
    }
  } else {
    if (to.meta.middleware !== "public" && store.getters.isUserAuthenticated) {
      next({ path: ROUTES.DASHBOARD.INDEX });
    } else {
      next();
    }
  }

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

export default router;
