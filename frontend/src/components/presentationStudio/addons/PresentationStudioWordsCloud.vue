<template>
  <div
    class="word_cloud"
    :style="`left: ${canvasRect.left}px; top: ${
      canvasRect.top + (canvasRect.height * 25) / 100
    }px;`"
  >
    <div ref="wordCloud"></div>
  </div>
</template>

<script setup>
import * as d3 from "d3";
import cloud from "d3-cloud";
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";

/*
 * emits
 */
const emit = defineEmits(["removeWord"]);

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { canvas } = storeToRefs(canvasStore);

const canvasRect = computed(() => {
  return canvasStore.canvasRect();
});

/*
 * props
 */
const props = defineProps({
  words: { type: Array, default: null },
});

const wordCloud = ref();

/*
 * data
 */
let frequencyCount = computed(() => {
  return props.words.reduce(function (acc, curr) {
    if (typeof acc[curr] == "undefined") {
      acc[curr] = 1;
    } else {
      acc[curr] += 1;
    }
    return acc;
  }, {});
});

const data = computed(() => {
  return Object.keys(frequencyCount.value).map((key) => ({
    text: key,
    size: frequencyCount.value[key] * canvasStore.computeAdjustedSize(16),
  }));
});

const colors = [
  "#FF5733",
  "#00A36C",
  "#3498DB",
  "#E74C3C",
  "#9B59B6",
  "#2ECC71",
  "#1ABC9C",
  "#F39C12",
  "#D35400",
  "#3498DB",
  "#8E44AD",
  "#2C3E50",
  "#E67E22",
  "#16A085",
  "#FFC0CB",
  "#1E90FF",
  "#FF69B4",
  "#2E8B57",
  "#FFD700",
  "#FF6347",
];

/*
 * draw
 */
const generateWordsCloud = () => {
  const width = canvasRect.value.width;
  const height = (canvasRect.value.height * 75) / 100;

  const svg = d3
    .select(wordCloud.value)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  cloud()
    .size([width, height])
    .words(data.value)
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .fontSize((d) => d.size)
    .on("end", (words) => draw(svg, words))
    .start();
};

const updateWordsCloud = () => {
  const width = canvasRect.value.width;
  const height = (canvasRect.value.height * 75) / 100;

  const svg = d3.select(wordCloud.value).select("svg");

  cloud()
    .size([width, height])
    .words(data.value)
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .fontSize((d) => d.size)
    .on("end", (words) => draw(svg, words))
    .start();
};

const draw = (svg, words) => {
  const cloud = svg.selectAll("g text").data(words, (d) => d.text);

  // entering words
  cloud
    .enter()
    .append("text")
    .style("fill", () => colors[Math.floor(Math.random() * colors.length)])
    .style("font-size", (d) => `${d.size}px`)
    .style("font-weight", "500")
    .attr("text-anchor", "middle")
    .text((d) => d.text)
    .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`);

  // entering & exiting words
  cloud
    .transition()
    .duration(600)
    .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
    .style("fill-opacity", 1);

  // exiting words
  cloud
    .exit()
    .transition()
    .duration(200)
    .style("fill-opacity", 1e-6)
    .attr("font-size", 1)
    .remove();
};

/*
 * trigger words cloud generation
 */
onMounted(() => {
  generateWordsCloud();
});

watch(
  () => props.words,
  () => {
    updateWordsCloud();
  }
);

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
