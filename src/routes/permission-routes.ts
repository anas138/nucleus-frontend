import { permissions } from "@/constants/permissions-constants";

export const permissionRoutes = [
  {
    path: "/permissions/create",
    name: "permissions-create",
    component: () => import("@/views/permissions/AddPermissions.vue"),
    meta: {
      pageTitle: "Create Permissions",
      breadcrumbs: ["Permissions", "Create"],
      permission: permissions.permissions.create,
    },
  },
  {
    path: "/permissions/list",
    name: "permissions-list",
    component: () => import("@/views/permissions/PermissionsList.vue"),
    meta: {
      pageTitle: "Permissions",
      pageIcon: "fa-solid fa-user-lock",
      breadcrumbs: ["Permissions"],
      permission: permissions.permissions.access,
    },
  },
];
