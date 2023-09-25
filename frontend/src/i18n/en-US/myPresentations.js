export default {
  /*
   * my presentations table
   */
  myPresentations: {
    title: "My Presentations",

    /*
     * actions
     */
    actions: {
      delete: {
        title: "Delete",

        confirmation: {
          title: "Deleting Presentations",
          message:
            "Are you sure you want to delete the selected presentations?",
        },
      },
      moveToFolder: "Move to",
    },

    /*
     * columns
     */
    columns: {
      name: "Presentation Name",
      accessKey: "Access Code",
      updated: "Updated",
      created: "Created",
    },

    /*
     * no presentations
     */
    noPresentations: {
      title: "You haven't created any presentations yet",
      description: "Choose a template or create your own style. It's easy!",
      import: "Upload PowerPoint",
      create: "New Presentation",
    },

    /*
     * presentation row
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
              title: "Deleting Folder",
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
            title: "Deleting Presentation",
            message:
              "Are you sure you want to delete the selected presentation?",
          },
        },
      },
    },

    /*
     * new presentation
     */
    newPresentation: {
      title: "New Presentation",
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
      create: "Create New Presentation",
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
          description: "The folder will be visible and accessible only to you",
        },
      },
      create: "Create New Folder",
      errors: {
        name: {
          required: "Folder name is required",
        },
      },
    },
  },
};
