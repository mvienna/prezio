import { SUBDOMAINS } from "src/constants/routes";
import routesApp from "src/router/routes/app";
import routes from "src/router/routes";

export const clearRoutePathFromProps = (path) => {
  return path.replace(/(\/[^/]+\/).*/, "$1");
};

export const getSubdomain = () => {
  const url = window.location.hostname;
  const parts = url
    .split(".")
    .filter((item) => !["localhost", "testing"].includes(item));

  return parts?.[0];
};

export const determineRoutes = () => {
  const subdomain = getSubdomain();
  switch (subdomain) {
    case SUBDOMAINS.app:
      return routesApp;

    default:
      return routes;
  }
};
