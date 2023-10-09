<template>
  <!-- words cloud -->
  <PresentationStudioWordsCloud
    v-if="slide?.type === SLIDE_TYPES.WORD_CLOUD"
    :words="slideAnswers"
    @remove-word="handleRemovingAnswer($event)"
  />
</template>

<script setup>
import { computed } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import PresentationStudioWordsCloud from "components/presentationStudio/addons/PresentationStudioWordsCloud.vue";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { api } from "boot/axios";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slide } = storeToRefs(presentationsStore);

/*
 * slide answers
 */
const slideAnswers = computed(() => {
  return slide.value?.answers?.map((item) => {
    return JSON.parse(item.answer_data).text;
  });
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
</script>
