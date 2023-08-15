import { boot } from "quasar/wrappers";
import axios from "axios";

const api = axios.create({
  withCredentials: true,
  baseURL: process.env.baseURL + "/api",
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  api.defaults.withCredentials = true;
  api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  app.config.globalProperties.$api = api;
});

export { axios, api };
