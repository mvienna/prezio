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

          slideBaseFill: {
            title: "Базовая заливка",
            set: "Задать",
          },
        },

        /*
         * template
         */
        template: {
          title: "Шаблон",
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