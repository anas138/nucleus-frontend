import { permissions } from "@/constants/permissions-constants";

export const subDepartmentRoutes = [
  {
    path: "/sub-department/create",
    name: "sub-department-create",
    component: () => import("@/views/sub-department/AddSubDepartment.vue"),
    meta: {
      pageTitle: "Create Sub Department",
      breadcrumbs: ["Sub-Department", "Create"],
      permission: permissions.subDepartment.create,
    },
  },
  {
    path: "/sub-department/list",
    name: "sub-department-list",
    component: () => import("@/views/sub-department/SubDepartmentList.vue"),
    meta: {
      pageTitle: "Sub-Department",
      pageIcon: "fa-solid fa-sitemap",
      breadcrumbs: ["Sub-Department"],
      permission: permissions.subDepartment.access,
    },
  },
  {
    path: "/sub-department/edit/:id",
    name: "sub-department-edit",
    component: () => import("@/views/sub-department/EditSubDepartment.vue"),
    meta: {
      pageTitle: "Edit Sub Department",
      breadcrumbs: ["Sub-Department", "Edit"],
      permission: permissions.subDepartment.edit,
    },
  },
];
