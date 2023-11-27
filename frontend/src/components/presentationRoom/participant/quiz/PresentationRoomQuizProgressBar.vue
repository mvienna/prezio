<template>
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
    </div>
  </transition>
</template>

<script setup>
import { timeLeftPercentage } from "src/helpers/countdown";
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
    slideSettings.value?.timeLimit
  );
});
</script>
