import { useAuthStore } from "stores/auth";
import { storeToRefs } from "pinia";
import { ROUTE_PATHS } from "src/constants/routes";

export default async ({ app, router }) => {
  const store = useAuthStore();
  const state = storeToRefs(useAuthStore());

  const allowedUnauthenticatedPaths = [
    ROUTE_PATHS.AUTH.LOGIN,
    ROUTE_PATHS.AUTH.RESTORE_PASSWORD,
    ROUTE_PATHS.AUTH.SIGNUP,
  ];

  router.beforeEach(async (to, from, next) => {
    /*
     * not authenticated
     */
    if (state.user.value === undefined || state.user.value === null) {
      if (!allowedUnauthenticatedPaths.includes(to.path)) {
        next(ROUTE_PATHS.AUTH.LOGIN);
        return;
      } else {
        next();
        return;
      }

      /*
       * authenticated
       */
    } else {
      if (to.path === ROUTE_PATHS.AUTH.LOGOUT) {
        await store.logout();
        return;
      }

      if (to.path === ROUTE_PATHS.AUTH.LOGIN) {
        next(ROUTE_PATHS.INDEX);
        return;
      }
    }

    next();
  });

  /*
   * laravel sanctum is designed for authentication within a single domain and doesn't support sharing sessions or authentication across different domains
   * for that reason, only in DEV mode the app saves user credentials and logs in using them afterwords
   * in PROD mode the app is hosting frontend & backend on the same domain, so there aren't any issues with that
   */
  if (process.env.DEV) {
    const credentials = JSON.parse(localStorage.getItem("credentials"));

    if (credentials) {
      await store.login(credentials.email, credentials.password);
    }
  }

  if (process.env.PROD) {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await store.auth();

        if (
          allowedUnauthenticatedPaths.includes(router.currentRoute._value.path)
        ) {
          router.push(ROUTE_PATHS.DASHBOARD);
        }
      } catch (error) {
        await store.logout();
      }
    }
  }
};
