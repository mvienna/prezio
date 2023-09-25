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
        newUser: "First time here?",
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
        disclaimer: `By clicking "Register," you confirm that you have read the <a href="${ROUTE_PATHS.POLICIES.PRIVACY_POLICY}" target="_blank">Privacy Policy</a> and <a href="${ROUTE_PATHS.POLICIES.USER_AGREEMENT}" target="_blank">User Agreement</a>`,
        submit: "Register",
        oldUser: "Already been here?",
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
        email: "Password Recovery",
        code: "Password Recovery",
        password: "Password Recovery",
        login: "Password has been successfully changed",
      },
      descriptions: {
        email: "We will send instructions to your email to reset the password",
        code: "Enter the code from the email sent to",
        password: "Almost there! Enter your new password",
        login: "Log in to your account using the new password",
      },
      form: {
        email: "Enter email",
        sendEmail: "Send",
        checkVerificationCode: "Check",
        resendVerificationCode: "Resend",
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
};
