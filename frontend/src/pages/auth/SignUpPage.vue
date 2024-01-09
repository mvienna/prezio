<template>
  <!-- logo -->
  <div
    class="q-mt-lg"
    :class="$q.screen.lt.lg ? 'fixed-top-center' : 'fixed-top-left q-ml-lg'"
  >
    <q-img src="/prezio.svg" style="width: 120px" />
  </div>

  <div class="container__wrapper">
    <!-- left -->
    <div class="container">
      <q-form @submit.prevent="submit()">
        <!-- title -->
        <div class="text-h5 text-semibold">
          {{ $t("auth.signup.title") }}
        </div>

        <!-- sub-title -->
        <div class="text-grey-9 q-mt-sm q-mb-lg">
          {{ $t("auth.signup.subtitle") }}
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
        />

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
        />

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
    </div>

    <!-- right -->
    <div
      v-if="!$q.screen.lt.lg"
      class="full-width full-height row justify-center items-center q-px-xl"
      style="
        background: linear-gradient(203.08deg, #5fa5ff 2.22%, #135dbc 96.08%);
      "
    >
      <q-img src="/assets/images/class.svg" style="width: 50%" />
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
