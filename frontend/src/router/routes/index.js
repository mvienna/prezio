import { ROUTE_PATHS } from "src/constants/routes";

const routes = [
  {
    path: "/",
    component: () => import("layouts/NoLayout.vue"),
    children: [
      {
        path: ROUTE_PATHS.INDEX,
        component: () => import("pages/IndexPage.vue"),
      },
    ],
  },

  /*
   * privacy policy
   */
  // {
  //   path: "/",
  //   component: () => import("layouts/NoLayout.vue"),
  //   children: [
  //     {
  //       path: ROUTE_PATHS.POLICIES.PRIVACY_POLICY,
  //       component: () => import("pages/policies/PrivacyPolicyPage.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "/",
  //   component: () => import("layouts/NoLayout.vue"),
  //   children: [
  //     {
  //       path: ROUTE_PATHS.POLICIES.USER_AGREEMENT,
  //       component: () => import("pages/policies/UserAgreementPage.vue"),
  //     },
  //   ],
  // },

  /*
   * presentation room
   */
  // {
  //   path: "/",
  //   component: () => import("layouts/NoLayout.vue"),
  //   children: [
  //     {
  //       path: ROUTE_PATHS.PRESENTATION_ROOM.PARTICIPANT,
  //       component: () => import("pages/presentations/PresentationRoomPage.vue"),
  //     },
  //   ],
  // },

  /*
   * 404 not found
   */
  // {
  //   path: "/:catchAll(.*)*",
  //   component: () => import("layouts/AuthLayout.vue"),
  //   children: [
  //     {
  //       path: "/:catchAll(.*)*",
  //       component: () => import("pages/ErrorNotFound.vue"),
  //     },
  //   ],
  // },
];

export default routes;
