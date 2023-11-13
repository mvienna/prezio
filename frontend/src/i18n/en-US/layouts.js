export default {
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
        logout: "Logout",
      },
      room: {
        enterCode: "Enter Code",
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
        title: "Start",

        now: {
          title: "Quick Start",
          description: "Present from the current slide",
        },
        fromBeginning: {
          title: "Start from the Beginning",
          description: "Present from the first slide",
        },
        withBackstage: {
          title: "Present with Backstage",
          description: "Advanced control over the presentation",
          beta: "Beta",
        },

        fullscreen: "Full Screen Mode",

        privacySettingsWarning: {
          title: "Presentation - Private",
          message:
            "The audience won't be able to see or interact with slides from their devices. Are you sure you want to continue?",
          switchToPublic: "Make Public",
          presentAnyway: "Continue",
        },

        quizSettingsWarning: {
          title: "You haven't specified the correct answer",
          message: "Slide ",
          dismiss: "Don't remind me in this presentation",
          cancel: "Cancel",
          presentAnyway: "Start Anyway",
        },
      },
      share: {
        title: "Share",
        inviteAudience: {
          title: "Audience Invitation",
          link: {
            title: "The audience can join at",
            copy: "Copy",
          },
          qr: {
            title: "Or by scanning the QR code",
            download: "Download",
          },
        },
        addEditor: {
          title: "Share Access",
        },
        shareSlides: {
          title: "Share Slides",
        },
        publish: {
          title: "Publish",
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
                "Are you sure you want to apply the base fill and background to all other slides in this presentation?",
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
            title: "Default Text Customization",
          },
        },

        /*
         * types
         */
        types: {
          title: "Types",

          options: {
            content: "Content",
            qr: "QR Code",
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

            leaderboard: "Leaderboard",

            /*
             * opinion
             */
            userAnswer: "Opinion",

            poll: "Poll",
            open_ended: "Open Ended",
            word_cloud: "Word Cloud",
            scales: "Scales",
            qna: "Q&A",
            brain_storm: "Brainstorm",
          },

          leaderboard: {
            tip: "In order to add leaderboard you have to have at least one slide of type «Quiz & Games»",
          },
        },

        /*
         * settings
         */
        settings: {
          title: "Settings",
          appliedToAllQuestionsSuccessfully:
            "Settings applied to all 'Quizzes & Games' and 'Opinion' slides successfully",

          question: {
            title: "Your question",
            placeholder: "Your question...",

            description: {
              title: "Detailed description",
              caption:
                "A more detailed description will be shown on your audience's devices. You can also display it during the presentation by hovering over the question title",
              placeholder: "Your Question Description...",
            },
          },

          timeLimit: {
            title: "Time Limit",
            description: "The time participants have to answer",
            invalid: "Invalid value. Enter a number from 5 to 1800",
            seconds: "Seconds",
          },

          lockSubmission: {
            title: "Lock Answers at Start",
            description:
              "Lock answer submission on this slide to present it before allowing the audience to vote",
          },

          hideResults: {
            title: "Hide Answers",
            description:
              "Hide participant answers while voting is still ongoing. This helps prevent bias in voting",
          },

          applyToAllQuestions: {
            title: "Apply to All Questions",
            confirmation: {
              title: "Apply to All Questions?",
              message:
                "Are you sure you want to apply the following settings to all questions in the presentation?",
            },
          },

          // word cloud
          multipleEntries: {
            title: "Allow Multiple Entries",

            on: "Each participant can respond multiple times",
            off: "Each participant can respond once",
          },

          entriesPerParticipant: {
            title: "Entries per Participant",
            description:
              "One response can consist of multiple words. You can increase this limit to 10",
            invalid: "Invalid value. Enter a number from 1 to 10",
          },

          // quiz
          answerOptions: {
            title: "Answer Options",
            description: {
              pick_answer:
                "Write answer options for participants to choose from",
              pick_image:
                "Attach photos as answer options for participants to choose from. Additionally, you can add labels to them",
            },

            answerOption: "Answer Option #",
            addAnswerOption: "Add Answer Option",

            tickTheCorrectAnswerOption: "Tick the correct answer",

            maxLengthErrorMessage: "Maximum 150 characters",
          },

          points: {
            title: "Points",
            description: "Select the point range for this question",

            min: "Min",
            max: "Max",

            errors: {
              invalid: "Value should be in range from 0 to 1000",
              invalidMin: "Значение должно быть меньше или равно макс.",
              invalidMax: "Значение должно быть больше или равно мин.",
            },

            scoreDependsOnTime: {
              title: "Score Depends on Time",
              description: {
                on: "Faster responses earn more points",
                off: "A correct response earns the maximum points, while a wrong response earns the minimum",
              },
            },

            partialScoring: {
              title: "Partial Scoring",
              description: {
                off: "Participants will get the maximum available amount of points (including score depends on time setting), but only if they choose all the correct answers",
                on: "Participants receive points for each correct answer, but selecting even one incorrect answer results in the minimum score",
              },
            },
          },

          leaderboard: {
            title: "Leaderboard",
            description:
              "After the question or at the end of the quiz, you can show a slide leaderboard with the results of the entire quiz",
            create: "Create after this slide",
          },

          openGeneralQuizSettings: {
            title: "Open General Quiz Settings",
          },

          filterProfanity: {
            title: "Filter profanity",
            description:
              "Participants won't be able to submit answers that have profanity words",
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
            placeholder: "Search Template...",
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
                    "The template will only be visible and accessible to you",
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
                  required: "Template name is required",
                },
              },
            },
          },

          applied: "Template applied successfully",
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
