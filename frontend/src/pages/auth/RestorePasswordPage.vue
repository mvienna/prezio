<template>
  <div class="container__wrapper">
    <div class="container">
      <!-- logo -->
      <div class="container__logo q-pb-xl">
        <q-img src="/logo_black.png" />
      </div>

      <q-form @submit.prevent="submit()">
        <!-- title -->
        <div class="form__title">
          {{ $t(`auth.restorePassword.titles.${step}`) }}
        </div>

        <!-- description -->
        <div class="form__description q-mt-md">
          {{ $t(`auth.restorePassword.descriptions.${step}`) }}

          <a v-if="step === STEPS.code" :href="`mailto:${form.email}`">
            {{ form.email }}
          </a>
        </div>

        <div class="column q-gutter-lg q-pt-lg">
          <!-- email -->
          <q-input
            v-if="step === STEPS.email"
            v-model="form.email"
            type="email"
            outlined
            no-error-icon
            :label="$t('auth.restorePassword.form.email')"
            :rules="[emailRule]"
            lazy-rules
            autofocus
            :error-message="errors.email"
            :error="!!errors.email"
          >
            <template #prepend>
              <q-icon name="r_mail" class="grey-2" />
            </template>
          </q-input>

          <!-- verification code -->
          <q-input
            v-if="step === STEPS.code"
            v-model="form.code"
            mask="#-#-#-#"
            outlined
            placeholder="0-0-0-0"
            unmasked-value
            no-error-icon
            autofocus
            class="verification_code"
            :rules="[codeRule]"
            lazy-rules
            :error-message="errors.code"
            :error="!!errors.code"
          />

          <!-- password -->
          <q-input
            v-if="step === STEPS.password"
            v-model="form.password"
            :type="isPasswordVisible ? 'text' : 'password'"
            outlined
            autofocus
            no-error-icon
            :label="$t('auth.login.form.password')"
            :rules="[passwordRule]"
            lazy-rules
          >
            <template #prepend>
              <q-icon name="r_lock" class="grey-2" />
            </template>

            <template #append>
              <q-icon
                :name="isPasswordVisible ? 'r_visibility_off' : 'r_visibility'"
                class="grey-2 cursor-pointer"
                @click="isPasswordVisible = !isPasswordVisible"
              />
            </template>
          </q-input>

          <DoneCheckmark v-if="step === STEPS.login" class="q-py-sm" />

          <!-- submit -->
          <q-btn
            color="primary"
            unelevated
            no-caps
            type="submit"
            :loading="isLoading"
            class="q-py-md text-bold"
            :label="
              step === STEPS.email
                ? $t('auth.restorePassword.form.sendEmail')
                : step === STEPS.code
                ? $t('auth.restorePassword.form.checkVerificationCode')
                : step === STEPS.password
                ? $t('auth.restorePassword.form.resetPassword')
                : $t('auth.restorePassword.form.login')
            "
          />
        </div>

        <div v-if="step === STEPS.code" class="form__sub_action q-mt-lg">
          <div v-if="timeLeft" class="text-grey-5 cursor-not-allowed">
            {{ countdown }}
          </div>

          <div
            v-else
            class="link"
            :class="isLoading ? 'text-grey-5 cursor-not-allowed' : ''"
            @click="handleResendingVerificationCode()"
          >
            {{ $t("auth.restorePassword.form.resendVerificationCode") }}
          </div>
        </div>

        <!-- login -->
        <div v-else-if="step !== STEPS.login" class="form__sub_action q-mt-lg">
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
import {
  checkVerificationCode,
  sendVerificationCode,
} from "src/services/API/email";
import { api } from "boot/axios";
import DoneCheckmark from "components/animations/DoneCheckmark.vue";
import { useRouter } from "vue-router";
import { countdown, startCountdown, timeLeft } from "src/helpers/countdown";

const { t } = useI18n({ useScope: "global" });

const router = useRouter();

/*
 * steps
 */
const STEPS = {
  email: "email",
  code: "code",
  password: "password",
  login: "login",
};
const step = ref(STEPS.email);

/*
 * form
 */
const form = ref({
  email: "",
  code: "",
  password: "",
});

const errors = ref({
  email: null,
  code: null,
});

const isPasswordVisible = ref(false);

// email validation
const emailRule = (value) => {
  if (!value) {
    return t("auth.restorePassword.form.errors.email.required");
  } else if (!isValidEmail(value)) {
    return t("auth.restorePassword.form.errors.email.invalid");
  }
  return true;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// code validation
const codeRule = (value) => {
  if (!value) {
    return t("auth.restorePassword.form.errors.code.required");
  } else if (value.length < 4) {
    return t("auth.restorePassword.form.errors.code.invalid");
  }
  return true;
};

// password validation
const passwordRule = (value) => {
  if (!value) {
    return t("auth.signup.form.errors.password.required");
  } else if (value.length < 6) {
    return t("auth.signup.form.errors.password.invalid");
  }
  return true;
};

/*
 * submit
 */
const isLoading = ref(false);

const submit = async () => {
  isLoading.value = true;
  errors.value = {};

  // send verification code
  if (step.value === STEPS.email) {
    await handleSendingVerificationCode();
  }

  // check verification code
  else if (step.value === STEPS.code) {
    await handleCheckingVerificationCode();
  }

  // update password
  else if (step.value === STEPS.password) {
    await handleUpdatingPassword();
  }

  // login
  else if (step.value === STEPS.login) {
    await router.push(ROUTE_PATHS.AUTH.LOGIN);
  }

  isLoading.value = false;
};

/*
 * verification code
 */
const handleSendingVerificationCode = async () => {
  await sendVerificationCode(form.value.email)
    .then(() => {
      step.value = STEPS.code;
      startCountdown(process.env.SECONDS_UNTIL_RESEND_CODE);
    })
    .catch((error) => {
      errors.value.email = error;
    });
};

const handleResendingVerificationCode = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  await handleSendingVerificationCode();
  isLoading.value = false;
};

const handleCheckingVerificationCode = async () => {
  await checkVerificationCode(form.value.email, form.value.code)
    .then((response) => {
      // set temp auth token
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      step.value = STEPS.password;
    })
    .catch((error) => {
      errors.value.code = error;
    });
};

/*
 * password
 */
const handleUpdatingPassword = async () => {
  await api
    .patch("/user", {
      password: form.value.password,
    })
    .then(() => {
      step.value = STEPS.login;
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

    .form__sub_action {
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

::v-deep(.verification_code) {
  font-size: 20px;
  font-weight: 500;

  input {
    text-align: center;
  }
}
</style>
