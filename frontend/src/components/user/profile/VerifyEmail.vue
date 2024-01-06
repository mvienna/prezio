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

        <div class="text-h6 text-semibold text-center">
          {{ $t("user.profile.form.emailVerification.title") }}
        </div>

        <div class="text-center q-mt-md">
          {{ $t("user.profile.form.emailVerification.description") }}

          <a :href="`mailto:${email}`">
            {{ email }}
          </a>
        </div>

        <!-- verification code - input -->
        <q-input
          v-model="code"
          mask="#-#-#-#"
          outlined
          placeholder="0-0-0-0"
          unmasked-value
          no-error-icon
          autofocus
          class="verification_code q-mt-lg"
          :rules="[codeRule]"
          lazy-rules
          hide-bottom-space
          :error-message="error"
          :error="!!error"
        />

        <div class="text-sm q-ml-3xs q-mt-sm text-grey">
          {{ $t("user.profile.form.emailVerification.warning") }}
        </div>

        <div class="row items-center no-wrap q-mt-lg">
          <!-- resend verification code -->
          <q-btn
            outline
            no-caps
            :disable="timeLeft !== -1 || isLoading"
            color="grey"
            class="full-width q-py-sm"
            :label="
              timeLeft !== -1
                ? countdown
                : $t('user.profile.form.emailVerification.resend')
            "
            @click="send()"
          />

          <q-space class="q-mr-lg" />

          <!-- submit -->
          <q-btn
            color="primary"
            unelevated
            no-caps
            class="full-width q-py-sm"
            type="submit"
            :loading="isLoading"
            :label="$t('user.profile.form.emailVerification.submit')"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { countdown, startCountdown, timeLeft } from "src/helpers/countdown";
import { onBeforeMount, ref } from "vue";
import {
  checkVerificationCode,
  sendVerificationCode,
} from "src/services/API/email";
import { useI18n } from "vue-i18n";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * emits
 */
const emit = defineEmits(["verified", "cancel"]);

/*
 * props
 */
const props = defineProps({
  email: { type: String, default: null },
});

/*
 * form
 */
const code = ref("");

const isLoading = ref(false);
const error = ref();

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
 * actions
 */
onBeforeMount(() => {
  send();
});

const send = async () => {
  isLoading.value = true;

  await sendVerificationCode(props.email, true)
    .then(() => {
      startCountdown(process.env.SECONDS_UNTIL_RESEND_CODE);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const check = async () => {
  isLoading.value = true;

  await checkVerificationCode(props.email, code.value, false)
    .then(() => {
      emit("verified");
    })
    .catch((e) => {
      error.value = e;
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

::v-deep(.verification_code) {
  font-size: 16px;
  font-weight: 500;

  input {
    text-align: center;
  }
}
</style>
