<template>
  <PresentationStudioTabsSettingsTabOptionLayout
    icon="r_pause_presentation"
    :label="
      $t('presentationLayout.rightDrawer.tabs.settings.lockSubmission.title')
    "
    :tooltip="
      $t(
        'presentationLayout.rightDrawer.tabs.settings.lockSubmission.description'
      )
    "
  >
    <q-toggle
      v-model="slideSettings.isInitialSubmissionLocked"
      color="primary"
      @update:model-value="$emit('updateSlideSettings')"
    />
  </PresentationStudioTabsSettingsTabOptionLayout>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import PresentationStudioTabsSettingsTabOptionLayout from "components/presentationStudio/tabs/settings/options/PresentationStudioTabsSettingsTabOptionLayout.vue";

/*
 * emits
 */
defineEmits(["updateSlideSettings"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings } = storeToRefs(presentationsStore);
</script>
