<template>
  <PresentationStudioTabsSettingsTabOptionLayout
    icon="o_hide_source"
    :label="
      $t('presentationLayout.rightDrawer.tabs.settings.hideResults.title')
    "
    :tooltip="
      $t('presentationLayout.rightDrawer.tabs.settings.hideResults.description')
    "
  >
    <q-toggle
      v-model="slideSettings.isResultsHidden"
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
