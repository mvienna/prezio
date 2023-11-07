<template>
  <q-page class="q-py-xl">
    <div class="container">
      <q-form @submit.prevent="submit()">
        <!-- title -->
        <div class="form__title">
          <template v-if="isVerificationCodeSent">
            {{ $t("user.profile.verifyEmail.title") }}
          </template>

          <template v-else>{{ $t("user.profile.title") }}</template>
        </div>

        <!-- description -->
        <div v-if="isVerificationCodeSent" class="form__description q-mt-md">
          {{ $t("user.profile.verifyEmail.description") }}

          <a :href="`mailto:${form.email}`">
            {{ form.email }}
          </a>
        </div>

        <div class="column q-gutter-sm q-pt-lg">
          <!-- verification code -->
          <q-input
            v-if="isVerificationCodeSent"
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

          <template v-else>
            <!-- avatar -->
            <EditUserAvatar class="q-mb-lg" />

            <!-- name -->
            <q-input
              v-model="form.name"
              type="text"
              no-error-icon
              outlined
              :label="$t('user.profile.form.name')"
              :rules="[nameRule]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="r_account_circle" class="grey-2" />
              </template>
            </q-input>

            <!-- email -->
            <q-input
              v-model="form.email"
              type="email"
              outlined
              no-error-icon
              :label="$t('user.profile.form.email')"
              :rules="[emailRule]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="r_mail" class="grey-2" />
              </template>
            </q-input>

            <!-- old password -->
            <q-input
              v-model="form.currentPassword"
              :type="isPasswordVisible ? 'text' : 'password'"
              outlined
              no-error-icon
              :label="$t('user.profile.form.currentPassword')"
              :error-message="errors.password"
              :error="!!errors.password"
            >
              <template #prepend>
                <q-icon name="r_lock_open" class="grey-2" />
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

            <!-- new password -->
            <q-input
              v-if="form.currentPassword"
              v-model="form.newPassword"
              :type="isPasswordVisible ? 'text' : 'password'"
              outlined
              no-error-icon
              :label="$t('user.profile.form.newPassword')"
              :rules="[passwordRule]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="r_lock" class="grey-2" />
              </template>
            </q-input>
          </template>
        </div>

        <!-- submit -->
        <q-btn
          color="primary"
          unelevated
          no-caps
          type="submit"
          icon-right="r_done"
          :disable="!isVerificationCodeSent ? isNoChanges : false"
          :loading="isLoading"
          class="q-py-md q-mt-lg text-bold full-width"
          :label="
            isVerificationCodeSent
              ? $t('user.profile.form.checkVerificationCode')
              : $t('user.profile.save')
          "
        />

        <div v-if="isVerificationCodeSent" class="text-center q-mt-md">
          <div v-if="!!timeLeft" class="text-grey-5 cursor-not-allowed">
            {{ countdown }}
          </div>

          <div
            v-else
            class="link"
            :class="isLoading ? 'text-grey-5 cursor-not-allowed' : ''"
            @click="handleResendingVerificationCode()"
          >
            {{ $t("user.profile.form.resendVerificationCode") }}
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/auth";
import { useI18n } from "vue-i18n";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import {
  checkVerificationCode,
  sendVerificationCode,
} from "src/services/API/email";
import EditUserAvatar from "components/user/profile/EditUserAvatar.vue";
import { countdown, startCountdown, timeLeft } from "src/helpers/countdown";

/*
 * variables
 */
const { user } = storeToRefs(useAuthStore());
const userStore = useAuthStore();

const { t } = useI18n({ useScope: "global" });

const $q = useQuasar();

/*
 * form
 */
const form = ref({
  name: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  code: "",
});

const isPasswordVisible = ref(false);

const isVerificationCodeSent = ref(false);

const errors = ref({
  password: null,
  code: null,
});

// check form for changes from saved values
const isNoChanges = computed(() => {
  const propsToSkip = ["currentPassword", "newPassword", "code"];

  for (const prop in form.value) {
    if (propsToSkip.includes(prop)) {
      continue;
    } else if (
      form.value.hasOwnProperty(prop) &&
      user.value.hasOwnProperty(prop)
    ) {
      if (form.value[prop] !== user.value[prop]) {
        return false;
      }
    } else {
      return false;
    }
  }

  if (form.value.currentPassword && form.value.newPassword) {
    return false;
  }

  return true;
});

const isLoading = ref(false);

// load user's data into form
onBeforeMount(() => {
  loadUsersDataIntoForm();
});

const loadUsersDataIntoForm = () => {
  form.value = {
    name: user.value.name,
    email: user.value.email,
    currentPassword: null,
    newPassword: null,
  };
};

// name validation
const nameRule = (value) => {
  if (!value) {
    return t("user.profile.form.errors.name.required");
  }
  return true;
};

// email validation
const emailRule = (value) => {
  if (!value) {
    return t("user.profile.form.errors.email.required");
  } else if (!isValidEmail(value)) {
    return t("user.profile.form.errors.email.invalid");
  }
  return true;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// password validation
const passwordRule = (value) => {
  if (value && value.length < 6) {
    return t("user.profile.form.errors.password.invalid");
  }
  return true;
};

// code validation
const codeRule = (value) => {
  if (!value) {
    return t("user.profile.form.errors.code.required");
  } else if (value.length < 4) {
    return t("user.profile.form.errors.code.invalid");
  }
  return true;
};

/*
 * submit
 */
const submit = async () => {
  errors.value = {};
  isLoading.value = true;

  // check verification code if it's been sent
  if (isVerificationCodeSent.value) {
    await handleCheckingVerificationCode();
  } else {
    // send verification code on email change
    if (form.value.email !== user.value.email) {
      await handleSendingVerificationCode();
      return;
    }
  }

  handleUpdatingUserData();
};

/*
 * verification code
 * on email change
 */
const handleSendingVerificationCode = async () => {
  await sendVerificationCode(form.value.email, true)
    .then(() => {
      isVerificationCodeSent.value = true;
      startCountdown(process.env.SECONDS_UNTIL_RESEND_CODE);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading.value = false;
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
  await checkVerificationCode(form.value.email, form.value.code, false).catch(
    (error) => {
      isLoading.value = false;
      errors.value.code = error;
      throw error;
    }
  );
};

/*
 * update user data
 */
const handleUpdatingUserData = () => {
  let data = {
    name: form.value.name,
    email: form.value.email,
  };

  if (form.value.currentPassword?.length) {
    data = {
      ...data,
      currentPassword: form.value.currentPassword,
      password: form.value.newPassword,
    };
  }

  api
    .patch("/user", {
      ...data,
    })
    .then((response) => {
      /*
       * update dev user's credentials
       */
      if (form.value.email !== user.value.email) {
        userStore.setUserCredentialsForDev({
          email: form.value.email,
        });
      }

      if (form.value.newPassword) {
        userStore.setUserCredentialsForDev({
          password: form.value.newPassword,
        });
      }

      /*
       * update user's local data
       */
      user.value = {
        ...user.value,
        name: response.data.name,
        email: response.data.email,
      };
      loadUsersDataIntoForm();

      /*
       * success message
       */
      $q.notify({
        message: t("user.profile.form.success"),
        icon: "r_done",
      });
    })
    .catch((error) => {
      errors.value.password = error.response.data.message;
    })
    .finally(() => {
      isLoading.value = false;
      isVerificationCodeSent.value = false;
    });
};
</script>

<style scoped lang="scss">
.container {
  background: $white;
  max-width: 500px;
  width: 100%;
  padding: 36px;
  border-radius: 16px;
  margin: 0 auto;

  form {
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
