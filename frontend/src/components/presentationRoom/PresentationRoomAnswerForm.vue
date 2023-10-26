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
    <!-- question title -->
    <div class="text-h6 text-semibold text-center">
      {{ layoutTitleElement?.text }}
    </div>

    <!-- question description -->
    <div class="text-semibold text-center q-mt-sm q-mb-lg">
      {{ slideSettings.description }}
    </div>

    <q-slide-transition>
      <div v-if="timeLeft" class="q-pb-md">
        <q-linear-progress
          size="xl"
          rounded
          :value="1 - timeLeftPercentage / 100"
          :color="
            timeLeftPercentage < 25
              ? 'positive'
              : timeLeftPercentage < 50
              ? 'yellow-10'
              : timeLeftPercentage < 75
              ? 'orange'
              : 'red'
          "
        />
      </div>
    </q-slide-transition>

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
            :rules="[
              (val) =>
                !val?.length ||
                val?.length <= 25 ||
                $t('presentationRoom.answers.invalidLength'),
            ]"
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
        :disable="slideSettings.isSubmissionLocked"
        :icon-right="slideSettings.isSubmissionLocked ? 'r_lock' : 'r_done'"
        color="primary"
        class="full-width q-py-md q-mt-md"
        style="position: sticky; bottom: 0"
      >
        <template #default>
          <div class="q-mr-sm">
            {{
              slideSettings.isSubmissionLocked
                ? $t("presentationRoom.answers.submit.submissionIsLocked")
                : $t("presentationRoom.answers.submit.title")
            }}

            {{ timeLeft ? countdown : "" }}
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

        <div class="text-center" style="opacity: 0.7">
          {{ $t("presentationRoom.answers.answersSubmittedWait") }}
        </div>
      </div>
    </transition>

    <!-- submission is locked, please wait -->
    <div
      v-if="slideSettings.isSubmissionLocked"
      class="text-center q-mt-md"
      style="opacity: 0.7"
    >
      {{ $t("presentationRoom.answers.waitForSubmissionToBeUnlocked") }}
    </div>

    <!-- multiple entries available -->
    <div
      v-else-if="slideSettings.isMultipleEntries"
      class="text-center q-mt-md"
      style="opacity: 0.7"
    >
      {{ $t("presentationRoom.answers.multipleEntriesAvailable") }}
    </div>
  </q-form>
</template>

<script setup>
import { computed, onBeforeMount, ref, watch } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";
import {
  countdown,
  startCountdown,
  stopCountdown,
  timeLeft,
  timeLeftPercentage,
} from "src/helpers/countdown";

/*
 * props
 */
defineProps({
  textColor: { type: String, default: "white" },
});

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slide, slideSettings, participant } = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

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
    (answer) => answer.participant_id === participant.value?.id
  ).length;
});

const handleSubmittingAnswers = () => {
  presentationsStore.submitPresentationRoomAnswers(answerInputs.value);
  answerInputs.value = [];
};

watch(
  () => slideSettings.value,
  () => {
    if (slideSettings.value) {
      check();
    } else {
      stopCountdown();
    }
  },
  { deep: true }
);

onBeforeMount(() => {
  if (slideSettings.value) {
    check();
  }
});

const check = () => {
  if (
    !slideSettings.value.isSubmissionLocked &&
    slideSettings.value.isLimitedTime
  ) {
    startCountdown(slideSettings.value.timeLimit);
  } else {
    stopCountdown();
  }
};
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
</style>
