import { SUBDOMAINS } from "src/constants/routes";
import routesApp from "src/router/routes/app";
import routes from "src/router/routes";

export const clearRoutePathFromProps = (path) => {
  return path.replace(/(\/[^/]+\/).*/, "$1");
};

export const getSubdomain = () => {
  const url = window.location.origin;
  let domain = url;
  if (url.includes("://")) {
    domain = url.split("://")[1];
  }

  const subdomain = domain.split(".")[0];
  return subdomain !== window.location.host ? subdomain : null;
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
