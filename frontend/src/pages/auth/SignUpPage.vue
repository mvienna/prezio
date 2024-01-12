<template>
  <q-form @submit.prevent="submit()">
    <!-- title -->
    <div class="text-h5 text-semibold">
      {{ $t("auth.signup.title") }}
    </div>

    <!-- sub-title -->
    <div class="text-grey-9 q-mt-sm q-mb-lg">
      {{ $t("auth.signup.subtitle") }}
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

    <!-- name -->
    <q-input
      v-model="form.name"
      type="text"
      no-error-icon
      outlined
      dense
      hide-bottom-space
      autofocus
      :label="$t('auth.signup.form.name')"
      :rules="[nameRule]"
      lazy-rules
    >
      <template #prepend>
        <q-icon name="o_account_circle" />
      </template>
    </q-input>

    <!-- email -->
    <q-input
      v-model="form.email"
      type="email"
      outlined
      dense
      hide-bottom-space
      no-error-icon
      class="q-mt-md"
      :label="$t('auth.signup.form.email')"
      :rules="[emailRule]"
      lazy-rules
    >
      <template #prepend>
        <q-icon name="r_alternate_email" />
      </template>
    </q-input>

    <!-- password -->
    <q-input
      v-model="form.password"
      :type="isPasswordVisible ? 'text' : 'password'"
      no-error-icon
      outlined
      dense
      hide-bottom-space
      class="q-mt-md"
      :label="$t('auth.signup.form.password')"
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
        :label="$t('auth.signup.form.submit')"
      />
    </div>

    <!-- disclaimer -->
    <div
      v-html="$t('auth.signup.form.disclaimer')"
      class="text-caption q-mt-md text-center"
    ></div>

    <!-- login -->
    <div class="text-center text-weight-medium q-mt-lg">
      {{ $t("auth.signup.form.oldUser") }}

      <router-link :to="ROUTE_PATHS.AUTH.LOGIN" class="link text-primary">
        {{ $t("auth.signup.form.login") }}
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
  name: "",
  email: "",
  password: "",
});

const isPasswordVisible = ref(false);

const isLoading = ref(false);

// name validation
const nameRule = (value) => {
  if (!value) {
    return t("auth.signup.form.errors.name.required");
  }
  return true;
};

// email validation
const emailRule = (value) => {
  if (!value) {
    return t("auth.signup.form.errors.email.required");
  } else if (!isValidEmail(value)) {
    return t("auth.signup.form.errors.email.invalid");
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
    return t("auth.signup.form.errors.password.required");
  } else if (value.length < 6) {
    return t("auth.signup.form.errors.password.invalid");
  }
  return true;
};

/*
 * submit
 */
const submit = async () => {
  isLoading.value = true;

  await store
    .register(form.value.name, form.value.email, form.value.password)
    .catch((error) => {
      console.log(error);
      isLoading.value = false;
    });

  await store
    .login(form.value.email, form.value.password)
    .then(() => {
      router.push(ROUTE_PATHS.INDEX);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

useMeta({
  title: t("meta.auth.signup.title"),
  titleTemplate: (title) => `${title} - ${t("meta.app")}`,

  // meta tags
  meta: {
    description: {
      name: "description",
      content: t("meta.auth.signup.description"),
    },
    keywords: {
      name: "keywords",
      content: t("meta.auth.signup.keywords"),
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
});
</script>

<style lang="scss">
.chaport-container {
  display: none;
}
</style>
