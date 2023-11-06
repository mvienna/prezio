<template>
  <!-- title description -->
  <transition
    appear
    enter-active-class="animated fadeInDown"
    leave-active-class="animated fadeOutUp"
  >
    <div
      v-if="hoveredElement && slideSettings?.description"
      ref="tooltip"
      :style="`top: ${
        canvasStore.canvasRect().top +
        canvasStore.computeRealSize(hoveredElement.y) +
        canvasStore.computeRealSize(hoveredElement.height) +
        16
      }px; left: ${
        canvasStore.canvasRect().left +
        canvasStore.computeRealSize(hoveredElement.x) +
        canvasStore.computeRealSize(hoveredElement.width) / 2 -
        tooltipWidth / 2
      }px;`"
      class="tooltip"
    >
      {{ slideSettings.description }}
    </div>
  </transition>

  <!-- words cloud -->
  <PresentationStudioWordsCloud
    v-if="
      slide?.type === SLIDE_TYPES.WORD_CLOUD &&
      slideAnswers?.length &&
      !slideSettings?.isResultsHidden
    "
    :words="slideAnswers"
    :style="isPresentationPreview ? 'z-index: 6001;' : ''"
    @remove-word="handleRemovingAnswer($event)"
  />

  <!-- bar chart -->
  <PresentationAddonsBarChart
    v-if="
      [
        SLIDE_TYPES.TYPE_ANSWER,
        SLIDE_TYPES.PICK_ANSWER,
        SLIDE_TYPES.PICK_IMAGE,
      ].includes(slide?.type) &&
      (!room || (room && room.is_quiz_started && !room.is_submission_locked))
    "
  />
</template>

<script setup>
import { computed, ref } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import PresentationStudioWordsCloud from "components/presentation/addons/PresentationAddonsWordsCloud.vue";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { api } from "boot/axios";
import { useCanvasStore } from "stores/canvas";
import PresentationAddonsBarChart from "components/presentation/addons/PresentationAddonsBarChart.vue";

/*
 * props
 */
defineProps({
  hoveredElement: { type: Object },
});

/*
 * stores
 */
const canvasStore = useCanvasStore();

const presentationsStore = usePresentationsStore();
const { room, slide, slideSettings, isPresentationPreview, participants } =
  storeToRefs(presentationsStore);

/*
 * slide answers
 */
const slideAnswers = computed(() => {
  return (
    slide.value?.answers
      .filter((item) => item.slide_type === slide.value?.type)
      ?.map((item) => {
        return JSON.parse(item.answer_data).text;
      }) || []
  );
});

const handleRemovingAnswer = (text) => {
  const answer = slide.value?.answers?.find((item) => {
    return JSON.parse(item.answer_data).text === text;
  });

  api
    .delete(`/presentation/slide/${slide.value.id}/answer/${answer.id}`)
    .then(() => {
      slide.value.answers = slide.value.answers.filter(
        (item) => item.id !== answer.id
      );
      presentationsStore.updateLocalSlide();
    });
};

/*
 * tooltip
 */
const tooltip = ref();
const tooltipWidth = computed(() => {
  return tooltip.value?.offsetWidth;
});
</script>

<style scoped lang="scss">
.tooltip {
  z-index: 999;
  position: fixed;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.8);
  color: $white;
  border-radius: 8px;
  padding: 8px;
  max-width: 400px;
  font-size: 12px;
}
</style>
