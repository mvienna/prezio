/*
 * ru-RU
 */
import ruIndex from "./ru-RU";
import ruAuth from "./ru-RU/auth";
import ruUser from "./ru-RU/user";
import ruMedia from "./ru-RU/media";
import ruLayouts from "./ru-RU/layouts";
import ruDashboard from "./ru-RU/dashboard";
import ruPresentationStudio from "./ru-RU/presentationStudio";
import ruPresentationRoom from "./ru-RU/presentationRoom";
import ruWebSockets from "./ru-RU/websockets";
import ruLanding from "./ru-RU/landing";

export default {
  "ru-RU": {
    ...ruIndex,
    ...ruAuth,
    ...ruUser,
    ...ruMedia,
    ...ruLayouts,
    ...ruDashboard,
    ...ruPresentationStudio,
    ...ruPresentationRoom,
    ...ruWebSockets,
    ...ruLanding,
  },
};
