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
      room: {
        enterCode: "Введите код",
        join: "Присоединиться",
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
      present: {
        title: "Запустить",

        now: {
          title: "Быстрый запуск",
          description: "Презентовать с текущего слайда",
        },
        fromBeginning: {
          title: "Запуск с начала",
          description: "Презентовать с первого слайда",
        },
        withBackstage: {
          title: "Презентовать с бэкстейджем",
          description: "Расширенный контроль над презентацией",
          beta: "Бета",
        },

        fullscreen: "Полноэкранный режим",

        privacySettingsWarning: {
          title: "Презентация - приватная",
          message:
            "Аудитория не сможет видеть слайды или взаимодействовать с ними со своих устройств. Вы уверены, что хотите продолжить?",
          switchToPublic: "Сделать публичной",
          presentAnyway: "Продолжить",
        },

        quizSettingsWarning: {
          title: "Вы не указали правильный ответ",
          message: "Слайд ",
          dismiss: "Не напоминать мне об этом в этой презентации",
          cancel: "Отмена",
          presentAnyway: "Все-равно запустить",
        },
      },
      share: {
        title: "Поделиться",
        inviteAudience: {
          title: "Приглашение аудитории",
          link: {
            title: "Аудитория сможет присоединиться по адресу",
            copy: "Скопировать",
          },
          qr: {
            title: "Или отсканировав QR код",
            download: "Скачать",
          },
        },
        addEditor: {
          title: "Поделиться доступом",
        },
        shareSlides: {
          title: "Поделиться слайдами",
        },
        publish: {
          title: "Опубликовать",
        },
      },
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

            leaderboard: "Таблица лидеров",

            /*
             * opinion
             */
            userAnswer: "Опросы",

            poll: "Опрос",
            open_ended: "Открытый ответ",
            word_cloud: "Облако слов",
            scales: "Графики",
            qna: "Вопрос - Ответ",
            brain_storm: "Брейншторм",
          },

          leaderboard: {
            tip: "Чтобы добавить слайд с таблицой лидеров необходимо создать слайд типа «Игры & Викторины»",
          },
        },

        /*
         * settings
         */
        settings: {
          title: "Настройки",
          appliedToAllQuestionsSuccessfully:
            "Настройки применены ко всем слайдам типа «Игры & Викторины» и «Опросы» успешно",

          question: {
            title: "Ваш вопрос",
            placeholder: "Ваш вопрос...",

            description: {
              title: "Подробное описание",
              caption:
                "Более подробное описание будет показано на устройствах вашей аудитории. Вы также можете показать это во время презентации, наведя курсор на название вашего вопроса",
              placeholder: "Ваше описание вопроса...",
            },
          },

          timeLimit: {
            title: "Лимит по времени",
            description: "Время за которое участники должны успеть ответить",
            invalid: "Недопустимое значение. Введите число от 5 до 1800",
            seconds: "Секунд",
          },

          lockSubmission: {
            title: "Заблокировать ответы в начале",
            description:
              "Заблокировать отправку ответов на этом слайде, чтобы представить его перед разрешением аудитории голосовать",
          },

          hideResults: {
            title: "Скрыть ответы",
            description:
              "Скрыть ответы участников, пока все еще идет голосование. Это помогает предотвратить предвзятость при голосовании",
          },

          applyToAllQuestions: {
            title: "Применить ко всем вопросам",
            confirmation: {
              title: "Применить ко всем вопросам?",
              message:
                "Вы уверены, что хотите применять следующие настройки ко всем вопросам в презентации?",
            },
          },

          // word cloud
          multipleEntries: {
            title: "Можно отвечать более одного раза",

            on: "Каждый участник сможет отвечать неограниченное кол-во раз",
            off: "Каждый участник сможет ответить единожды",
          },

          entriesPerParticipant: {
            title: "Вариантов ответа на участника",
            description:
              "Один ответ может состоять из нескольких слов. Вы можете увеличить этот лимит до 10",
            invalid: "Недопустимое значение. Введите число от 1 до 10",
          },

          // quiz
          answerOptions: {
            title: "Варианты ответов",
            description: {
              pick_answer:
                "Напишите варианты ответов, из которых участники будут выбирать",
              pick_image:
                "Прикрепите фотографии в качестве вариантов ответов, из которых участники будут выбирать. Дополнительно, вы можете добавить к ним надписи",
            },

            answerOption: "Вариант ответа №",
            addAnswerOption: "Добавить вариант ответа",

            tickTheCorrectAnswerOption: "Пометить правильный ответ",

            maxLengthErrorMessage: "Максимум 150 символов",
          },

          points: {
            title: "Баллы",
            description: "Выберите диапазон баллов для этого вопроса",

            min: "Мин.",
            max: "Макс.",

            errors: {
              invalid: "The value must be in the range from 0 to 1000",
              invalidMin: "The value must be less than or equal to max",
              invalidMax: "The value must be greater than or equal to min",
            },

            scoreDependsOnTime: {
              title: "Чем быстрее ответ, тем больше балл",
              description: {
                on: "Чем быстрее участник ответит, тем больше баллов получит",
                off: "Если участник ответит правильно, то получит максимальное кол-во баллов, если неправильно - минимальное",
              },
            },

            partialScoring: {
              title: "Частичный подсчет очков",
              description: {
                off: "Участники получат максимально возможное кол-во баллов (с учетом скорости ответа, если включена настройка), но только если они выберут все правильные варианты ответов",
                on: "Участники получат баллы за каждый правильный ответ отдельно, но при выборе хотя бы одного неверного - получат минимальное кол-во баллов",
              },
            },
          },

          leaderboard: {
            title: "Таблица лидеров",
            description:
              "После вопроса или в конце викторины можно показать слайд - таблицу лидеров, с результатами всей викторины",
            create: "Создать после этого слайда",
          },

          openGeneralQuizSettings: {
            title: "Общие настройки игр и викторин",
          },

          filterProfanity: {
            title: "Фильтровать ненормативную лексику",
            description:
              "Участники не смогут отправлять ответы, содержащие ненормативную лексику",
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
