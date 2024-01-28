<template>
  <div>
    <div
      class="bar_chart"
      ref="barChart"
      :style="`top: ${top}px; left: ${left}px;`"
    ></div>
  </div>
</template>

<script setup>
import * as d3 from "d3";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useStudioStore } from "stores/studio";
import { COLOR_SCHEME_OPTIONS } from "src/constants/canvas/canvasVariables";

/*
 * stores
 */
const presentationStore = usePresentationsStore();
const {
  room,
  slide,
  slideSettings,
  averageBackgroundBrightness,
  backgroundBrightnessThreshold,
} = storeToRefs(presentationStore);

const studioStore = useStudioStore();
const { stages } = storeToRefs(studioStore);

/*
 * data
 */
const props = defineProps({
  data: { type: Array },
  box: { type: Object, default: null },
});

const color = computed(() => {
  return slide.value.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
    ? "black"
    : "white";
});

const barChart = ref();
const isBarChartGenerated = ref(false);

const svg = ref();
const x = ref();
const xAxis = ref();
const y = ref();
const yAxis = ref();
const tooltip = ref();

const width = ref(0);
const height = ref(0);
const left = ref(0);
const top = ref(0);

/*
 * hooks
 */
watch(
  () => props.data,
  () => {
    update();
  },
);

watch(
  () => color.value,
  () => {
    update();
  },
);

onMounted(() => {
  update();
});

watch(
  () => props.box,
  () => {
    update();
  },
  { deep: true },
);

/*
 * d3 bar chart
 */
const generate = () => {
  if (!barChart.value) return;
  d3.select(barChart.value).selectAll("svg").remove();

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
            "</div>",
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
  // yAxis.value = svg.value.append("g");

  isBarChartGenerated.value = true;
  update();
};

const update = () => {
  width.value = (props.box?.width * 80) / 100;
  height.value = (props.box?.height * 70) / 100;
  left.value = props.box?.left + (props.box?.width - width.value) / 2;
  top.value = props.box?.top + (props.box?.height - height.value) / 2;

  if (!isBarChartGenerated.value) return generate();

  svg.value = d3
    .select(barChart.value)
    .select("svg")
    .attr("width", width.value)
    .attr("height", height.value + (height.value * 15) / 100)
    .select("g");
  // .attr("transform", `translate(${0}, ${(height.value * 15) / 100})`);

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
    .style("font-size", "22px")
    .style("fill", color.value)
    .call(wrap, x.value.bandwidth());
  xAxis.value.selectAll("path").style("stroke", color.value);
  xAxis.value.selectAll("line").style("stroke", color.value);

  const maxWidth = 100;
  const barSize = Math.min(maxWidth, x.value.bandwidth());

  const xOffset =
    (x.value.bandwidth() - Math.min(maxWidth, x.value.bandwidth())) / 2;

  svg.value
    .selectAll("rect")
    .data(props.data)
    .join("rect")
    .transition()
    .duration(0)
    .attr("x", (d) => x.value(d.group) + xOffset)
    .attr("y", (d) => y.value(d.value) + 0.5)
    .attr("width", barSize)
    .attr("height", (d) => (d.value > 0 ? height.value - y.value(d.value) : 0))
    .attr("width", barSize)
    .attr("height", (d) => (d.value > 0 ? height.value - y.value(d.value) : 0))
    .attr("fill", (d) => (d.isCorrect ? "#21BA45" : "#EA5757"))
    .attr("stroke", color.value)
    .attr("stroke-width", 1);

  svg.value
    .selectAll(".bar-text")
    .data(props.data)
    .join("text")
    .attr("class", "bar-text")
    .attr("x", (d) => x.value(d.group) + xOffset + barSize / 2)
    .attr("y", (d) => y.value(d.value) - 10 - (d.image ? 100 : 0)) // Adjust the y position as needed
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("fill", color.value)
    .text((d) => d.value);

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
</script>

<style scoped lang="scss">
.bar_chart {
  position: fixed;
  z-index: 1;
}
</style>
