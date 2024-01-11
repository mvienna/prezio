<template>
  <q-form @submit.prevent="submit()">
    <!-- title -->
    <div class="text-h5 text-semibold">
      {{ $t("auth.login.title") }}
    </div>

    <!-- sub-title -->
    <div class="text-grey-9 q-mt-sm q-mb-lg">
      {{ $t("auth.login.subtitle") }}
    </div>

    <!-- yandex auth -->
    <q-img
      src="/assets/images/yandex_auth.svg"
      class="cursor-not-allowed"
      style="opacity: 0.5"
    />

    <div class="row no-wrap items-center justify-between q-my-md">
      <q-separator style="width: 42.5%" class="bg-grey-2" />

      <div class="text-grey q-mx-3xs">
        {{ $t("auth.thirdParty.or") }}
      </div>

      <q-separator style="width: 42.5%" class="bg-grey-2" />
    </div>

    <!-- email -->
    <q-input
      v-model="form.email"
      type="email"
      dense
      outlined
      no-error-icon
      :label="$t('auth.login.form.email')"
      :rules="[emailRule]"
      lazy-rules
      hide-bottom-space
      :error="!!invalidCredentialsError"
    >
      <template #prepend>
        <q-icon name="r_alternate_email" />
      </template>
    </q-input>

    <!-- password -->
    <q-input
      v-model="form.password"
      :type="isPasswordVisible ? 'text' : 'password'"
      outlined
      dense
      no-error-icon
      :label="$t('auth.login.form.password')"
      :rules="[passwordRule]"
      lazy-rules
      hide-bottom-space
      class="q-mt-md"
      :error-message="invalidCredentialsError"
      :error="!!invalidCredentialsError"
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
</template>

<script setup>
import { ref } from "vue";
import { ROUTE_PATHS } from "src/constants/routes";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "stores/auth";
import { useRouter } from "vue-router";
import { useMeta } from "quasar";

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

useMeta({
  title: t("pages.auth.login.title"),
  titleTemplate: (title) => `${title} - ${t("pages.app")}`,

  // meta tags
  meta: {
    description: {
      name: "description",
      content: t("pages.auth.login.description"),
    },
    keywords: {
      name: "keywords",
      content: t("pages.auth.login.keywords"),
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
        return `${ogTitle} - ${t("pages.app")}`;
      },
    },
  },
});
</script>

<style lang="scss">
.chaport-container {
  display: none;
}
</style>
