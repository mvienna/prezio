<template>
  <PresentationStudioTabsSettingsTabOptionLayout
    icon="icon-page_info"
    :label="
      $t(
        'presentationLayout.rightDrawer.tabs.settings.openGeneralQuizSettings.title'
      )
    "
  >
    <div
      class="link text-primary"
      @click="
        showSettingsDialog = true;
        presentationSettingsTabsExpanded = [false, false, true, false, false];
      "
    >
      {{
        $t(
          "presentationLayout.rightDrawer.tabs.settings.openGeneralQuizSettings.open"
        )
      }}
    </div>
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
const { slideSettings, showSettingsDialog, presentationSettingsTabsExpanded } =
  storeToRefs(presentationsStore);
</script>
