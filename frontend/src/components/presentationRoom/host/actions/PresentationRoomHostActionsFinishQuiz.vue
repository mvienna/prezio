<template>
  <q-btn
    flat
    icon="r_sports_score"
    no-caps
    :label="$t('presentationRoom.footer.finishQuiz.title')"
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
const { room, presentation } = storeToRefs(presentationsStore);

/*
 * finish quiz
 */
const finishQuiz = () => {
  room.value.is_submission_locked = true;
  room.value.is_answers_revealed =
    !presentation.value?.settings?.quiz_data ||
    (presentation.value?.settings?.quiz_data &&
      JSON.parse(presentation.value.settings.quiz_data)?.showAnswersManually ===
        false);

  presentationsStore.sendPresentationRoomUpdateEvent(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      is_submission_locked: room.value.is_submission_locked,
      is_answers_revealed: room.value.is_answers_revealed,
      countdown: 0,
    }
  );
};
</script>
