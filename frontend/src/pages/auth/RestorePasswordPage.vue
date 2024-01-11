<template>
  <q-form @submit.prevent="submit()">
    <!-- title -->
    <div class="text-h5 text-semibold">
      {{ $t(`auth.restorePassword.titles.${step}`) }}
    </div>

    <!-- sub-title -->
    <div class="text-grey-9 q-mt-sm q-mb-lg">
      <span
        v-html="
          $t(`auth.restorePassword.descriptions.${step}`, {
            mail:
              step === STEPS.verify
                ? `<span class='link'>${form.email}</span>`
                : `<a href='mailto:hello@prezio.ru'>prezio.ru</a>`,
          })
        "
      />
    </div>

    <!-- email -->
    <q-input
      v-if="step === STEPS.request"
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
    >
      <template #prepend>
        <q-icon name="r_alternate_email" />
      </template>
    </q-input>

    <!-- verification code -->
    <template v-if="step === STEPS.verify">
      <div class="row no-wrap justify-between">
        <template v-for="n in 6" :key="n">
          <q-input
            v-model="form.code[n - 1]"
            mask="#"
            outlined
            unmasked-value
            no-error-icon
            :autofocus="n - 1 === 0"
            hide-bottom-space
            class="verification_code"
            :error="!!errors.code"
            @update:model-value="handleEmailVerificationCodeInputUpdate(n - 1)"
            @keydown="handleEmailVerificationCodeInputKeyDown($event, n - 1)"
          />
        </template>
      </div>

      <!--      <div class="row items-center text-caption">-->
      <!--        <div v-if="timeLeft !== -1" class="text-grey-5 cursor-not-allowed">-->
      <!--          {{ countdown }}-->
      <!--        </div>-->

      <!--        <div-->
      <!--          v-else-->
      <!--          class="link"-->
      <!--          :class="isLoading ? 'text-grey-5 cursor-not-allowed' : 'text-primary'"-->
      <!--          @click="handleResendingVerificationCode()"-->
      <!--        >-->
      <!--          {{ $t("auth.restorePassword.form.resendVerificationCode") }}-->
      <!--        </div>-->
      <!--      </div>-->
    </template>

    <!-- password -->
    <template v-if="step === STEPS.confirm">
      <q-input
        v-model="form.password"
        :type="isPasswordVisible ? 'text' : 'password'"
        outlined
        dense
        autofocus
        no-error-icon
        hide-bottom-space
        :label="$t('auth.restorePassword.form.password')"
        :rules="[passwordRule]"
        lazy-rules
      >
        <template #prepend>
          <q-icon name="o_lock" />
        </template>

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

      <q-input
        v-model="form.passwordCopy"
        :type="isPasswordVisible ? 'text' : 'password'"
        outlined
        dense
        no-error-icon
        hide-bottom-space
        :label="$t('auth.restorePassword.form.passwordCopy')"
        :rules="[passwordCopyRule]"
        lazy-rules
        class="q-mt-md"
      >
        <template #prepend>
          <q-icon name="o_lock" />
        </template>
      </q-input>
    </template>

    <div>
      <DoneCheckmark v-if="step === STEPS.success" class="q-py-sm" />
    </div>

    <!-- submit -->
    <div class="q-mt-lg">
      <q-btn
        color="primary"
        unelevated
        no-caps
        type="submit"
        :loading="isLoading"
        align="left"
        class="q-py-sm full-width"
        :label="
          step === STEPS.request
            ? $t('auth.restorePassword.actions.sendEmail')
            : step === STEPS.verify
            ? $t('auth.restorePassword.actions.checkVerificationCode')
            : step === STEPS.confirm
            ? $t('auth.restorePassword.actions.resetPassword')
            : $t('auth.restorePassword.actions.proceed')
        "
      />
    </div>

    <!-- login -->
    <div v-if="step !== STEPS.success" class="text-weight-medium q-mt-lg">
      <router-link :to="ROUTE_PATHS.AUTH.LOGIN" class="link text-primary">
        <q-icon name="r_arrow_back" />
        {{ $t("auth.restorePassword.rememberPassword") }}
      </router-link>
    </div>
  </q-form>
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
import { startCountdown } from "src/helpers/countdown";
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
  request: "request",
  verify: "verify",
  confirm: "confirm",
  success: "success",
};
const step = ref(STEPS.request);

/*
 * form
 */
const form = ref({
  email: "",
  code: ["", "", "", "", "", ""],
  password: "",
  passwordCopy: "",
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

// password validation
const passwordRule = (value) => {
  if (!value) {
    return t("auth.restorePassword.form.errors.password.required");
  } else if (value.length < 6) {
    return t("auth.restorePassword.form.errors.password.invalid");
  }
  return true;
};

const passwordCopyRule = (value) => {
  if (!value) {
    return t("auth.restorePassword.form.errors.password.required");
  } else if (value.length < 6) {
    return t("auth.restorePassword.form.errors.password.invalid");
  } else if (value !== form.value.password) {
    return t("auth.restorePassword.form.errors.password.mismatch");
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
  if (step.value === STEPS.request) {
    await handleSendingVerificationCode();
  }

  // check verification code
  else if (step.value === STEPS.verify) {
    await handleCheckingVerificationCode();
  }

  // update password
  else if (step.value === STEPS.confirm) {
    await handleUpdatingPassword();
  }

  // login
  else if (step.value === STEPS.success) {
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
      step.value = STEPS.verify;
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
  await checkVerificationCode(form.value.email, form.value.code.join(""))
    .then((response) => {
      // set temp auth token
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      step.value = STEPS.confirm;
    })
    .catch((error) => {
      errors.value.code = error;
    });
};

const handleEmailVerificationCodeInputUpdate = (n) => {
  const input =
    document.getElementsByClassName("verification_code")?.[
      form.value.code[n] ? n + 1 : n - 1
    ];
  if (input) {
    input.querySelector("input").focus();
  }
};

const handleEmailVerificationCodeInputKeyDown = (event, n) => {
  if (![37, 39].includes(event.keyCode)) return;

  const input =
    document.getElementsByClassName("verification_code")?.[
      event.keyCode === 39 ? n + 1 : n - 1
    ];
  if (input) {
    input.querySelector("input").focus();
  }
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

      step.value = STEPS.success;

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

::v-deep(.verification_code) {
  font-size: 16px;
  cursor: text;

  .q-field__control {
    height: 48px;
    width: 48px;
    padding: 0 18px;
  }
}
</style>

<style lang="scss">
.chaport-container {
  display: none;
}
</style>
