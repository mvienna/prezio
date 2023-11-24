<template>
  <div
    class="word_cloud"
    :style="`left: ${
      canvasRect.left + canvasRect.width / 2 - width / 2
    }px; top: ${canvasRect.top + canvasRect.height / 2 - height / 2}px;`"
  >
    <div ref="wordCloud"></div>
  </div>
</template>

<script setup>
import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
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
const { canvas, scale } = storeToRefs(canvasStore);

const presentationsStore = usePresentationsStore();
const { showRoomInvitationPanel } = storeToRefs(presentationsStore);

/*
 * data
 */
const props = defineProps({
  words: { type: Array, default: null },
});

const wordCloud = ref();

const canvasRect = ref(canvasStore.canvasRect());

const width = computed(() => {
  return (canvasRect.value.width * 60) / 100;
});

const height = computed(() => {
  return (canvasRect.value.height * 40) / 100;
});

const settings = {
  size: (group) => group.length, // given a grouping of words, returns the size factor for that word
  word: (d) => d, // given an item of the data array, returns the word
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  maxWords: 250,
  fontFamily: "sans-serif",
  fontScale: 20,
  fontWeight: 600,
  padding: 5,
  rotate: () => ~~(Math.random() * 2) * 90,
  invalidation: null, // when this promise resolves, stop the simulation
};

/*
 * generation
 */
const generateWordCloud = () => {
  const data = d3
    .rollups(props.words, settings.size, (w) => w)
    .sort(([, a], [, b]) => d3.descending(a, b))
    .slice(0, settings.maxWords)
    .map(([key, size]) => ({
      text: settings.word(key),
      size,
      id: settings.word(key).replace(/[^a-zA-Zа-яА-Я]/g, ""),
    }));

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width.value, height.value])
    .attr("width", width.value)
    .attr("font-family", settings.fontFamily)
    .attr("text-anchor", "middle")
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const g = svg
    .append("g")
    .attr(
      "transform",
      `translate(${settings.marginLeft},${settings.marginTop})`
    );

  const cloud = d3Cloud()
    .size([
      width.value - settings.marginLeft - settings.marginRight,
      height.value - settings.marginTop - settings.marginBottom,
    ])
    .words(data)
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
};

const updateWordCloud = () => {
  d3.select("svg")
    .select("g")
    .selectAll("text")
    .data([])
    .exit()
    .transition()
    .duration(200)
    .style("fill-opacity", 1e-6)
    .attr("font-size", 1)
    .remove();

  const data = d3
    .rollups(props.words, settings.size, (w) => w)
    .sort(([, a], [, b]) => d3.descending(a, b))
    .slice(0, settings.maxWords)
    .map(([key, size]) => ({
      text: settings.word(key),
      size,
      id: settings.word(key).replace(/[^a-zA-Zа-яА-Я]/g, ""),
    }));

  const cloud = d3Cloud()
    .size([
      width.value - settings.marginLeft - settings.marginRight,
      height.value - settings.marginTop - settings.marginBottom,
    ])
    .words(data)
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
 * trigger words cloud generation
 */
onMounted(() => {
  setTimeout(() => {
    canvasRect.value = canvasStore.canvasRect();
    generateWordCloud();

    window.addEventListener("resize", onResize);
  }, 500);
});

watch(
  () => props.words,
  () => {
    updateWordCloud();
  }
);

watch(
  () => showRoomInvitationPanel.value,
  () => {
    setTimeout(() => {
      onResize();
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

const onResize = () => {
  canvasRect.value = canvasStore.canvasRect();
  updateWordCloud();
};

/*
 * hover
 */
onBeforeMount(() => {
  document.addEventListener("click", handleWordsCloudClickEvent);
});

const handleWordsCloudClickEvent = (event) => {
  if (event.target.nodeName === "text") {
    emit("removeWord", event.target.innerHTML);
  }
};
</script>

<style lang="scss">
.word_cloud div,
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
