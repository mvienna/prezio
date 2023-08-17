import { defineStore } from "pinia";
import { api } from "boot/axios";

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

          if (process.env.DEV) {
            localStorage.setItem("credentials", JSON.stringify(credentials));
          }
        })
        .catch((error) => {
          throw error;
        });
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
      await api
        .get("/user")
        .then((response) => {
          this.user = response.data.user;
        })
        .catch((error) => {
          throw error;
        });
    },

    /*
     * logout
     */
    async logout() {
      try {
        await api.post("/logout");
        this.clearUserData();
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
