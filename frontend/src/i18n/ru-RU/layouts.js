export default {
  /*
   * main layout
   */
  mainLayout: {
    header: {
      userMenuLinks: {
        profile: "Профиль",
        upgrade: "Обновить тариф",
        logout: "Выйти",
      },

      feedbackForm: {
        title: "Обратная связь",
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
          beta: "Beta",
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
          title: "Пригласите аудиторию",
          description:
            "Отправьте по электронной почте уникальную ссылку или QR участника, чтобы они могли присоединиться к вашей презентации.",
          link: {
            title: "Постоянная ссылка на презентацию",
            copy: "Скопировать",
          },
          or: "или",
          qr: {
            title: "Персональный QR код",
            description:
              "QR код можно скачать и заранее отправить аудитории или распечатать и использовать в публичном месте.",
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
      panel: {
        hide: "Скрыть панель",
        expand: "Раскрыть панель",
      },

      tabs: {
        /*
         * layers
         */
        layers: {
          label: "Слои",
          title: "Определите приоритет обьектов",

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
            image: "Фотография",
            emoji: "Эмодзи",
            shape: "Форма",
          },
        },

        /*
         * design
         */
        design: {
          label: "Дизайн",
          title: "Настройте дизайн слайда",

          tabs: {
            design: "Дизайн слайда",
            themes: "Темы",
          },

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
            categories: {
              prezio: "Prezio",
              gradients: "Градиенты",
              stock: "Стоковые",
            },

            select: {
              title: "Изображение фона",
              open: "Загрузить",
            },

            filters: {
              title: "Фильтры",
              reset: "Сбросить фильтры",

              opacity: "Непрозрачность",
              blur: "Размытие",
              contrast: "Контраст",
              brightness: "Яркость",
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
            font: { title: "Шрифт по умолчанию" },
            color: { title: "Цвет текста по умолчанию", set: "Задать:" },
          },
        },

        /*
         * types
         */
        types: {
          label: "Типы",
          title: "Выберите тип слайда",

          availableSoon: "Скоро будет доступно",

          options: {
            content: "Конент",
            qr: "QR",
            video: "Видео",

            /*
             * quizzes & games
             */
            quizzesAndGames: "Викторины",

            pick_answer: "Выбор ответа",
            pick_image: "Выбор изображения",
            type_answer: "Ввод ответа",
            match_pairs: "Сравнение ответов",
            correct_order: "Сортировка ответов",

            leaderboard: "Таблица лидеров",

            /*
             * opinion
             */
            userAnswer: "Опросы",

            poll: "Простой опрос",
            open_ended: "Открытый ответ",
            word_cloud: "Облако слов",
            qna: "Вопрос ответ",
            brain_storm: "Мозговой штурм",
          },

          leaderboard: {
            tip: "Чтобы добавить слайд с таблицой лидеров необходимо создать слайд типа «Игры & Викторины»",
          },
        },

        /*
         * settings
         */
        settings: {
          label: "Контент",
          title: "Настройте вопрос",

          groups: {
            submission: "Настройки ответов",
            answerOptions: "Варианты ответов",
            scoring: "Начисление баллов",
            other: "Другое",
          },

          appliedToAllQuestionsSuccessfully:
            "Настройки применены ко всем слайдам типа «Игры & Викторины» и «Опросы» успешно",

          info: {
            question: "Введите вопрос",
            title: "Введите заголовок",

            description: {
              title: "Описание",
              label: "Подробное описание",
              caption:
                "Более подробное описание будет показано на устройствах вашей аудитории. Вы также можете показать это во время презентации, наведя курсор на название вашего вопроса",
              placeholder: "Введите описание",
            },
          },

          timeLimit: {
            title: "Лимит по времени",
            description: "Время за которое участники должны успеть ответить",
            invalid: "Недопустимое значение. Введите число от 5 до 1800",
            seconds: "сек.",
          },

          lockSubmission: {
            title: "Заблокировать отправку ответов в начале",
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
            title: "Ответов на участника",
            description:
              "Один ответ может состоять из нескольких слов. Вы можете увеличить этот лимит до 10",
            invalid: "Недопустимое значение. Введите число от 1 до 10",
          },

          // quiz answer options
          answerOptions: {
            title: "Варианты ответов",
            description: {
              pick_answer:
                "Напишите варианты ответов, из которых участники будут выбирать",
              pick_image:
                "Прикрепите фотографии в качестве вариантов ответов, из которых участники будут выбирать. Дополнительно, вы можете добавить к ним надписи",
            },

            answerOption: "Вариант №",
            addAnswerOption: "Добавить",

            tickTheCorrectAnswerOption: "Пометить правильный ответ",

            maxLengthErrorMessage: "Максимум 150 символов",
          },

          // quiz - type answer
          typeAnswer: {
            correctAnswer: {
              title: "Правильный ответ",
              description: "Этот ответ покажется по завершению времени",

              placeholder: "Введите ответ",
            },

            otherAcceptedAnswers: {
              title: "Другие приемлимые ответы",
              description:
                "Данные ответы входящие в этот список будут помечены как верные",
            },

            answerOption: "Вариант ответа №",
            addAnswerOption: "Добавить",

            maxLengthErrorMessage: "Максимум 150 символов",
          },

          // scoring
          points: {
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
            create: "Добавить",
          },

          openGeneralQuizSettings: {
            title: "Общие настройки",
            open: "Открыть",
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
          label: "Шаблоны",
          title: "Выберите шаблон слайда",

          categories: {
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
          label: "Аудио",
          title: "Выберите сопутствующее аудио-сопровождение",
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
