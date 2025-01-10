import { permissions } from "@/constants/permissions-constants";

export const categoryRoutes = [
  {
    path: "/category/create",
    name: "category-create",
    component: () => import("@/views/category/AddCategory.vue"),
    meta: {
      pageTitle: "Create Category",
      breadcrumbs: ["Category", "Create"],
      permission: permissions.troubleTicketCategory.create,
    },
  },
  {
    path: "/category/list",
    name: "category-list",
    component: () => import("@/views/category/CategoryList.vue"),
    meta: {
      pageTitle: "Categories",
      pageIcon: "fa-solid fa-table-list",
      breadcrumbs: ["Categories"],
      permission: permissions.troubleTicketCategory.access,
    },
  },
  {
    path: "/category/edit/:id",
    name: "category-edit",
    component: () => import("@/views/category/EditCategory.vue"),
    meta: {
      pageTitle: "Edit Category",
      breadcrumbs: ["Category", "Edit"],
      permission: permissions.troubleTicketCategory.edit,
    },
  },
];
