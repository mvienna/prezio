<template>
  <div class="container__wrapper">
    <div class="container">
      <!-- logo -->
      <div class="container__logo q-pb-xl">
        <q-img src="/public/logo.png" />
      </div>

      <q-form @submit.prevent="submit()">
        <!-- title -->
        <div class="form__title">{{ $t("auth.restorePassword.title") }}</div>
        <div class="form__description q-mt-md">
          {{ $t("auth.restorePassword.description") }}
        </div>

        <div class="column q-gutter-lg q-pt-lg">
          <!-- email -->
          <q-input
            v-model="form.email"
            type="email"
            outlined
            no-error-icon
            :label="$t('auth.restorePassword.form.email')"
            :rules="[emailRule]"
          >
            <template #prepend>
              <q-icon name="o_mail" class="grey-2" />
            </template>
          </q-input>

          <!-- submit -->
          <q-btn
            color="primary"
            unelevated
            no-caps
            type="submit"
            class="q-py-md text-bold"
            :label="$t('auth.restorePassword.form.submit')"
          />
        </div>

        <!-- login-->
        <div class="form__login q-mt-lg">
          <router-link :to="ROUTE_PATHS.AUTH.LOGIN">
            {{ $t("auth.restorePassword.form.login") }}
          </router-link>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ROUTE_PATHS } from "src/constants/routes";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

/*
 * form
 */
const form = ref({
  email: "",
});

// email validation
const emailRule = (value) => {
  if (!value) {
    return t("auth.login.form.errors.email.required");
  } else if (!isValidEmail(value)) {
    return t("auth.login.form.errors.email.invalid");
  }
  return true;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/*
 * submit
 */
const submit = () => {
  console.log("email sent");
};
</script>

<style scoped lang="scss">
.container__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;

  .container {
    max-width: 500px;
    width: 100%;
  }

  .container__logo {
    width: 140px;
    margin: 0 auto;
  }

  form {
    padding: 48px;
    border: 1px solid $grey-5;
    background: $white;
    border-radius: 8px;

    .form__title {
      text-align: center;
      font-size: 18px;
      font-weight: 600;
    }

    .form__description {
      text-align: center;
      font-size: 16px;
      opacity: 0.8;
      font-weight: 500;
    }

    .form__disclaimer {
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 0;
    }

    .form__login {
      text-align: center;
      font-weight: 600;

      a {
        color: $primary;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .container__wrapper {
    .container {
      max-width: 100%;
    }

    form {
      border: none;
    }
  }
}

@media screen and (max-width: 470px) {
  .container__wrapper {
    form {
      padding: 24px;
    }
  }
}
</style>
