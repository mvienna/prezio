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
const props = defineProps({
  data: { type: Array },
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
const margin = computed(() => {
  return {
    top: (canvasRect.value.height * 25) / 100,
    right: (canvasRect.value.width * 10) / 100,
    bottom: (canvasRect.value.height * 25) / 100,
    left: (canvasRect.value.width * 10) / 100,
  };
});
const width = computed(() => {
  return (canvasRect.value.width * 80) / 100;
});
const height = computed(() => {
  return (canvasRect.value.height * 50) / 100;
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
              d.target.__data__.tooltipData.join(", ") +
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

    xAxis.value = svg.value.append("g");
    yAxis.value = svg.value.append("g");

    update(true);
  }, 500);

  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const update = (isOnLoad = false) => {
  if (!svg.value) return;

  svg.value = d3
    .select(barChart.value)
    .select("svg")
    .attr("width", width.value + margin.value.left + margin.value.right)
    .attr("height", height.value + margin.value.top + margin.value.bottom)
    .select("g")
    .attr(
      "transform",
      `translate(${margin.value.left}, ${
        margin.value.top + margin.value.bottom / 2
      })`
    );

  svg.value.selectAll("image").remove();

  x.value = d3.scaleBand().range([0, width.value]).padding(0.2);
  xAxis.value = svg.value
    .select("g")
    .attr("transform", `translate(0, ${height.value})`);

  x.value.domain(props.data.map((d) => d.group));
  xAxis.value.call(d3.axisBottom(x.value));

  y.value = d3.scaleLinear().range([height.value, 0]);
  const maxScore = d3.max(props.data, (d) => d.value);
  if (maxScore > 0) {
    y.value.domain([0, maxScore]);
  }

  function wrap(text, width) {
    text.each(function () {
      let text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1,
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")) || 0,
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }

  xAxis.value
    .selectAll("text")
    .style("font-size", "16px")
    .style("fill", color.value)
    .call(wrap, x.value.bandwidth());
  xAxis.value.selectAll("path").style("stroke", color.value);
  xAxis.value.selectAll("line").style("stroke", color.value);

  const maxWidth = 75;
  const barSize = Math.min(maxWidth, x.value.bandwidth());

  const xOffset =
    (x.value.bandwidth() - Math.min(maxWidth, x.value.bandwidth())) / 2;

  svg.value
    .selectAll("rect")
    .data(props.data)
    .join("rect")
    .transition()
    .duration(isOnLoad ? 0 : 200)
    .attr("x", (d) => x.value(d.group) + xOffset)
    .attr("y", (d) => y.value(d.value))
    .attr("width", barSize)
    .attr("height", (d) => (d.value > 0 ? height.value - y.value(d.value) : 0))
    .attr("width", barSize)
    .attr("height", (d) => (d.value > 0 ? height.value - y.value(d.value) : 0))
    .attr("fill", (d) => (d.isCorrect ? "#21BA45" : "#EA5757"));

  svg.value
    .selectAll("image")
    .data(props.data)
    .join("image")
    .filter((d) => d.image)
    .attr("xlink:href", (d) => d.image)
    .attr("width", barSize)
    .attr("height", barSize)
    .attr("x", (d) => x.value(d.group) + xOffset)
    .attr("y", (d) => y.value(d.value) - barSize)
    .attr("preserveAspectRatio", "xMidYMid slice");
};

watch(
  () => props.data,
  () => {
    if (props.data) {
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
