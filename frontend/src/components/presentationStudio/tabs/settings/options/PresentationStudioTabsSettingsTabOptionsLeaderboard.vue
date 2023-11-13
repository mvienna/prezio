<template>
  <div class="text-semibold q-mt-md">
    <div>
      {{ $t("presentationLayout.rightDrawer.tabs.settings.leaderboard.title") }}

      <q-icon name="r_info" class="q-ml-xs" color="grey-8">
        <q-tooltip class="text-center" max-width="200px" :offset="[0, 8]">
          {{
            $t(
              "presentationLayout.rightDrawer.tabs.settings.leaderboard.description"
            )
          }}
        </q-tooltip>
      </q-icon>
    </div>

    <q-btn
      no-caps
      unelevated
      color="grey-3"
      text-color="black"
      :label="
        $t('presentationLayout.rightDrawer.tabs.settings.leaderboard.create')
      "
      icon="r_leaderboard"
      class="q-mt-sm"
      @click="handleAddingLeaderboardSlide()"
    />
  </div>
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
    presentationsStore.updateLocalSlide();
    presentationsStore.saveSlide(undefined, elements.value);
  }

  await presentationsStore.addNewSlide(undefined, SLIDE_TYPES.LEADERBOARD);
  await canvasStore.setElementsFromSlide();

  canvasStore.renderSlidePreview();
  canvasStore.saveSlidePreview();
};
</script>
