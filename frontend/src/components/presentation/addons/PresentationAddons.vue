<template>
  <!-- todo: title description -->
  <!-- title description -->
  <!--  <transition-->
  <!--    appear-->
  <!--    enter-active-class="animated fadeInDown"-->
  <!--    leave-active-class="animated fadeOutUp"-->
  <!--  >-->
  <!--    <div-->
  <!--      v-if="hoveredElement && slideSettings?.description"-->
  <!--      ref="tooltip"-->
  <!--      :style="`top: ${-->
  <!--        canvasStore.canvasRect().top +-->
  <!--        canvasStore.computeRealSize(hoveredElement.y) +-->
  <!--        canvasStore.computeRealSize(hoveredElement.height) +-->
  <!--        16-->
  <!--      }px; left: ${-->
  <!--        canvasStore.canvasRect().left +-->
  <!--        canvasStore.computeRealSize(hoveredElement.x) +-->
  <!--        canvasStore.computeRealSize(hoveredElement.width) / 2 - -->
  <!--        tooltipWidth / 2-->
  <!--      }px;`"-->
  <!--      class="tooltip text-12"-->
  <!--    >-->
  <!--      {{ slideSettings.description }}-->
  <!--    </div>-->
  <!--  </transition>-->

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
import { computed, onMounted, onUnmounted, ref } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import PresentationStudioWordCloud from "components/presentation/addons/PresentationAddonsWordCloud.vue";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import { api } from "boot/axios";
import { useCanvasStore } from "stores/canvas";
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
const { stages } = storeToRefs(studioStore);

const presentationsStore = usePresentationsStore();
const { room, slide, slideSettings, isPresentationPreview, participants } =
  storeToRefs(presentationsStore);

/*
 * resize
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
 * slide answers
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
 * tooltip
 */
const tooltip = ref();
const tooltipWidth = computed(() => {
  return tooltip.value?.offsetWidth;
});

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

    const answers = slide.value.answers.filter(
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
        !room.value || room.value?.is_answers_revealed ? answers.length : 0,
      tooltipData: answers.map((answer) => {
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

const computeQuizTypeAnswerBarChartData = () => {
  const correctAnswers = slide.value.answers.filter(
    (answer) =>
      answer.slide_type === slide.value?.type &&
      [
        slideSettings.value.correctAnswer.value,
        ...slideSettings.value.otherAcceptedAnswers.map((item) => item.value),
      ].includes(JSON.parse(answer.answer_data)?.text),
  );

  const incorrectAnswers = slide.value.answers.filter(
    (answer) =>
      answer.slide_type === slide.value?.type &&
      ![
        slideSettings.value.correctAnswer.value,
        ...slideSettings.value.otherAcceptedAnswers.map((item) => item.value),
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
          ? correctAnswers.length
          : 0,
      tooltipData: correctAnswers.map((answer) => {
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
          ? incorrectAnswers.length
          : 0,
      tooltipData: incorrectAnswers.map(
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
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.8);
  color: $white;
  border-radius: 8px;
  padding: 8px;
  max-width: 400px;
}
</style>
