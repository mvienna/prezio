<template>
  <transition-group appear enter-active-class="animated zoomIn">
    <!-- waiting for quiz to start -->
    <div v-if="room && !room.is_quiz_started && room.is_submission_locked">
      <div
        class="text-center q-mb-md text-16 text-semibold"
        :style="participantData ? `color: ${participantData.color}` : ''"
      >
        {{ participantData.avatar + " " + participantData.name }}
      </div>

      <div class="waiting_for_quiz_start__title">
        {{ $t("presentationRoom.waitingForQuizStart.title") }}
      </div>

      <div class="text-center q-mt-md" style="opacity: 0.5">
        {{ $t("presentationRoom.waitingForQuizStart.description") }}
      </div>
    </div>

    <!-- before-quiz timeout-->
    <div
      v-else-if="
        (room &&
          room.is_quiz_started &&
          room.is_submission_locked &&
          timeLeft !== -1) ||
        (hasAlreadyAnswered && !room.is_answers_revealed)
      "
    >
      <transition-group appear enter-active-class="animated zoomIn">
        <!-- already answered -->
        <div v-if="hasAlreadyAnswered">
          <div class="row justify-center">
            <q-avatar size="128px">
              {{ participantData.avatar }}
            </q-avatar>
          </div>

          <div class="text-h6 text-semibold text-center">
            {{ $t("presentationRoom.quizCountdown.hasAlreadyAnswered.title") }}
          </div>

          <div class="text-center" style="opacity: 0.7">
            {{
              $t(
                "presentationRoom.quizCountdown.hasAlreadyAnswered.description"
              )
            }}
          </div>
        </div>

        <!-- question №n out of x -->
        <div
          v-else-if="
            timeLeft > 5 ||
            (presentation.settings.quiz_data &&
              !JSON.parse(presentation.settings.quiz_data).countdown)
          "
        >
          <div class="text-h6 text-semibold text-center">
            {{ $t("presentationRoom.quizCountdown.questionIndex.title") }}
            {{
              presentation.slides
                .filter((item) => SLIDE_TYPES_OF_QUIZ.includes(item.type))
                .findIndex((item) => item.id === slide.id) + 1
            }}
            {{ $t("presentationRoom.quizCountdown.questionIndex.outOf") }}
            {{
              presentation.slides.filter((item) =>
                SLIDE_TYPES_OF_QUIZ.includes(item.type)
              ).length
            }}
          </div>

          <div v-if="slideSettings.scoreDependsOnTime">
            <div class="text-center">
              {{
                $t(
                  "presentationRoom.quizCountdown.scoreDependsOnTime.true.title"
                )
              }}
            </div>
            <div class="row no-wrap justify-center q-mt-md">
              <q-icon name="r_timer" size="48px" class="timerAnimation" />
            </div>
          </div>

          <div v-else class="text-center">
            <div>
              {{
                $t(
                  "presentationRoom.quizCountdown.scoreDependsOnTime.false.title"
                )
              }}
            </div>
            <div class="text-grey q-mt-xs">
              {{
                $t(
                  "presentationRoom.quizCountdown.scoreDependsOnTime.false.subtitle"
                )
              }}
            </div>
          </div>
        </div>

        <!-- 5s countdown -->
        <div v-else-if="timeLeft !== -1">
          <!-- question title -->
          <div class="text-h6 text-semibold text-center q-mb-lg">
            {{ layoutTitleElement?.text }}
          </div>

          <div class="row no-wrap justify-center">
            <q-circular-progress
              :value="
                timeLeftPercentage * 2 === 0
                  ? 100
                  : timeLeftPercentage * 2 - 100
              "
              size="64px"
              :thickness="1"
              :color="
                timeLeftPercentage * 2 - 100 < 25
                  ? 'positive'
                  : timeLeftPercentage * 2 - 100 < 50
                  ? 'yellow-10'
                  : timeLeftPercentage * 2 - 100 < 75
                  ? 'orange'
                  : 'red'
              "
              track-color="white"
            />
          </div>

          <div class="text-center text-semibold text-16 q-mt-md">
            {{ countdown }}
          </div>
        </div>
      </transition-group>
    </div>

    <!-- default -->
    <div v-else>
      <slot name="default" />
    </div>
  </transition-group>
</template>

<script setup>
import { countdown, timeLeft, timeLeftPercentage } from "src/helpers/countdown";
import { SLIDE_TYPES_OF_QUIZ } from "src/constants/presentationStudio";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";
import { usePresentationsStore } from "stores/presentations";
import { computed } from "vue";

/*
 * variables
 */
defineProps({
  layoutTitleElement: { type: Object, default: null },
  hasAlreadyAnswered: { type: Boolean },
});

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, room, slide, slideSettings, participant } =
  storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

/*
 * participant data
 */
const participantData = computed(() => {
  return participant.value?.user_data
    ? JSON.parse(participant.value.user_data)
    : {};
});
</script>

<style scoped lang="scss">
/*
 * waiting for quiz start
 */
.waiting_for_quiz_start__title {
  z-index: 2;
  font-size: 2em;
  font-weight: 600;
  text-align: center;
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  from {
    transform: scale(1);
  }
  50% {
    transform: scale(1.25);
  }
  to {
    transform: scale(1);
  }
}

/*
 * timer icon animation
 */
.timerAnimation {
  animation: timerAnimation 0.7s ease-in-out;
  animation-delay: 2s;
}

@keyframes timerAnimation {
  0% {
    transform: scale(1) rotate(0);
  }
  20% {
    transform: scale(1.2) rotate(0);
  }
  40% {
    transform: scale(1.2) rotate(-15deg);
  }
  60% {
    transform: scale(1.2) rotate(15deg);
  }
  80% {
    transform: scale(1.2) rotate(0);
  }
  100% {
    transform: scale(1) rotate(0);
  }
}
</style>
