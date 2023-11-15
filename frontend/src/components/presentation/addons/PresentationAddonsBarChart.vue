<template>
  <div>
    <div
      class="bar_chart"
      ref="barChart"
      :style="`top: ${
        canvasRect.top + canvasRect.height / 2 - height / 2 - margin.top
      }px; left: ${
        canvasRect.left + canvasRect.width / 2 - width / 2 - margin.left
      }px;`"
    ></div>
  </div>
</template>

<script setup>
import * as d3 from "d3";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useCanvasStore } from "stores/canvas";

/*
 * stores
 */
const presentationStore = usePresentationsStore();
const {
  room,
  slide,
  slideSettings,
  showRoomInvitationPanel,
  averageBackgroundBrightness,
  backgroundBrightnessThreshold,
} = storeToRefs(presentationStore);

const canvasStore = useCanvasStore();
const { canvas, scale } = storeToRefs(canvasStore);

/*
 * data
 */
const data = computed(() => {
  return slideSettings.value.answerOptions?.map((option) => {
    if (!slide.value?.answers) {
      return {
        group: "",
        value: 0,
        participants: [],
        isCorrect: option.isCorrect,
      };
    }

    return {
      group: (option.isCorrect ? "✅" : "❌") + " " + option.value,
      value:
        !room.value || room.value?.is_answers_revealed
          ? slide.value.answers.filter(
              (answer) => JSON.parse(answer.answer_data)?.text === option.value
            ).length
          : 0,
      participants: slide.value.answers
        .filter(
          (answer) =>
            JSON.parse(answer.answer_data)?.text === option.value &&
            answer.slide_type === slide.value?.type
        )
        .map((answer) =>
          answer.participant?.user_data
            ? JSON.parse(answer.participant.user_data)
            : { avatar: "", name: "" }
        ),
      isCorrect: option.isCorrect,
    };
  });
});

const color = computed(() => {
  return averageBackgroundBrightness.value >=
    backgroundBrightnessThreshold.value
    ? "black"
    : "white";
});

const barChart = ref();
const svg = ref();

const x = ref();
const xAxis = ref();

const y = ref();
const yAxis = ref();

const tooltip = ref();

const canvasRect = ref(canvasStore.canvasRect());
const margin = { top: 50, right: 100, bottom: 150, left: 100 };
const width = computed(() => {
  return (canvasRect.value.width * 80) / 100;
});
const height = computed(() => {
  return (canvasRect.value.height * 40) / 100;
});

onMounted(() => {
  setTimeout(() => {
    canvasRect.value = canvasStore.canvasRect();

    tooltip.value = d3
      .select(barChart.value)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("border-radius", "16px")
      .style("padding", "8px 16px")
      .style("background", "rgba(0, 0, 0, 0.5)")
      .style("color", "white")
      .style("backdrop-filter", "blur(4px)");

    svg.value = d3
      .select(barChart.value)
      .append("svg")
      .attr("width", width.value)
      .attr("height", height.value)
      .append("g")
      .on("mouseover", (d) => {
        tooltip.value.style("opacity", 1);
        d.target.style.opacity = 0.85;
      })
      .on("mousemove", (d) => {
        if (!d.target?.__data__?.value) {
          tooltip.value.style("opacity", 0);
          d.target
            .querySelectorAll("rect")
            .forEach((rect) => (rect.style.opacity = 1));
          return;
        }

        tooltip.value
          .html(
            "<b>Ответов: " +
              d.target.__data__.value +
              "</b></br><div>" +
              d.target.__data__.participants
                .map(
                  (participant) => participant.avatar + " " + participant.name
                )
                .join(", ") +
              "</div>"
          )
          .style("left", d.offsetX + "px")
          .style("top", d.offsetY + "px");
      })
      .on("mouseleave", (d) => {
        tooltip.value.style("opacity", 0);
        d.target
          .querySelectorAll("rect")
          .forEach((rect) => (rect.style.opacity = 1));
      });

    x.value = d3.scaleBand().range([0, width.value]).padding(0.2);
    xAxis.value = svg.value
      .append("g")
      .attr("transform", `translate(0, ${height.value + 1})`);

    y.value = d3.scaleLinear().range([height.value, 0]);
    yAxis.value = svg.value.append("g").attr("class", "myYaxis");

    update();
  }, 500);

  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const update = () => {
  if (!svg.value) return;

  x.value = d3.scaleBand().range([0, width.value]).padding(0.2);
  xAxis.value = svg.value
    .select("g")
    .attr("transform", `translate(0, ${height.value})`);

  y.value = d3.scaleLinear().range([height.value, 0]);
  yAxis.value = svg.value.select("g").attr("class", "myYaxis");

  svg.value = d3
    .select(barChart.value)
    .select("svg")
    .attr("width", width.value + margin.left + margin.right)
    .attr("height", height.value + margin.top + margin.bottom)
    .select("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  x.value.domain(data.value.map((d) => d.group));
  xAxis.value.call(d3.axisBottom(x.value));

  xAxis.value
    .selectAll("text")
    .style("font-size", "16px")
    .style("fill", color.value)
    .attr("transform", "translate(-10,0) rotate(-45)")
    .style("text-anchor", "end");
  xAxis.value.selectAll("path").style("stroke", color.value);
  xAxis.value.selectAll("line").style("stroke", color.value);

  y.value.domain([0, d3.max(data.value, (d) => d.value)]);
  // yAxis.value.transition().duration(1000).call(d3.axisLeft(y));

  svg.value
    .selectAll("rect")
    .data(data.value)
    .join("rect")
    .transition()
    .duration(600)
    .attr("x", (d) => x.value(d.group))
    .attr("y", (d) => y.value(d.value))
    .attr("width", x.value.bandwidth())
    .attr("height", (d) => {
      return d.value > 0 ? height.value - y.value(d.value) : 0;
    })
    .attr("fill", (d) => {
      return d.isCorrect ? "#21BA45" : "#EA5757";
    });
};

watch(
  () => data.value,
  () => {
    if (data.value) {
      update();
    }
  },
  { deep: true }
);

watch(
  () => showRoomInvitationPanel.value,
  () => {
    setTimeout(() => {
      canvasRect.value = canvasStore.canvasRect();
      update();
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
  update();
};

watch(
  () => averageBackgroundBrightness.value,
  () => {
    xAxis.value?.selectAll("text")?.style("fill", color.value);
    xAxis.value?.selectAll("path")?.style("stroke", color.value);
    xAxis.value?.selectAll("line")?.style("stroke", color.value);
  }
);
</script>

<style scoped lang="scss">
.bar_chart {
  position: fixed;
  z-index: 1;
}

.bar_chart,
.bar_chart div,
svg,
g,
rect {
  transition: 0.6s;
}
</style>
