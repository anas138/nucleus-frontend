import { permissions } from "@/constants/permissions-constants";

export const designationRoutes = [
  {
    path: "/designation/create",
    name: "designation-create",
    component: () => import("@/views/designation/AddDesignation.vue"),
    meta: {
      pageTitle: "Create Designation",
      breadcrumbs: ["Designation", "Create"],
      permission: permissions.designation.create,
    },
  },
  {
    path: "/designation/list",
    name: "designation-list",
    component: () => import("@/views/designation/DesignationList.vue"),
    meta: {
      pageTitle: "Designation",
      pageIcon: "fa-solid fa-user-tie",
      breadcrumbs: ["Designations"],
      permission: permissions.designation.access,
    },
  },
  {
    path: "/designation/edit/:id",
    name: "designation-edit",
    component: () => import("@/views/designation/EditDesignation.vue"),
    meta: {
      pageTitle: "Edit Designation",
      breadcrumbs: ["Designation", "Edit"],
      permission: permissions.designation.edit,
    },
  },
];
