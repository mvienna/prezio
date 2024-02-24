<template>
  <!-- title description -->
  <div
    v-if="showTitleTooltip && slideSettings?.description"
    :style="`top: ${mouse.y}px; left: ${mouse.x + 20}px;`"
    class="tooltip text-12"
  >
    {{ slideSettings.description }}
  </div>

  <template v-if="box">
    <!-- words cloud -->
    <PresentationStudioWordCloud
      v-if="
        slide?.type === SLIDE_TYPES.WORD_CLOUD &&
        wordCloudData?.length &&
        !slideSettings?.isResultsHidden
      "
      :box="box"
      :key="'addons__word_cloud__' + slide?.id"
      :words="wordCloudData"
      :style="isPresentationPreview ? 'z-index: 6001;' : ''"
      @remove-word="handleRemovingAnswer($event)"
    />

    <!-- bar chart -->
    <PresentationAddonsBarChart
      v-if="
        SLIDE_TYPES_OF_QUIZ.includes(slide?.type) &&
        (!room ||
          (room &&
            room.is_quiz_started &&
            (!room.is_submission_locked ||
              (room.is_submission_locked && timeLeft === -1))))
      "
      :box="box"
      :key="'addons__bar_chart__' + slide?.id"
      :style="isPresentationPreview ? 'z-index: 6001;' : ''"
      :data="
        [SLIDE_TYPES.PICK_ANSWER, SLIDE_TYPES.PICK_IMAGE].includes(slide?.type)
          ? computeQuizPickAnswerBarChartData()
          : computeQuizTypeAnswerBarChartData()
      "
    />

    <!-- leaderboard -->
    <PresentationAddonsLeaderboard
      v-if="slide?.type === SLIDE_TYPES.LEADERBOARD"
      :key="'addons__leaderboard__' + slide?.id"
      :box="box"
      :style="isPresentationPreview ? 'z-index: 9001;' : ''"
    />
  </template>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import PresentationStudioWordCloud from "components/presentation/addons/PresentationAddonsWordCloud.vue";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import { api } from "boot/axios";
import PresentationAddonsBarChart from "components/presentation/addons/PresentationAddonsBarChart.vue";
import { timeLeft } from "src/helpers/countdown";
import PresentationAddonsLeaderboard from "components/presentation/addons/PresentationAddonsLeaderboard.vue";
import { useI18n } from "vue-i18n";
import { useStudioStore } from "stores/studio";

const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const studioStore = useStudioStore();
const { stages, showTitleTooltip } = storeToRefs(studioStore);

const presentationsStore = usePresentationsStore();
const { room, slide, slideSettings, isPresentationPreview, participants } =
  storeToRefs(presentationsStore);

/*
 * canvas container
 */
const box = ref();
const resizeObserverCanvas = ref();

onMounted(() => {
  box.value = stages.value.default.container().getBoundingClientRect();

  resizeObserverCanvas.value = new ResizeObserver((entries) => {
    for (const entry of entries) {
      box.value = stages.value.default.container().getBoundingClientRect();

      setTimeout(() => {
        box.value = stages.value.default.container().getBoundingClientRect();
      }, 1000);
    }
  });
  resizeObserverCanvas.value.observe(stages.value.default.container());
});

onUnmounted(() => {
  resizeObserverCanvas.value.disconnect();
});

/*
 * tooltip
 */
const mouse = ref({ x: 0, y: 0 });
onBeforeMount(() => {
  document.addEventListener("mousemove", (event) => {
    mouse.value.x = event.clientX;
    mouse.value.y = event.clientY;
  });
});

/*
 * word cloud
 */
const wordCloudData = computed(() => {
  return (
    slide.value?.answers
      ?.filter((item) => item.slide_type === slide.value?.type)
      ?.map((item) => {
        return JSON.parse(item.answer_data).text;
      }) || []
  );
});

const handleRemovingAnswer = (text) => {
  const answers = slide.value?.answers?.filter((item) => {
    return JSON.parse(item.answer_data).text === text;
  });

  answers.forEach(async (answer) => {
    api
      .delete(`/presentation/slide/${slide.value.id}/answer/${answer.id}`)
      .catch((error) => {
        console.log(error);
      });
  });

  slide.value.answers = slide.value?.answers?.filter((item) => {
    return JSON.parse(item.answer_data).text !== text;
  });
  presentationsStore.syncCurrentSlideWithPresentationSlides();
};

/*
 * pick answer
 */
const computeQuizPickAnswerBarChartData = () => {
  return slideSettings.value.answerOptions?.map((option) => {
    if (!slide.value?.answers) {
      return {
        group: "",
        value: 0,
        participants: [],
        isCorrect: option.isCorrect,
        image: "",
      };
    }

    const answers = slide.value.answers?.filter(
      (answer) =>
        JSON.parse(answer.answer_data)?.text === option.value &&
        answer.slide_type === slide.value?.type,
    );

    return {
      group:
        (!room.value || room.value?.is_answers_revealed
          ? option.isCorrect
            ? "✅ "
            : "❌ "
          : "") + option.value,
      value:
        !room.value || room.value?.is_answers_revealed ? answers?.length : 0,
      tooltipData: answers?.map((answer) => {
        if (answer.participant.user_data) {
          const participantData = JSON.parse(answer.participant.user_data);
          return `${participantData.avatar} ${participantData.name}`;
        }
      }),
      isCorrect: option.isCorrect,
      image: option.image,
    };
  });
};

/*
 * type answer
 */
const computeQuizTypeAnswerBarChartData = () => {
  const correctAnswers = slide.value.answers.filter(
    (answer) =>
      answer.slide_type === slide.value?.type &&
      [
        slideSettings.value.correctAnswer.value,
        ...slideSettings.value.otherAcceptedAnswers?.map((item) => item.value),
      ].includes(JSON.parse(answer.answer_data)?.text),
  );

  const incorrectAnswers = slide.value.answers.filter(
    (answer) =>
      answer.slide_type === slide.value?.type &&
      ![
        slideSettings.value.correctAnswer.value,
        ...slideSettings.value.otherAcceptedAnswers?.map((item) => item.value),
      ].includes(JSON.parse(answer.answer_data)?.text),
  );

  return [
    {
      group:
        !room.value || room.value?.is_answers_revealed
          ? slideSettings.value.correctAnswer.value
          : "",
      value:
        !room.value || room.value?.is_answers_revealed
          ? correctAnswers?.length
          : 0,
      tooltipData: correctAnswers?.map((answer) => {
        let participantName = "";

        if (answer.participant.user_data) {
          const participantData = JSON.parse(answer.participant.user_data);
          participantName = `${participantData.avatar} ${participantData.name}`;
        }

        return `${participantName} - ${JSON.parse(answer.answer_data)?.text}`;
      }),
      isCorrect: true,
    },

    {
      group: t("presentationRoom.quiz.typeAnswer.otherAnswers"),
      value:
        !room.value || room.value?.is_answers_revealed
          ? incorrectAnswers?.length
          : 0,
      tooltipData: incorrectAnswers?.map(
        (answer) => JSON.parse(answer.answer_data)?.text,
      ),
      isCorrect: false,
    },
  ];
};
</script>

<style scoped lang="scss">
.tooltip {
  z-index: 999;
  position: fixed;
  background: $white;
  border: 1px solid $grey;
  color: $black;
  border-radius: 6px;
  padding: 6px;
  max-width: 400px;
}
</style>
