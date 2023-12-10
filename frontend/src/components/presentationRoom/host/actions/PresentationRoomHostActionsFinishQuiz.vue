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
import { timeLeft } from "src/helpers/countdown";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, presentation } = storeToRefs(presentationsStore);

/*
 * finish quiz
 */
const finishQuiz = () => {
  presentationsStore.updateRoom(undefined, undefined, {
    countdown: 3,
  });
};
</script>
