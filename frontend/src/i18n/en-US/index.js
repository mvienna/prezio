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
      title: "Password Recovery",
      description:
        "We will send you instructions on how to change your password to your email",
      form: {
        email: "Enter email",
        submit: "Reset Password",
        login: "Log In",
        errors: {
          email: {
            required: "Email is required",
            invalid: "Invalid email format",
          },
        },
      },
    },
  },
};
