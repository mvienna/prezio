<template>
  <div :class="`text-${textColor}`" class="absolute-center" style="z-index: 2">
    <template
      v-if="
        room.is_quiz_started && room.is_submission_locked && timeLeft !== -1
      "
    >
      <template
        v-if="
          timeLeft > 5 ||
          (presentation.settings.quiz_data &&
            !JSON.parse(presentation.settings.quiz_data).countdown)
        "
      >
        <div class="text-h6 text-semibold text-center">
          {{ $t("presentationRoom.quizCountdown.questionIndex.title") }}
          {{
            presentation.slides
              .filter((item) =>
                [
                  SLIDE_TYPES.PICK_IMAGE,
                  SLIDE_TYPES.PICK_ANSWER,
                  SLIDE_TYPES.TYPE_ANSWER,
                ].includes(item.type)
              )
              .findIndex((item) => item.id === slide.id) + 1
          }}
          {{ $t("presentationRoom.quizCountdown.questionIndex.outOf") }}
          {{
            presentation.slides.filter((item) =>
              [
                SLIDE_TYPES.PICK_IMAGE,
                SLIDE_TYPES.PICK_ANSWER,
                SLIDE_TYPES.TYPE_ANSWER,
              ].includes(item.type)
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
            <q-icon name="r_timer" size="48px" />
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
      </template>

      <template v-else>
        <div class="row no-wrap justify-center">
          <q-circular-progress
            :value="timeLeftPercentage"
            size="64px"
            :thickness="1"
            :color="
              timeLeftPercentage < 25
                ? 'positive'
                : timeLeftPercentage < 50
                ? 'yellow-10'
                : timeLeftPercentage < 75
                ? 'orange'
                : 'red'
            "
            track-color="white"
          />
        </div>

        <div class="text-center text-semibold text-h7 q-mt-md">
          {{ countdown }}
        </div>

        <div class="text-center text-no-wrap">
          {{ $t("presentationRoom.quizCountdown.title") }}
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { countdown, timeLeft, timeLeftPercentage } from "src/helpers/countdown";
import { SLIDE_TYPES } from "src/constants/presentationStudio";

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
  roomBackgroundBrightnessThreshold,
} = storeToRefs(presentationsStore);

/*
 * text color
 */
const textColor = computed(() => {
  return averageRoomBackgroundBrightness.value >=
    roomBackgroundBrightnessThreshold.value
    ? "white"
    : "black";
});
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
</style>
