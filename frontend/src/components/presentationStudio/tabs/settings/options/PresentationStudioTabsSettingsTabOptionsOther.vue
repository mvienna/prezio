<template>
  <PresentationStudioTabsSettingsTabOptionLayout
    icon="r_sentiment_very_dissatisfied"
    :label="
      $t('presentationLayout.rightDrawer.tabs.settings.filterProfanity.title')
    "
    :tooltip="
      $t(
        'presentationLayout.rightDrawer.tabs.settings.filterProfanity.description'
      )
    "
  >
    <q-toggle
      v-model="slideSettings.filterProfanity"
      color="primary"
      @update:model-value="$emit('updateSlideSettings')"
    />
  </PresentationStudioTabsSettingsTabOptionLayout>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import PresentationStudioTabsSettingsTabOptionLayout from "components/presentationStudio/tabs/settings/options/PresentationStudioTabsSettingsTabOptionLayout.vue";

/*
 * emits
 */
defineEmits(["updateSlideSettings"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings, slide } = storeToRefs(presentationsStore);
</script>
