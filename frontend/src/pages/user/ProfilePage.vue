<template>
  <q-page class="q-py-lg">
    <div class="container">
      <q-dialog v-model="isVerificationCodeSent" persistent>
        <q-card>
          <q-card-section class="q-pa-lg">
            <q-form @submit.prevent="submit()">
              <div class="absolute-top-right q-mt-lg q-mr-lg">
                <q-btn
                  flat
                  color="grey"
                  round
                  class="round-borders"
                  icon="r_close"
                  size="10px"
                  @click="handleCancelVerification()"
                />
              </div>

              <div class="text-h7 text-semibold text-center">
                {{ $t("user.profile.verifyEmail.title") }}
              </div>

              <div class="text-center q-my-md">
                {{ $t("user.profile.verifyEmail.description") }}

                <a :href="`mailto:${form.email}`">
                  {{ form.email }}
                </a>
              </div>

              <!-- verification code - input -->
              <q-input
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

              <div class="row items-center no-wrap q-mt-lg">
                <!-- resend verification code -->
                <q-btn
                  v-if="isVerificationCodeSent"
                  flat
                  no-caps
                  :disable="timeLeft !== -1 || loading.verificationCode"
                  color="grey"
                  style="padding: 0 12px"
                  :label="
                    timeLeft !== -1
                      ? countdown
                      : $t('user.profile.form.resendVerificationCode')
                  "
                  @click="handleSendingVerificationCode()"
                />

                <q-space />

                <!-- submit -->
                <q-btn
                  color="primary"
                  unelevated
                  no-caps
                  type="submit"
                  :loading="loading.verificationCode"
                  class="text-semibold"
                  :label="$t('user.profile.form.checkVerificationCode')"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-form @submit.prevent="submit()">
        <!-- verification code - title & description -->
        <template v-if="isVerificationCodeSent"> </template>

        <div class="column q-gutter-sm">
          <!-- avatar -->
          <EditUserAvatar class="q-mb-lg" />

          <div class="row">
            <!-- name -->
            <div class="col-12 col-sm q-mr-md">
              <div class="form__field__label">
                {{ $t("user.profile.form.name.label") }}
              </div>

              <q-input
                v-model="form.name"
                type="text"
                no-error-icon
                outlined
                dense
                :placeholder="$t('user.profile.form.name.placeholder')"
                :rules="[nameRule]"
                lazy-rules
              />
            </div>

            <!-- phone -->
            <div class="col-12 col-sm">
              <div class="form__field__label row items-center">
                {{ $t("user.profile.form.phone.label") }}
                <q-space />

                <span class="text-grey text-weight-regular text-caption">
                  {{ $t("user.profile.form.optional") }}
                </span>
              </div>

              <q-input
                v-model="form.phone"
                no-error-icon
                outlined
                dense
                unmasked-value
                mask="+7 (###) ### ## ##"
                :placeholder="$t('user.profile.form.phone.placeholder')"
                :error-message="errors.phone"
                :error="!!errors.phone"
              />
            </div>
          </div>

          <!-- email -->
          <div>
            <div class="form__field__label">
              {{ $t("user.profile.form.email.label") }}
            </div>

            <q-input
              v-model="form.email"
              type="email"
              outlined
              dense
              no-error-icon
              :placeholder="$t('user.profile.form.email.placeholder')"
              :rules="[emailRule]"
              lazy-rules
              :error-message="errors.email"
              :error="!!errors.email"
            />
          </div>

          <!-- preferred app use -->
          <div class="q-mb-md">
            <div class="form__field__label row items-center">
              {{ $t("user.profile.form.preferredAppUsage.label") }}
              <q-space />

              <span class="text-grey text-weight-regular text-caption">
                {{ $t("user.profile.form.optional") }}
              </span>
            </div>

            <q-select
              v-model="form.preferred_app_usage"
              outlined
              dense
              emit-value
              options-dense
              popup-content-class="q-pa-sm"
              option-value="label"
              dropdown-icon="r_expand_more"
              :label-slot="!form.preferred_app_usage?.length"
              :options="[
                {
                  label: $t(
                    'user.profile.form.preferredAppUsage.options.business'
                  ),
                  icon: 'r_business',
                  color: 'primary',
                },
                {
                  label: $t(
                    'user.profile.form.preferredAppUsage.options.education'
                  ),
                  icon: 'r_school',
                  color: 'purple',
                },
                {
                  label: $t(
                    'user.profile.form.preferredAppUsage.options.personal'
                  ),
                  icon: 'r_account_circle',
                  color: 'orange',
                },
                {
                  label: $t(
                    'user.profile.form.preferredAppUsage.options.other'
                  ),
                  icon: 'r_more_horiz',
                  color: 'grey',
                },
              ]"
            >
              <template #label>
                {{ $t("user.profile.form.preferredAppUsage.placeholder") }}
              </template>

              <template v-slot:option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  :class="`text-${scope.opt.color}`"
                  class="row items-center"
                >
                  <q-icon :name="scope.opt.icon" size="20px" class="q-mr-sm" />
                  {{ scope.opt.label }}
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- current password -->
          <div>
            <div class="form__field__label">
              {{ $t("user.profile.form.currentPassword.label") }}
            </div>

            <q-input
              v-model="form.currentPassword"
              :type="isPasswordVisible ? 'text' : 'password'"
              outlined
              dense
              no-error-icon
              :placeholder="$t('user.profile.form.currentPassword.placeholder')"
              :error-message="errors.password"
              :error="!!errors.password"
            >
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
            <div v-if="form.currentPassword">
              <div class="form__field__label">
                {{ $t("user.profile.form.newPassword.label") }}
              </div>

              <q-input
                v-model="form.newPassword"
                :type="isPasswordVisible ? 'text' : 'password'"
                outlined
                dense
                no-error-icon
                :label="$t('user.profile.form.newPassword.placeholder')"
                :rules="[passwordRule]"
                lazy-rules
              />
            </div>

            <!-- restore password -->
            <div class="form__field__label q-mt-md">
              <div class="text-weight-regular">
                {{
                  $t("user.profile.form.currentPassword.forgotPassword.title")
                }}
                <router-link
                  :to="ROUTE_PATHS.AUTH.RESTORE_PASSWORD"
                  class="text-primary link"
                >
                  {{
                    $t(
                      "user.profile.form.currentPassword.forgotPassword.subtitle"
                    )
                  }}
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="row items-center no-wrap q-mt-lg">
          <!-- delete account -->
          <q-btn
            flat
            no-caps
            color="red"
            style="padding: 0 12px"
            :label="$t('user.profile.deleteAccount.title')"
            @click="showAccountDeletionConfirmationDialog = true"
          />

          <q-dialog v-model="showAccountDeletionConfirmationDialog">
            <ConfirmationDialog
              icon="r_no_accounts"
              icon-color="red"
              :title="$t('user.profile.deleteAccount.confirmation.title')"
              :message="$t('user.profile.deleteAccount.confirmation.message')"
              confirm-btn-color="red"
              cancel-btn-color="grey"
              @cancel="showAccountDeletionConfirmationDialog = false"
              @confirm="deleteAccount()"
            >
            </ConfirmationDialog>
          </q-dialog>

          <q-space />

          <!-- submit -->
          <q-btn
            color="primary"
            unelevated
            no-caps
            type="submit"
            :disable="isNoChanges"
            :loading="loading.saving"
            class="text-semibold"
            :label="$t('user.profile.save')"
          />
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
import { ROUTE_PATHS } from "src/constants/routes";
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const $q = useQuasar();

/*
 * stores
 */
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

/*
 * form
 */
const form = ref({
  name: "",
  phone: "",
  email: "",
  preferred_app_usage: "",
  currentPassword: "",
  newPassword: "",
  code: "",
});

const isPasswordVisible = ref(false);
const isVerificationCodeSent = ref(false);

const errors = ref({
  password: null,
  phone: null,
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

  return !(form.value.currentPassword && form.value.newPassword);
});

const loading = ref({
  saving: false,
  verificationCode: false,
});

// set user's data
onBeforeMount(() => {
  setUsersData();
});

const setUsersData = () => {
  form.value = {
    name: user.value.name,
    phone: user.value.phone,
    email: user.value.email,
    preferred_app_usage: user.value.preferred_app_usage,
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

  // check verification code if it's been sent
  if (isVerificationCodeSent.value) {
    await handleCheckingVerificationCode();
  } else {
    loading.value.saving = true;

    // send verification code on email change
    if (form.value.email !== user.value.email) {
      await api
        .patch("/user", {
          checkEmail: true,
          email: form.value.email,
        })
        .then(() => {
          handleSendingVerificationCode();
        })
        .catch((error) => {
          errors.value.email = error.response.data.message;
          loading.value.saving = false;
        });

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
  loading.value.verificationCode = true;

  await sendVerificationCode(form.value.email, true)
    .then(() => {
      isVerificationCodeSent.value = true;
      startCountdown(10 || process.env.SECONDS_UNTIL_RESEND_CODE);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      loading.value.verificationCode = false;
      loading.value.saving = false;
    });
};

const handleCancelVerification = () => {
  loading.value.verificationCode = false;
  isVerificationCodeSent.value = false;
  form.value.code = "";
};

const handleCheckingVerificationCode = async () => {
  loading.value.verificationCode = true;

  await checkVerificationCode(form.value.email, form.value.code, false)
    .then(() => {
      form.value.code = "";
      isVerificationCodeSent.value = false;
    })
    .catch((error) => {
      errors.value.code = error;
      loading.value.verificationCode = false;
      throw error;
    })
    .finally(() => {});
};

/*
 * update user data
 */
const handleUpdatingUserData = () => {
  let data = {
    name: form.value.name,
    phone: form.value.phone,
    email: form.value.email,
    preferred_app_usage: form.value.preferred_app_usage,
  };

  if (form.value.currentPassword?.length) {
    data = {
      ...data,
      currentPassword: form.value.currentPassword,
      password: form.value.newPassword,
    };
  }

  loading.value.saving = true;

  api
    .patch("/user", {
      ...data,
    })
    .then((response) => {
      /*
       * update dev user's credentials
       */
      if (form.value.email !== user.value.email) {
        authStore.setUserCredentialsForDev({
          email: form.value.email,
        });
      }

      if (form.value.newPassword) {
        authStore.setUserCredentialsForDev({
          password: form.value.newPassword,
        });
      }

      /*
       * update user's local data
       */
      user.value = {
        ...user.value,
        name: response.data.name,
        phone: response.data.phone,
        email: response.data.email,
        preferred_app_usage: response.data.preferred_app_usage,
      };
      setUsersData();

      /*
       * success message
       */
      $q.notify({
        message: t("user.profile.form.success"),
        icon: "r_done",
      });
    })
    .catch((error) => {
      if (error.response.data?.errors?.phone) {
        errors.value.phone = t("user.profile.form.errors.phone.invalid");
      }

      if (error.response.data?.errors?.password) {
        errors.value.password = error.response.data.message;
      }
    })
    .finally(() => {
      loading.value.saving = false;
      isVerificationCodeSent.value = false;
    });
};

/*
 * delete account
 */
const showAccountDeletionConfirmationDialog = ref(false);

const deleteAccount = async () => {
  await authStore.delete();
  await authStore.logout();
};
</script>

<style scoped lang="scss">
.container {
  background: $white;
  max-width: 520px;
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  border: 2px solid $grey-2;
  margin: 0 auto;

  form {
    .form__title {
      text-align: center;
      font-size: 18px;
      font-weight: 600;
    }

    .form__field__label {
      margin-bottom: 8px;
      padding-left: 12px;
      font-weight: 500;
    }
  }
}

/*
 * verification code
 */
.q-card {
  border-radius: 16px;
  max-width: 468px;
  width: 100%;
}

::v-deep(.verification_code) {
  font-size: 16px;
  font-weight: 500;

  input {
    text-align: center;
  }
}
</style>
