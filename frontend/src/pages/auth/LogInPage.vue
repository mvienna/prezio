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
          {{ $t("auth.login.title") }}
        </div>

        <!-- sub-title -->
        <div class="text-grey-9 q-mt-sm q-mb-lg">
          {{ $t("auth.login.subtitle") }}
        </div>

        <!-- email -->
        <q-input
          v-model="form.email"
          type="email"
          dense
          outlined
          no-error-icon
          :placeholder="$t('auth.login.form.email')"
          :rules="[emailRule]"
          lazy-rules
          hide-bottom-space
          :error="!!invalidCredentialsError"
        />

        <!-- password -->
        <q-input
          v-model="form.password"
          :type="isPasswordVisible ? 'text' : 'password'"
          outlined
          dense
          no-error-icon
          :placeholder="$t('auth.login.form.password')"
          :rules="[passwordRule]"
          lazy-rules
          hide-bottom-space
          class="q-mt-md"
          :error-message="invalidCredentialsError"
          :error="!!invalidCredentialsError"
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

        <!-- forgot password -->
        <div class="row justify-end q-mt-sm text-weight-medium">
          <router-link
            :to="ROUTE_PATHS.AUTH.RESTORE_PASSWORD"
            class="link text-primary"
          >
            {{ $t("auth.login.form.forgotPassword") }}
          </router-link>
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
            :label="$t('auth.login.form.submit')"
          />
        </div>

        <!-- signup-->
        <div class="text-center text-weight-medium q-mt-lg">
          {{ $t("auth.login.form.newUser") }}

          <router-link :to="ROUTE_PATHS.AUTH.SIGNUP" class="link text-primary">
            {{ $t("auth.login.form.register") }}
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
