export const ROUTE_PATHS = {
  INDEX: "/",
  DASHBOARD: "/dashboard",

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

  USER: {
    PROFILE: "/user/profile",
    MY_PLAN: "/user/my-plan",
    PAYMENTS: "/user/payments",
  },

  PRESENTATIONS_BROWSER: "/presentations",
  PRESENTATION_STUDIO: "/presentation/:presentation_id",
  PRESENTATION_ROOM: "/room/:token",
  PRESENTATION_ROOM_BACKSTAGE: "/room/:token/backstage",
};
