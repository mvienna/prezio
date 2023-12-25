<template>
  <q-btn
    unelevated
    no-caps
    outline
    color="background"
    text-color="primary"
    style="width: calc(50% - 8px)"
    @click="
      showSettingsDialog = true;
      presentationSettingsTabsExpanded = [false, false, false, false, true];
    "
  >
    <div>
      <q-icon name="r_quiz" size="32px" class="q-my-sm" />

      <div class="text-center q-mb-sm" style="line-height: 1.4">
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.settings.openGeneralQuizSettings.title"
          )
        }}
      </div>
    </div>
  </q-btn>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

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
