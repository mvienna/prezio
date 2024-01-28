<template>
  <div>
    <Vue3Lottie
      v-if="results?.length"
      :animation-data="confettiJSON"
      :height="(box?.height * 65) / 100"
      :width="box?.width"
      class="fixed"
      :scale="2"
      style="z-index: 1"
      :style="`top: ${
        box?.top + (box?.height * 20) / 100
      }px; left: ${box?.left}px;`"
    />

    <div
      class="leaderboard hide-scrollbar q-pa-sm"
      :style="`top: ${
        box?.top + (box?.height * 20) / 100
      }px; left: ${box?.left + (box?.width * 10) / 100}px; width: ${
        (box?.width * 80) / 100
      }px; height: ${(box?.height * 65) / 100}px`"
    >
      <div v-if="results?.length" class="row no-wrap justify-center">
        <div class="column no-wrap q-gutter-md full-width">
          <div
            v-for="(result, index) in results"
            :key="result?.participant?.id"
            class="row no-wrap items-center text-18 text-weight-medium"
          >
            <div
              class="q-mr-md"
              :class="
                slide.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
                  ? 'text-black'
                  : 'text-white'
              "
            >
              {{ index + 1 }}
            </div>

            <div v-if="!result.score" class="text-semibold ellipsis q-pa-md">
              {{
                result.participantData?.avatar +
                " " +
                result.participantData?.name
              }}
            </div>

            <q-card
              v-else
              flat
              style="border-radius: 6px !important; overflow: hidden"
              :style="`width: ${(result.score * 100) / maxScore}%`"
              class="bg-white"
            >
              <div
                class="absolute-left"
                style="height: 100%; width: 100%; border-radius: 0"
                :style="`background: rgba(${Object.values(
                  colors.textToRgb(result.participantData?.color || '#FFFFFF'),
                ).join(',')}, 0.7);`"
              ></div>

              <q-card-section
                class="row no-wrap items-center"
                :class="$q.screen.lt.lg ? 'q-pa-sm' : 'q-pa-md'"
              >
                <div class="text-semibold ellipsis text-no-wrap">
                  {{
                    result.participantData?.avatar +
                    " " +
                    result.participantData?.name
                  }}
                </div>
              </q-card-section>
            </q-card>

            <div
              class="text-no-wrap column justify-center q-ml-md"
              :class="
                slide.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
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

      <div
        v-else
        class="text-center column no-wrap justify-center full-height"
        :class="
          slide.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
            ? 'text-black'
            : 'text-white'
        "
      >
        <!-- TODO: translate -->
        <div class="text-h5 text-semibold">Результатов пока нет</div>
        <div class="q-mt-sm" style="opacity: 0.5">
          Тут появится таблица лидеров, когда появятся результаты
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { SLIDE_TYPES_OF_QUIZ } from "src/constants/presentationStudio";
import { colors } from "quasar";
import { Vue3Lottie } from "vue3-lottie";
import confettiJSON from "src/assets/animations/confetti.json";
import { useStudioStore } from "stores/studio";
import { COLOR_SCHEME_OPTIONS } from "src/constants/canvas/canvasVariables";

/*
 * stores
 */
const presentationStore = usePresentationsStore();
const { slide, slideSettings, presentation } = storeToRefs(presentationStore);

const studioStore = useStudioStore();
const { stages } = storeToRefs(studioStore);

defineProps({
  box: { type: Object, default: null },
});

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
</script>

<style scoped lang="scss">
.leaderboard {
  position: fixed;
  z-index: 1;
  transition: 0.6s;
  overflow-y: scroll;
}

.champion_cup {
  width: 100px;
}
</style>
