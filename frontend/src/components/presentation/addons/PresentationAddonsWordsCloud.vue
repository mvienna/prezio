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
const { canvas, scale } = storeToRefs(canvasStore);

const presentationsStore = usePresentationsStore();
const { showRoomInvitationPanel } = storeToRefs(presentationsStore);

/*
 * props
 */
const props = defineProps({
  words: { type: Array, default: null },
});

/*
 * data
 */
const wordCloud = ref();

const canvasRect = ref(canvasStore.canvasRect());

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

/*
 * draw
 */
const svg = ref();

const width = computed(() => {
  return canvasRect.value.width;
});

const height = computed(() => {
  return (canvasRect.value.height * 75) / 100 - 148;
});

const generateWordsCloud = () => {
  d3.select(wordCloud.value).append("svg").append("g");
  updateWordsCloud();
};

const updateWordsCloud = () => {
  d3.select(wordCloud.value)
    .select("svg")
    .transition()
    .duration(600)
    .attr("width", width.value)
    .attr("height", height.value);

  cloud()
    .size([width.value, height.value])
    .words(data.value)
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .fontSize((d) => d.size)
    .on("end", draw)
    .start();
};

const draw = (words) => {
  let wordGroup = d3
    .select(wordCloud.value)
    .select("svg")
    .select("g.word-group");

  if (wordGroup.empty()) {
    wordGroup = d3
      .select(wordCloud.value)
      .select("svg")
      .append("g")
      .attr("class", "word-group");
  }

  const cloud = wordGroup
    .attr("transform", `translate(${width.value / 2}, ${height.value / 2})`)
    .selectAll("text")
    .data(words, (d) => d.text);

  const newElements = cloud
    .enter()
    .append("text")
    .style(
      "fill",
      () =>
        wordCloudTextColors[
          Math.floor(Math.random() * wordCloudTextColors.length)
        ]
    )
    .style("font-size", (d) => `${d.size}px`)
    .style("font-weight", "500")
    .attr("text-anchor", "middle")
    .text((d) => d.text)
    .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`);

  newElements
    .style("fill-opacity", 1e-6)
    .transition()
    .duration(600)
    .style("fill-opacity", 1);

  cloud
    .transition()
    .duration(600)
    .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
    .style("fill-opacity", 1);

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
  setTimeout(() => {
    canvasRect.value = canvasStore.canvasRect();
    generateWordsCloud();
  }, 500);

  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

watch(
  () => props.words,
  () => {
    updateWordsCloud();
  }
);

watch(
  () => showRoomInvitationPanel.value,
  () => {
    setTimeout(() => {
      canvasRect.value = canvasStore.canvasRect();
      updateWordsCloud();
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
  updateWordsCloud();
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
