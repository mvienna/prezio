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

  PRESENTATIONS: {
    INDEX: "/presentations",
    PRESENTATION: "/presentation/:presentation_id",
    TEMPLATES: "/presentations/templates",
    SHARED_WITH_ME: "/presentations/shared-with-me",
  },

  SUBSCRIPTION_PLANS: "/subscriptions-plans",
};
