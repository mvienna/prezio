<template>
  <!-- word could -->
  <div
    class="participants_word_cloud"
    :style="`left: ${canvasRect.left}px; top: ${
      canvasRect.top + (canvasRect.height * 25) / 100
    }px;`"
  >
    <div ref="wordCloud"></div>
  </div>

  <!-- header -->
  <div
    class="waiting_for_participants__header text-no-wrap"
    :class="`text-${textColor}`"
  >
    {{ $t("presentationRoom.waitingForParticipants.title") }}
  </div>

  <!-- footer -->
  <div class="waiting_for_participants__footer" :class="`text-${textColor}`">
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

    <q-btn
      unelevated
      no-caps
      :label="$t('presentationRoom.waitingForParticipants.startQuiz.title')"
      class="q-px-xl"
      style="height: 62px"
      size="18px"
      @click="presentationsStore.handleQuizStart()"
    />
  </div>
</template>

<script setup>
import * as d3 from "d3";
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { wordCloudTextColors } from "src/helpers/colorUtils";
import cloud from "d3-cloud";

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { canvas } = storeToRefs(canvasStore);

const presentationsStore = usePresentationsStore();
const {
  room,
  presentation,
  slideSettings,
  participants,
  averageRoomBackgroundBrightness,
  roomBackgroundBrightnessThreshold,
  showRoomInvitationPanel,
} = storeToRefs(presentationsStore);

/*
 * text color
 */
const textColor = computed(() => {
  return averageRoomBackgroundBrightness.value >=
    roomBackgroundBrightnessThreshold.value
    ? "black"
    : "white";
});

/*
 * word cloud data
 */
const wordCloud = ref();

const canvasRect = ref(canvasStore.canvasRect());

let frequencyCount = computed(() => {
  return participants.value
    .map((user) => {
      const user_data = JSON.parse(user.user_data);
      return (user_data.avatar ? user_data.avatar + " " : "") + user_data.name;
    })
    .reduce(function (acc, curr) {
      if (typeof acc[curr] == "undefined") {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }
      return acc;
    }, {});
});

const data = computed(() => {
  return Object.keys(frequencyCount.value).map((key) => {
    return {
      text: key,
      size: frequencyCount.value[key] * canvasStore.computeAdjustedSize(8),
    };
  });
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
});

watch(
  () => participants.value,
  () => {
    updateWordsCloud();
  },
  { deep: true }
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

/*
 * click on words
 */
onBeforeMount(() => {
  document.addEventListener("click", handleWordsCloudClickEvent);
});

const handleWordsCloudClickEvent = (event) => {
  if (event.target.nodeName === "text") {
  }
};
</script>

<style lang="scss">
.participants_word_cloud,
.participants_word_cloud div,
svg,
g,
text {
  transition: 0.6s;
}

.participants_word_cloud {
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
  top: 100px;
  transform: translate(-50%, 0) scale(1);
  font-size: 2em;
  font-weight: 600;
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
    border-radius: 24px;
    background: rgba(0, 0, 0, 0.5);
    color: $white;
    backdrop-filter: blur(4px);
  }
}
</style>
