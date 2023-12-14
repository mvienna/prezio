import { useAuthStore } from "stores/auth";
import { storeToRefs } from "pinia";
import { ROUTE_PATHS } from "src/constants/routes";
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

export default async ({ app, router }) => {
  const userStore = useAuthStore();
  const userState = storeToRefs(userStore);

  const allowedUnauthenticatedPaths = [
    ROUTE_PATHS.AUTH.LOGIN,
    ROUTE_PATHS.AUTH.RESTORE_PASSWORD,
    ROUTE_PATHS.AUTH.SIGNUP,
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

    encrypted: !process.env.DEV,
    forceTLS: !process.env.DEV,
    disableStats: true,

    enabledTransports: ["ws", "wss"],
    disabledTransports: ["sockjs", "xhr_polling", "xhr_streaming"],

    authEndpoint: process.env.PUSHER_APP_ENDPOINT,
  };

  window.Pusher = Pusher;
  window.Echo = new Echo(
    process.env.PUSHER_SCHEME === "http"
      ? { ...options, wsHost: process.env.PUSHER_HOST }
      : {
          ...options,
          wssHost: process.env.PUSHER_HOST,
        }
  );

  /*
   * route middleware
   */
  router.beforeEach(async (to, from, next) => {
    /*
     * not authenticated
     */
    if (userState.user.value === undefined || userState.user.value === null) {
      if (
        !allowedUnauthenticatedPaths.includes(to.path) &&
        !to.path.includes(
          clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_ROOM)
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
      if (allowedUnauthenticatedPaths.includes(to.path)) {
        next(ROUTE_PATHS.INDEX);
        return;
      }
    }

    next();
  });
};
