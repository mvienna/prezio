export default {
  /*
   * main layout
   */
  mainLayout: {
    header: {
      search: "Find Presentation",
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
        sharedWithMe: "Shared With Me",
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
        logout: "Logout",
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
            backgroundPreview: "Background (Preview)",
            baseFill: "Base Fill",
          },
        },

        /*
         * design
         */
        design: {
          title: "Design",

          reset: {
            title: "Reset Slide Design",
            confirmation: {
              title: "Reset Slide Design",
              message: "Are you sure you want to reset the slide design?",
            },
          },

          applyToAllSlides: {
            title: "Apply to All Slides",
            confirmation: {
              title: "Apply to All Slides",
              message:
                "Are you sure you want to apply base fill and background to all other slides in this presentation?",
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
              reset: "Reset Filters",

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

    /*
     * errors
     */
    errors: {
      somethingWentWrong: "Something Went Wrong",
    },
  },
};