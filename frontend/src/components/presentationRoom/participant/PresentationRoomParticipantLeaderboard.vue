<template>
  <div>
    <Vue3Lottie
      v-if="results?.length"
      :animation-data="confettiJSON"
      height="100vh"
      width="100vw"
      class="absolute"
      :scale="2"
      style="z-index: 0"
    />

    <div style="z-index: 2; overflow-y: scroll" class="hide-scrollbar">
      <template v-if="results?.length">
        <div class="row justify-center">
          <q-img src="/assets/images/champion.svg" class="champion_cup" />
        </div>

        <div
          class="text-center"
          :class="`${
            slide?.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
              ? 'text-black'
              : 'text-white'
          }`"
        >
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

            <span class="text-semibold">
              {{ participantResults?.data?.score }}
            </span>
            {{ $t("presentationRoom.leaderboard.points") }}
          </div>
        </div>

        <div class="row no-wrap justify-center q-px-lg q-pt-lg q-pb-sm">
          <div class="column no-wrap q-gutter-md full-width q-pt-md">
            <div
              v-for="(result, index) in results"
              :key="result?.participant?.id"
              class="row no-wrap full-width"
            >
              <div class="column justify-center">
                <q-btn
                  round
                  flat
                  style="border-radius: 50%; backdrop-filter: blur(4px)"
                  :class="
                    slide?.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
                      ? 'text-black'
                      : 'text-white'
                  "
                  :style="
                    slide?.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
                      ? `background: rgba(255, 255, 255, 0.5)`
                      : 'background: rgba(0, 0, 0, 0.5)'
                  "
                  class="q-mr-md"
                  size="12px"
                >
                  {{ index + 1 }}
                </q-btn>
              </div>

              <q-card
                flat
                style="
                  border-radius: 16px !important;
                  overflow: hidden;
                  width: 100%;
                "
                class="bg-white"
              >
                <div
                  class="absolute-left"
                  style="height: 100%; border-radius: 0"
                  :style="`background: rgba(${Object.values(
                    colors.textToRgb(
                      result.participantData?.color || '#FFFFFF',
                    ),
                  ).join(',')}, 0.7); width: ${
                    (result.score * 100) / maxScore
                  }%`"
                ></div>

                <q-card-section
                  class="row no-wrap items-center"
                  :class="$q.screen.lt.lg ? 'q-pa-sm' : 'q-pa-md'"
                >
                  <div class="text-semibold ellipsis text-no-wrap text-16">
                    {{
                      result.participantData?.avatar +
                      " " +
                      result.participantData?.name
                    }}
                    {{
                      result?.participant?.id === participant?.id
                        ? " " + $t("you")
                        : ""
                    }}
                  </div>
                </q-card-section>
              </q-card>

              <div
                class="text-no-wrap column justify-center q-ml-md"
                :class="
                  slide?.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
                    ? 'text-black'
                    : 'text-white'
                "
              >
                {{ result.score }}
                {{ $t("presentationRoom.leaderboard.p") }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <div
        v-else
        class="text-center column no-wrap justify-center full-height"
        :class="
          slide?.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
            ? 'text-black'
            : 'text-white'
        "
      >
        <div class="text-h5 text-semibold">Результатов пока нет</div>
        <div class="q-mt-sm" style="opacity: 0.5">
          Тут появится таблица лидеров, когда появятся результаты
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { SLIDE_TYPES_OF_QUIZ } from "src/constants/presentationStudio";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { colors } from "quasar";
import confettiJSON from "assets/animations/confetti.json";
import { Vue3Lottie } from "vue3-lottie";
import { COLOR_SCHEME_OPTIONS } from "src/constants/canvas/canvasVariables";

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
    (item) => item.id === slide.id,
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
        participantData: answer.participant?.user_data
          ? JSON.parse(answer.participant.user_data)
          : {},
        score: score,
      });
    }
  });

  return Array.from(scoresMap.values()).sort((a, b) => {
    return b.score - a.score;
  });
});

const maxScore = computed(() => {
  return results.value.reduce(
    (max, obj) => (obj.score > max ? obj.score : max),
    results.value[0].score,
  );
});

const participantResults = computed(() => {
  if (!results.value?.length) return;

  return {
    data: results.value.find(
      (result) => result.participant.id === participant.value?.id,
    ),
    place:
      results.value.findIndex(
        (result) => result.participant.id === participant.value?.id,
      ) + 1,
  };
});
</script>

<style scoped lang="scss">
.champion_cup {
  width: 100px;
}
</style>
