import { ROUTE_PATHS } from "src/constants/routes";

export default {
  auth: {
    thirdParty: {
      title: "Войти с Yandex ID",
      or: "или",
    },

    login: {
      title: "Войти в аккаунт",
      subtitle:
        "Введите свои учетные данные для доступа к вашей учетной записи",
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
      subtitle:
        "Создайте новый аккаунт, и ваши публичные выступления уже не будут прежними",
      form: {
        name: "Ваше имя",
        email: "Введите email",
        password: "Введите пароль",
        disclaimer: `Нажимая на кнопку “Зарегистрироваться”, вы подтверждаете, что ознакомились с <a href="${ROUTE_PATHS.POLICIES.PRIVACY_POLICY}" target="_blank">Политикой конфиденциальности</a> и <a href="${ROUTE_PATHS.POLICIES.USER_AGREEMENT}" target="_blank">Пользовательским соглашением</a>`,
        submit: "Зарегистрироваться",
        oldUser: "Уже зарегистрированы?",
        login: "Войти",

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
        request: "Восстановление доступа",
        verify: "Подтвердите email",
        confirm: "Введите пароль",
        success: "Пароль был успешно изменен",
      },
      descriptions: {
        request:
          "Мы вышлем на вашу почту инструкции по сбросу пароля. Если у вас нет доступа к почте, напишите нам на {mail} и мы  попробуем восстановить учетную запись.",
        verify: "Введите код из письма, которое было отправлено на {mail}",
        confirm: "Почти все готово! Введите новый пароль",
        success: "Получилось! Можете перейти в личный кабинет",
      },
      actions: {
        sendEmail: "Сбросить пароль",
        checkVerificationCode: "Проверить",
        resendVerificationCode: "Отправить повторно",
        resetPassword: "Сбросить пароль",
        proceed: "Перейти в личный кабинет",
      },
      form: {
        email: "Введите email",
        password: "Введите новый пароль",
        passwordCopy: "Подтвердите новый пароль",

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
            mismatch: "Пароли не совпадают",
          },
        },
      },
      rememberPassword: "Я помню пароль",
    },
  },
};
