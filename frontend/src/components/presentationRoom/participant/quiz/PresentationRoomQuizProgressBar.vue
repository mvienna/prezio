<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <!-- progress bar -->
    <div class="q-pb-md">
      <div
        v-if="slideSettings.points.min && slideSettings.points.max"
        class="row no-wrap justify-between q-mb-sm"
      >
        <div>
          {{ slideSettings.points.min }}
          {{ $t("presentationRoom.leaderboard.p") }}
        </div>

        <div>
          {{ slideSettings.points.max }}
          {{ $t("presentationRoom.leaderboard.p") }}
        </div>
      </div>

      <div
        class="relative-position bg-grey-2 rounded-borders"
        style="width: 100%; height: 12px"
      >
        <div
          style="height: 100%; transition: 1s"
          class="absolute"
          :style="`width: ${
            100 -
            (participantAnswers?.length
              ? timeTakenToAnswerPercentage
              : timeLeft !== -1
              ? Math.round(timeLeftPercentage / 10) * 10
              : 100)
          }%`"
          :class="`rounded-borders bg-${
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
          }`"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { timeLeft, timeLeftPercentage } from "src/helpers/countdown";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";

/*
 * variables
 */
const props = defineProps({
  participantAnswers: { type: Array, default: null },
});

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings } = storeToRefs(presentationsStore);

/*
 * time taken to answer %
 */
const timeTakenToAnswerPercentage = computed(() => {
  return (
    (props.participantAnswers?.[0]?.time_taken_to_answer * 100) /
    Number(slideSettings.value?.timeLimit)
  );
});
</script>
