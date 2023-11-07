<template>
  <q-btn
    flat
    icon="r_sports_score"
    no-caps
    :label="$t('presentationRoom.footer.menu.finishQuiz.title')"
    class="q-ml-sm"
    @click="finishQuiz()"
  >
  </q-btn>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room } = storeToRefs(presentationsStore);

/*
 * finish quiz
 */
const finishQuiz = () => {
  room.value.is_quiz_started = false;
  room.value.is_submission_locked = true;

  presentationsStore.sendPresentationRoomUpdateEvent(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      is_quiz_started: room.value.is_quiz_started,
      is_submission_locked: room.value.is_submission_locked,
      countdown: 0,
    }
  );
};
</script>
