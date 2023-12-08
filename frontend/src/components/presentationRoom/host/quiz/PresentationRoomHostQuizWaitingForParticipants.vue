<template>
  <div class="word_cloud" :style="`left: ${left}; top: ${top};`">
    <div ref="wordCloud"></div>
  </div>

  <!-- header -->
  <div
    class="waiting_for_participants__header text-no-wrap"
    :class="`text-${textColor}`"
  >
    <!-- title -->
    <div>{{ $t("presentationRoom.waitingForParticipants.title") }}</div>

    <!-- participants count -->
    <div v-if="participants.length" style="opacity: 0.5">
      {{
        $t(
          "presentationRoom.waitingForParticipants.joined.title",
          authorizedParticipants?.length
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
        size="8px"
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
        :size="$q.screen.lt.md ? '14px' : '18px'"
        @click="presentationsStore.handleQuizStart()"
      />
    </div>
  </div>
</template>

<script setup>
import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { canvas, scale } = storeToRefs(canvasStore);

const presentationsStore = usePresentationsStore();
const {
  room,
  presentation,
  slideSettings,
  participants,
  averageBackgroundBrightness,
  backgroundBrightnessThreshold,
  showRoomInvitationPanel,
} = storeToRefs(presentationsStore);

/*
 * text color
 */
const textColor = computed(() => {
  return averageBackgroundBrightness.value >=
    backgroundBrightnessThreshold.value
    ? "black"
    : "white";
});

/*
 * data
 */
const wordCloud = ref();
const isWordCloudGenerated = ref(false);

const canvasRect = ref(canvasStore.canvasRect());

const width = ref(0);
const height = ref(0);

const left = computed(() => {
  if (width.value > canvasRect.value.width && !showRoomInvitationPanel.value) {
    return canvasRect.value.left;
  }

  return (
    canvasRect.value.left + canvasRect.value.width / 2 - width.value / 2 + "px"
  );
});

const top = computed(() => {
  return (
    canvasRect.value.y +
    canvasRect.value.height / 2 -
    (width.value > canvasRect.value.width
      ? d3.select(wordCloud.value).select("svg").node().getBoundingClientRect()
          .height / 2
      : height.value / 2) +
    "px"
  );
});

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
  return participants.value?.filter((user) => !user.is_guest);
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
      (w) => w
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
const resizeObserverCanvas = ref();
const resizeObserverPage = ref();

onMounted(() => {
  const canvas = document.getElementById("canvas");
  resizeObserverCanvas.value = new ResizeObserver((entries) => {
    for (const entry of entries) {
      canvasRect.value = canvasStore.canvasRect();
    }
  });
  resizeObserverCanvas.value.observe(canvas);

  const page = document.getElementsByClassName("q-page-container")[0];
  resizeObserverPage.value = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (
        window.screen.width > canvasStore.canvasRect().width &&
        !showRoomInvitationPanel.value
      ) {
        canvasRect.value = canvasStore.canvasRect();
      }
    }
  });
  resizeObserverPage.value.observe(page);

  setTimeout(() => {
    width.value = (canvasRect.value.width * 80) / 100;
    height.value = (canvasRect.value.height * 50) / 100;
    generate();
  }, 500);
});

onUnmounted(() => {
  resizeObserverCanvas.value.disconnect();
  resizeObserverPage.value.disconnect();
});

watch(
  () => authorizedParticipants.value,
  (newValue, oldValue) => {
    if (!oldValue?.length) {
      generate();
    } else {
      update();
    }
  },
  { deep: true }
);

/*
 * d3 cloud
 */
const generate = () => {
  if (!wordCloud.value) return;
  console.log("b:", wordCloud.value);
  d3.select(wordCloud.value).selectAll("svg").remove();

  console.log("a:", wordCloud.value);
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

.word_cloud {
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

  div:first-child {
    font-size: 2.5em;
    font-weight: 600;
  }
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
    border-radius: 24px;
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
