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
    <template
      v-if="
        slideSettings.isMultipleEntries ||
        (!slideSettings.isMultipleEntries && participantAnswersCount === 0)
      "
    >
      <!-- question title -->
      <div class="text-h6 text-semibold text-center">
        {{ layoutTitleElement?.text }}
      </div>

      <!-- question description -->
      <div class="text-semibold text-center q-mt-sm q-mb-lg">
        {{ slideSettings.description }}
      </div>
    </template>

    <!-- thanks for participation -->
    <div v-else class="text-h6 text-semibold text-center q-mb-md">
      {{ $t("presentationRoom.answers.thanksForParticipation") }}
    </div>

    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div
        v-if="
          timeLeft !== -1 &&
          (slideSettings.isMultipleEntries ||
            (!slideSettings.isMultipleEntries && participantAnswersCount === 0))
        "
        class="q-pb-md"
      >
        <PresentationRoomQuizProgressBar />
      </div>
    </transition>

    <template
      v-if="
        slideSettings.isMultipleEntries ||
        (!slideSettings.isMultipleEntries && participantAnswersCount === 0)
      "
    >
      <!-- answer inputs -->
      <div class="column no-wrap q-gutter-md">
        <div v-for="n in Number(slideSettings.entriesPerParticipant)" :key="n">
          <q-input
            v-model="answerInputs[n - 1]"
            outlined
            hide-bottom-space
            color="primary"
            :placeholder="$t('presentationRoom.answers.placeholder')"
            :maxlength="25"
            :rules="answerRules"
            reactive-rules
          >
            <template #append>
              <div class="text-caption">
                {{ 25 - (answerInputs[n - 1]?.length || 0) }}
              </div>
            </template>
          </q-input>
        </div>
      </div>

      <!-- submit -->
      <q-btn
        type="submit"
        unelevated
        no-caps
        :disable="!!room?.is_submission_locked"
        :icon-right="room?.is_submission_locked ? 'r_lock' : 'r_done'"
        color="primary"
        class="full-width q-py-md q-mt-md"
        style="position: sticky; bottom: 0"
      >
        <template #default>
          <div class="q-mr-sm">
            {{
              room?.is_submission_locked
                ? $t("presentationRoom.answers.submit.submissionIsLocked")
                : $t("presentationRoom.answers.submit.title")
            }}

            {{ timeLeft !== -1 ? countdown : "" }}
          </div>
        </template>
      </q-btn>
    </template>

    <!-- submitting more answers is disabled -->
    <transition
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
    >
      <div
        v-if="!slideSettings.isMultipleEntries && participantAnswersCount !== 0"
      >
        <svg
          class="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            class="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            class="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>

        <div class="text-center" style="opacity: 0.5">
          {{ $t("presentationRoom.answers.answersSubmittedWait") }}
        </div>
      </div>
    </transition>

    <template
      v-if="
        slideSettings.isMultipleEntries ||
        (!slideSettings.isMultipleEntries && participantAnswersCount === 0)
      "
    >
      <!-- submission is locked, please wait -->
      <div
        v-if="room?.is_submission_locked"
        class="text-center q-mt-md"
        style="opacity: 0.5"
      >
        {{ $t("presentationRoom.answers.waitForSubmissionToBeUnlocked") }}
      </div>

      <!-- multiple entries available -->
      <div
        v-else-if="slideSettings.isMultipleEntries"
        class="text-center q-mt-md"
        style="opacity: 0.5"
      >
        {{ $t("presentationRoom.answers.multipleEntriesAvailable") }}
      </div>
    </template>
  </q-form>
</template>

<script setup>
import { computed, ref } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";
import { countdown, timeLeft } from "src/helpers/countdown";
import { russianProfanityWords } from "src/constants/profanity";
import { useI18n } from "vue-i18n";
import PresentationRoomQuizProgressBar from "components/presentationRoom/participant/quiz/PresentationRoomQuizProgressBar.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const {
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
const answerInputs = ref([]);

const participantAnswersCount = computed(() => {
  return slide.value.answers.filter(
    (answer) =>
      answer.participant_id === participant.value?.id &&
      answer.slide_type === slide.value?.type
  ).length;
});

const handleSubmittingAnswers = () => {
  presentationsStore.submitPresentationRoomAnswers(
    answerInputs.value.map((answer) => ({ value: answer }))
  );
  answerInputs.value = [];
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
</style>
