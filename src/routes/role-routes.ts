import { permissions } from "@/constants/permissions-constants";

export const roleRoutes = [
  {
    path: "/roles/list",
    name: "roles-list",
    component: () => import("@/views/roles/RolesList.vue"),
    meta: {
      pageTitle: "Roles Management",
      pageIcon: "fa-solid fa-user-lock",
      breadcrumbs: ["Roles"],
      permission: permissions.role.access,
    },
  },
  {
    path: "/roles/edit-permissions/:id",
    name: "roles-edit-permissions",
    component: () => import("@/views/roles/EditRolesPermissions.vue"),
    meta: {
      pageTitle: "Edit Role Permissions",
      breadcrumbs: ["Role", "Permissions"],
      permission: permissions.permissions.edit,
    },
  },
  {
    path: "/roles/create",
    name: "roles-add",
    component: () => import("@/views/roles/AddRole.vue"),
    meta: {
      pageTitle: "Add Role",
      permission: permissions.role.create,
    },
  },
  {
    path: "/roles/edit/:id",
    name: "roles-edit",
    component: () => import("@/views/roles/EditRole.vue"),
    meta: {
      pageTitle: "Edit Role",
      permission: permissions.role.edit,
    },
  },
];
