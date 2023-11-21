<template>
  <transition appear leave-active-class="animated zoomOut">
    <div
      v-if="!isFinished"
      :class="`text-${textColor}`"
      class="absolute-center"
      style="z-index: 2"
    >
      <transition-group appear enter-active-class="animated zoomIn">
        <div
          v-if="
            !isQuizComingToEnd &&
            room.is_submission_locked &&
            timeLeft !== -1 &&
            (timeLeft > 5 ||
              (presentation.settings.quiz_data &&
                !JSON.parse(presentation.settings.quiz_data).countdown))
          "
        >
          <!-- question №n out of x -->
          <div class="text-h3 text-semibold text-center q-mb-md">
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

          <!-- score depends on time + timer icon -->
          <div v-if="slideSettings.scoreDependsOnTime">
            <div class="text-center text-h5">
              {{
                $t(
                  "presentationRoom.quizCountdown.scoreDependsOnTime.true.title"
                )
              }}
            </div>

            <div class="row no-wrap justify-center q-mt-md">
              <q-icon name="r_timer" size="64px" class="timerAnimation" />
            </div>
          </div>

          <!-- score doesn't depend on time -->
          <div v-else class="text-center">
            <div class="text-h5">
              {{
                $t(
                  "presentationRoom.quizCountdown.scoreDependsOnTime.false.title"
                )
              }}
            </div>
            <div class="q-mt-sm" style="opacity: 0.5">
              {{
                $t(
                  "presentationRoom.quizCountdown.scoreDependsOnTime.false.subtitle"
                )
              }}
            </div>
          </div>
        </div>

        <!-- 5s countdown -->
        <div
          v-else-if="
            !isQuizComingToEnd && room.is_submission_locked && timeLeft !== -1
          "
        >
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

          <div class="text-center text-semibold text-h5 q-mt-md">
            {{ countdown }}
          </div>

          <div class="text-center text-semibold q-mt-lg text-no-wrap text-h3">
            {{ $t("presentationRoom.quizCountdown.title") }}
          </div>
        </div>

        <!-- time's out -->
        <div v-else-if="isQuizComingToEnd">
          <div
            v-if="timeLeft > 0 && timeLeft <= 3"
            class="text-center text-semibold text-h3 q-mt-md timeOutCountdownAnimation"
          >
            {{ timeLeft }}
          </div>

          <q-intersection transition="scale" v-else>
            <div class="text-h3 text-center text-semibold">
              {{
                isAllParticipantsAnswered
                  ? $t("presentationRoom.quizCountdown.allParticipantsAnswered")
                  : $t("presentationRoom.quizCountdown.timesup")
              }}
            </div>

            <!-- reveal answers -->
            <div
              v-if="
                !room.is_answers_revealed &&
                presentation?.settings?.quiz_data &&
                JSON.parse(presentation.settings.quiz_data)
                  ?.showAnswersManually === true
              "
              class="row no-wrap justify-center q-mt-md"
            >
              <q-btn
                unelevated
                no-caps
                style="
                  border-radius: 16px;
                  font-size: 1em;
                  transition: 0.2s;
                  height: 46px;
                  background: rgba(0, 0, 0, 0.5);
                  color: white;
                  backdrop-filter: blur(4px);
                "
                label="Показать ответы"
                @click="handleRevealAnswers()"
              />
            </div>
          </q-intersection>
        </div>
      </transition-group>
    </div>
  </transition>
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
  averageBackgroundBrightness,
  backgroundBrightnessThreshold,
} = storeToRefs(presentationsStore);

/*
 * text color
 */
const textColor = computed(() => {
  return averageBackgroundBrightness.value >=
    backgroundBrightnessThreshold.value
    ? "black"
    : "white";
});

/*
 * last 3s before quiz end
 * finish quiz countdown
 */
const isQuizComingToEnd = ref(false);
const isFinished = ref(false);
const isAllParticipantsAnswered = ref(false);

watch(
  () => timeLeft.value,
  () => {
    // timeout
    if (
      timeLeft.value > 0 &&
      timeLeft.value <= 3 &&
      !room.value.is_submission_locked
    ) {
      isQuizComingToEnd.value = true;

      // set "is answers revealed" prop to true if setting is turned on (default setting showAnswersManually: false)
      room.value.is_answers_revealed =
        !presentation.value?.settings?.quiz_data ||
        (presentation.value?.settings?.quiz_data &&
          JSON.parse(presentation.value.settings.quiz_data)
            ?.showAnswersManually === false);

      presentationsStore.sendPresentationRoomUpdateEvent(
        undefined,
        undefined,
        undefined,
        undefined,
        {
          is_answers_revealed: room.value.is_answers_revealed,
        }
      );

      if (timeLeft.value === 1 && room.value.is_answers_revealed) {
        setTimeout(() => {
          isFinished.value = true;
        }, 3000);
      }
    }

    // clear
    if (timeLeft.value > 3) {
      isQuizComingToEnd.value = false;
    }

    // all participants submitted answers
    if (
      timeLeft.value === -1 &&
      room.value.is_submission_locked &&
      room.value.countdown === 0 &&
      !isQuizComingToEnd.value
    ) {
      isQuizComingToEnd.value = true;
      isAllParticipantsAnswered.value = true;

      if (
        !presentation.value?.settings?.quiz_data ||
        (presentation.value?.settings?.quiz_data &&
          JSON.parse(presentation.value.settings.quiz_data)
            ?.showAnswersManually === false)
      ) {
        setTimeout(() => {
          isFinished.value = true;
        }, 3000);
      } else {
        isFinished.value = false;
      }
    }
  }
);

// watch(
//   () => slide.value,
//   () => {
//     console.log("update");
//     isQuizComingToEnd.value = false;
//     isFinished.value = false;
//     isAllParticipantsAnswered.value = false;
//   }
// );

/*
 * reveal answers
 */
const handleRevealAnswers = () => {
  room.value.is_answers_revealed = true;
  isQuizComingToEnd.value = false;
  isFinished.value = true;

  presentationsStore.sendPresentationRoomUpdateEvent(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      is_answers_revealed: room.value.is_answers_revealed,
    }
  );
};
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
  opacity: 0;
  transform: scale(0.8);
}

@keyframes timeOutCountdown {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  20% {
    transform: scale(1.2);
    opacity: 1;
  }
  40% {
    transform: scale(1);
  }
  60% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
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
