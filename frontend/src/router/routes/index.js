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
   * 404 not found
   */
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
