<template>
  <div>
    <q-btn
      outline
      color="primary"
      icon-right="r_quiz"
      :label="
        $t(
          'presentationLayout.rightDrawer.tabs.settings.openGeneralQuizSettings.title'
        )
      "
      no-caps
      class="full-width q-py-sm q-mb-md q-mt-lg"
      @click="
        showSettingsDialog = true;
        presentationSettingsTabsExpanded = [false, false, false, false, true];
      "
    />
  </div>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { SLIDE_TYPES } from "src/constants/presentationStudio";

/*
 * emits
 */
defineEmits(["updateSlideSettings"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings, showSettingsDialog, presentationSettingsTabsExpanded } =
  storeToRefs(presentationsStore);

/*
 * rules
 */
</script>
