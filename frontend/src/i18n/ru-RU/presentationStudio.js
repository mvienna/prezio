export default {
  presentationStudio: {
    /*
     * toolbar
     */
    toolbar: {
      drawing: {
        title: "Рисование",

        options: {
          strokeColor: "Цвет",
          strokeWidth: "Размер кисти",
          mode: "Тип кисти",
        },

        modes: {
          brush: "Кисть",
          eraser: "Стерка",
        },
      },

      text: {
        title: "Текст",

        options: {
          font: "Шрифт",
          fontSize: "Размер шрифта",
          newText: "Новое поле",
          color: "Цвет",
          letterSpacing: "Интервал между буквами",
          lineHeight: "Высота линии",

          formatting: {
            bold: "Жирный шрифт",
            italic: "Курсив",
            underline: "Подчеркивание",
            strikeThrough: "Зачеркивание",
            alignment: "Выравнивание",
          },
        },

        newTextValue: "Начните вводить сюда текст",
      },

      image: {
        title: "Фотографии",

        replaceImage: {
          title: "Заменить",
        },

        shadow: {
          title: "Тень",
          opacity: "Непрозрачность тени",
          blur: "Размытие тени",
          offsetX: "Отступ по X",
          offsetY: "Отступ по Y",
        },

        opacity: {
          title: "Непрозрачность",
        },

        stroke: {
          title: "Обводка",
          width: "Толщина обводки",
          dash: {
            width: "Длинна пунктирной линии",
          },
        },

        cornerRadius: {
          title: "Радиус закругления",
        },

        clipPosition: {
          title: "Положение зажима",

          none: "Нет",

          centerTop: "Центр-Верх",
          centerMiddle: "Центр-Середина",
          centerBottom: "Центр-Низ",

          rightTop: "Право-Верх",
          rightMiddle: "Право-Середина",
          rightBottom: "Право-Низ",

          leftTop: "Лево-Верх",
          leftMiddle: "Лево-Середина",
          leftBottom: "Лево-Низ",
        },
      },

      emoji: {
        title: "Эмодзи",
      },

      shape: {
        title: "Формы",

        fill: {
          title: "Цвет заливки",
          remove: "Убрать заливку",
        },

        stroke: {
          title: "Обводка",
          width: "Толщина обводки",
          pointerSize: "Размер указателя",
          dash: {
            width: "Длинна пунктирной линии",
          },
        },

        opacity: {
          title: "Непрозрачность",
        },

        shadow: {
          title: "Тень",
          opacity: "Непрозрачность тени",
          blur: "Размытие тени",
          offsetX: "Отступ по X",
          offsetY: "Отступ по Y",
        },

        cornerRadius: {
          title: "Радиус закругления",
        },

        groups: {
          lines: "Линии",
          simpleShapes: "Простые формы",
          abstract: "Абстрактные формы",
        },
      },

      resetCustomization: {
        title: "Очистить",
        tooltip: "По умолчанию",
      },

      // zoom
      zoom: {
        in: "Увеличить",
        out: "Уменьшить",
        select: "Выбрать масштабирование",
      },

      // reset results
      resetResults: {
        title: "Презентация имеет результаты",

        manage: "Управлять",
        view: "Посмотреть",

        confirmation: {
          title: "Сбросить результаты?",
          message:
            "Вы уверены, что хотите сбросить результаты (ответы), полученные от участников ранее?",

          options: {
            resetPresentation: "Сбросить результаты для всей презентации",
            resetSlide: "Сбросить результаты для этого слайда",
          },
        },
      },

      // layouts
      layouts: {
        title: "Выберите макет слайда",
        placeholder: "Макет",

        options: {
          blank: "Пустой",
          titleSlide: "Титульный слайд",
          title: "Заголовок сверху",
          titleAndBody: "Заголовок и обьект",
          titleAndTwoColumns: "Заголовок и 2 обьекта",
          titleOnly: "Только заголовок",
        },
      },

      // change background
      changeBackground: {
        title: "Заменить задний фон",
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

      replaceImage: "Заменить фотографию",

      moveUp: "Переместить выше",
      moveToTheTop: "Переместить вверх",

      moveDown: "Переместить ниже",
      moveToTheBottom: "Переместить вниз",
    },

    /*
     * settings
     */
    settings: {
      title: "Настройки",

      visibility: {
        private: "Приватная",
        public: "Публичная",
      },

      generalInformation: {
        title: "Основная информация",
        description: {
          title: "Описание",
          placeholder: "Напишите о презентации...",
        },
        preview: {
          title: "Обложка",
          select: "Загрузить изображение",
        },
      },

      collectParticipantsInfo: {
        title: "Сбор данных участников",
        checkbox: "Требовать ввода информации",

        fields: {
          title: "Поля для заполнения",

          heading: {
            title: "Заголовок",
            default: "Добро пожаловать!",
          },

          default: {
            label: "Название",
            name: "Поле",
            value: "Введите имя",
          },

          mandatory: {
            on: 'Это поле <span class="text-bold">является</span><br/>обязательным для заполнения',
            off: 'Это поле <span class="text-bold">не является</span><br/>обязательным для заполнения',
          },

          types: {
            text: "Текст",
            email: "E-mail",
            number: "Цифры",
            color: "Цвет",
            date: "Дата",
            password: "Пароль",
          },

          add: "Добавить",
        },
      },

      audienceAuthentication: {
        title: "Аутентификация аудитории",
      },

      questionsAndAnswersFromAudience: {
        title: "Вопросы и ответы вашей аудитории",
      },

      quiz: {
        title: "Настройка викторин",
        info: {
          title:
            "Настройки применяются на все слайды типа «Игры & Викторины» и «Опросы»",
        },

        warning: {
          dismiss: "Не напоминать об отсутствии правильного ответа",
        },

        options: {
          liveChat: "Чат в реальном времени",
          lobbyMusic: "Музыка в лобби",
          countdown: "Обратный отсчет 5 сек",
          playAsTeam: "Играть командой",
          shuffleAnswerOptions: "Менять прядок вариантов ответов",
          showAnswersManually: "Показывать ответы вручную",
        },
      },

      language: {
        title: "Язык",
        profanityFilter:
          "Включить фильтр ненормативной лексики по умолчанию во всех ответах аудитории",
        info: "Помогите нам улучшить переводы или фильтрацию ненормативной лексики, написав нам по адресу",
      },

      leader: {
        title: "Кто берет на себя инициативу",
      },

      other: {
        title: "Другие настройки",

        showJoiningInstructionsBar: {
          title: "Показать шапку с инструкций по присоединению",
        },

        reactions: {
          title: "Доступные реакции",
        },
      },
    },

    /*
     * preview
     */
    preview: {
      title: "Предпросмотр презентации",
      controls: {
        previous: "Предыдущий",
        next: "Следующий",
      },
    },

    /*
     * layouts
     */
    layouts: {
      defaultTexts: {
        title: "Нажмите чтобы добавить заголовок",
        subtitle: "Нажмите чтобы добавить подзаголовок",
        body: "Нажмите чтобы добавить текст",
        question: "Нажмите чтобы добавить вопрос",
        leaderboard: "Таблица лидеров",
      },
    },
  },
};
