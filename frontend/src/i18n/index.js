/*
 * en-US
 */
import enIndex from "./en-US";
import enAuth from "./en-US/auth";
import enUser from "./en-US/user";
import enMedia from "./en-US/media";
import enLayouts from "./en-US/layouts";
import enMyPresentations from "./en-US/myPresentations";
import enPresentationStudio from "./en-US/presentationStudio";

/*
 * ru-RU
 */
import ruIndex from "./ru-RU";
import ruAuth from "./ru-RU/auth";
import ruUser from "./ru-RU/user";
import ruMedia from "./ru-RU/media";
import ruLayouts from "./ru-RU/layouts";
import ruMyPresentations from "./ru-RU/myPresentations";
import ruPresentationStudio from "./ru-RU/presentationStudio";

export default {
  "en-US": {
    ...enIndex,
    ...enAuth,
    ...enUser,
    ...enMedia,
    ...enLayouts,
    ...enMyPresentations,
    ...enPresentationStudio,
  },
  "ru-RU": {
    ...ruIndex,
    ...ruAuth,
    ...ruUser,
    ...ruMedia,
    ...ruLayouts,
    ...ruMyPresentations,
    ...ruPresentationStudio,
  },
};
