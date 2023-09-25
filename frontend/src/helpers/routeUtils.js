export const clearRoutePathFromProps = (path) => {
  return path.replace(/(\/[^/]+\/).*/, "$1");
};
