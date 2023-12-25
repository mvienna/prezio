<template>
  <q-btn
    no-caps
    outline
    color="background"
    text-color="primary"
    style="width: calc(50% - 8px)"
    @click="handleAddingLeaderboardSlide()"
  >
    <q-icon name="r_insert_chart" size="32px" class="q-my-sm" />

    <div class="text-center q-mb-sm" style="line-height: 1.4">
      {{
        $t("presentationLayout.rightDrawer.tabs.settings.leaderboard.create")
      }}
    </div>
  </q-btn>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { deselectElement } from "stores/canvas/helpers/select";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { useCanvasStore } from "stores/canvas";

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

  await presentationsStore.addNewSlide(
    undefined,
    undefined,
    SLIDE_TYPES.LEADERBOARD
  );
  await canvasStore.setElementsFromSlide();

  canvasStore.renderSlidePreview();
  canvasStore.saveSlidePreview();
};
</script>
