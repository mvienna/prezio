import { ROUTE_PATHS } from "src/constants/routes";

export default {
  /*
   * auth
   */
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
        disclaimer: `By clicking "Sign Up," you confirm that you have read the <a href="${ROUTE_PATHS.POLICIES.PRIVACY_POLICY}" target="_blank">Privacy Policy</a> and <a href="${ROUTE_PATHS.POLICIES.USER_AGREEMENT}" target="_blank">User Agreement</a>`,
        submit: "Sign Up",
        oldUser: "Already have an account?",
        login: "Log In",

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
        },
      },
    },

    restorePassword: {
      titles: {
        email: "Password Recovery",
        code: "Password Recovery",
        password: "Password Recovery",
        login: "Password Successfully Changed",
      },
      descriptions: {
        email: "We will send instructions to your email for password reset",
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
            invalid: "Password must have 6 or more characters",
          },
        },
      },
    },
  },

  /*
   * main layout
   */
  mainLayout: {
    header: {
      search: "Search Presentation",
      goPro: "Go Pro",
      userMenuLinks: {
        profile: "Profile",
        myPlan: "My Plan",
        payments: "Payments",
        logout: "Log Out",
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

  /*
   * user layout
   */
  userLayout: {
    drawer: {
      links: {
        settings: "Settings",
        myPlan: "My Plan",
        payments: "Payments",
        logout: "Log Out",
      },
    },
  },

  /*
   * user
   */
  user: {
    /*
     * profile
     */
    profile: {
      title: "Profile",
      save: "Save",
      verifyEmail: {
        title: "Verify Email",
        description: "Enter the code from the email sent to",
      },
      form: {
        name: "Name",
        email: "Email",
        currentPassword: "Current Password",
        newPassword: "New Password",
        success: "Data successfully updated",
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

  /*
   * presentation layout
   */
  presentationLayout: {
    header: {
      preview: "Preview",
      run: "Run",
    },
    leftDrawer: {
      newSlide: "New Slide",
      import: "Import",
    },
    rightDrawer: {
      tabs: {
        layers: "Layers",
        design: "Design",
        template: "Template",
        audio: "Audio",
      },
      layers: {
        layer: {
          title: "Layer",
          visibility: {
            on: "Hide",
            off: "Show",
          },
          lock: {
            on: "Lock",
            off: "Unlock",
          },
          delete: "Remove",
        },
        names: {
          drawing: "Line",
          text: "Text",
          media: "Image",
          mediaEmoji: "Emoji",
          shape: "Shape",
        },
      },
    },
  },

  /*
   * presentation editor
   */
  presentationEditor: {
    drawing: {
      options: {
        color: "Color",
        erase: "Eraser Mode",
        brushSize: "Brush Size",
        brushType: "Brush Type",
      },
      BRUSH_TYPES: {
        pen: "Pen",
        pencil: "Pencil",
      },
    },
    text: {
      options: {
        font: "Font",
        fontSize: "Font Size",
        newText: "New Field",
      },
    },
    shapes: {
      options: {
        color: "Color",
        fill: "Fill",
        lineWidth: "Line Width",
      },
    },

    toolbar: {
      drawing: {
        title: "Drawing",
      },
      text: {
        title: "Text",
        formatting: {
          bold: "Bold",
          italic: "Italic",
          underline: "Underline",
          strikeThrough: "Strike-Through",
          alignment: "Alignment",
        },
        newText: "Add new text on a slide",
      },
      media: {
        title: "Фотографии",
      },
      emoji: {
        title: "Эмодзи",
      },
      shape: {
        title: "Формы",
      },
      zoom: {
        in: "Zoom In",
        out: "Zoom Out",
        select: "Select Zoom",
      },
    },
  },

  /*
   * media
   */
  media: {
    select: {
      title: "Image Selection",
      tabs: {
        upload: {
          title: "Upload",
          description: "Upload an image from your device",
        },
        mine: {
          title: "My Images",
          empty: "You don't have any uploaded photos yet",
        },
        stock: {
          title: "Stock",
        },
        gifsAndStickers: {
          title: "GIFs and Stickers",
        },
      },
      submit: "Select",
    },
    actions: {
      delete: {
        title: "Delete",
      },
    },
  },

  /*
   * tooltips
   */
  tooltips: {
    in_development: "In Development",
  },
};
