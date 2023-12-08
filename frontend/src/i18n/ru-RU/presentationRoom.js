export default {
  presentationRoom: {
    header: {
      backToStudio: "Вернуться в студию",
      roomLink: {
        title: "Чтобы присоединиться, перейдите по:",
        copyToClipboard: "Нажмите чтобы скопировать",
        copied: "Скопировано, можно делиться!",
      },
      invitationPanel: {
        show: "Показать QR код",
        hide: "Скрыть QR код",
      },
    },

    footer: {
      menu: {
        title: "Меню",

        terminateRoom: "Завершить презентацию",
        openBackstage: "Показать бэкстейдж",
        fullscreen: {
          on: "Полноэкранный режим",
          off: "Оконный режим",
        },
        invitationPanel: {
          show: "Показать QR код",
          hide: "Скрыть QR код",
        },
        informationPanel: {
          show: "Показать шапку",
          hide: "Скрыть шапку",
        },
        privacy: {
          private: "Сделать приватной",
          public: "Сделать публичной",
        },
      },

      chat: {
        title: "Чат",

        system: {
          joined: "присоединился(ась)",
          left: "ушел(а)",
          allParticipantsSubmittedAnswers: "Все участники ответили",
        },

        errors: {
          fieldRequired: "Нужно написать сообщение чтобы отправить его",
          maxLength: "Максимальная длина сообщения - 255 символов",
        },

        noMessages: {
          title: "Начни разговор!",
          message:
            "Сообщения в чате пока отсутствуют. Напишите что-нибудь, чтобы начать общение!",
        },
      },

      finishQuiz: {
        title: "Завершить викторину",
      },

      reactions: {
        answersCount: "Получено ответов - ",
      },

      hideResults: {
        tooltip: {
          on: "Результаты отображаются",
          off: "Результаты скрыты",
        },

        dialog: {
          title: "Результаты скрыты",
          description:
            "Получено 0 ответов | Получен {n} ответ | Получено {n} ответа | Получено {n} ответов",
          toggle: "Показать результаты",
        },
      },

      submissionLock: {
        on: "Отправка разрешена",
        off: "Отправка запрещена",

        toggle: {
          on: "Нажмите чтобы разблокировать отправку ответов",
          off: "Нажмите чтобы заблокировать отправку ответов",
        },

        resetTime: {
          sec: "сек",
        },
      },
    },

    invitationPanel: {
      title: "Сканируйте",
      otherOption: {
        or: "или",
        url: "Переходите на",
        id: "И вводите",
      },
    },

    auth: {
      form: {
        title: "Давайте познакомимся",
        name: "Введите ваше имя",
        avatar: "Выберите себе аватар",
        fieldIsRequired: "Поле обязательно для заполнения",
        submit: "Присоединиться сейчас",
      },
      guest: "Гость",
    },

    waitingForParticipants: {
      title: "Ждем участников...",
      joined: {
        title:
          "Подключилось - 0 участников | Подключился - {n} участник | Подключилось - {n} участника | Подключилось - {n} участников",
      },
      startQuiz: {
        title: "Начать викторину!",
        shortcut: "Вы также можете нажать",
      },
    },

    waitingForQuizStart: {
      title: "Приготовьтесь к игре!",
      description: "Викторина скоро начнется",
    },

    quizCountdown: {
      title: "Посмотрите на свое устройство",

      questionIndex: {
        title: "Вопрос",
        outOf: "из",
      },

      scoreDependsOnTime: {
        true: {
          title: "Более быстрые ответы дают больше баллов",
        },
        false: {
          title: "Ответьте до истечения времени",
          subtitle: "(скорость ответа не имеет значения)",
        },
      },

      inProgressWarning: {
        title: "Викторина все еще идет",
        message:
          "Если вы хотите все-равно переключить слайд нажмите ту же кнопку",
        leave: "Переключить",
        stay: "Остаться",
        sec: "сек",
      },

      timesup: "Время вышло",
      allParticipantsAnswered: "Все ответили",
      revealResults: "Показать ответы",
    },

    quiz: {
      typeAnswer: {
        otherAnswers: "Другие ответы",
      },
    },

    isPrivate: {
      title: "Презентация проходит в закрытом режиме",
      description:
        "Как только ведущий переключится на общедоступный режим, вы сможете просматривать его слайды и взаимодействовать с ними",
    },

    answers: {
      placeholder: "Ваш ответ...",

      errors: {
        invalidLength: "Ответ должен содержать не болеее 25 символов",
        profanity: "Ответ не должен содержать недопустимой лексики",
      },

      submit: {
        title: "Отправить",
        submissionIsLocked: "Отправка завершена",
      },

      waitForSubmissionToBeUnlocked: "Ожидайте начала голосование",
      multipleEntriesAvailable:
        "Вы можете отправлять ответы неограниченное кол-во раз",
      answersSubmittedWait:
        "Вы уже ответили на этот вопрос. Пожалуйста, подождите, пока ведущий покажет следующий слайд.",
      thanksForParticipation: "Благодарим за Ваше участие",
      hasAlreadyAnswered: "Вы уже ответили на данный вопрос",

      results: {
        correct: "Правильно!",
        incorrect: "Неправильно!",
        timesUp: "Время вышло!",
        sec: "сек",
      },

      correctAnswer: {
        title: "Правильный ответ",
      },
      otherAcceptedAnswers: {
        title: "Другие приемлимые ответы",
      },
    },

    leaderboard: {
      title: "Поздравляем!",

      youAreIn: "Вы на",
      place: "месте",
      outOf: "из",
      players: "игроков",

      youScored: "Вы набрали:",
      points: "баллов",
      p: "б.",
    },
  },
};
