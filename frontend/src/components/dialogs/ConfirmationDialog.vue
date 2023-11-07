<template>
  <q-card flat class="q-pa-sm">
    <q-card-section class="q-pa-lg">
      <div class="absolute-right q-mr-sm q-mt-sm">
        <q-btn
          color="grey"
          round
          flat
          icon="r_close"
          size="12px"
          style="border-radius: 100%"
          @click="$emit('cancel')"
        />
      </div>

      <!-- icon -->
      <div class="row justify-center q-mt-md">
        <q-icon :name="icon" :color="iconColor" size="52px" />
      </div>

      <!-- title -->
      <div class="text-h6 text-bold text-center q-mt-lg">{{ title }}</div>

      <!-- message -->
      <div class="text-h7 q-mt-sm text-center q-mb-lg" v-html="message"></div>

      <!-- slot -->
      <slot name="default" />

      <div class="row no-wrap q-gutter-lg">
        <!-- cancel -->
        <q-btn
          outline
          no-caps
          class="q-py-sm"
          :color="cancelBtnColor"
          :label="cancelBtnText || $t('dialogs.confirmation.cancel')"
          @click="$emit('cancel')"
        />

        <!-- confirm -->
        <q-btn
          unelevated
          no-caps
          class="q-py-sm"
          :color="confirmBtnColor"
          :label="confirmBtnText || $t('dialogs.confirmation.confirm')"
          @click="$emit('confirm')"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * props
 */
defineProps({
  icon: { type: String, default: "r_crisis_alert" },
  iconColor: { type: String, default: "orange" },

  title: { type: String, default: null },
  message: { type: String, default: null },

  cancelBtnText: { type: String, default: null },
  cancelBtnColor: { type: String, default: "primary" },

  confirmBtnText: { type: String, default: null },
  confirmBtnColor: { type: String, default: "positive" },
});

/*
 * emits
 */
defineEmits(["cancel", "confirm"]);
</script>

<style scoped lang="scss">
.q-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px !important;
}

.q-btn {
  width: 100%;
}
</style>
