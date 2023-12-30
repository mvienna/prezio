export default {
  /*
   * my presentations table
   */
  presentationsBrowser: {
    welcome: {
      title: "Привет, {name} 👋",
      description: "Управляй своими презентациями в едином пространстве",
    },

    upgrade: {
      title: "Бесплатный тариф",
      description: "До 7 участников",
      upgrade: "Обновить",
    },

    /*
     * columns
     */
    columns: {
      name: "Название презентации",
      roomToken: "Код комнаты",
      updated: "Изменено",
      created: "Создано",
    },

    /*
     * no presentations
     */
    noPresentations: {
      title: "Создайте первую презентацию",
      description: "Это очень просто! Выберите шаблон или создайте свой стиль",
    },

    sort: {
      title: "Сортировка",
      fields: {
        name: "По названию",
        created_at: "По дате создания",
        updated_at: "По дате обновления",
      },
      direction: {
        ascending: "По возрастанию",
        descending: "По убыванию",
      },
    },

    /*
     * presentation row
     */
    presentationItem: {
      title: "Мои презентации",

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
        rename: "Переименовать",
        edit: "Редактировать",
        launch: "Запустить",
        delete: {
          title: "Удалить",

          confirmation: {
            title: "Удаление презентации",
            message: "Вы уверены, что хотите удалить выбранную презентацию?",
          },
        },
      },
    },

    folderItem: {
      title: "Мои папки",
    },

    /*
     * new presentation
     */
    newPresentation: {
      title: "Новая презентация",

      fields: {
        name: "Введите название презентации",
        description: "Введите описание презентации",
        folder: "Выберите папку (необязательно)",
        privacy: {
          title: "Настройка видимости",

          private: "Приватная",
          description:
            "Все у кого есть ссылка или QR смогут видеть презентацию. Можно настроить позже.",
        },

        errors: {
          name: {
            required: "Требуется ввести название презентации",
          },
        },
      },

      cancel: "Отменить",
      create: "Создать",
    },

    /*
     * new folder
     */
    newFolder: {
      title: "Новая папка",

      fields: {
        name: "Введите название папки",
        addPresentations: {
          title: "Добавьте презентации",
          description:
            "Вы можете быстро переместить в эту папку ваши недавние презентации",
        },

        errors: {
          name: {
            required: "Требуется ввести название папки",
          },
        },
      },

      cancel: "Отменить",
      create: "Создать",
    },

    /*
     * search
     */
    search: {
      placeholder: "Поиск",
    },
  },
};
