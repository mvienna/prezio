export default {
  /*
   * My presentations table
   */
  myPresentations: {
    title: "My Presentations",

    /*
     * Actions
     */
    actions: {
      delete: {
        title: "Delete",

        confirmation: {
          title: "Delete Presentations",
          message:
            "Are you sure you want to delete the selected presentations?",
        },
      },
      moveToFolder: "Move to",
    },

    /*
     * Columns
     */
    columns: {
      name: "Presentation Name",
      roomToken: "Room Code",
      updated: "Updated",
      created: "Created",
    },

    /*
     * No presentations
     */
    noPresentations: {
      title: "You haven't created any presentations yet",
      description:
        "Choose a template or create your own style. It's very easy!",
      import: "Upload PowerPoint",
      create: "New Presentation",
    },

    /*
     * Presentation row
     */
    presentationRow: {
      actions: {
        folder: {
          addToFolder: "Add to Folder",
          privacy: {
            public: "Public",
            private: "Private",
          },
          delete: {
            title: "Delete",

            confirmation: {
              title: "Delete Folder",
              message: "Are you sure you want to delete the selected folder?",
            },
          },
        },
        duplicate: "Duplicate",
        stats: "Statistics",
        resetResults: "Reset<br/>Results",
        share: "Share",
        delete: {
          title: "Delete",

          confirmation: {
            title: "Delete Presentation",
            message:
              "Are you sure you want to delete the selected presentation?",
          },
        },
      },
    },

    /*
     * New presentation
     */
    newPresentation: {
      title: "New Presentation",

      fields: {
        name: "Presentation Name",
        description: "Presentation Description",
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

        errors: {
          name: {
            required: "Presentation name is required",
          },
        },
      },

      cancel: "Cancel",
      create: "Create",
    },

    /*
     * New folder
     */
    newFolder: {
      title: "New Folder",

      fields: {
        name: "Folder Name",
        description: "Folder Description",
        addPresentations: "Add Presentations",
        privacy: {
          public: {
            title: "Public",
            description:
              "The folder will be visible and accessible to other users",
          },
          private: {
            title: "Private",
            description:
              "The folder will be visible and accessible only to you",
          },
        },

        errors: {
          name: {
            required: "Folder name is required",
          },
        },
      },

      cancel: "Cancel",
      create: "Create",
    },
  },
};
