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
          description: `Получено {answersCount} ответов`,
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
        submit: "Присоединяйся сейчас",
      },
      guest: "Гость",
    },

    isPrivate: {
      title: "Презентация проходит в закрытом режиме",
      description:
        "Как только ведущий переключится на общедоступный режим, вы сможете просматривать его слайды и взаимодействовать с ними",
    },

    answers: {
      placeholder: "Ваш ответ...",
      invalidLength: "Ответ должен содержать не болеее 25 символов",
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
    },
  },
};
