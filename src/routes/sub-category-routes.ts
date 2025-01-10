import { permissions } from "@/constants/permissions-constants";

export const subCategoryRoutes = [
  {
    path: "/sub-category/create/:id",
    name: "sub-category-create",
    component: () => import("@/views/sub-category/AddSubCategory.vue"),
    meta: {
      pageTitle: "Create Sub Category",
      breadcrumbs: ["Sub category", "Create"],
      //   permission: permissions.sub-category.create,
    },
  },
  {
    path: "/sub-category/list/:id",
    name: "sub-category-list",
    component: () => import("@/views/sub-category/SubCategoryList.vue"),
    meta: {
      pageTitle: "Sub Categories",
      pageIcon: "fa-brands fa-mendeley",
      breadcrumbs: ["Sub Categories"],
      //   permission: permissions.sub-category.access,
    },
  },
  {
    path: "/sub-category/edit/:id",
    name: "sub-category-edit",
    component: () => import("@/views/sub-category/EditSubCategory.vue"),
    meta: {
      pageTitle: "Edit Sub Category",
      breadcrumbs: ["Sub Category", "Edit"],
      //   permission: permissions.sub-category.edit,
    },
  },
];
