import { ROUTE_PATHS } from "src/constants/routes";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: ROUTE_PATHS.INDEX,
        redirect: ROUTE_PATHS.DASHBOARD,
      },
      {
        path: ROUTE_PATHS.DASHBOARD,
        component: () => import("pages/DashboardPage.vue"),
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: ROUTE_PATHS.AUTH.LOGIN,
        component: () => import("pages/auth/LogInPage.vue"),
      },
      {
        path: ROUTE_PATHS.AUTH.SIGNUP,
        component: () => import("pages/auth/SignUpPage.vue"),
      },
      {
        path: ROUTE_PATHS.AUTH.RESTORE_PASSWORD,
        component: () => import("pages/auth/RestorePasswordPage.vue"),
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
