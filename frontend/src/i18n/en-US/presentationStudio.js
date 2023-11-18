export default {
  presentationStudio: {
    /*
     * toolbar
     */
    toolbar: {
      // drawing
      drawing: {
        title: "Drawing",

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

      // text
      text: {
        title: "Text",

        options: {
          font: "Font",
          fontSize: "Font Size",
          newText: "New Text Field",

          formatting: {
            bold: "Bold",
            italic: "Italic",
            underline: "Underline",
            strikeThrough: "Strike Through",
            alignment: "Alignment",

            clearFormatting: "Clear Formatting",
          },
        },

        newTextValue: "Start entering text here",
      },

      // media
      media: {
        title: "Photos",
      },

      // emoji
      emoji: {
        title: "Emoji",
      },

      // shape
      shape: {
        title: "Shapes",

        options: {
          strokeColor: "Stroke Color",
          removeStrokeColor: "Remove Stroke Color",
          fillColor: "Fill Color",
          removeFillColor: "Remove Fill Color",
          lineWidth: "Line Width",
        },
      },

      // zoom
      zoom: {
        in: "Zoom In",
        out: "Zoom Out",
        select: "Select Zoom",
      },

      // reset results
      resetResults: {
        title: "Reset results",

        confirmation: {
          title: "Reset results?",
          message:
            "Are you sure you want to reset results (submissions), received from participants before?",
        },

        options: {
          resetPresentation: "Reset the whole presentation",
          resetSlide: "Reset only this slide",
        },
      },

      // layouts
      layouts: {
        title: "Layout",

        options: {
          blank: "Blank Slide",
          titleSlide: "Title slide",
          title: "Title on the top",
          titleAndBody: "Title and Body",
          titleAndTwoColumns: "Title and Two Objects",
          titleOnly: "Title only",
        },
      },
    },

    /*
     * slide
     */
    slide: {
      actions: {
        newSlide: "Add Slide",
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

      moveUp: "Move Up",
      moveToTheTop: "Move to the Top",

      moveDown: "Move Down",
      moveToTheBottom: "Move to the Bottom",
    },

    /*
     * settings
     */
    settings: {
      title: "Settings",

      visibility: {
        private: "Private",
        public: "Public",
      },

      generalInformation: {
        title: "General Information",
        description: {
          title: "Description",
          placeholder: "Write about the presentation...",
        },
        preview: {
          title: "Cover",
          select: "Select",
        },
      },

      collectParticipantsInfo: {
        title: "Collect Participants Info",
      },

      audienceAuthentication: {
        title: "Audience Authentication",
      },

      questionsAndAnswersFromAudience: {
        title: "Questions and Answers from Your Audience",
      },

      quiz: {
        title: "Quiz Settings",
        info: {
          title: "Settings apply to all 'Quizzes & Games' and 'Opinion' slides",
        },

        warning: {
          dismiss: "Don't remind about the absence of a correct answer",
        },

        options: {
          liveChat: "Live chat",
          lobbyMusic: "Lobby music",
          countdown: "5-Second countdown",
          playAsTeam: "Play as a Team",
          shuffleAnswerOptions: "Shuffle answer options",
          showAnswersManually: "Reveal answers manually",
        },
      },

      language: {
        title: "Language",
      },

      leader: {
        title: "Who Takes the Initiative",
      },

      other: {
        title: "Other Settings",

        showRoomInvitationPanel: {
          title: "Instructions panel to join",
        },

        reactions: {
          title: "Available reactions",
        },
      },
    },

    /*
     * preview
     */
    preview: {
      title: "Presentation preview",
      controls: {
        previous: "Back",
        next: "Next",
      },
    },

    /*
     * layouts
     */
    layouts: {
      defaultTexts: {
        title: "Click to add title",
        subtitle: "Click to add subtitle",
        body: "Click to add text",
        question: "Click to add question",
        leaderboard: "Leaderboard",
      },
    },
  },
};
