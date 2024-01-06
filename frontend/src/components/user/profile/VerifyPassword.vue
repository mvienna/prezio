<template>
  <q-card>
    <q-card-section class="q-pa-lg">
      <q-form @submit.prevent="check()">
        <div class="absolute-top-right">
          <q-btn
            flat
            color="grey"
            round
            class="round-borders"
            icon="r_close"
            size="10px"
            @click="$emit('cancel')"
          />
        </div>

        <!-- title -->
        <div class="text-h6 text-semibold text-center">
          {{ $t("user.profile.form.passwordVerification.title") }}
        </div>

        <!-- description -->
        <div class="text-center q-mt-sm">
          {{ $t("user.profile.form.passwordVerification.description") }}
        </div>

        <!-- password -->
        <div class="q-mt-lg">
          <div class="q-pl-3xs q-mb-sm text-semibold">
            {{ $t("user.profile.form.passwordVerification.label") }}
          </div>

          <q-input
            v-model="password"
            :type="isPasswordVisible ? 'text' : 'password'"
            outlined
            dense
            autofocus
            no-error-icon
            :rules="[passwordRule]"
            lazy-rules
            :placeholder="
              $t('user.profile.form.passwordVerification.placeholder')
            "
            :error="!!error"
            :error-message="error"
            hide-bottom-space
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
        </div>

        <!-- restore password -->
        <div class="q-pl-3xs q-mt-md">
          {{
            $t("user.profile.form.passwordVerification.forgotPassword.title")
          }}
          <router-link
            :to="ROUTE_PATHS.AUTH.RESTORE_PASSWORD"
            class="text-primary link"
          >
            {{
              $t(
                "user.profile.form.passwordVerification.forgotPassword.subtitle"
              )
            }}
          </router-link>
        </div>

        <!-- submit -->
        <q-btn
          color="primary"
          unelevated
          no-caps
          class="full-width q-py-sm q-mt-lg"
          type="submit"
          :loading="isLoading"
          :label="$t('user.profile.form.passwordVerification.submit')"
        />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

import { useI18n } from "vue-i18n";
import { ROUTE_PATHS } from "src/constants/routes";
import { api } from "boot/axios";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * emits
 */
const emit = defineEmits(["verified", "cancel"]);

/*
 * form
 */
const password = ref("");
const isPasswordVisible = ref(false);

const isLoading = ref(false);
const error = ref();

// name validation
const passwordRule = (value) => {
  if (!value) {
    return t("user.profile.form.errors.password.required");
  }
  return true;
};

/*
 * actions
 */
const check = async () => {
  isLoading.value = true;

  await api
    .patch("/user", {
      checkPassword: true,
      currentPassword: password.value,
    })
    .then(() => {
      emit("verified", password.value);
    })
    .catch((e) => {
      error.value = e.response.data.message;
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>

<style scoped lang="scss">
.q-card {
  border-radius: 16px;
  max-width: 468px;
  width: 100%;
}
</style>
