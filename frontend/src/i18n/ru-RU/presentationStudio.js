export default {
  presentationStudio: {
    /*
     * toolbar
     */
    toolbar: {
      // drawing
      drawing: {
        title: "Рисование",

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

      // text
      text: {
        title: "Текст",

        options: {
          font: "Шрифт",
          fontSize: "Размер шрифта",
          newText: "Новое поле",

          formatting: {
            bold: "Жирный шрифт",
            italic: "Курсив",
            underline: "Подчеркивание",
            strikeThrough: "Зачеркивание",
            alignment: "Выравнивание",

            clearFormatting: "Очистить форматирование",
          },
        },

        newTextValue: "Начните вводить сюда текст",
      },

      // media
      media: {
        title: "Фотографии",
      },

      // emoji
      emoji: {
        title: "Эмодзи",
      },

      // shape
      shape: {
        title: "Формы",

        options: {
          strokeColor: "Цвет обводки",
          removeStrokeColor: "Убрать обводку",
          fillColor: "Цвет заливки",
          removeFillColor: "Убрать заливку",
          lineWidth: "Размер",
        },
      },

      // zoom
      zoom: {
        in: "Увеличить",
        out: "Уменьшить",
        select: "Выбрать масштабирование",
      },

      // layouts
      layouts: {
        title: "Макет",

        options: {
          blank: "Пустой слайд",
          titleSlide: "Титульный слайд",
          title: "Заголовок сверху",
          titleAndBody: "Заголовок и обьект",
          titleAndTwoColumns: "Заголовок и два обьекта",
          titleOnly: "Только заголовок",
        },
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
  },
};
