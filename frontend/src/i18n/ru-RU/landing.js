export default {
  landing: {
    auth: {
      login: "Войти",
      signup: "Регистрация",
    },

    joinRoom: {
      title: "Вы участник? Введите код презентации",
      url: "PREZIO.RU/",
      enterCode: "ВВЕДИТЕ КОД",
      join: "Присоединиться",
    },

    hyperlinks: {
      features: "Возможности",
      prices: "Цены",
      faq: "Вопросы и ответ",
    },

    heroes: {
      title: {
        static: "Интерактивные презентации для",
        dynamic: {
          one: "рабочих встреч",
          two: "обучения",
          three: "выступлений",
        },
      },
      description:
        "Привлекайте любую аудиторию с помощью облаков слов, живых опросов, викторин, инструментов мозгового штурма",
      action: "Создать презентацию",
    },

    benefits: {
      title: "Кому полезно использовать Prezio?",
      description:
        "Поможем вовлеч и активировать аудиторию, собрать обратную связь и повысить узнаваемость бренда",

      sales: {
        title: "Сотрудникам продаж",
        description:
          "Повышайте продажи мотивируя и вовлекая ваших клиентов и партнеров. Выделяйтесь на рынке с помощью уникальных интерактивных презентаций.",
      },

      expertsAndTeams: {
        title: "Экспертам и командам",
        description:
          "Делайте свои презентации более интересными и полезными. Получайте ценную обратную связь от вашей аудитории в реальном времени с помощью онлайн опросов.",
      },

      teachers: {
        title: "Учителям",
        description:
          "Создавайте увлекательные и эффективные уроки с помощью нашего сервиса. Используйте игровые механики, чтобы стимулировать интерес и участие вашей аудитории.",
      },
    },

    mechanics: {
      title:
        "<span class='text-primary text-underline'>Впечатляте</span> с помощью интерактивных механик",

      pickAnswer: {
        title: "Онлайн опросы с отзывами вашей аудитории",
        description:
          "Создавайте интерактивные онлайн опросы и получайте мгновенную обратную связь от вашей аудитории.",

        list: {
          one: "Визуализируйте результаты в реальном времени",
          two: "Используйте разные механики вопросов",
          three: "Добавляйте изображения и GIF к вашим вопросам",
        },
      },

      leaderboard: {
        title: "Игровые механики в формате викторин с таблицей лидеров",
        description:
          "Создайте викторину всего за несколько простых шагов. Пусть участники соревнуются за победу и признание.",

        list: {
          one: "Участники отвечают на вопросы и зарабатывают баллы",
          two: "Таблица лидеров сравнивает результаты участников",
          three:
            "Делайте свои игры более яркими и забавными с помощью музыки, изображений и GIF-файлов",
        },
      },

      wordcloud: {
        title: "Мозговой штурм с помощью облака слов",
        description:
          "Проводите креативные мозговые штурмы и собирайте идеи от вашей аудитории. Визуализируйте слова в формате облака слов.",

        list: {
          one: "Задавайте вопросы и получайте ответы в виде слов",
          two: "Визуализируйте самые популярные идеи в виде облака слов",
          three: "Анализируйте и обсуждайте результаты",
        },
      },
    },

    tools: {
      title: "Все инструменты для успешной презентации",
      description:
        "Мы сделали Prezio максимально простым в использовании. Что бы вы могли впечатлять аудиторию создавая профессиональные презентации с интерактивными механиками.",

      bento: {
        studio: {
          title: "Простой и понятный конструктор презентаций",
          description:
            "Используйте редактор, чтобы настроить свою презентацию, добавляя изображения, фигуры, наклейки, GIF-файлы, тексты и многое другое.",
        },
        stock: {
          title: "Бесплатные стоковые фотографии",
          description:
            "Просмотрите наши бесплатные стоковые фотографии премиум-класса и добавьте их в свои презентации.",
        },
        emojisAndGifs: {
          title: "GIF-стикеры и эмоджи",
          description:
            "Ищите и выбирайте среди множества GIF-файлов, анимированных наклеек, текстов и 3D-смайликов.",
        },
        onlineChat: {
          title: "Онлайн чат для участников",
          description:
            "Никаких границ, ваша аудитория может общаться друг с другом во время интеррактива.",
        },
        templates: {
          title: "Премиум-шаблоны",
          description:
            "Выберите один из наших дизайнерских шаблонов премиум-класса или создайте свой собственный.",
        },
      },
    },

    prices: {
      title: "Тарифы и цены",
      description: "Платите по мере использования, отмените в любое время.",

      plans: {
        free: {
          title: "Бесплатно",
          description: "Испытайте Prezio уже сейчас, бесплатно навсегда",
          price: "0 ₽",
          period: "/месяц",
          participantsLimit: "до 7 участников",
          features: {
            one: "Неограниченное количество презентаций",
            two: "Неограниченные опросы и викторины",
            three: "Онлайн поддержка",
          },
          action: "Зарегистрироваться",
        },
        basic: {
          title: "Базовый",
          description:
            "Для презентаций на небольшую аудиторию до 50 участников",
          price: "590 ₽",
          period: "/месяц",
          participantsLimit: "до 50 участников",
          features: {
            one: "Все что входит в бесплатный",
            two: "Онлайн чат между участниками ",
            three: "Сбор информации об аудитории",
            four: "Импорт PowerPoint/PDF",
          },
          action: "Зарегистрироваться",
        },
        pro: {
          title: "Профессиональный",
          description: "Для больших встреч на аудиторию до 300 участников",
          price: "990 ₽",
          period: "/месяц",
          participantsLimit: "Неограниченно",
          features: {
            one: "Все что входит в бесплатный",
            two: "Онлайн чат между участниками ",
            three: "Сбор информации об аудитории",
            four: "Импорт PowerPoint/PDF",
            five: "Добавьте свой логотип и брендинг",
          },
          action: "Зарегистрироваться",
        },
      },

      contact: {
        title:
          "Если у вас есть какие-либо вопросы относительно индивидуальных планов, выставления счетов и обновлений, ",
        mail: "свяжитесь со мной в любое время",
      },
    },

    faq: {
      title: "Вопросы и ответы",

      list: {
        one: {
          title: "Почему я должен вам платить?",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        },
        two: {
          title: "Будете ли вы хранить данные моей кредитной карты?",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        },
        three: {
          title: "Могу ли я отменить в любое время?",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        },
        four: {
          title:
            "Что произойдет, когда моя презентация достигнет лимита участников?",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        },
      },
    },

    promo: {
      title: "Начните использовать Prezio уже сейчас!",
      description: "И ваши публичные выступления уже не станут прежними.",
      action: "Создать презентацию",
    },

    footer: {
      title: "Привлекайте любую аудиторию с помощью интеррактивных презентаций",
      allRightsReserved: "Все права защищены",
      madeInRussia: "Сделано в России 🇷🇺",
    },
  },
};
