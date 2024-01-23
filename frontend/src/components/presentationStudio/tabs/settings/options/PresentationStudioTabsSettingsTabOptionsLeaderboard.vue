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
import { deselectElement } from "stores/canvas/helpers/select";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { useCanvasStore } from "stores/canvas";
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

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

/*
 * add leaderboard slide
 */
const handleAddingLeaderboardSlide = async () => {
  if (slide.value) {
    canvasStore.saveSlidePreview();
    deselectElement();

    slide.value.canvas_data = JSON.stringify(elements.value);
    presentationsStore.syncCurrentSlideWithPresentationSlides();
    presentationsStore.saveSlide(undefined, elements.value);
  }

  const newSlide = await presentationsStore.addNewSlide({
    type: SLIDE_TYPES.LEADERBOARD,
  });
  // TODO: set new slide
  await canvasStore.setElementsFromSlide();

  canvasStore.renderSlidePreview();
  canvasStore.saveSlidePreview();
};
</script>
