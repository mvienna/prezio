<template>
  <q-card class="accept_other_answers" flat bordered>
    <div class="row no-wrap justify-between items-center q-px-md q-pt-md">
      <div class="text-h6">Другие ответы</div>
      <q-btn
        flat
        color="grey"
        round
        size="10px"
        icon="r_close"
        class="round-borders"
        @click="$emit('cancel')"
      />
    </div>

    <q-card-section>
      <q-card
        v-for="(answer, index) in answers"
        :key="answer.id"
        flat
        bordered
        class="bg-transparent"
        :class="
          answer.answer_data.is_marked_as_correct
            ? 'border-positive'
            : 'border-negative'
        "
      >
        <q-card-section class="row no-wrap items-center justify-between">
          <div class="ellipsis">
            <div
              class="text-semibold q-mb-xs ellipsis"
              :style="`color: ${answer.participant.user_data.color}`"
            >
              {{ answer.participant.user_data.avatar }}
              {{ answer.participant.user_data.name }}
            </div>

            <div class="text-semibold ellipsis">
              Ответ:
              <span class="text-weight-regular">
                {{ answer.answer_data.text }}
              </span>
            </div>
          </div>

          <q-btn
            :icon="
              answer.answer_data.is_marked_as_correct
                ? 'r_check_circle'
                : 'o_circle'
            "
            color="primary"
            flat
            round
            class="q-ml-md round-borders"
            :loading="isLoadingAnswerIndex === index"
            @click="acceptAnswer(answer, index)"
          >
            <q-tooltip>
              {{
                answer.answer_data.is_marked_as_correct ? "Отменить" : "Принять"
              }}
            </q-tooltip>
          </q-btn>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { api } from "boot/axios";
import { ref, watch } from "vue";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, room, slide, slideSettings } =
  storeToRefs(presentationsStore);

/*
 * emits
 */
defineEmits(["cancel"]);

/*
 * variables
 */
const props = defineProps({
  answers: { type: Array },
});

const isLoadingAnswerIndex = ref();

watch(
  () => props.answers,
  () => {
    isLoadingAnswerIndex.value = null;
  }
);

/*
 * accept answer
 */
const acceptAnswer = (answer, index) => {
  isLoadingAnswerIndex.value = index;

  const score = presentationsStore.computeScoreForAnswers(
    [{ value: answer.answer_data.text }],
    slideSettings.value.timeLimit - answer.time_taken_to_answer,
    !answer.answer_data.is_marked_as_correct
  );

  api
    .patch(
      `/presentation/${presentation.value.id}/room/${room.value.id}/answers/${answer.id}`,
      {
        score,
        answer_data: {
          text: answer.answer_data.text,
          is_marked_as_correct: !answer.answer_data.is_marked_as_correct,
        },
      }
    )
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style scoped lang="scss">
.accept_other_answers {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  color: $white;
  border-radius: 16px !important;
  max-width: 80%;

  > .q-card {
  }

  > .q-card__section {
    display: grid;
    grid-template-columns: 300px 300px;
    gap: 16px;
  }
}

.border-positive {
  border-color: $positive;
}

.border-negative {
  border-color: $negative;
}
</style>
