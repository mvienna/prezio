<template>
  <!-- logo -->
  <div
    class="q-mt-lg"
    :class="$q.screen.lt.lg ? 'fixed-top-center' : 'fixed-top-left q-ml-lg'"
  >
    <q-img
      src="/prezio.svg"
      style="width: 120px; min-width: 120px"
      fit="contain"
    />
  </div>

  <div class="container__wrapper">
    <!-- left -->
    <div class="container">
      <q-form @submit.prevent="submit()">
        <!-- title -->
        <div class="text-h5 text-semibold">
          {{ $t(`auth.restorePassword.titles.${step}`) }}
        </div>

        <!-- sub-title -->
        <div class="text-grey-9 q-mt-sm q-mb-lg">
          {{ $t(`auth.restorePassword.descriptions.${step}`) }}

          <a
            v-if="step === STEPS.emailVerification"
            :href="`mailto:${form.email}`"
          >
            {{ form.email }}
          </a>
        </div>

        <!-- email -->
        <q-input
          v-if="step === STEPS.formEmail"
          v-model="form.email"
          type="email"
          outlined
          no-error-icon
          :label="$t('auth.restorePassword.form.email')"
          :rules="[emailRule]"
          lazy-rules
          autofocus
          dense
          hide-bottom-space
          :error-message="errors.email"
          :error="!!errors.email"
        />

        <!-- verification code -->
        <q-input
          v-if="step === STEPS.emailVerification"
          v-model="form.code"
          mask="#-#-#-#"
          outlined
          placeholder="0-0-0-0"
          unmasked-value
          no-error-icon
          autofocus
          dense
          hide-bottom-space
          class="verification_code"
          :rules="[codeRule]"
          lazy-rules
          :error-message="errors.code"
          :error="!!errors.code"
        >
          <template #append>
            <div class="row items-center text-caption">
              <div
                v-if="timeLeft !== -1"
                class="text-grey-5 cursor-not-allowed"
              >
                {{ countdown }}
              </div>

              <div
                v-else
                class="link"
                :class="
                  isLoading ? 'text-grey-5 cursor-not-allowed' : 'text-primary'
                "
                @click="handleResendingVerificationCode()"
              >
                {{ $t("auth.restorePassword.form.resendVerificationCode") }}
              </div>
            </div>
          </template>
        </q-input>

        <!-- password -->
        <q-input
          v-if="step === STEPS.formNewPassword"
          v-model="form.password"
          :type="isPasswordVisible ? 'text' : 'password'"
          outlined
          dense
          autofocus
          no-error-icon
          hide-bottom-space
          :label="$t('auth.login.form.password')"
          :rules="[passwordRule]"
          lazy-rules
        >
          <template #append>
            <q-btn
              flat
              round
              :icon="isPasswordVisible ? 'r_visibility_off' : 'r_visibility'"
              color="grey"
              class="round-borders"
              size="8px"
              @click="isPasswordVisible = !isPasswordVisible"
            />
          </template>
        </q-input>

        <div>
          <DoneCheckmark v-if="step === STEPS.proceed" class="q-py-sm" />
        </div>

        <!-- submit -->
        <div class="q-mt-md q-pt-xs">
          <q-btn
            color="primary"
            unelevated
            no-caps
            type="submit"
            :loading="isLoading"
            align="left"
            class="q-py-sm full-width"
            :label="
              step === STEPS.formEmail
                ? $t('auth.restorePassword.form.sendEmail')
                : step === STEPS.emailVerification
                ? $t('auth.restorePassword.form.checkVerificationCode')
                : step === STEPS.formNewPassword
                ? $t('auth.restorePassword.form.resetPassword')
                : $t('auth.restorePassword.form.proceed')
            "
          />
        </div>

        <!-- login -->
        <div class="text-center text-weight-medium q-mt-lg">
          {{ $t("auth.restorePassword.form.rememberPassword") }}

          <router-link :to="ROUTE_PATHS.AUTH.LOGIN" class="link text-primary">
            {{ $t("auth.restorePassword.form.login") }}
          </router-link>
        </div>
      </q-form>
    </div>

    <!-- right -->
    <div
      v-if="!$q.screen.lt.lg"
      class="full-width full-height row justify-center items-center q-px-xl"
      style="background: linear-gradient(203.08deg, #113b98, #1751d0)"
    >
      <q-img
        src="/assets/illustrations/team.svg"
        style="width: 80%; max-width: 512px"
      />
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
import { useAuthStore } from "stores/auth";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const router = useRouter();

/*
 * stores
 */
const authStore = useAuthStore();

/*
 * steps
 */
const STEPS = {
  formEmail: "email",
  emailVerification: "code",
  formNewPassword: "password",
  proceed: "login",
};
const step = ref(STEPS.formEmail);

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
  if (step.value === STEPS.formEmail) {
    await handleSendingVerificationCode();
  }

  // check verification code
  else if (step.value === STEPS.emailVerification) {
    await handleCheckingVerificationCode();
  }

  // update password
  else if (step.value === STEPS.formNewPassword) {
    await handleUpdatingPassword();
  }

  // login
  else if (step.value === STEPS.proceed) {
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
      step.value = STEPS.emailVerification;
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

      step.value = STEPS.formNewPassword;
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
      authStore.setUserCredentialsForDev({
        password: form.value.password,
      });

      authStore.login(form.value.email, form.value.password);

      step.value = STEPS.proceed;

      setTimeout(() => {
        router.push(ROUTE_PATHS.INDEX);
      }, 5000);
    });
};
</script>

<style scoped lang="scss">
.container__wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100svh;

  @media screen and (max-width: 1000px) {
    grid-template-columns: repeat(1, 1fr);
  }

  .container {
    max-width: 460px;
    width: 100%;
  }
}
</style>

<style lang="scss">
.chaport-container {
  display: none;
}
</style>
