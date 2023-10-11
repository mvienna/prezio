export default {
  /*
   * main layout
   */
  mainLayout: {
    header: {
      search: "Найти презентацию",
      goPro: "Перейти на Pro",
      userMenuLinks: {
        profile: "Профиль",
        myPlan: "Мой план",
        payments: "Платежи",
        logout: "Выйти",
      },
    },
    drawer: {
      links: {
        myPresentations: "Мои презентации",
        templates: "Шаблоны",
        sharedWithMe: "Поделились со мной",
        subscriptionPlans: "Тарифные планы",
      },
    },
  },

  /*
   * user layout
   */
  userLayout: {
    drawer: {
      links: {
        settings: "Настройки",
        myPlan: "Мой план",
        payments: "Платежи",
        logout: "Выйти",
      },
    },
  },

  /*
   * presentation layout
   */
  presentationLayout: {
    header: {
      preview: "Предпросмотр",
      run: "Запустить",
      open: "Открыть",
    },

    leftDrawer: {
      newSlide: "Новый слайд",
      import: "Импорт",
    },

    rightDrawer: {
      tabs: {
        /*
         * layers
         */
        layers: {
          title: "Слои",
          layer: {
            title: "Слой",
            visibility: {
              on: "Скрыть",
              off: "Показать",
            },
            lock: {
              on: "Заблокировать",
              off: "Разблокировать",
            },
            delete: "Удалить",
          },
          names: {
            drawing: "Линия",
            text: "Текст",
            media: "Фотография",
            mediaEmoji: "Эмоджи",
            shape: "Форма",
            background: "Фон",
            backgroundPreview: "Фон (предпросмотр)",
            baseFill: "Базовая заливка",
          },
        },

        /*
         * design
         */
        design: {
          title: "Дизайн",

          reset: {
            title: "Сбросить дизайн слайда",
            confirmation: {
              title: "Сброс дизайна слайда",
              message: "Вы уверены, что хотите сбросить дизайн слайда?",
            },
          },

          applyToAllSlides: {
            title: "Применить ко всем слайдам",
            confirmation: {
              title: "Применить ко всем слайдам",
              message:
                "Вы уверены, что хотите применить базовую заливку и фон ко всем остальным слайдам в этой презентации?",
            },
          },

          /*
           * slide background
           */
          slideBackground: {
            title: "Фон слайда",

            categories: {
              prezio: "Prezio",
              gradients: "Градиенты",
              minimalism: "Минимализм",
              office: "Оффис",
              architecture: "Архитектура",
              futuristic: "Футуристичные",
            },

            select: {
              title: "Выбранный фон слайда",
              open: "Выбрать фон",
            },

            filters: {
              title: "Фильтры",
              reset: "Сбросить фильтры",

              opacity: "Прозрачность",
              blur: "Размытие",
              contrast: "Контраст",
              brightness: "Яркость",
              invert: "Инверсивность",
              grayscale: "Оттенки серого",
            },
          },

          /*
           * slide base fill
           */
          slideBaseFill: {
            title: "Базовая заливка",
            set: "Задать",
          },

          /*
           * slide text default customization
           */
          defaultTextCustomization: {
            title: "Стандартные параметры текста",
          },
        },

        /*
         * types
         */
        types: {
          title: "Типы",

          options: {
            content: "Конент",
            qr: "QR код",
            video: "Видео",

            /*
             * quizzes & games
             */
            quizzesAndGames: "Игры & Викторины",

            pick_answer: "Выбор ответа",
            pick_image: "Выбор изображения",
            type_answer: "Ввод ответа",
            spinner_wheel: "Колесо фортуны",
            match_pairs: "Совпадающие пары",
            correct_order: "Правильный порядок",

            /*
             * opinion
             */
            userAnswer: "Мнение & Вопрос - Ответ",

            poll: "Опрос",
            open_ended: "Открытый ответ",
            word_cloud: "Облако слов",
            scales: "Графики",
            qna: "Вопрос - Ответ",
            brain_storm: "Брейншторм",
          },
        },

        /*
         * templates
         */
        templates: {
          title: "Шаблоны",

          categories: {
            title: "Категория шаблонов",

            work: "Работа",
            school: "Школа",
            fun: "Веселые",
            holidays: "Праздничные",
            other: "Другие",
          },

          search: {
            placeholder: "Поиск шаблона...",
            noResults: {
              title: "Ничего не найдено",
              template: "Шаблон",
            },
          },

          createOrEdit: {
            create: "Сохранить как шаблон",
            edit: "Редактировать шаблон",

            cancel: "Закрыть",
            submit: "Сохранить",

            fields: {
              name: "Название шаблона",
              description: "Описание шаблона",
              privacy: {
                public: {
                  title: "Публичный",
                  description: "Шаблон будет видна и доступна только Вам",
                },
                private: {
                  title: "Приватный",
                  description:
                    "Шаблон будет виден и доступен другим пользователям",
                },
              },
              category: "Категория шаблона",

              errors: {
                name: {
                  required: "Необходимо ввести имя шаблона",
                },
              },
            },
          },

          applied: "Шаблон успешно применен",
        },

        /*
         * audio
         */
        audio: {
          title: "Аудио",
        },
      },
    },

    /*
     * errors
     */
    errors: {
      somethingWentWrong: "Что-то пошло не так",
    },
  },
};
