<template>
  <q-card flat>
    <q-card-section class="q-pa-lg">
      <q-toolbar class="justify-between q-px-none">
        <!-- title -->
        <div class="text-h6 text-bold">{{ $t("presentations.new.title") }}</div>

        <!-- close -->
        <q-btn
          text-color="grey-5"
          unelevated
          icon="r_close"
          round
          @click="$emit('close')"
        />
      </q-toolbar>

      <q-form @submit.prevent="$emit('submit', form)">
        <!-- name -->
        <q-input
          v-model="form.name"
          :label="$t('presentations.new.name')"
          outlined
          autofocus
          color="primary"
          class="q-mt-md"
          :rules="[nameRule]"
          lazy-rules
        />

        <!-- description -->
        <q-input
          v-model="form.description"
          :label="$t('presentations.new.description')"
          outlined
          autogrow
          color="grey"
          class="q-mt-md"
        />

        <!-- submit -->
        <q-btn
          round
          no-caps
          class="full-width q-py-md q-mt-xl"
          color="primary"
          unelevated
          :loading="isLoading"
          :label="$t('presentations.new.create')"
          type="submit"
          icon="r_done"
        />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

defineEmits(["close", "submit"]);

defineProps({
  isLoading: { type: Boolean },
});

/*
 * form
 */
const form = ref({
  name: "",
  description: "",
});

// name validation
const nameRule = (value) => {
  if (!value) {
    return t("presentations.new.errors.name.required");
  }
  return true;
};
</script>

<style scoped lang="scss">
.q-card {
  width: 100%;
  max-width: 500px;
}
</style>
