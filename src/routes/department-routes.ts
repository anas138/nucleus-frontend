import { permissions } from "@/constants/permissions-constants";

export const departmentRoutes = [
  {
    path: "/department/create",
    name: "department-create",
    component: () => import("@/views/department/AddDepartment.vue"),
    meta: {
      pageTitle: "Create Department",
      breadcrumbs: ["Department", "Create"],
      permission: permissions.department.create,
    },
  },
  {
    path: "/department/list",
    name: "department-list",
    component: () => import("@/views/department/DepartmentList.vue"),
    meta: {
      pageTitle: "Department",
      pageIcon: "fa-solid fa-building",
      breadcrumbs: ["Department"],
      permission: permissions.department.access,
    },
  },
  {
    path: "/department/edit/:id",
    name: "department-edit",
    component: () => import("@/views/department/EditDepartment.vue"),
    meta: {
      pageTitle: "Edit Department",
      breadcrumbs: ["Department", "Edit"],
      permission: permissions.department.edit,
    },
  },
];
