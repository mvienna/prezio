<template>
  <div
    class="waiting_for_participants__word_cloud"
    :style="`left: ${left}px; top: ${top}px;`"
  >
    <div ref="wordCloud"></div>
  </div>

  <!-- header -->
  <div
    class="waiting_for_participants__header text-no-wrap"
    :class="`text-${textColor}`"
  >
    <!-- title -->
    <div class="text-semibold text-h4">
      {{ $t("presentationRoom.waitingForParticipants.title") }}
    </div>

    <!-- participants count -->
    <div v-if="participants.length" style="opacity: 0.5">
      {{
        $t(
          "presentationRoom.waitingForParticipants.joined.title",
          authorizedParticipants?.length,
        )
      }}
    </div>
  </div>

  <!-- footer -->
  <div class="waiting_for_participants__footer" :class="`text-${textColor}`">
    <!-- shortcut tip -->
    <div
      class="row no-wrap justify-center items-center q-mb-md"
      style="opacity: 0.75"
    >
      {{ $t("presentationRoom.waitingForParticipants.startQuiz.shortcut") }}
      <q-btn
        unelevated
        icon="r_keyboard_return"
        round
        size="sm"
        class="q-ml-sm"
        @click="presentationsStore.handleQuizStart()"
      />
    </div>

    <!-- start the quiz -->
    <div class="row no-wrap justify-center items-center">
      <q-btn
        unelevated
        no-caps
        :label="$t('presentationRoom.waitingForParticipants.startQuiz.title')"
        :class="$q.screen.lt.md ? 'q-px-lg' : 'q-px-xl'"
        :style="$q.screen.lt.md ? 'height: 50px' : 'height: 62px'"
        :size="$q.screen.lt.md ? '0.875rem' : '1.125rem'"
        @click="presentationsStore.handleQuizStart()"
      />
    </div>
  </div>
</template>

<script setup>
import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { useStudioStore } from "stores/studio";
import { COLOR_SCHEME_OPTIONS } from "src/constants/canvas/canvasVariables";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, slide, presentation, slideSettings, participants } =
  storeToRefs(presentationsStore);

const studioStore = useStudioStore();
const { stages } = storeToRefs(studioStore);

/*
 * props
 */
const props = defineProps({
  box: { type: Object, default: null },
});

/*
 * text color
 */
const textColor = computed(() => {
  return slide.value.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
    ? "black"
    : "white";
});

/*
 * data
 */
const wordCloud = ref();
const isWordCloudGenerated = ref(false);

const width = ref(0);
const height = ref(0);
const left = ref(0);
const top = ref(0);

const settings = {
  size: (group) => group.length, // given a grouping of words, returns the size factor for that word
  word: (d) => d, // given an item of the data array, returns the word
  maxWords: 250,
  fontFamily: "sans-serif",
  fontScale: 20,
  fontWeight: 600,
  padding: 5,
  // rotate: () => ~~(Math.random() * 2) * 90,
  rotate: 0,
  invalidation: null, // when this promise resolves, stop the simulation
};

const authorizedParticipants = computed(() => {
  return participants.value?.filter((user) => {
    const userData = user.user_data ? JSON.parse(user.user_data) : {};
    return !user.is_guest && userData?.name?.length && userData?.avatar?.length;
  });
});

const data = computed(() => {
  const participantsData = authorizedParticipants.value?.map((user) => {
    const user_data = JSON.parse(user.user_data);
    return {
      text: `${user_data.avatar} ${user_data.name}`,
      color: user_data.color,
    };
  });

  return d3
    .rollups(
      participantsData.map((item) => item.text),
      settings.size,
      (w) => w,
    )
    .sort(([, a], [, b]) => d3.descending(a, b))
    .slice(0, settings.maxWords)
    .map(([key, size]) => ({
      text: settings.word(key),
      size,
      id: settings.word(key).replace(/[^a-zA-Zа-яА-Я]/g, ""),
      color: participantsData.find((item) => item.text === settings.word(key))
        .color,
    }));
});

/*
 * hooks
 */
watch(
  () => authorizedParticipants.value,
  () => {
    // TODO: restore update() and fix the whole word cloud disappearing on word deletion
    generate();
  },
  { deep: true },
);

/*
 * d3 cloud
 */
const generate = () => {
  if (!wordCloud.value) return;
  d3.select(wordCloud.value).selectAll("svg").remove();

  width.value = (props.box?.width * 80) / 100;
  height.value = (props.box?.height * 60) / 100;
  left.value = props.box?.left + (props.box?.width - width.value) / 2;
  top.value = props.box?.top + (props.box?.height - height.value) / 2;

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width.value, height.value])
    .attr("width", width.value)
    .attr("font-family", settings.fontFamily)
    .attr("text-anchor", "middle")
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const g = svg.append("g").attr("transform", `translate(${0},${0})`);

  const cloud = d3Cloud()
    .size([width.value, height.value])
    .words(data.value)
    .padding(settings.padding)
    .rotate(settings.rotate)
    .font(settings.fontFamily)
    .fontSize((d) => Math.sqrt(d.size) * settings.fontScale)
    .on("word", ({ size, x, y, rotate, text, id, color }) => {
      g.append("text")
        .attr("class", `word-cloud-text-${id}`)
        .attr("font-size", size)
        .attr("font-weight", settings.fontWeight)
        .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
        .style("fill", color)

        .text(text);
    });

  cloud.start();
  settings.invalidation && settings.invalidation.then(() => cloud.stop());
  wordCloud.value.append(svg.node());

  isWordCloudGenerated.value = true;
};

const update = () => {
  if (!isWordCloudGenerated.value) return generate();

  d3.select(wordCloud.value)
    .select("svg")
    .select("g")
    .selectAll("text")
    .data([])
    .exit()
    .transition()
    .duration(200)
    .style("fill-opacity", 1e-6)
    .attr("font-size", 1)
    .remove();

  const cloud = d3Cloud()
    .size([width.value, height.value])
    .words(data.value)
    .padding(settings.padding)
    .rotate(settings.rotate)
    .font(settings.fontFamily)
    .fontSize((d) => Math.sqrt(d.size) * settings.fontScale)
    .on("word", ({ size, x, y, rotate, text, id, color }) => {
      const textElements = d3
        .select("svg")
        .select("g")
        .selectAll(`.word-cloud-text-${id}`)
        .data([text]);

      const enterText = textElements
        .enter()
        .append("text")
        .attr("class", `word-cloud-text-${id}`)
        .attr("font-size", 0)
        .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
        .style("fill", color)

        .text(text);

      textElements
        .merge(enterText)
        .transition()
        .duration(500)
        .attr("font-size", size)
        .attr("font-weight", settings.fontWeight)
        .attr("transform", `translate(${x},${y}) rotate(${rotate})`);

      textElements
        .exit()
        .transition()
        .duration(200)
        .style("fill-opacity", 1e-6)
        .attr("font-size", 1)
        .remove();
    });

  cloud.start();
  settings.invalidation && settings.invalidation.then(() => cloud.stop());
};
</script>

<style lang="scss">
svg,
g,
text {
  transition: 0.6s;
}

.waiting_for_participants__word_cloud {
  position: fixed;
  z-index: 1;

  text {
    cursor: pointer;
    transition: transform 0.2s ease;
  }
}

/*
 * header
 */
.waiting_for_participants__header {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 120px;
  transform: translate(-50%, 0) scale(1);
  text-align: center;
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  from {
    transform: translate(-50%, 0) scale(1);
  }
  50% {
    transform: translate(-50%, 0) scale(1.25);
  }
  to {
    transform: translate(-50%, 0) scale(1);
  }
}

/*
 * footer
 */
.waiting_for_participants__footer {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: 24px;
  transform: translate(-50%, 0);

  .q-btn {
    border-radius: 1.5rem;
    background: rgba(0, 0, 0, 0.5);
    color: $white;
    backdrop-filter: blur(4px);
  }
}

@media screen and (max-width: 1023px) {
  .waiting_for_participants__footer {
    bottom: 8px;
  }
}
</style>
