export default {
  user: {
    /*
     * profile
     */
    profile: {
      save: "Сохранить",
      deleteAccount: {
        title: "Удалить аккаунт",
        confirmation: {
          title: "Удаление аккаунта",
          message:
            "Вы действительно хотите удалить свой аккаунт вместе со всеми данными?",
        },
      },

      verifyEmail: {
        title: "Подтвердите почту",
        description: "Введите код из письма, которое было отправлено на",
        warning: "* Если письмо не пришло, проверьте папку спама",
      },

      form: {
        name: { label: "Ваше имя", placeholder: "Введите имя" },
        phone: { label: "Телефон", placeholder: "+7" },
        email: { label: "Email", placeholder: "Введите email адрес" },
        preferredAppUsage: {
          label: "Где вы планируете использовать Prezio?",
          placeholder: "Выберите опцию",

          options: {
            business: "Бизнес",
            education: "Обучение",
            personal: "Личное",
            other: "Другое",
          },
        },
        currentPassword: {
          label: "Текущий пароль",
          placeholder: "Введите текущий пароль",

          forgotPassword: {
            title: "Забыли пароль?",
            subtitle: "Вы можете восстановить его здесь",
          },
        },
        newPassword: {
          label: "Новый пароль",
          placeholder: "Введите новый пароль",
        },

        success: "Данные успешно обновлены",
        checkVerificationCode: "Проверить",
        resendVerificationCode: "Отправить повторно",

        optional: "Необязательно",

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
          phone: {
            invalid: "Неверный номер телефона",
          },
        },

        avatar: {
          upload: "Загрузить",
          delete: "Удалить",
          success: {
            upload: "Аватарка загружена успешно",
            delete: "Аватарка удалена успешно",
          },
        },
      },
    },
  },
};
