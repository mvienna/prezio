import { ROUTE_PATHS } from "src/constants/routes";

const routesApp = [
  /*
   * index
   * dashboard
   * presentations browser
   */
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: ROUTE_PATHS.INDEX,
        redirect: ROUTE_PATHS.PRESENTATIONS_BROWSER,
      },
      {
        path: ROUTE_PATHS.PRESENTATIONS_BROWSER,
        component: () => import("pages/DashboardPage.vue"),
      },
    ],
  },

  /*
   * auth
   */
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

  /*
   * user
   */
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: ROUTE_PATHS.PROFILE.INDEX,
        component: () => import("pages/user/ProfilePage.vue"),
      },
    ],
  },

  /*
   * presentation studio
   */
  {
    path: "/",
    component: () => import("layouts/PresentationStudioLayout.vue"),
    children: [
      {
        path: ROUTE_PATHS.PRESENTATION_STUDIO,
        component: () =>
          import("pages/presentations/PresentationStudioPage.vue"),
      },
    ],
  },

  /*
   * presentation room
   */
  {
    path: "/",
    component: () => import("layouts/NoLayout.vue"),
    children: [
      {
        path: ROUTE_PATHS.PRESENTATION_ROOM.HOST,
        component: () => import("pages/presentations/PresentationRoomPage.vue"),
      },
    ],
  },

  /*
   * 404
   */
  {
    path: "/:catchAll(.*)*",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue"),
      },
    ],
  },
];

export default routesApp;
