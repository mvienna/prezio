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

        <PresentationRoomQuizProgressBar
          :participants-answers="participantAnswers"
        />

        <!-- footer - result -->
        <transition appear enter-active-class="animated fadeIn">
          <PresentationRoomParticipantQuizFooter
            v-if="participantAnswers?.length && room.is_answers_revealed"
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
              {{
                participantAnswers
                  .map((answer) => answer.score)
                  .reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  )
              }}
            </template>

            <template #score-tooltip>
              {{ participantAnswers[0].time_taken_to_answer }}
              {{ $t("presentationRoom.answers.results.sec") }}
            </template>
          </PresentationRoomParticipantQuizFooter>
        </transition>

        <!-- footer - time's up -->
        <transition appear enter-active-class="animated fadeIn">
          <PresentationRoomParticipantQuizFooter
            v-if="
              !participantAnswers?.length &&
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

        <!-- answer inputs -->
        <div class="column no-wrap q-gutter-md">
          <q-card
            v-for="(answerOption, answerOptionIndex) in answerOptions"
            :key="answerOptionIndex"
            flat
            :style="`border: 1px solid ${
              answerOption.isSelected
                ? (timeLeft !== -1 && !participantAnswers?.length) ||
                  !room.is_answers_revealed
                  ? 'var(--q-primary)'
                  : answerOption.isCorrect
                  ? 'var(--q-positive)'
                  : 'var(--q-negative)'
                : 'transparent'
            }`"
            class="text-black"
          >
            <q-card-section class="q-py-sm q-pl-md q-pr-sm">
              <q-checkbox
                v-model="answerOption.isSelected"
                :class="
                  !isAllowedToSelectMultipleAnswerOptions
                    ? 'q-checkbox--round'
                    : ''
                "
                class="full-width"
                :color="
                  (timeLeft !== -1 && !participantAnswers?.length) ||
                  !room.is_answers_revealed
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
                <div class="q-pl-sm row no-wrap items-center">
                  <div>
                    {{ answerOption.value }}
                  </div>

                  <q-space />

                  <div v-if="answerOption.image">
                    <q-img
                      :src="answerOption.image"
                      style="width: 75px; height: 75px; border-radius: 4px"
                    />
                  </div>
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
          class="text-center text-semibold q-mt-md"
          style="opacity: 0.5"
        >
          {{
            hasAlreadyAnswered
              ? $t("presentationRoom.answers.hasAlreadyAnswered")
              : $t("presentationRoom.answers.thanksForParticipation")
          }}
        </div>
      </template>
    </PresentationRoomParticipantQuizLayout>
  </q-form>
</template>

<script setup>
import { computed, onBeforeMount, ref, watch } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";
import { countdown, stopCountdown, timeLeft } from "src/helpers/countdown";
import { shuffleArray } from "src/helpers/arrayUtils";
import PresentationRoomParticipantQuizLayout from "components/presentationRoom/participant/quiz/PresentationRoomParticipantQuizLayout.vue";
import PresentationRoomQuizProgressBar from "components/presentationRoom/participant/quiz/PresentationRoomQuizProgressBar.vue";
import PresentationRoomParticipantQuizFooter from "components/presentationRoom/participant/quiz/PresentationRoomParticipantQuizFooter.vue";

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
};

const answerOptions = computed(() => {
  return presentation.value.settings.quiz_data &&
    JSON.parse(presentation.value.settings.quiz_data).shuffleAnswerOptions
    ? shuffleArray(slideSettings.value.answerOptions)
    : slideSettings.value.answerOptions;
});

/*
 * participant answers
 */
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

/*
 * submitted answers data
 */
const isAnsweredCorrectly = computed(() => {
  return (
    participantAnswers.value?.filter((answer) =>
      answerOptions.value
        ?.filter((item) => !item.isCorrect)
        ?.map((item) => item.value)
        ?.includes(JSON.parse(answer.answer_data).text)
    ).length === 0
  );
});

/*
 * has already participated
 */
const hasAlreadyAnswered = ref(false);
onBeforeMount(() => {
  if (participantAnswers.value.length) {
    hasAlreadyAnswered.value = true;
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
