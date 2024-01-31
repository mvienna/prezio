<template>
  <div class="word_cloud" :style="`left: ${left}px; top: ${top}px;`">
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
import { wordCloudTextColors } from "src/helpers/colorUtils";

/*
 * emits
 */
const emit = defineEmits(["removeWord"]);

/*
 * data
 */
const props = defineProps({
  words: { type: Array, default: null },
  box: { type: Object, default: null },
});

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
onMounted(() => {
  generate();
});

watch(
  () => props.words,
  () => {
    // todo: restore update() and fix the whole word cloud disappearing on word deletion
    generate();
  },
);

/*
 * d3 cloud
 */
const generate = () => {
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
            ],
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
            ],
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
