<template>
  <div>
    <Vue3Lottie
      v-if="results?.length"
      :animation-data="confettiJSON"
      :height="canvasRect.height"
      :width="canvasRect.width"
      class="fixed"
      :scale="2"
      style="z-index: 1"
      :style="`top: ${canvasRect.top}px; left: ${canvasRect.left}px;`"
    />

    <div
      class="leaderboard scroll--hidden q-pa-sm"
      :style="`top: ${
        canvasRect.top + (canvasRect.height * 20) / 100
      }px; left: ${canvasRect.left + (canvasRect.width * 10) / 100}px; width: ${
        (canvasRect.width * 80) / 100
      }px; height: ${(canvasRect.height * 65) / 100}px`"
    >
      <div v-if="results?.length" class="row no-wrap justify-center">
        <div class="column no-wrap q-gutter-md full-width">
          <div
            v-for="(result, index) in results"
            :key="result?.participant?.id"
            class="row no-wrap"
          >
            <div class="column justify-center">
              <q-btn
                round
                flat
                style="border-radius: 50%; backdrop-filter: blur(4px)"
                :class="
                  averageBackgroundBrightness >= backgroundBrightnessThreshold
                    ? 'text-black'
                    : 'text-white'
                "
                :style="
                  averageBackgroundBrightness >= backgroundBrightnessThreshold
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
                  colors.textToRgb(result.color)
                ).join(',')}, 0.7); width: ${(result.score * 100) / maxScore}%`"
              ></div>

              <q-card-section
                class="row no-wrap items-center"
                :class="$q.screen.lt.lg ? 'q-pa-sm' : 'q-pa-md'"
              >
                <div
                  class="text-semibold ellipsis text-no-wrap q-mr-md"
                  style="font-size: 1em"
                >
                  {{
                    (JSON.parse(result.participant.user_data)?.avatar
                      ? JSON.parse(result.participant.user_data)?.avatar + " "
                      : "") + JSON.parse(result.participant.user_data).name
                  }}
                </div>
              </q-card-section>
            </q-card>

            <div
              class="text-no-wrap column justify-center q-ml-md"
              :class="
                averageBackgroundBrightness >= backgroundBrightnessThreshold
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
          averageBackgroundBrightness >= backgroundBrightnessThreshold
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
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useCanvasStore } from "stores/canvas";
import { SLIDE_TYPES_OF_QUIZ } from "src/constants/presentationStudio";
import { wordCloudTextColors } from "src/helpers/colorUtils";
import { colors } from "quasar";
import { Vue3Lottie } from "vue3-lottie";
import confettiJSON from "src/assets/animations/confetti.json";

/*
 * stores
 */
const presentationStore = usePresentationsStore();
const {
  slide,
  slideSettings,
  showRoomInvitationPanel,
  presentation,
  averageBackgroundBrightness,
  backgroundBrightnessThreshold,
} = storeToRefs(presentationStore);

const canvasStore = useCanvasStore();
const { canvas, scale } = storeToRefs(canvasStore);

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

const maxScore = computed(() => {
  return results.value.reduce(
    (max, obj) => (obj.score > max ? obj.score : max),
    results.value[0].score
  );
});

/*
 * canvas size
 */
const canvasRect = ref(canvasStore.canvasRect());

watch(
  () => showRoomInvitationPanel.value,
  () => {
    setTimeout(() => {
      canvasRect.value = canvasStore.canvasRect();
    }, 500);
  },
  { deep: true }
);

watch(
  () => scale.value,
  () => {
    onResize();
  }
);

onMounted(() => {
  setTimeout(() => {
    onResize();
  }, 500);

  window.addEventListener("resize", onResize);
});

const onResize = () => {
  canvasRect.value = canvasStore.canvasRect();
};
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
