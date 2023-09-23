import { ROUTE_PATHS } from "src/constants/routes";

export default {
  /*
   * auth
   */
  auth: {
    login: {
      title: "Войти",
      google: "Войти с помощью Google",
      or: "или",
      form: {
        email: "Введите email",
        password: "Введите пароль",
        forgotPassword: "Забыли пароль?",
        submit: "Войти",
        newUser: "Впервые тут?",
        register: "Зарегистрируйтесь",

        errors: {
          email: {
            required: "Требуется ввести email",
            invalid: "Неверный формат email",
          },
          password: {
            required: "Требуется ввести пароль",
          },
        },
      },
    },

    signup: {
      title: "Регистрация",
      google: "Зарегистрироваться с помощью Google",
      or: "или",
      form: {
        name: "Ваше имя",
        email: "Введите email",
        password: "Введите пароль",
        disclaimer: `Нажимая на кнопку “Зарегистрироваться”, вы подтверждаете, что ознакомились с <a href="${ROUTE_PATHS.POLICIES.PRIVACY_POLICY}" target="_blank">Политикой конфиденциальности</a> и <a href="${ROUTE_PATHS.POLICIES.USER_AGREEMENT}" target="_blank">Пользовательским соглашением</a>`,
        submit: "Зарегистрироваться",
        oldUser: "Уже были у нас?",
        login: "Войдите",

        errors: {
          name: {
            required: "Требуется ввести ваше имя",
          },
          email: {
            required: "Требуется ввести email",
            invalid: "Неверный формат email",
          },
          password: {
            required: "Требуется ввести пароль",
            invalid: "Пароль должен иметь 6 или больше символов",
          },
        },
      },
    },

    restorePassword: {
      titles: {
        email: "Восстановление доступа",
        code: "Восстановление доступа",
        password: "Восстановление доступа",
        login: "Пароль был успешно изменен",
      },
      descriptions: {
        email: "На вашу почту мы пришлем инструкцию по изменению пароля",
        code: "Введите код из письма, которое было отправлено на",
        password: "Почти закончили! Введите ваш новый пароль",
        login: "Войдите в свой аккаунт используя новый пароль",
      },
      form: {
        email: "Введите email",
        sendEmail: "Отправить",
        checkVerificationCode: "Проверить",
        resendVerificationCode: "Отправить повторно",
        resetPassword: "Сбросить пароль",
        login: "Войти",
        errors: {
          email: {
            required: "Требуется ввести email",
            invalid: "Неверный формат email",
          },
          code: {
            required: "Требуется ввести код",
            invalid: "Неверный код",
          },
          password: {
            required: "Требуется ввести пароль",
            invalid: "Пароль должен иметь 6 или больше символов",
          },
        },
      },
    },
  },

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
   * user
   */
  user: {
    /*
     * profile
     */
    profile: {
      title: "Профиль",
      save: "Сохранить",
      verifyEmail: {
        title: "Подтвердите почту",
        description: "Введите код из письма, которое было отправлено на",
      },
      form: {
        name: "Имя",
        email: "Email",
        currentPassword: "Старый пароль",
        newPassword: "Новый пароль",
        success: "Данные успешно обновлены",
        checkVerificationCode: "Проверить",
        resendVerificationCode: "Отправить повторно",
        errors: {
          name: {
            required: "Требуется ввести ваше имя",
          },
          email: {
            required: "Требуется ввести email",
            invalid: "Неверный формат email",
          },
          password: {
            required: "Требуется ввести пароль",
            invalid: "Пароль должен иметь 6 или больше символов",
          },
          code: {
            required: "Требуется ввести код",
            invalid: "Неверный код",
          },
        },
        avatar: {
          upload: "Загрузить",
          success: {
            upload: "Аватарка загружена успешно",
            delete: "Аватарка удалена успешно",
          },
        },
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
            baseFill: "Базовая заливка",
          },
        },

        /*
         * design
         */
        design: {
          title: "Дизайн",

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
  },

  /*
   * presentation
   */
  presentation: {
    /*
     * modes
     */
    drawing: {
      options: {
        color: "Цвет",
        erase: "Режим стирания",
        brushSize: "Размер кисти",
        brushType: "Тип кисти",
      },
      BRUSH_TYPES: {
        pen: "Ручка",
        pencil: "Карандаш",
      },
    },
    text: {
      options: {
        font: "Шрифт",
        fontSize: "Размер шрифта",
        newText: "Новое поле",
        clearFormatting: "Очистить форматирование",
      },
    },
    shapes: {
      options: {
        strokeColor: "Цвет обводки",
        removeStrokeColor: "Убрать обводку",
        fillColor: "Цвет заливки",
        removeFillColor: "Убрать заливку",
        lineWidth: "Размер",
      },
    },

    /*
     * toolbar
     */
    toolbar: {
      drawing: {
        title: "Рисование",
      },
      text: {
        title: "Текст",
        formatting: {
          bold: "Жирный шрифт",
          italic: "Курсив",
          underline: "Подчеркивание",
          strikeThrough: "Зачеркивание",
          alignment: "Выравнивание",
        },
        newText: "Добавьте новый текст на слайд",
      },
      media: {
        title: "Фотографии",
      },
      emoji: {
        title: "Эмодзи",
      },
      shape: {
        title: "Формы",
      },
      zoom: {
        in: "Увеличить",
        out: "Уменьшить",
        select: "Выбрать масштабирование",
      },
    },

    /*
     * slide
     */
    slide: {
      actions: {
        newSlide: "Добавить слайд",
        duplicate: "Дублировать",
        delete: "Удалить",
      },
    },

    /*
     * element's context menu
     */
    elementsContextMenu: {
      copy: "Копировать",
      cut: "Вырезать",
      paste: "Вставить",
      duplicate: "Дублировать",
      delete: "Удалить",

      moveUp: "Переместить выше",
      moveToTheTop: "Переместить вверх",

      moveDown: "Переместить ниже",
      moveToTheBottom: "Переместить вниз",
    },

    /*
     * settings
     */
    settings: {
      visibility: {
        private: "Приватная",
        public: "Публичная",
      },

      title: "Настройки",

      generalInformation: {
        title: "Основная информация",
        description: {
          title: "Описание",
          placeholder: "Напишите о презентации...",
        },
        preview: {
          title: "Обложка",
          select: "Выбрать",
        },
      },
      audienceAuthentication: {
        title: "Аутентификация аудитории",
      },
      questionsAndAnswersFromAudience: {
        title: "Вопросы и ответы вашей аудитории",
      },
      quizSetup: {
        title: "Настройка викторины/опроса",
      },
      language: {
        title: "Язык",
      },
      leader: {
        title: "Кто берет на себя инициативу",
      },
      other: {
        title: "Другие настройки",
      },
    },
  },

  /*
   * my presentations, table
   */
  presentations: {
    myPresentationsTitle: "Мои презентации",

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

    /*
     * errors
     */
    errors: {
      somethingWentWrong: "Что-то пошло не так",
    },
  },

  /*
   * media
   */
  media: {
    select: {
      title: "Выбор изображения",
      tabs: {
        upload: {
          title: "Загрузка",
          description: "Загрузите изображение с устройства",
        },
        mine: {
          title: "Мои картинки",
          empty: "У вас пока что нет загруженных фотографий",
        },
        stock: {
          title: "Стоковые",
          search: "Поиск...",
        },
        gifsAndStickers: {
          title: "GIF и стикеры",
        },
      },
      submit: "Выбрать",
    },
    actions: {
      delete: {
        title: "Удалить",
      },
      open: {
        title: "Открыть",
      },
    },
  },

  /*
   * tooltips
   */
  tooltips: {
    in_development: "В процессе разработки",
  },

  /*
   * loading
   */
  loading: {
    fetchingData: "Загружаем данные",
  },

  /*
   * dashboard
   */
  dashboard: {
    noPresentations: {
      title: "Вы еще не создали ни одной презентации",
      description: "Выберите шаблон или создайте свой стиль. Это очень просто!",
      import: "Загрузить PowerPoint",
      create: "Новая презентация",
      delete: "Удалить",
      moveTo: "Переместить в",
    },
    presentation: {
      actions: {
        folder: {
          addToFolder: "Добавить в папку",
          privacy: {
            public: "Публичная",
            private: "Приватная",
          },
          delete: "Удалить",
        },
        duplicate: "Дублировать",
        stats: "Статистика",
        resetResults: "Сбросить<br/>результаты",
        share: "Поделиться",
        delete: "Удалить",
      },
    },
  },
};
