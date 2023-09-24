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
        /*
         * layers
         */
        layers: {
          title: "Layers",
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
            delete: "Delete",
          },
          names: {
            drawing: "Line",
            text: "Text",
            media: "Photo",
            mediaEmoji: "Emoji",
            shape: "Shape",
            background: "Background",
            backgroundPreview: "Background (preview)",
            baseFill: "Base Fill",
          },
        },

        /*
         * design
         */
        design: {
          title: "Design",
          reset: {
            title: "Reset slide design",
            confirmation: {
              title: "Reset slide design",
              message: "Are you sure that you want to reset slide design?",
            },
          },

          slideBackground: {
            title: "Slide Background",

            categories: {
              prezio: "Prezio",
              gradients: "Gradients",
              minimalism: "Minimalism",
              office: "Office",
              architecture: "Architecture",
              futuristic: "Futuristic",
            },

            select: {
              title: "Selected Slide Background",
              open: "Select Background",
            },

            filters: {
              title: "Filters",
              reset: "Reset filters",

              opacity: "Opacity",
              blur: "Blur",
              contrast: "Contrast",
              brightness: "Brightness",
              invert: "Invert",
              grayscale: "Grayscale",
            },
          },

          slideBaseFill: {
            title: "Base Fill",
            set: "Set",
          },
        },

        /*
         * template
         */
        template: {
          title: "Template",
        },

        /*
         * audio
         */
        audio: {
          title: "Audio",
        },
      },
    },
  },

  /*
   * presentation
   */
  presentation: {
    /*
     * modes
     */
    drawing: {
      options: {
        color: "Color",
        erase: "Erase mode",
        brushSize: "Brush size",
        brushType: "Brush type",
      },
      BRUSH_TYPES: {
        pen: "Pen",
        pencil: "Pencil",
      },
    },
    text: {
      options: {
        font: "Font",
        fontSize: "Font size",
        newText: "New text field",
        clearFormatting: "Clear formatting",
      },
    },
    shapes: {
      options: {
        strokeColor: "Stroke Color",
        removeStrokeColor: "Remove Stroke",
        fillColor: "Fill Color",
        removeFillColor: "Remove Fill",
        lineWidth: "Line Width",
      },
    },

    /*
     * toolbar
     */
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
          strikeThrough: "Strike through",
          alignment: "Alignment",
        },
        newText: "Add new text to slide",
      },
      media: {
        title: "Photos",
      },
      emoji: {
        title: "Emojis",
      },
      shape: {
        title: "Shapes",
      },
      zoom: {
        in: "Zoom In",
        out: "Zoom Out",
        select: "Select zoom level",
      },
    },

    /*
     * slide
     */
    slide: {
      actions: {
        newSlide: "New Slide",
        duplicate: "Duplicate",
        delete: "Delete",
      },
    },

    /*
     * element's context menu
     */
    elementsContextMenu: {
      copy: "Copy",
      cut: "Cut",
      paste: "Paste",
      duplicate: "Duplicate",
      delete: "Delete",

      moveUp: "Move up",
      moveToTheTop: "Move to the top",

      moveDown: "Move down",
      moveToTheBottom: "Move to the bottom",
    },

    /*
     * settings
     */
    settings: {
      visibility: {
        private: "Private",
        public: "Public",
      },

      title: "Settings",

      generalInformation: {
        title: "General Info",
        description: {
          title: "Description",
          placeholder: "Tell about the presentation...",
        },
        preview: {
          title: "Preview",
          select: "Select",
        },
      },
      audienceAuthentication: {
        title: "Audience Auth",
      },
      questionsAndAnswersFromAudience: {
        title: "Q&A from Audience",
      },
      quizSetup: {
        title: "Quiz setup",
      },
      language: {
        title: "Language",
      },
      leader: {
        title: "Who takes the initiative",
      },
      other: {
        title: "Other settings",
      },
    },
  },

  /*
   * my presentations, table
   */
  presentations: {
    myPresentationsTitle: "My Presentations",

    /*
     * columns
     */
    columns: {
      name: "Presentation name",
      accessKey: "Access code",
      updated: "Updated",
      created: "Created",
    },

    /*
     * new presentation
     */
    newPresentation: {
      title: "New Presentation",
      name: "Presentation name",
      description: "Presentation description",
      folder: "Folder",
      privacy: {
        public: {
          title: "Public",
          description:
            "The presentation will be visible and accessible to other users",
        },
        private: {
          title: "Private",
          description:
            "The presentation will be visible and accessible only to you",
        },
      },
      create: "Create new presentation",
      errors: {
        name: {
          required: "Presentation name is required",
        },
      },
    },

    /*
     * new folder
     */
    newFolder: {
      title: "New Folder",
      name: "Folder name",
      description: "Folder description",
      addPresentations: "Add presentations",
      privacy: {
        public: {
          title: "Public",
          description:
            "The folder will be visible and accessible to other users",
        },
        private: {
          title: "Private",
          description: "The folder will be visible and accessible only to you",
        },
      },
      create: "Create new folder",
      errors: {
        name: {
          required: "Folder name is required",
        },
      },
    },

    /*
     * errors
     */
    errors: {
      somethingWentWrong: "Something went wrong",
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
          search: "Search...",
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
      open: {
        title: "Open",
      },
    },
  },

  /*
   * tooltips
   */
  tooltips: {
    in_development: "In development",
  },

  /*
   * loading
   */
  loading: {
    fetchingData: "Fetching data",
  },

  /*
   * dashboard
   */
  dashboard: {
    noPresentations: {
      title: "You haven't created any presentations yet",
      description: "Choose a template or create your own style. It's easy!",
      import: "Import PowerPoint",
      create: "New Presentation",
      delete: "Delete",
      moveTo: "Move to",
    },
    presentation: {
      actions: {
        folder: {
          folder: "Add to folder",
          privacy: {
            public: "Public",
            private: "Private",
          },
          delete: "Delete",
        },
        duplicate: "Duplicate",
        stats: "Statistics",
        resetResults: "Reset Results",
        share: "Share",
        delete: "Delete",
      },
    },
  },
};
