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
        redirect: ROUTE_PATHS.PRESENTATIONS.INDEX,
      },
      {
        path: ROUTE_PATHS.PRESENTATIONS.INDEX,
        component: () =>
          import("pages/presentations/PresentationsBrowserPage.vue"),
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
      {
        path: ROUTE_PATHS.AUTH.LOGOUT,
        component: () => import("pages/auth/LogOutPage.vue"),
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/UserLayout.vue"),
    children: [
      {
        path: ROUTE_PATHS.USER.PROFILE,
        component: () => import("pages/user/ProfilePage.vue"),
      },
      {
        path: ROUTE_PATHS.USER.MY_PLAN,
        component: () => import("pages/user/MyPlanPage.vue"),
      },
      {
        path: ROUTE_PATHS.USER.PAYMENTS,
        component: () => import("pages/user/PaymentsPage.vue"),
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/Presentation/PresentationLayout.vue"),
    children: [
      {
        path: ROUTE_PATHS.PRESENTATIONS.PRESENTATION,
        component: () =>
          import("pages/presentations/PresentationStudioPage.vue"),
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
