import { ROUTE_PATHS } from "src/constants/routes";

export default {
  auth: {
    login: {
      title: "Log In",
      google: "Log In with Google",
      or: "or",
      form: {
        email: "Enter email",
        password: "Enter password",
        forgotPassword: "Forgot password?",
        submit: "Log In",
        newUser: "New here?",
        register: "Register",

        errors: {
          email: {
            required: "Email is required",
            invalid: "Invalid email format",
          },
          password: {
            required: "Password is required",
          },
        },
      },
    },

    signup: {
      title: "Sign Up",
      google: "Sign Up with Google",
      or: "or",
      form: {
        name: "Your name",
        email: "Enter email",
        password: "Enter password",
        disclaimer: `By clicking "Register", you confirm that you have read the <a href="${ROUTE_PATHS.POLICIES.PRIVACY_POLICY}" target="_blank">Privacy Policy</a> and <a href="${ROUTE_PATHS.POLICIES.USER_AGREEMENT}" target="_blank">User Agreement</a>`,
        submit: "Register",
        oldUser: "Been here before?",
        login: "Log In",

        errors: {
          name: {
            required: "Your name is required",
          },
          email: {
            required: "Email is required",
            invalid: "Invalid email format",
          },
          password: {
            required: "Password is required",
            invalid: "Password must be 6 characters or more",
          },
        },
      },
    },

    restorePassword: {
      titles: {
        email: "Restoring Access",
        code: "Restoring Access",
        password: "Restoring Access",
        login: "Password has been updated successfully",
      },
      descriptions: {
        email:
          "We will send you instructions on how to change your password to your email",
        code: "Enter the code from email that has been sent to",
        password: "Almost done! Enter your new password",
        login: "Log in to your account using a new password",
      },
      form: {
        email: "Enter email",
        sendEmail: "Send",
        checkVerificationCode: "Submit",
        resendVerificationCode: "Resend code",
        resetPassword: "Reset Password",
        login: "Log In",
        errors: {
          email: {
            required: "Email is required",
            invalid: "Invalid email format",
          },
          code: {
            required: "Code is required",
            invalid: "Invalid code",
          },
          password: {
            required: "Password is required",
            invalid: "Password must be 6 characters or more",
          },
        },
      },
    },
  },

  mainLayout: {
    header: {
      search: "Find presentation",
      goPro: "Go Pro",
      userMenuLinks: {
        profile: "Profile",
        myPlan: "My Plan",
        payments: "Payments",
        logout: "Logout",
      },
    },
    drawer: {
      links: {
        myPresentations: "My Presentations",
        templates: "Templates",
        sharedWithMe: "Shared with Me",
        subscriptionPlans: "Subscription Plans",
      },
    },
  },

  userLayout: {
    drawer: {
      links: {
        settings: "Settings",
        myPlan: "My Plan",
        payments: "Payments",
        logout: "Logout",
      },
    },
  },

  user: {
    profile: {
      title: "Profile",
      save: "Save",
      form: {
        name: "Name",
        email: "Email",
        currentPassword: "Current password",
        newPassword: "New password",
        success: "Updated successfully",
        errors: {
          name: {
            required: "Your name is required",
          },
          email: {
            required: "Email is required",
            invalid: "Invalid email",
          },
          password: {
            required: "Password is required",
            invalid: "Password must be 6 characters or more",
          },
          code: {
            required: "Code is required",
            invalid: "Invalid code",
          },
        },
      },
    },
  },
};
