<template>
  <PresentationStudioTabsSettingsTabOptionLayout
    icon="r_group"
    :label="
      $t(
        'presentationLayout.rightDrawer.tabs.settings.entriesPerParticipant.title'
      )
    "
    :tooltip="
      $t(
        'presentationLayout.rightDrawer.tabs.settings.entriesPerParticipant.description'
      )
    "
  >
    <q-input
      v-model="slideSettings.entriesPerParticipant"
      type="number"
      outlined
      dense
      :min="1"
      :max="10"
      placeholder="1"
      style="width: 87px"
      hide-bottom-space
      :rules="entriesPerParticipantRules"
      @update:model-value="
        () => {
          if (
            isEntriesPerParticipantValid(
              Number(slideSettings.entriesPerParticipant)
            )
          ) {
            $emit('updateSlideSettings');
          }
        }
      "
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
const entriesPerParticipantRules = [
  (val) =>
    isEntriesPerParticipantValid(val) ||
    t(
      "presentationLayout.rightDrawer.tabs.settings.entriesPerParticipant.invalid"
    ),
];

const isEntriesPerParticipantValid = (val) => {
  return val >= 0 && val <= 10;
};
</script>
