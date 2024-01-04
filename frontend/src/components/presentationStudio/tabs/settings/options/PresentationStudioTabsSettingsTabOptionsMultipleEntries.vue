<template>
  <PresentationStudioTabsSettingsTabOptionLayout
    icon="r_sync"
    :label="
      $t('presentationLayout.rightDrawer.tabs.settings.multipleEntries.title')
    "
    :tooltip="
      $t(
        `presentationLayout.rightDrawer.tabs.settings.multipleEntries.${
          slideSettings.isMultipleEntries ? 'on' : 'off'
        }`
      )
    "
  >
    <q-toggle
      v-model="slideSettings.isMultipleEntries"
      color="primary"
      checked-icon="r_all_inclusive"
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

/*
 * rules
 */
</script>
