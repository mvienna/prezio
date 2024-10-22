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
                SLIDE_TYPES_OF_QUIZ.includes(item.type),
              ).length
            }}
          </div>

          <!-- score depends on time + timer icon -->
          <div v-if="slideSettings.scoreDependsOnTime">
            <div class="text-center text-h5">
              {{
                $t(
                  "presentationRoom.quizCountdown.scoreDependsOnTime.true.title",
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
                  "presentationRoom.quizCountdown.scoreDependsOnTime.false.title",
                )
              }}
            </div>
            <div class="q-mt-sm" style="opacity: 0.5">
              {{
                $t(
                  "presentationRoom.quizCountdown.scoreDependsOnTime.false.subtitle",
                )
              }}
            </div>
          </div>
        </div>

        <!-- 5s countdown -->
        <div
          v-else-if="
            !isQuizComingToEnd && room.is_submission_locked && timeLeft >= 0
          "
        >
          <div class="row no-wrap justify-center">
            <q-circular-progress
              :value="timeLeftPercentage * 2 - 100"
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
            v-if="timeLeft >= 0 && timeLeft <= 3"
            class="text-center text-semibold text-h3 q-mt-md timeOutCountdownAnimation"
          >
            {{ Math.floor(timeLeft) + 1 }}
          </div>

          <q-intersection transition="scale" v-else>
            <!-- all participants answered / time's up -->
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
                class="rounded-md text-16"
                style="
                  transition: 0.2s;
                  height: 46px;
                  background: rgba(0, 0, 0, 0.5);
                  color: white;
                  backdrop-filter: blur(4px);
                "
                :label="$t('presentationRoom.quizCountdown.revealResults')"
                @click="handleRevealAnswers()"
              />
            </div>
          </q-intersection>
        </div>
      </transition-group>
    </div>

    <div
      v-else-if="
        slide?.type === SLIDE_TYPES.TYPE_ANSWER && otherAnswersToAccept?.length
      "
      :class="`text-${textColor}`"
      class="quiz_countdown__finished"
    >
      <div class="row no-wrap justify-center items-center">
        <q-btn
          unelevated
          no-caps
          :label="$t('presentationRoom.quizCountdown.acceptMoreAnswers')"
          :class="$q.screen.lt.md ? 'q-px-lg' : 'q-px-xl'"
          :style="$q.screen.lt.md ? 'height: 50px' : 'height: 62px'"
          :size="$q.screen.lt.md ? '10px' : '14px'"
          @click="showAcceptOtherAnswersDialog = true"
        />
      </div>
    </div>
  </transition>

  <!-- accept other answers dialog -->
  <q-dialog v-model="showAcceptOtherAnswersDialog">
    <PresentationRoomHostQuizCountdownAcceptOtherAnswers
      :answers="otherAnswersToAccept"
      @cancel="showAcceptOtherAnswersDialog = false"
    />
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { countdown, timeLeft, timeLeftPercentage } from "src/helpers/countdown";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import PresentationRoomHostQuizCountdownAcceptOtherAnswers from "components/presentationRoom/host/quiz/PresentationRoomHostQuizCountdownAcceptOtherAnswers.vue";
import { COLOR_SCHEME_OPTIONS } from "src/constants/canvas/canvasVariables";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, slide, presentation, slideSettings, participants } =
  storeToRefs(presentationsStore);

/*
 * text color
 */
const textColor = computed(() => {
  return slide.value?.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
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
      timeLeft.value >= 0 &&
      timeLeft.value <= 3 &&
      !room.value.is_submission_locked
    ) {
      isQuizComingToEnd.value = true;

      if (timeLeft.value === 1) {
        setTimeout(() => {
          // set "is answers revealed" prop to true if setting is turned on (default setting showAnswersManually: false)
          const is_answers_revealed =
            !presentation.value?.settings?.quiz_data ||
            (presentation.value?.settings?.quiz_data &&
              JSON.parse(presentation.value.settings.quiz_data)
                ?.showAnswersManually === false);

          if (is_answers_revealed) {
            presentationsStore.updateRoom(undefined, undefined, {
              is_answers_revealed: true,
            });

            isFinished.value = true;
          }
        }, 4000);
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
        }, 2000);
      } else {
        isFinished.value = false;
      }
    }
  },
);

/*
 * reveal answers
 */
const handleRevealAnswers = () => {
  isQuizComingToEnd.value = false;
  isFinished.value = true;

  presentationsStore.updateRoom(undefined, undefined, {
    is_answers_revealed: true,
  });
};

/*
 * accept other answers
 * for type "type_answer"
 */
const showAcceptOtherAnswersDialog = ref(false);

const otherAnswersToAccept = computed(() => {
  if (slide.value?.type !== SLIDE_TYPES.TYPE_ANSWER) return [];

  return slide.value.answers
    .map((answer) => {
      return {
        ...answer,
        answer_data: JSON.parse(answer.answer_data),
        participant: {
          ...answer.participant,
          user_data: JSON.parse(answer.participant.user_data),
        },
      };
    })
    .filter(
      (answer) =>
        answer.slide_type === slide.value?.type &&
        ![
          slideSettings.value.correctAnswer.value,
          ...slideSettings.value.otherAcceptedAnswers.map((item) => item.value),
        ].includes(answer.answer_data.text),
    );
});
</script>

<style lang="scss">
//.quiz_countdown__title {
//  z-index: 2;
//  font-size: 2em;
//  font-weight: 600;
//  text-align: center;
//  animation: pulse 2s infinite ease-in-out;
//}

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

/*
 * finished footer
 */
.quiz_countdown__finished {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: 24px;
  transform: translate(-50%, 0);

  .q-btn {
    border-radius: 24px;
    background: rgba(0, 0, 0, 0.5);
    color: $white;
    backdrop-filter: blur(4px);
  }
}

@media screen and (max-width: 1023px) {
  .waiting_for_participants__footer {
    bottom: 8px;
  }
}
</style>
