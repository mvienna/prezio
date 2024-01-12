export const ROUTE_PATHS = {
  INDEX: "/",

  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
    SIGNUP: "/signup",
    RESTORE_PASSWORD: "/restore-password",
  },

  POLICIES: {
    PRIVACY_POLICY: "/privacy-policy",
    USER_AGREEMENT: "/user-agreement",
  },

  PROFILE: {
    INDEX: "/profile",
    SUBSCRIPTION: "/profile/subscription",
  },

  PRESENTATIONS_BROWSER: "/dashboard",
  PRESENTATION_STUDIO: "/presentation/:presentation_id",
  PRESENTATION_ROOM: {
    HOST: "/room/:token",
    PARTICIPANT: "/:token",
  },
};

export const SUBDOMAINS = {
  app: "app",
};
