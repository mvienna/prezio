import { useAuthStore } from "stores/auth";
import { storeToRefs } from "pinia";
import { ROUTE_PATHS } from "src/constants/routes";
import { clearRoutePathFromProps, getSubdomain } from "src/helpers/routeUtils";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

export default async ({ app, router }) => {
  const userStore = useAuthStore();
  const userState = storeToRefs(userStore);

  const allowedUnauthenticatedPaths = [
    ROUTE_PATHS.AUTH.LOGIN,
    ROUTE_PATHS.AUTH.RESTORE_PASSWORD,
    ROUTE_PATHS.AUTH.SIGNUP,
    ROUTE_PATHS.POLICIES.PRIVACY_POLICY,
    ROUTE_PATHS.POLICIES.USER_AGREEMENT,
  ];

  /*
   * laravel sanctum is designed for authentication within a single domain and doesn't support sharing sessions or authentication across different domains
   * for that reason, only in DEV mode the app saves user credentials and logs in using them afterwords
   * in PROD mode the app is hosting frontend & backend on the same domain, so there aren't any issues with that
   */
  if (process.env.DEV) {
    const credentials = JSON.parse(localStorage.getItem("credentials"));
    if (credentials) {
      try {
        await userStore.login(credentials.email, credentials.password);
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (process.env.PROD) {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        userState.user.value = await userStore.auth();
      } catch (error) {
        userStore.clearUserData();
        window.location = ROUTE_PATHS.AUTH.LOGIN;
      }
    }
  }

  /*
   * web sockets
   */
  const options = {
    broadcaster: "pusher",
    key: process.env.PUSHER_APP_KEY,
    cluster: process.env.PUSHER_APP_CLUSTER,

    wsPort: process.env.PUSHER_PORT || 80,
    wssPort: process.env.PUSHER_PORT || 443,

    encrypted: process.env.PUSHER_SCHEME !== "http",
    forceTLS: process.env.PUSHER_SCHEME !== "http",
    disableStats: true,

    enabledTransports: ["ws", "wss"],

    wsHost: process.env.PUSHER_HOST,
    wssHost: process.env.PUSHER_HOST,

    authEndpoint: process.env.PUSHER_APP_ENDPOINT,
  };

  window.Pusher = Pusher;
  window.Echo = new Echo(options);

  /*
   * route middleware
   */
  router.onError((error, to) => {
    if (error.message.includes("Failed to fetch dynamically imported module")) {
      window.location = to.fullPath;
    }
  });

  router.beforeEach(async (to, from, next) => {
    const subdomain = getSubdomain();

    // landing page - proceed
    if (!subdomain) {
      next();
      return;
    }

    /*
     * not authenticated
     */
    if (userState.user.value === undefined || userState.user.value === null) {
      if (
        !allowedUnauthenticatedPaths.includes(to.path) &&
        !to.path.includes(
          clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_ROOM.HOST),
        )
      ) {
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
        await userStore.logout();
        return;
      }

      // redirect from unauthorized routes
      if (
        allowedUnauthenticatedPaths
          .filter((item) => item !== ROUTE_PATHS.AUTH.RESTORE_PASSWORD)
          .includes(to.path)
      ) {
        next(ROUTE_PATHS.INDEX);
        return;
      }
    }

    next();
  });
};
