export const signInRoute = {
  path: "/",
  component: () => import("@/layouts/AuthLayout.vue"),
  children: [
    {
      path: "/sign-in",
      name: "sign-in",
      component: () => import("@/views/authentication/Login.vue"),
      meta: {
        pageTitle: "Sign In",
      },
    },
    {
      path: "/password-reset",
      name: "password-reset",
      component: () => import("@/views/authentication/PasswordReset.vue"),
      meta: {
        pageTitle: "Forgot Password",
      },
    },
    {
      path: "/password-update",
      name: "password-update",
      component: () => import("@/views/authentication/UpdatePassword.vue"),
      meta: {
        pageTitle: "Update Password",
      },
    },
    {
      path: "/app-update",
      name: "app-update",
      component: () => import("@/views/app-update/AppUpdate.vue"),
      meta: {
        pageTitle: "Application Update",
        middleware: "public",
      },
    },
  ],
};
