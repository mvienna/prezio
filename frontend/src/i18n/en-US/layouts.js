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
      room: {
        enterCode: "Enter code",
        join: "Join",
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
      present: {
        title: "Present",

        now: {
          title: "Present now",
          description: "Present from the current slide",
        },
        fromBeginning: {
          title: "Present from beginning",
          description: "Present from the first slide",
        },
        withBackstage: {
          title: "Present with Backstage",
          description: "Extended control over presentation",
          beta: "Beta",
        },

        fullscreen: "Fullscreen",

        privacySettingsWarning: {
          title: "Presentation is private",
          message:
            "Your audience won't be able to see your slides or interact from their devices. Would you like to proceed?",
          switchToPublic: "Switch to public",
          presentAnyway: "Present anyway",
        },
      },
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

          /*
           * slide background
           */
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

          /*
           * slide base fill
           */
          slideBaseFill: {
            title: "Base Fill",
            set: "Set",
          },

          /*
           * slide text default customization
           */
          defaultTextCustomization: {
            title: "Default text params",
          },
        },

        /*
         * content
         */
        content: {
          title: "Content",

          question: {
            title: "Your Question",
            placeholder: "Your question...",

            description: {
              title: "Detailed Description",
              caption:
                "A more detailed description will be shown on your audience's devices. You can also display it during the presentation by hovering over the question's title.",
              placeholder: "Your question description...",
            },
          },

          multipleEntries: {
            on: "Each participant can answer an unlimited number of times",
            off: "Each participant can answer only once",
          },

          entriesPerParticipant: {
            title: "Number of Answers per Participant",
            description:
              "A single answer can consist of multiple words. You can increase this limit up to 10.",
            invalid: "Invalid value. Enter a number from 1 to 10.",
          },

          timeLimit: {
            title: "Time Limit",
            description: "The time in which participants must respond",
            invalid:
              "Invalid value. Enter a number equal to or greater than 5.",
            seconds: "Seconds",
          },

          lockSubmission: {
            title: "Submission Lock",
            description:
              "Lock submissions on this slide to present it to the audience for voting before enabling voting.",
          },

          hideResults: {
            title: "Hide Answers",
            description:
              "Hide participant answers while voting is still in progress. This helps prevent bias in voting.",
            applyToAllQuestions: "Apply to all questions in the presentation",
          },
        },

        /*
         * templates
         */
        templates: {
          title: "Templates",

          categories: {
            title: "Template Categories",

            work: "Work",
            school: "School",
            fun: "Fun",
            holidays: "Holidays",
            other: "Other",
          },

          search: {
            placeholder: "Search for a template...",
            noResults: {
              title: "Nothing Found",
              template: "Template",
            },
          },

          createOrEdit: {
            create: "Save as Template",
            edit: "Edit Template",

            cancel: "Close",
            submit: "Save",

            fields: {
              name: "Template Name",
              description: "Template Description",
              privacy: {
                public: {
                  title: "Public",
                  description:
                    "The template will be visible and accessible only to you",
                },
                private: {
                  title: "Private",
                  description:
                    "The template will be visible and accessible to other users",
                },
              },
              category: "Template Category",

              errors: {
                name: {
                  required: "Please enter the template name",
                },
              },
            },
          },

          applied: "Template applied successfully",
        },

        /*
         * types
         */
        types: {
          title: "Types",

          options: {
            content: "Content",
            qr: "QR code",
            video: "Video",

            /*
             * quizzes & games
             */
            quizzesAndGames: "Quizzes & Games",

            pick_answer: "Pick Answer",
            pick_image: "Pick Image",
            type_answer: "Type Answer",
            spinner_wheel: "Spinner Wheel",
            match_pairs: "Match Pairs",
            correct_order: "Correct Order",

            /*
             * opinion
             */
            userAnswer: "Opinion & Question - Answer",

            poll: "Poll",
            open_ended: "Open Ended",
            word_cloud: "Word Cloud",
            scales: "Scaled",
            qna: "Q&A",
            brain_storm: "Brain Storm",
          },
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
