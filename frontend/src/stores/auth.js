import { defineStore } from "pinia";
import { api } from "boot/axios";
import { ROUTE_PATHS } from "src/constants/routes";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      user: null,
    };
  },

  actions: {
    /*
     * login
     */
    async login(email, password) {
      await api.get(process.env.baseURL + "/sanctum/csrf-cookie");

      const credentials = { email: email, password: password };
      await api
        .post("/login", credentials)
        .then((response) => {
          this.user = response.data.user;

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;

          localStorage.setItem("token", response.data.token);

          this.setUserCredentialsForDev(credentials);

          /*
           * web sockets
           */
          try {
            this.initEcho(response.data.token).then(() => {
              console.log("init echo: ", window.Echo);
            });
          } catch (e) {
            console.log("echo error: ", e);
          }
        })
        .catch((error) => {
          throw error;
        });
    },

    setUserCredentialsForDev(credentials) {
      if (process.env.DEV) {
        let savedCredentials = JSON.parse(localStorage.getItem("credentials"));

        if (savedCredentials) {
          savedCredentials = {
            email: credentials.email || savedCredentials.email,
            password: credentials.password || savedCredentials.password,
          };
        }

        localStorage.setItem(
          "credentials",
          JSON.stringify(savedCredentials || credentials)
        );
      }
    },

    /*
     * register
     */
    async register(name, email, password) {
      const credentials = {
        name: name,
        email: email,
        password: password,
      };

      await api.post("/register", credentials).catch((error) => {
        throw error;
      });
    },

    /*
     * auth
     */
    async auth() {
      const response = await api.get("/user").catch((error) => {
        throw error;
      });

      return response.data;
    },

    /*
     *
     */
    async initEcho(token) {
      window.Pusher = Pusher;
      window.Echo = new Echo({
        broadcaster: "pusher",
        key: process.env.PUSHER_APP_KEY,
        cluster: process.env.PUSHER_APP_CLUSTER,
        authEndpoint: process.env.PUSHER_APP_ENDPOINT,
        wsHost: process.env.PUSHER_APP_WS_HOST,
        encrypted: !process.env.DEV,
        wsPort: 6001, // 80,
        wssPort: 6001, // 443,
        forceTLS: !process.env.DEV,
        disableStats: true,
        enabledTransports: ["ws"],
        disabledTransports: ["sockjs", "xhr_polling", "xhr_streaming"], // can be removed
        namespace: "",
        auth: {
          // withCredentials: true,
          headers: {
            Referer: window.location.hostname,
            Authorization: "Bearer " + token,
          },
        },
      });
    },

    /*
     * logout
     */
    async logout() {
      try {
        await api.post("/logout");
        this.clearUserData();
        window.location = ROUTE_PATHS.AUTH.LOGIN;
      } catch (error) {
        throw error;
      }
    },

    clearUserData() {
      localStorage.removeItem("token");

      if (process.env.DEV) {
        localStorage.removeItem("credentials");
      }

      this.user = null;
    },
  },
});
