/*
 * ru-RU
 */
import ruIndex from "./ru-RU";
import ruAuth from "./ru-RU/auth";
import ruUser from "./ru-RU/user";
import ruMedia from "./ru-RU/media";
import ruLayouts from "./ru-RU/layouts";
import ruPresentationsBrowser from "./ru-RU/presentationsBrowser";
import ruPresentationStudio from "./ru-RU/presentationStudio";
import ruPresentationRoom from "./ru-RU/presentationRoom";

export default {
  "ru-RU": {
    ...ruIndex,
    ...ruAuth,
    ...ruUser,
    ...ruMedia,
    ...ruLayouts,
    ...ruPresentationsBrowser,
    ...ruPresentationStudio,
    ...ruPresentationRoom,
  },
};
