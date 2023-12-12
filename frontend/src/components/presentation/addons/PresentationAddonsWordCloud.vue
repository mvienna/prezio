<template>
  <div class="word_cloud" :style="`left: ${left}; top: ${top};`">
    <div ref="wordCloud"></div>
  </div>
</template>

<script setup>
import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { wordCloudTextColors } from "src/helpers/colorUtils";
import { usePresentationsStore } from "stores/presentations";

/*
 * emits
 */
const emit = defineEmits(["removeWord"]);

/*
 * stores
 */
const canvasStore = useCanvasStore();

const presentationsStore = usePresentationsStore();
const { showRoomInvitationPanel } = storeToRefs(presentationsStore);

/*
 * data
 */
const props = defineProps({
  words: { type: Array, default: null },
});

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
  rotate: () => ~~(Math.random() * 2) * 90,
  invalidation: null, // when this promise resolves, stop the simulation
};

const data = computed(() => {
  return d3
    .rollups(props.words, settings.size, (w) => w)
    .sort(([, a], [, b]) => d3.descending(a, b))
    .slice(0, settings.maxWords)
    .map(([key, size]) => ({
      text: settings.word(key),
      size,
      id: settings.word(key).replace(/[^a-zA-Zа-яА-Я]/g, ""),
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

      if (
        !isWordCloudGenerated.value &&
        canvasRect.value.width > 0 &&
        canvasRect.value.height > 0
      ) {
        width.value = (canvasRect.value.width * 80) / 100;
        height.value = (canvasRect.value.height * 50) / 100;
        generate();
      }
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
});

onUnmounted(() => {
  resizeObserverCanvas.value.disconnect();
  resizeObserverPage.value.disconnect();
});

watch(
  () => props.words,
  () => {
    // TODO: restore update() and fix the whole word cloud disappearing on word deletion
    generate();
  }
);

/*
 * d3 cloud
 */
const generate = () => {
  if (!wordCloud.value || !width.value || !height.value) return;
  d3.select(wordCloud.value).selectAll("svg").remove();

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
    .on("word", ({ size, x, y, rotate, text, id }) => {
      g.append("text")
        .attr("class", `word-cloud-text-${id}`)
        .attr("font-size", size)
        .attr("font-weight", settings.fontWeight)
        .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
        .style(
          "fill",
          () =>
            wordCloudTextColors[
              Math.floor(Math.random() * wordCloudTextColors.length)
            ]
        )
        .text(text);
    });

  cloud.start();
  settings.invalidation && settings.invalidation.then(() => cloud.stop());
  wordCloud.value.append(svg.node());

  isWordCloudGenerated.value = true;
};

const update = () => {
  if (!isWordCloudGenerated.value) return;

  d3.select(wordCloud.value)
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
    .on("word", ({ size, x, y, rotate, text, id }) => {
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
        .style(
          "fill",
          () =>
            wordCloudTextColors[
              Math.floor(Math.random() * wordCloudTextColors.length)
            ]
        )
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

/*
 * handle click on word event
 */
onBeforeMount(() => {
  document.addEventListener("click", handleWordsCloudClickEvent);
});

onUnmounted(() => {
  document.removeEventListener("click", handleWordsCloudClickEvent);
});

const handleWordsCloudClickEvent = (event) => {
  if (event.target.nodeName === "text") {
    emit("removeWord", event.target.innerHTML);
  }
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

  text:hover {
    text-decoration: line-through;
  }
}
</style>
