<template>
  <div class="container__wrapper">
    <div class="container">
      <!-- logo -->
      <div class="container__logo q-pb-xl">
        <q-img src="/logo_with_title_black.png" />
      </div>

      <q-form @submit.prevent="submit()">
        <!-- title -->
        <div class="form__title">{{ $t("auth.login.title") }}</div>

        <!-- google -->
        <q-btn
          outline
          color="primary"
          no-caps
          class="full-width q-py-md text-bold q-mt-lg"
        >
          <template #default>
            <q-img
              src="/assets/icons/google.svg"
              style="width: 24px"
              class="q-mr-md"
            />
            <span>
              {{ $t("auth.login.google") }}
            </span>
          </template>
        </q-btn>

        <!-- or -->
        <div class="q-py-lg text-center text-grey-5">
          {{ $t("auth.login.or") }}
        </div>

        <div class="column q-gutter-md">
          <!-- email -->
          <q-input
            v-model="form.email"
            type="email"
            outlined
            no-error-icon
            :label="$t('auth.login.form.email')"
            :rules="[emailRule]"
            lazy-rules
            :error="!!invalidCredentialsError"
          >
            <template #prepend>
              <q-icon name="r_mail" class="grey-2" />
            </template>
          </q-input>

          <!-- password -->
          <div>
            <q-input
              v-model="form.password"
              :type="isPasswordVisible ? 'text' : 'password'"
              outlined
              no-error-icon
              :label="$t('auth.login.form.password')"
              :rules="[passwordRule]"
              lazy-rules
              :error-message="invalidCredentialsError"
              :error="!!invalidCredentialsError"
            >
              <template #prepend>
                <q-icon name="r_lock" class="grey-2" />
              </template>

              <template #append>
                <q-icon
                  :name="
                    isPasswordVisible ? 'r_visibility_off' : 'r_visibility'
                  "
                  class="grey-2 cursor-pointer"
                  @click="isPasswordVisible = !isPasswordVisible"
                />
              </template>
            </q-input>

            <!-- forgot password -->
            <div class="row justify-end q-mt-sm">
              <router-link
                :to="ROUTE_PATHS.AUTH.RESTORE_PASSWORD"
                class="form__password__forgot_password"
              >
                {{ $t("auth.login.form.forgotPassword") }}
              </router-link>
            </div>
          </div>

          <!-- submit -->
          <q-btn
            color="primary"
            unelevated
            no-caps
            type="submit"
            :loading="isLoading"
            class="q-py-md text-bold"
            :label="$t('auth.login.form.submit')"
          />
        </div>

        <!-- signup-->
        <div class="form__signup q-mt-lg">
          {{ $t("auth.login.form.newUser") }}

          <router-link :to="ROUTE_PATHS.AUTH.SIGNUP">
            {{ $t("auth.login.form.register") }}
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
import { useAuthStore } from "stores/auth";
import { useRouter } from "vue-router";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const store = useAuthStore();

const router = useRouter();

/*
 * form
 */
const form = ref({
  email: "",
  password: "",
});

const isPasswordVisible = ref(false);

const invalidCredentialsError = ref();

const isLoading = ref(false);

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

// password validation
const passwordRule = (value) => {
  if (!value) {
    return t("auth.login.form.errors.password.required");
  }
  return true;
};

/*
 * submit
 */
const submit = async () => {
  isLoading.value = true;
  invalidCredentialsError.value = null;

  store
    .login(form.value.email, form.value.password)
    .then(() => {
      router.push(ROUTE_PATHS.INDEX);
    })
    .catch((error) => {
      invalidCredentialsError.value = error.response.data.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>

<style scoped lang="scss">
.container__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;

  .container {
    max-width: 600px;
    width: 100%;
  }

  .container__logo {
    width: 140px;
    margin: 0 auto;
  }

  form {
    padding: 48px;
    background: $white;
    border-radius: 16px;
    box-shadow: rgba(73, 112, 255, 0.1) 0 8px 24px;

    .form__title {
      text-align: center;
      font-size: 20px;
      font-weight: 600;
    }

    .form__password__forgot_password {
      color: $primary;
      font-weight: 600;
      font-size: 12px;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .form__signup {
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
