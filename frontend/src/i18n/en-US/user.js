export default {
  user: {
    /*
     * profile
     */
    profile: {
      title: "Profile",
      save: "Save",

      verifyEmail: {
        title: "Verify Email",
        description: "Enter the code from the email that was sent to",
      },

      form: {
        name: "Name",
        email: "Email",
        currentPassword: "Current Password",
        newPassword: "New Password",
        success: "Data updated successfully",
        checkVerificationCode: "Check",
        resendVerificationCode: "Resend",

        errors: {
          name: {
            required: "Name is required",
          },
          email: {
            required: "Email is required",
            invalid: "Invalid email format",
          },
          password: {
            required: "Password is required",
            invalid: "Password must have 6 or more characters",
          },
          code: {
            required: "Code is required",
            invalid: "Invalid code",
          },
        },

        avatar: {
          upload: "Upload",
          success: {
            upload: "Avatar uploaded successfully",
            delete: "Avatar deleted successfully",
          },
        },
      },
    },
  },
};
