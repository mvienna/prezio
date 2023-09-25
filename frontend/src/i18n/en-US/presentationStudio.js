export default {
  presentationStudio: {
    /*
     * toolbar
     */
    toolbar: {
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

        newText: "Add new text to slide",
      },
      media: {
        title: "Photos",
      },
      emoji: {
        title: "Emoji",
      },
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
      zoom: {
        in: "Zoom In",
        out: "Zoom Out",
        select: "Select Zoom",
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

      audienceAuthentication: {
        title: "Audience Authentication",
      },

      questionsAndAnswersFromAudience: {
        title: "Questions and Answers from Your Audience",
      },

      quizSetup: {
        title: "Quiz/Poll Setup",
      },

      language: {
        title: "Language",
      },

      leader: {
        title: "Who Takes the Initiative",
      },

      other: {
        title: "Other Settings",
      },
    },
  },
};
