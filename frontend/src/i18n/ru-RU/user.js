export default {
  user: {
    /*
     * profile
     */
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
