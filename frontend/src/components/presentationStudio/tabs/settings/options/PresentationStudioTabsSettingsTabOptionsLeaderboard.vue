<template>
  <PresentationStudioTabsSettingsTabOptionLayout
    icon="icon-leaderboard"
    :label="
      $t('presentationLayout.rightDrawer.tabs.settings.leaderboard.title')
    "
    :tooltip="
      $t('presentationLayout.rightDrawer.tabs.settings.leaderboard.description')
    "
  >
    <div class="link text-primary" @click="handleAddingLeaderboardSlide()">
      {{
        $t("presentationLayout.rightDrawer.tabs.settings.leaderboard.create")
      }}
    </div>
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

/*
 * add leaderboard slide
 */
const handleAddingLeaderboardSlide = async () => {
  const newSlide = await presentationsStore.addNewSlide({
    type: SLIDE_TYPES.LEADERBOARD,
  });
  await presentationsStore.setSlide(newSlide);
};
</script>
