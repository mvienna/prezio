<template>
  <div :class="`text-${textColor}`" class="absolute-center" style="z-index: 2">
    <transition-group appear enter-active-class="animated zoomIn">
      <div
        v-if="
          !stage &&
          room.is_submission_locked &&
          timeLeft !== -1 &&
          (timeLeft > 5 ||
            (presentation.settings.quiz_data &&
              !JSON.parse(presentation.settings.quiz_data).countdown))
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
              $t("presentationRoom.quizCountdown.scoreDependsOnTime.true.title")
            }}
          </div>
          <div class="row no-wrap justify-center q-mt-md">
            <q-icon name="r_timer" size="48px" class="timerAnimation" />
          </div>
        </div>

        <div v-else class="text-center">
          <div class="text-h6">
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

      <div v-else-if="!stage && room.is_submission_locked && timeLeft !== -1">
        <div class="row no-wrap justify-center">
          <q-circular-progress
            :value="
              timeLeftPercentage * 2 + 20 - 100 < 100
                ? timeLeftPercentage * 2 + 20 - 100
                : 100
            "
            size="64px"
            :thickness="1"
            :color="
              timeLeftPercentage * 2 - 100 + 20 < 25
                ? 'positive'
                : timeLeftPercentage * 2 - 100 + 20 < 50
                ? 'yellow-10'
                : timeLeftPercentage * 2 - 100 + 20 < 75
                ? 'orange'
                : 'red'
            "
            track-color="white"
          />
        </div>

        <div class="text-center text-semibold text-h7 q-mt-md">
          {{ countdown }}
        </div>

        <div class="text-center text-semibold q-mt-sm text-no-wrap text-h6">
          {{ $t("presentationRoom.quizCountdown.title") }}
        </div>
      </div>

      <div v-else-if="stage">
        <div
          v-if="timeLeft !== -1"
          class="text-center text-semibold text-h4 q-mt-md timeOutCountdownAnimation"
        >
          {{ timeLeft }}
        </div>

        <q-intersection transition="scale" v-else class="text-h6 text-semibold">
          Время вышло
        </q-intersection>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { countdown, timeLeft, timeLeftPercentage } from "src/helpers/countdown";
import { SLIDE_TYPES_OF_QUIZ } from "src/constants/presentationStudio";

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { canvas } = storeToRefs(canvasStore);

const presentationsStore = usePresentationsStore();
const {
  room,
  slide,
  presentation,
  slideSettings,
  participants,
  averageRoomBackgroundBrightness,
  backgroundBrightnessThreshold,
} = storeToRefs(presentationsStore);

/*
 * text color
 */
const textColor = computed(() => {
  return averageRoomBackgroundBrightness.value >=
    backgroundBrightnessThreshold.value
    ? "black"
    : "white";
});

/*
 *
 */
const stage = ref();
watch(
  () => timeLeft.value,
  () => {
    if (
      timeLeft.value >= 0 &&
      timeLeft.value <= 3 &&
      !room.value.is_submission_locked
    ) {
      stage.value = true;
    }
  }
);
</script>

<style lang="scss">
.quiz_countdown__title {
  z-index: 2;
  font-size: 2em;
  font-weight: 600;
  text-align: center;
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  from {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.25);
  }
  to {
    transform: translate(-50%, -50%) scale(1);
  }
}

/*
 * 3s left countdown
 */
.timeOutCountdownAnimation {
  animation: timeOutCountdown 1s infinite ease-in-out;
  opacity: 1;
  transform: scale(1);
}

@keyframes timeOutCountdown {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  33% {
    transform: scale(0.8);
    opacity: 0;
  }
  66% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

/*
 * timer icon animation
 */
.timerAnimationAnimation {
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
