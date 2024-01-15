<template>
  <q-page :class="{ 'q-py-lg': !$q.screen.lt.md }">
    <div class="container">
      <q-form @submit.prevent="submit()">
        <div class="column q-gutter-sm">
          <!-- avatar -->
          <EditUserAvatar class="q-mb-lg" />

          <div class="row" :class="{ 'no-wrap': !$q.screen.lt.md }">
            <!-- name -->
            <div class="full-width" :class="{ 'q-pr-sm': !$q.screen.lt.md }">
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
                hide-bottom-space
              />
            </div>

            <!-- phone -->
            <div
              class="full-width"
              :class="{
                'q-pl-sm': !$q.screen.lt.md,
                'q-mt-lg': $q.screen.lt.md,
              }"
            >
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
                hide-bottom-space
              />
            </div>
          </div>

          <!-- email -->
          <div class="q-mt-lg">
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
              hide-bottom-space
            />
          </div>

          <!-- preferred app use -->
          <div class="q-mt-lg">
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
                  color: 'teal',
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

          <!-- new password -->
          <div class="q-mt-lg">
            <div class="form__field__label">
              {{ $t("user.profile.form.newPassword.label") }}
            </div>

            <q-input
              v-model="newPassword"
              :type="isPasswordVisible ? 'text' : 'password'"
              outlined
              dense
              no-error-icon
              :placeholder="$t('user.profile.form.newPassword.placeholder')"
              :rules="[passwordRule]"
              hide-bottom-space
              lazy-rules
            >
              <template #append>
                <q-btn
                  flat
                  round
                  :icon="
                    isPasswordVisible ? 'r_visibility_off' : 'r_visibility'
                  "
                  color="grey"
                  class="round-borders"
                  size="8px"
                  @click="isPasswordVisible = !isPasswordVisible"
                />
              </template>
            </q-input>
          </div>
        </div>

        <!-- actions -->
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
            :loading="isLoading"
            class="text-semibold"
            :label="$t('user.profile.save')"
          />
        </div>
      </q-form>
    </div>

    <!-- email verification -->
    <q-dialog v-model="showEmailVerificationDialog" persistent>
      <VerifyEmail
        :email="form.email"
        @verified="
          isEmailVerified = true;
          submit();
          showEmailVerificationDialog = false;
        "
        @cancel="showEmailVerificationDialog = false"
      />
    </q-dialog>

    <!-- password verification -->
    <q-dialog v-model="showPasswordVerificationDialog" persistent>
      <VerifyPassword
        @verified="
          isPasswordVerified = true;
          currentPassword = $event;
          submit();
          showPasswordVerificationDialog = false;
        "
        @cancel="showPasswordVerificationDialog = false"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/auth";
import { useI18n } from "vue-i18n";
import { api } from "boot/axios";
import { useMeta, useQuasar } from "quasar";
import EditUserAvatar from "components/user/profile/EditUserAvatar.vue";
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";
import VerifyEmail from "components/user/profile/VerifyEmail.vue";
import VerifyPassword from "components/user/profile/VerifyPassword.vue";

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
});

const newPassword = ref("");
const currentPassword = ref();

const isPasswordVisible = ref(false);

const errors = ref({
  password: null,
  phone: null,
});

// check form for changes from saved values
const isNoChanges = computed(() => {
  for (const prop in form.value) {
    if (form.value.hasOwnProperty(prop) && user.value.hasOwnProperty(prop)) {
      if (form.value[prop] !== user.value[prop]) {
        return false;
      }
    } else {
      return false;
    }
  }

  return !newPassword.value?.length;
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

/*
 * submit
 */
const isLoading = ref(false);

const submit = async () => {
  errors.value = {};

  // new email
  if (form.value.email !== user.value.email) {
    if (!isPasswordVerified.value) {
      showPasswordVerificationDialog.value = true;
      return;
    }

    if (!isEmailVerified.value) {
      // check new email uniqueness
      await api
        .patch("/user", {
          checkEmail: true,
          email: form.value.email,
        })
        .then(() => {
          // verify new email by code
          showEmailVerificationDialog.value = true;
        })
        .catch((error) => {
          errors.value.email = error.response.data.message;
        });

      return;
    }
  }

  if (newPassword.value?.length && !isPasswordVerified.value) {
    showPasswordVerificationDialog.value = true;
    return;
  }

  let data = form.value;

  if (newPassword.value?.length && currentPassword.value) {
    data = {
      ...data,
      password: newPassword.value,
      currentPassword: currentPassword.value,
    };
  }

  isLoading.value = true;

  await api
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

      if (newPassword.value?.length) {
        authStore.setUserCredentialsForDev({
          password: newPassword.value,
        });
        newPassword.value = "";
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
      isLoading.value = false;
      isEmailVerified.value = false;
      isPasswordVerified.value = false;
      currentPassword.value = null;
    });
};

/*
 * email verification
 */
const showEmailVerificationDialog = ref(false);
const isEmailVerified = ref(false);

/*
 * password verification
 */
const showPasswordVerificationDialog = ref(false);
const isPasswordVerified = ref(false);

/*
 * delete account
 */
const showAccountDeletionConfirmationDialog = ref(false);

const deleteAccount = async () => {
  await authStore.delete();
  await authStore.logout();
};

/*
 * meta
 */
const metaOptions = {
  title: t("meta.profile.title"),
  titleTemplate: (title) => `${title} - ${t("meta.app")}`,

  // meta tags
  meta: {
    description: {
      name: "description",
      content: t("meta.profile.description"),
    },
    keywords: {
      name: "keywords",
      content: t("meta.profile.keywords"),
    },
    equiv: {
      "http-equiv": "Content-Type",
      content: "text/html; charset=UTF-8",
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle: {
      property: "og:title",
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogTitle) {
        return `${ogTitle} - ${t("meta.app")}`;
      },
    },
  },
};

if (window.location.host === process.env.STAGING_HOST) {
  metaOptions.meta.robots = {
    name: "robots",
    content: "noindex, nofollow",
  };
}

useMeta(metaOptions);
</script>

<style scoped lang="scss">
.container {
  background: $white;
  max-width: 520px;
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid $grey-2;
  margin: 0 auto;

  @media screen and (max-width: 568px) {
    border: none;
  }

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
</style>

<style lang="scss">
.chaport-container {
  display: none;
}
</style>
