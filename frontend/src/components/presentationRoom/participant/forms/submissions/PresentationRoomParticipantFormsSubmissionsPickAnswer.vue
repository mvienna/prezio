<template>
  <q-form
    v-if="slideSettings"
    :class="`text-${textColor}`"
    style="
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
      overflow-y: scroll;
      max-height: calc(100vh - 96px - 96px);
    "
    class="scroll--hidden"
    @submit.prevent="handleSubmittingAnswers()"
  >
    <!-- waiting for quiz to start -->
    <transition-group appear enter-active-class="animated zoomIn">
      <div v-if="room && !room.is_quiz_started && room.is_submission_locked">
        <div
          class="text-center q-mb-md text-h7 text-semibold"
          :style="`color: ${
            wordCloudTextColors[
              Math.floor(Math.random() * wordCloudTextColors.length)
            ]
          }`"
        >
          {{
            participant?.user_data
              ? JSON.parse(participant.user_data).avatar + " "
              : ""
          }}
          {{
            participant?.user_data ? JSON.parse(participant.user_data).name : ""
          }}
        </div>

        <div class="waiting_for_quiz_start__title">
          {{ $t("presentationRoom.waitingForQuizStart.title") }}
        </div>

        <div class="text-center q-mt-md" style="opacity: 0.7">
          {{ $t("presentationRoom.waitingForQuizStart.description") }}
        </div>
      </div>

      <!-- 5s timeout -->
      <div
        v-else-if="
          room &&
          room.is_quiz_started &&
          room.is_submission_locked &&
          timeLeft !== -1
        "
      >
        <transition-group appear enter-active-class="animated zoomIn">
          <div
            v-if="
              timeLeft > 5 ||
              (presentation.settings.quiz_data &&
                !JSON.parse(presentation.settings.quiz_data).countdown)
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
              <div class="q-mt-sm q-mb-md" style="opacity: 0.5">
                {{
                  $t(
                    "presentationRoom.quizCountdown.scoreDependsOnTime.false.subtitle"
                  )
                }}
              </div>
            </div>
          </div>

          <div v-else-if="timeLeft !== -1">
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
          </div>
        </transition-group>
      </div>

      <!-- answer -->
      <div v-else>
        <!-- question title -->
        <div class="text-h6 text-semibold text-center">
          {{ layoutTitleElement?.text }}
        </div>

        <!-- question description -->
        <div class="text-semibold text-center q-mt-sm q-mb-lg">
          {{ slideSettings.description }}
        </div>

        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <!-- progress bar -->
          <div class="q-pb-md">
            <div class="row no-wrap justify-between q-mb-sm">
              <div>
                {{ slideSettings.points.min }}
                {{ $t("presentationRoom.leaderboard.p") }}
              </div>

              <div>
                {{ slideSettings.points.max }}
                {{ $t("presentationRoom.leaderboard.p") }}
              </div>
            </div>

            <q-linear-progress
              size="xl"
              rounded
              :value="
                participantAnswers?.length
                  ? 1 - timeTakenToAnswerPercentage / 100
                  : 1 - timeLeftPercentage / 100
              "
              style="border: 1px solid rgba(255, 255, 255, 0.1)"
              :color="
                participantAnswers?.length
                  ? timeTakenToAnswerPercentage < 25
                    ? 'positive'
                    : timeTakenToAnswerPercentage < 50
                    ? 'yellow-10'
                    : timeTakenToAnswerPercentage < 75
                    ? 'orange'
                    : 'red'
                  : timeLeftPercentage < 25
                  ? 'positive'
                  : timeLeftPercentage < 50
                  ? 'yellow-10'
                  : timeLeftPercentage < 75
                  ? 'orange'
                  : 'red'
              "
            />

            <!--
participantAnswers
                      .map((answer) => answer.score)
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      )
-->
          </div>
        </transition>

        <!-- answer inputs -->
        <div class="column no-wrap q-gutter-md">
          <q-card
            v-for="(answerOption, answerOptionIndex) in answerOptions"
            :key="answerOptionIndex"
            flat
            :style="`border: 1px solid ${
              answerOption.isSelected
                ? timeLeft !== -1 && !participantAnswers?.length
                  ? 'var(--q-primary)'
                  : answerOption.isCorrect
                  ? 'var(--q-positive)'
                  : 'var(--q-negative)'
                : 'transparent'
            }`"
            class="text-black"
          >
            <q-card-section class="q-py-sm q-px-md">
              <q-checkbox
                v-model="answerOption.isSelected"
                :class="
                  !isAllowedToSelectMultipleAnswerOptions
                    ? 'q-checkbox--round'
                    : ''
                "
                class="full-width"
                :color="
                  timeLeft !== -1 && !participantAnswers?.length
                    ? 'primary'
                    : answerOption.isCorrect
                    ? 'positive'
                    : 'negative'
                "
                :disable="timeLeft === -1 || participantAnswers?.length > 0"
                @update:model-value="
                  () => {
                    if (!isAllowedToSelectMultipleAnswerOptions) {
                      slideSettings.answerOptions =
                        slideSettings.answerOptions.map((item, index) => {
                          if (item.isSelected && index !== answerOptionIndex) {
                            item.isSelected = false;
                          }

                          return item;
                        });
                    }
                  }
                "
              >
                <div class="q-ml-sm">
                  {{ answerOption.value }}
                </div>
              </q-checkbox>
            </q-card-section>
          </q-card>
        </div>

        <!-- submit -->
        <q-btn
          type="submit"
          unelevated
          no-caps
          :disable="
            !!room?.is_submission_locked ||
            timeLeft === -1 ||
            participantAnswers?.length > 0
          "
          :icon-right="
            room?.is_submission_locked || participantAnswers?.length > 0
              ? 'r_lock'
              : 'r_done'
          "
          color="primary"
          class="full-width q-py-md q-mt-md"
          style="position: sticky; bottom: 0"
        >
          <template #default>
            <div class="q-mr-sm">
              {{
                room?.is_submission_locked || participantAnswers?.length > 0
                  ? $t("presentationRoom.answers.submit.submissionIsLocked")
                  : $t("presentationRoom.answers.submit.title")
              }}

              {{
                timeLeft !== -1 && !participantAnswers?.length ? countdown : ""
              }}
            </div>
          </template>
        </q-btn>

        <div
          v-if="timeLeft === -1 && room?.is_submission_locked"
          class="text-center text-semibold text-grey q-mt-md"
        >
          {{ $t("presentationRoom.answers.timesUp") }}
        </div>
      </div>
    </transition-group>
  </q-form>
</template>

<script setup>
import { computed, watch } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";
import {
  countdown,
  stopCountdown,
  timeLeft,
  timeLeftPercentage,
} from "src/helpers/countdown";
import { wordCloudTextColors } from "src/helpers/colorUtils";
import { SLIDE_TYPES_OF_QUIZ } from "src/constants/presentationStudio";
import { shuffleArray } from "src/helpers/arrayUtils";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const {
  presentation,
  room,
  slide,
  slideSettings,
  participant,
  averageBackgroundBrightness,
  backgroundBrightnessThreshold,
} = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

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
 * title
 */
const layoutTitleElement = computed(() => {
  return elements.value?.find((element) => element.id.includes("-title-top-"));
});

/*
 * answer entries
 */
const handleSubmittingAnswers = () => {
  presentationsStore.submitPresentationRoomAnswers(
    slideSettings.value.answerOptions.filter((option) => option.isSelected)
  );
  stopCountdown();
  room.value.is_submission_locked = true;
};

const participantAnswers = computed(() => {
  return slide.value.answers.filter(
    (answer) =>
      answer.participant_id === participant.value?.id &&
      answer.slide_type === slide.value?.type
  );
});

watch(
  () => participantAnswers.value,
  () => {
    slideSettings.value.answerOptions.map((option, index) => {
      if (
        participantAnswers.value
          .map((answer) => JSON.parse(answer.answer_data)?.text)
          .includes(option.value)
      ) {
        slideSettings.value.answerOptions[index].isSelected = true;
      }
    });
  },
  { deep: true }
);

const isAllowedToSelectMultipleAnswerOptions = computed(() => {
  return (
    slideSettings.value.answerOptions.filter((option) => option.isCorrect)
      .length > 1
  );
});

const answerOptions = computed(() => {
  return presentation.value.settings.quiz_data &&
    JSON.parse(presentation.value.settings.quiz_data).shuffleAnswerOptions
    ? shuffleArray(slideSettings.value.answerOptions)
    : slideSettings.value.answerOptions;
});

const timeTakenToAnswerPercentage = computed(() => {
  return (
    (participantAnswers.value?.[0]?.time_taken_to_answer * 100) /
    slideSettings.value?.timeLimit
  );
});
</script>

<style scoped lang="scss">
::v-deep(.q-field__control) {
  background: $white;
  border-radius: 8px;
}

.q-btn.disabled {
  opacity: 1 !important;
  background: $black !important;
}

/*
 * checkmark
 */
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: $green-5;
  fill: $positive;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  margin: 0 auto 16px auto;
  box-shadow: inset 0 0 0 $green-5;
  animation: fill 0.4s ease-in-out 0.4s forwards,
    scale 0.3s ease-in-out 0.9s both;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes scale {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}
@keyframes fill {
  100% {
    box-shadow: inset 0 0 0 30px $green-5;
  }
}

/*
 * checkbox
 */
::v-deep(.q-checkbox--round) {
  .q-checkbox__bg {
    border-radius: 100% !important;
  }

  .q-checkbox__svg {
    padding: 2px;
  }
}

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
