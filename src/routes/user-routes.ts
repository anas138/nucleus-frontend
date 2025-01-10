import { permissions } from "@/constants/permissions-constants";

export const userRoutes = [
  {
    path: "/users/list",
    name: "users-list",
    component: () => import("@/views/users/UsersList.vue"),
    meta: {
      pageTitle: "Users Management",
      pageIcon: "fa-solid fa-users",
      breadcrumbs: ["Users"],
      permission: permissions.users.access,
    },
  },
  {
    path: "/users/create",
    name: "users-create",
    component: () => import("@/views/users/AddUser.vue"),
    meta: {
      pageTitle: "Create Users",
      breadcrumbs: ["User", "create"],
      permission: permissions.users.create,
    },
  },
  {
    path: "/users/edit/:id",
    name: "users-edit",
    component: () => import("@/views/users/EditUser.vue"),
    meta: {
      pageTitle: "Edit Users",
      breadcrumbs: ["User", "edit"],
      permission: permissions.users.edit,
    },
  },
  {
    path: "/users/edit-permissions/:id",
    name: "users-edit-permissions",
    component: () => import("@/views/users/EditUserPermissions.vue"),
    meta: {
      pageTitle: "Edit User Permissions",
      breadcrumbs: ["User", "Permissions"],
      permission: permissions.permissions.edit,
    },
  },
];
