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
    <PresentationRoomParticipantQuizLayout
      :layout-title-element="layoutTitleElement"
      :has-already-answered="hasAlreadyAnswered"
    >
      <template #default>
        <!-- question title -->
        <div class="text-h6 text-semibold text-center">
          {{ layoutTitleElement?.text }}
        </div>

        <!-- question description -->
        <div class="text-semibold text-center q-mt-sm q-mb-lg">
          {{ slideSettings.description }}
        </div>

        <!-- progress bar (time left) -->
        <PresentationRoomQuizProgressBar
          :participants-answers="[participantAnswer]"
        />

        <!-- answer input -->
        <q-input
          v-model="answer"
          outlined
          hide-bottom-space
          color="primary"
          :placeholder="$t('presentationRoom.answers.placeholder')"
          :disable="
            !!room?.is_submission_locked ||
            timeLeft === -1 ||
            !!participantAnswer
          "
          :maxlength="25"
          :rules="answerRules"
          reactive-rules
          :class="isAnsweredCorrectly ? 'answer_input--correct' : ''"
        >
          <template #append>
            <q-icon
              v-if="isAnsweredCorrectly"
              class="q-mr-sm"
              name="r_done"
              color="positive"
              size="14px"
            />

            <div class="text-caption">
              {{ 25 - (answer?.length || 0) }}
            </div>
          </template>
        </q-input>

        <!-- revealed results -->
        <div v-if="timeLeft === -1 && room?.is_answers_revealed">
          <!-- correct answer -->
          <div v-if="!isAnsweredCorrectly" class="q-mt-lg">
            <div class="row no-wrap items-center q-mb-sm">
              {{ $t("presentationRoom.answers.correctAnswer.title") }}
            </div>

            <q-card flat bordered>
              <q-card-section class="row no-wrap justify-between items-center">
                <div>
                  {{ slideSettings?.correctAnswer?.value }}
                </div>

                <q-icon color="positive" name="r_done" />
              </q-card-section>
            </q-card>
          </div>

          <!-- other accepted answers -->
          <div class="row no-wrap items-center q-mb-sm q-mt-lg">
            {{ $t("presentationRoom.answers.otherAcceptedAnswers.title") }}
          </div>

          <div class="column no-wrap q-gutter-md">
            <q-card
              v-for="(
                otherAcceptedAnswer, otherAcceptedAnswerIndex
              ) in slideSettings.otherAcceptedAnswers"
              :key="otherAcceptedAnswerIndex"
              flat
              bordered
            >
              <q-card-section class="row no-wrap justify-between items-center">
                <div>
                  {{ otherAcceptedAnswer.value }}
                </div>

                <q-icon color="positive" name="r_done" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- submit -->
        <q-btn
          type="submit"
          unelevated
          no-caps
          :disable="
            !!room?.is_submission_locked ||
            timeLeft === -1 ||
            !!participantAnswer
          "
          :icon-right="
            room?.is_submission_locked || !!participantAnswer
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
                room?.is_submission_locked || !!participantAnswer
                  ? $t("presentationRoom.answers.submit.submissionIsLocked")
                  : $t("presentationRoom.answers.submit.title")
              }}

              {{ timeLeft !== -1 && !participantAnswer ? countdown : "" }}
            </div>
          </template>
        </q-btn>

        <div
          v-if="timeLeft === -1 && room?.is_submission_locked"
          class="text-center text-semibold q-mt-md"
          style="opacity: 0.5"
        >
          {{
            hasAlreadyAnswered
              ? $t("presentationRoom.answers.hasAlreadyAnswered")
              : $t("presentationRoom.answers.thanksForParticipation")
          }}
        </div>

        <!-- footer - result -->
        <transition appear enter-active-class="animated fadeIn">
          <PresentationRoomParticipantQuizFooter
            v-if="participantAnswer && room.is_answers_revealed"
            :class="isAnsweredCorrectly ? 'bg-positive' : 'bg-negative'"
            score-tooltip
          >
            <template #icon>
              <q-icon
                v-if="isAnsweredCorrectly"
                name="icon-olive-branches-award"
                color="white"
                size="36px"
              />

              <q-icon
                v-else
                name="icon-thumb-down-circular"
                color="white"
                size="36px"
                style="transform: rotate(180deg) scaleX(-1)"
              />
            </template>

            <template #message>
              {{
                $t(
                  `presentationRoom.answers.results.${
                    isAnsweredCorrectly ? "correct" : "incorrect"
                  }`
                )
              }}
            </template>

            <template #score>
              +
              {{ participantAnswer?.score }}
            </template>

            <template #score-tooltip>
              {{ participantAnswer?.time_taken_to_answer }}
              {{ $t("presentationRoom.answers.results.sec") }}
            </template>
          </PresentationRoomParticipantQuizFooter>
        </transition>

        <!-- footer - time's up -->
        <transition appear enter-active-class="animated fadeIn">
          <PresentationRoomParticipantQuizFooter
            v-if="
              !participantAnswer &&
              room.is_answers_revealed &&
              room.is_submission_locked &&
              timeLeft === -1
            "
            class="bg-orange"
          >
            <template #icon>
              <q-icon name="r_timer" color="white" size="36px" />
            </template>

            <template #message>
              {{ $t("presentationRoom.answers.results.timesUp") }}
            </template>

            <template #score> + 0 </template>
          </PresentationRoomParticipantQuizFooter>
        </transition>
      </template>
    </PresentationRoomParticipantQuizLayout>
  </q-form>
</template>

<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";
import { countdown, stopCountdown, timeLeft } from "src/helpers/countdown";
import PresentationRoomParticipantQuizLayout from "components/presentationRoom/participant/quiz/PresentationRoomParticipantQuizLayout.vue";
import PresentationRoomQuizProgressBar from "components/presentationRoom/participant/quiz/PresentationRoomQuizProgressBar.vue";
import PresentationRoomParticipantQuizFooter from "components/presentationRoom/participant/quiz/PresentationRoomParticipantQuizFooter.vue";
import { russianProfanityWords } from "src/constants/profanity";

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
 * answer entry
 */
const answer = ref();

const handleSubmittingAnswers = () => {
  presentationsStore.submitPresentationRoomAnswers([{ value: answer.value }]);
  stopCountdown();
};

/*
 * answer rules (length & profanity)
 */
const answerRules = [
  (val) =>
    !val?.length ||
    val?.length <= 25 ||
    t("presentationRoom.answers.errors.invalidLength"),
  (val) =>
    (slideSettings.value?.filterProfanity
      ? !russianProfanityWords.filter((word) => {
          return val.toLowerCase() === word;
        }).length
      : true) || t("presentationRoom.answers.errors.profanity"),
];

/*
 * participant answers
 */
const participantAnswer = computed(() => {
  return slide.value.answers.find(
    (answer) =>
      answer.participant_id === participant.value?.id &&
      answer.slide_type === slide.value?.type
  );
});

/*
 * submitted answers data
 */
const isAnsweredCorrectly = computed(() => {
  if (!participantAnswer.value) {
    return false;
  }

  return (
    [
      slideSettings.value.correctAnswer.value,
      ...slideSettings.value.otherAcceptedAnswers.map((item) => item.value),
    ].includes(JSON.parse(participantAnswer.value.answer_data).text) ||
    JSON.parse(participantAnswer.value.answer_data).is_marked_as_correct
  );
});

/*
 * has already participated
 */
const hasAlreadyAnswered = ref(false);
onBeforeMount(() => {
  if (participantAnswer.value) {
    hasAlreadyAnswered.value = true;
    answer.value = JSON.parse(participantAnswer.value.answer_data).text;
  }
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

::v-deep(.answer_input--correct) {
  .q-field__control:before {
    border-color: $positive !important;
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

::v-deep(.q-checkbox__label) {
  width: 100%;
}
</style>
