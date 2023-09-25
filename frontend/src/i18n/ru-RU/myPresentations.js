export default {
  /*
   * my presentations table
   */
  myPresentations: {
    title: "Мои презентации",

    /*
     * actions
     */
    actions: {
      delete: {
        title: "Удалить",

        confirmation: {
          title: "Удаление презентаций",
          message: "Вы уверены, что хотите удалить выбранные презентации?",
        },
      },
      moveToFolder: "Переместить в",
    },

    /*
     * columns
     */
    columns: {
      name: "Название презентации",
      accessKey: "Код доступа",
      updated: "Изменено",
      created: "Создано",
    },

    /*
     * no presentations
     */
    noPresentations: {
      title: "Вы еще не создали ни одной презентации",
      description: "Выберите шаблон или создайте свой стиль. Это очень просто!",
      import: "Загрузить PowerPoint",
      create: "Новая презентация",
    },

    /*
     * presentation row
     */
    presentationRow: {
      actions: {
        folder: {
          addToFolder: "Добавить в папку",
          privacy: {
            public: "Публичная",
            private: "Приватная",
          },
          delete: {
            title: "Удалить",

            confirmation: {
              title: "Удаление папки",
              message: "Вы уверены, что хотите удалить выбранную папку?",
            },
          },
        },
        duplicate: "Дублировать",
        stats: "Статистика",
        resetResults: "Сбросить<br/>результаты",
        share: "Поделиться",
        delete: {
          title: "Удалить",

          confirmation: {
            title: "Удаление презентации",
            message: "Вы уверены, что хотите удалить выбранную презентацию?",
          },
        },
      },
    },

    /*
     * new presentation
     */
    newPresentation: {
      title: "Новая презентация",
      name: "Название презентации",
      description: "Описание презентации",
      folder: "Папка",
      privacy: {
        public: {
          title: "Публичная",
          description:
            "Презентация будет видна и доступна другим пользователям",
        },
        private: {
          title: "Приватная",
          description: "Презентация будет видна и доступна только Вам",
        },
      },
      create: "Создать новую презентацию",
      errors: {
        name: {
          required: "Требуется ввести название презентации",
        },
      },
    },

    /*
     * new folder
     */
    newFolder: {
      title: "Новая папка",
      name: "Название папки",
      description: "Описание папки",
      addPresentations: "Добавьте презентации",
      privacy: {
        public: {
          title: "Публичная",
          description: "Папка будет видна и доступна другим пользователям",
        },
        private: {
          title: "Приватная",
          description: "Папка будет видна и доступна только Вам",
        },
      },
      create: "Создать новую папку",
      errors: {
        name: {
          required: "Требуется ввести название папки",
        },
      },
    },
  },
};
