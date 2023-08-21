import { ROUTE_PATHS } from "src/constants/routes";

export default {
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

  user: {
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
};
