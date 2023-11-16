<template>
  <div>
    <div class="row justify-center">
      <q-img src="/assets/images/champion.svg" class="champion_cup" />
    </div>

    <div class="text-center">
      <div class="text-h6 text-semibold">
        {{ $t("presentationRoom.leaderboard.title") }}
      </div>

      <div class="q-mt-sm">
        {{ $t("presentationRoom.leaderboard.youAreIn") }}

        <span class="text-semibold">{{ participantResults?.place }}</span>
        {{ $t("presentationRoom.leaderboard.place") }}
        {{ $t("presentationRoom.leaderboard.outOf") }}
        <span class="text-semibold">{{ results.length }}</span>
        {{ $t("presentationRoom.leaderboard.players") }}
      </div>

      <div>
        {{ $t("presentationRoom.leaderboard.youScored") }}

        <span class="text-semibold">{{ participantResults?.data?.score }}</span>
        {{ $t("presentationRoom.leaderboard.points") }}
      </div>
    </div>

    <div class="row justify-center q-mt-md">
      <div class="column no-wrap q-gutter-md q-pt-md">
        <q-card
          v-for="(result, index) in results"
          :key="result?.participant?.id"
          flat
          :style="`background: rgba(${Object.values(
            colors.textToRgb(result.color)
          ).join(',')}, 0.7)`"
          style="border-radius: 24px !important; backdrop-filter: blur(4px)"
        >
          <q-card-section
            class="row no-wrap items-center justify-between q-pa-md"
          >
            <q-btn
              round
              flat
              style="
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(4px);
              "
              class="q-mr-sm"
              size="8px"
            >
              {{ index + 1 }}
            </q-btn>

            <div class="text-semibold">
              {{
                (JSON.parse(result.participant.user_data)?.avatar
                  ? JSON.parse(result.participant.user_data)?.avatar + " "
                  : "") + JSON.parse(result.participant.user_data).name
              }}
            </div>

            <div class="q-ml-xl q-pl-xl">
              {{ result.score }}
              {{ $t("presentationRoom.leaderboard.p") }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { SLIDE_TYPES_OF_QUIZ } from "src/constants/presentationStudio";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { wordCloudTextColors } from "src/helpers/colorUtils";
import { colors } from "quasar";

/*
 * stores
 */
const presentationsStudio = usePresentationsStore();
const { presentation, slide, participant } = storeToRefs(presentationsStudio);

/*
 * results
 */
const results = computed(() => {
  const slideIndex = presentation.value.slides.findIndex(
    (item) => item.id === slide.id
  );

  const slides = presentation.value.slides
    .slice(0, slideIndex)
    .filter((item) => SLIDE_TYPES_OF_QUIZ.includes(item.type));

  const answers = slides.map((item) => item.answers).flat();

  const scoresMap = new Map();

  answers.forEach((answer) => {
    const participantId = answer.participant.id;
    const score = answer.score;

    if (scoresMap.has(participantId)) {
      scoresMap.get(participantId).score += score;
    } else {
      scoresMap.set(participantId, {
        participant: answer.participant,
        score: score,
        color:
          wordCloudTextColors[
            Math.floor(Math.random() * wordCloudTextColors.length)
          ],
      });
    }
  });

  return Array.from(scoresMap.values()).sort((a, b) => {
    return b.score - a.score;
  });
});

const participantResults = computed(() => {
  if (!results.value?.length) return;

  return {
    data: results.value.find(
      (result) => result.participant.id === participant.value?.id
    ),
    place:
      results.value.findIndex(
        (result) => result.participant.id === participant.value?.id
      ) + 1,
  };
});
</script>

<style scoped lang="scss">
.champion_cup {
  width: 100px;
}
</style>
