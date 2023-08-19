import { boot } from "quasar/wrappers";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.baseURL + "/api",
  withCredentials: true,
});

export default boot(({ app }) => {
  api.defaults.withCredentials = true;
  api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { axios, api };
