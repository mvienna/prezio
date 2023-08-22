<template>
  <q-page>
    <!-- header -->
    <div class="bg-white q-py-md q-px-lg row no-wrap q-gutter-md">
      <!-- drawing -->
      <q-btn icon="gesture" unelevated text-color="dark" round size="12px">
        <q-menu
          anchor="bottom left"
          self="top left"
          transition-show="jump-down"
          transition-hide="jump-up"
          :offset="[0, 8]"
          class="q-pa-sm"
          style="width: 230px"
        >
          <!-- color picker -->
          <q-item
            dense
            class="items-center text-semibold justify-start rounded-borders"
          >
            <q-icon
              name="o_palette"
              class="q-mr-md text-semibold"
              :style="`color: ${strokeColor}`"
              size="20px"
            />
            <div class="q-mr-lg" :style="`color: ${strokeColor}`">
              {{ $t("presentationEditor.drawing.options.color") }}
            </div>

            <q-space />

            <input type="color" class="color_input" v-model="strokeColor" />
          </q-item>

          <!-- eraser -->
          <q-item
            dense
            class="items-center text-semibold justify-start rounded-borders q-py-sm q-mt-md"
            :class="eraserMode ? 'text-black' : 'text-grey-5'"
            clickable
            v-close-popup
            @click="toggleEraser()"
          >
            <q-icon
              name="icon-eraser"
              class="q-mr-md text-semibold"
              size="20px"
            />
            <div class="q-mr-lg text-no-wrap">
              {{ $t("presentationEditor.drawing.options.erase") }}
            </div>
          </q-item>

          <!-- brush size -->
          <q-item
            dense
            class="items-center text-semibold justify-start rounded-borders q-mt-sm"
          >
            <q-select
              v-model="brushSize"
              :options="brushSizeOptions"
              map-options
              emit-value
              borderless
              :label="$t('presentationEditor.drawing.options.brushSize')"
              class="full-width"
              color="dark"
            >
              <template #prepend>
                <q-icon
                  name="line_weight"
                  class="q-mr-xs text-semibold text-dark"
                  size="20px"
                />
              </template>
            </q-select>
          </q-item>

          <!-- brush type -->
          <q-item
            dense
            class="items-center text-semibold justify-start rounded-borders"
          >
            <q-select
              v-model="selectedBrushType"
              :options="brushTypes"
              map-options
              emit-value
              borderless
              class="full-width"
              color="dark"
              :label="$t('presentationEditor.drawing.options.brushType')"
            >
              <template #prepend>
                <q-icon
                  name="brush"
                  class="q-mr-xs text-semibold text-dark"
                  size="20px"
                />
              </template>
            </q-select>
          </q-item>
        </q-menu>
      </q-btn>

      <!-- text -->
      <q-btn
        icon="text_fields"
        unelevated
        text-color="dark"
        round
        size="12px"
      />

      <!-- image -->
      <q-btn icon="o_image" unelevated text-color="dark" round size="12px" />

      <!-- gif -->
      <q-btn icon="o_gif_box" unelevated text-color="dark" round size="12px" />

      <!-- emoji -->
      <q-btn icon="mood" unelevated text-color="dark" round size="12px" />

      <!-- shapes -->
      <q-btn
        icon="o_shape_line"
        unelevated
        text-color="dark"
        round
        size="12px"
      />

      <q-space />

      <!-- undo button -->
      <q-btn
        icon="undo"
        unelevated
        text-color="dark"
        size="12px"
        round
        :disable="!undoStack.length"
        @click="undo()"
      />

      <!-- redo button -->
      <q-btn
        icon="redo"
        unelevated
        text-color="dark"
        size="12px"
        round
        :disable="!redoStack.length"
        @click="redo()"
      />

      <!-- delete line button -->
      <q-btn
        v-if="selectedLineIndex !== -1"
        icon="o_backspace"
        unelevated
        text-color="dark"
        size="12px"
        round
        @click="deleteSelectedLine()"
      />
    </div>

    <!-- slide -->
    <div class="q-pa-lg">
      <!-- canvas -->
      <canvas
        ref="canvas"
        id="drawingCanvas"
        @mousedown="handleCanvasMouseDown"
        @mousemove="handleCanvasMouseMove"
        @mouseup="handleCanvasMouseUp"
        @click="selectLine"
      ></canvas>

      <!-- mouse position -->
      <div class="q-mt-md text-right">
        Mouse Position: {{ mouseX }}, {{ Math.round(mouseY) }}
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * init
 */
onMounted(() => {
  ctx.value = canvas.value.getContext("2d");

  // set default stroke color
  ctx.value.strokeStyle = strokeColor.value;

  // resize canvas
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // shortcuts
  document.addEventListener("keydown", (event) => {
    // delete selected line
    if (event.key === "Delete" || event.key === "Backspace") {
      deleteSelectedLine();
    }

    // undo & redo
    if ((event.ctrlKey || event.metaKey) && event.key === "z") {
      if (event.shiftKey) {
        event.preventDefault();
        redo();
      } else {
        event.preventDefault();
        undo();
      }
    }
  });
});

/*
 * customization
 */
const strokeColor = ref("#000000");
const brushSize = ref(10);

const brushSizeOptions = [
  { value: 1, label: "1px" },
  { value: 2, label: "2px" },
  { value: 3, label: "3px" },
  { value: 4, label: "4px" },
  { value: 8, label: "8px" },
  { value: 12, label: "12px" },
  { value: 16, label: "16px" },
  { value: 24, label: "24px" },
];

const brushTypes = [
  { label: t("presentationEditor.drawing.brushTypes.pen"), value: "pen" },
  { label: t("presentationEditor.drawing.brushTypes.pencil"), value: "pencil" },
  { label: t("presentationEditor.drawing.brushTypes.marker"), value: "marker" },
];
const selectedBrushType = ref(brushTypes[0].value);

/*
 * canvas
 */
const canvas = ref();
const ctx = ref();

const mouseX = ref(0);
const mouseY = ref(0);

const canvasRect = computed(() => {
  return canvas.value.getBoundingClientRect();
});

const resizeCanvas = () => {
  const page = document.getElementsByClassName("q-page")[0];
  const aspectRatio = 16 / 9;
  canvas.value.width = page.offsetWidth;
  canvas.value.height = page.offsetWidth / aspectRatio;
  redrawCanvas();
};

const handleCanvasMouseDown = (event) => {
  if (selectedLineIndex.value !== -1) {
    startDrag(event);
  } else {
    startPainting(event);
  }
};

const handleCanvasMouseMove = (event) => {
  mouseX.value = event.clientX - canvasRect.value.left;
  mouseY.value = event.clientY - canvasRect.value.top;

  if (selectedLineIndex.value !== -1) {
    dragLine(event);
  } else {
    draw(event);
  }
};

const handleCanvasMouseUp = () => {
  if (selectedLineIndex.value !== -1) {
    endDrag();
  } else {
    finishedPainting();
  }
};

/*
 * drawing
 */
const lines = ref([]);
let currentLine = ref();
let currentIndex = ref(-1);

const isPainting = ref(false);
const eraserMode = ref(false);

let lastX = null;
let lastY = null;

const startPainting = (e) => {
  redoStack.value = [];
  isPainting.value = true;
  currentIndex.value = -1;
  ctx.value.strokeStyle = strokeColor.value;
  redrawCanvas();
  draw(e);
};

const finishedPainting = () => {
  isPainting.value = false;
  lastX = null;
  lastY = null;
  ctx.value.beginPath();
  if (currentLine.value) {
    undoStack.value.push(currentLine.value);
  }
  currentLine.value = null;
};

const draw = (event) => {
  if (!isPainting.value) return;

  const x = event.clientX - canvasRect.value.left;
  const y = event.clientY - canvasRect.value.top;

  if (lastX !== null && lastY !== null) {
    const deltaX = x - lastX;
    const deltaY = y - lastY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const step = 1.5;

    if (distance > step) {
      const steps = Math.floor(distance / step);
      const stepX = deltaX / steps;
      const stepY = deltaY / steps;

      for (let i = 0; i < steps; i++) {
        const currentX = lastX + stepX * i;
        const currentY = lastY + stepY * i;
        drawPoint(currentX, currentY);
      }
    }
  } else {
    drawPoint(x, y);
  }

  lastX = x;
  lastY = y;
};

const drawPoint = (x, y) => {
  ctx.value.lineWidth = currentLine.value?.brushSize || brushSize.value;
  ctx.value.lineCap = "round";

  if (!currentLine.value) {
    currentLine.value = {
      color: eraserMode.value ? "white" : strokeColor.value,
      brushSize: brushSize.value,
      brushType: selectedBrushType.value,
      points: [],
    };

    lines.value.push(currentLine.value);
    currentIndex.value++;
  }

  currentLine.value.points.push({ x, y });

  if (eraserMode.value) {
    ctx.value.globalCompositeOperation = "destination-out";
    ctx.value.arc(x, y, brushSize.value / 2, 0, Math.PI * 2);
    ctx.value.fill();
    ctx.value.globalCompositeOperation = "source-over";
  } else {
    ctx.value.globalCompositeOperation = "source-over";

    // reset default styles
    ctx.value.globalAlpha = 1;
    ctx.value.shadowBlur = null;
    ctx.value.shadowColor = null;

    switch (currentLine.value.brushType) {
      case "pen":
        break;

      case "pencil":
        ctx.value.globalAlpha = 0.1;
        break;

      case "marker":
        ctx.value.globalAlpha = 1;
        ctx.value.shadowBlur = 4;
        ctx.value.shadowColor = strokeColor.value;
        break;
    }

    ctx.value.lineTo(x, y);
    ctx.value.stroke();
  }

  ctx.value.beginPath();
  ctx.value.moveTo(x, y);
};

const clearCanvas = () => {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
};

const toggleEraser = () => {
  eraserMode.value = !eraserMode.value;
  lastX = null;
  lastY = null;
};

/*
 * undo & redo
 */
const undoStack = ref([]);
const redoStack = ref([]);

const undo = () => {
  if (undoStack.value.length > 0) {
    const line = undoStack.value.pop();
    lines.value.pop();
    redoStack.value.push(line);
    redrawCanvas();
    brushSize.value = line.brushSize;
  }
};

const redo = () => {
  if (redoStack.value.length > 0) {
    const line = redoStack.value.pop();
    lines.value.push(line);
    undoStack.value.push(line);
    redrawCanvas();
    brushSize.value = line.brushSize;
  }
};

const redrawCanvas = () => {
  clearCanvas();
  lines.value.forEach((line, index) => {
    ctx.value.strokeStyle = line.color;
    ctx.value.lineWidth = line.brushSize;

    // reset default styles
    ctx.value.globalAlpha = 1;
    ctx.value.shadowBlur = null;
    ctx.value.shadowColor = null;

    switch (line.brushType) {
      case "pen":
        break;

      case "pencil":
        ctx.value.globalAlpha = 0.1;
        break;

      case "marker":
        ctx.value.shadowBlur = 4;
        ctx.value.shadowColor = line.color;
        break;
    }

    ctx.value.beginPath();
    line.points.forEach((point, pointIndex) => {
      if (pointIndex === 0) {
        ctx.value.moveTo(point.x, point.y);
      } else {
        ctx.value.lineTo(point.x, point.y);
        ctx.value.stroke();
      }
    });

    // draw border for the selected line
    if (index === currentIndex.value) {
      const minX = Math.min(...line.points.map((point) => point.x));
      const maxX = Math.max(...line.points.map((point) => point.x));
      const minY = Math.min(...line.points.map((point) => point.y));
      const maxY = Math.max(...line.points.map((point) => point.y));
      drawBorder(minX, minY, maxX - minX, maxY - minY);
    }
  });
  ctx.value.beginPath();
};

/*
 * selection
 */
let selectedLineIndex = ref(-1);

const selectLine = (event) => {
  if (isPainting.value) {
    return;
  }

  const clickedX = event.clientX - canvasRect.value.left;
  const clickedY = event.clientY - canvasRect.value.top;

  let foundLine = false;

  // check if the clicked point is inside any line's bounding box
  for (let i = 0; i < lines.value.length; i++) {
    const line = lines.value[i];
    const minX = Math.min(...line.points.map((point) => point.x));
    const maxX = Math.max(...line.points.map((point) => point.x));
    const minY = Math.min(...line.points.map((point) => point.y));
    const maxY = Math.max(...line.points.map((point) => point.y));

    if (
      clickedX >= minX &&
      clickedX <= maxX &&
      clickedY >= minY &&
      clickedY <= maxY
    ) {
      currentIndex.value = i;
      selectedLineIndex.value = i;
      redrawCanvas();
      drawBorder(minX, minY, maxX - minX, maxY - minY);
      foundLine = true;
      break;
    }
  }

  if (!foundLine) {
    currentIndex.value = -1;
    selectedLineIndex.value = -1;
    redrawCanvas();
  }
};

const drawBorder = (x, y, width, height) => {
  // styles
  ctx.value.lineWidth = 3;
  ctx.value.strokeStyle = "#4971FF";
  const outlineColor = "#D7E0FF";
  const padding = 10;
  const borderRadius = 8;

  // calculate the coordinates and dimensions for the padded border
  const paddedX = x - padding;
  const paddedY = y - padding;
  const paddedWidth = width + 2 * padding;
  const paddedHeight = height + 2 * padding;

  // draw the outer border rectangle with the lighter outline
  ctx.value.strokeStyle = outlineColor;
  ctx.value.strokeRect(
    paddedX - 3,
    paddedY - 3,
    paddedWidth + 6,
    paddedHeight + 6
  );

  // draw the inner padded border rectangle with the red border and border radius
  ctx.value.strokeStyle = "#4971FF";
  ctx.value.lineJoin = "round";
  ctx.value.strokeRect(
    paddedX,
    paddedY,
    paddedWidth,
    paddedHeight,
    borderRadius
  );
};

const deleteSelectedLine = () => {
  if (selectedLineIndex.value !== -1) {
    const deletedLine = lines.value.splice(selectedLineIndex.value, 1)[0];
    undoStack.value.push(deletedLine);
    selectedLineIndex.value = -1;
    redrawCanvas();
  }
};

/*
 * dragging
 */
const draggingLine = ref(false);
let dragStartX = 0;
let dragStartY = 0;

const startDrag = (event) => {
  draggingLine.value = true;
  const line = lines.value[selectedLineIndex.value];
  const bounds = getLineBoundingBox(line);
  dragStartX = event.clientX - canvasRect.value.left - bounds.x;
  dragStartY = event.clientY - canvasRect.value.top - bounds.y;
};

const endDrag = () => {
  draggingLine.value = false;
};

const dragLine = (event) => {
  if (draggingLine.value) {
    const newX = event.clientX - canvasRect.value.left - dragStartX;
    const newY = event.clientY - canvasRect.value.top - dragStartY;
    moveLine(newX, newY);
  }
};

const getLineBoundingBox = (line) => {
  const minX = Math.min(...line.points.map((point) => point.x));
  const maxX = Math.max(...line.points.map((point) => point.x));
  const minY = Math.min(...line.points.map((point) => point.y));
  const maxY = Math.max(...line.points.map((point) => point.y));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};

const moveLine = (newX, newY) => {
  const line = lines.value[selectedLineIndex.value];
  const deltaX = newX - line.points[0].x;
  const deltaY = newY - line.points[0].y;

  line.points.forEach((point) => {
    point.x += deltaX;
    point.y += deltaY;
  });

  redrawCanvas();
};
</script>

<style scoped lang="scss">
.q-page {
  height: calc(100vh - 66px);
  overflow-y: scroll;
}

canvas {
  background-color: $white;
  border-radius: 6px;
  cursor: crosshair;
  width: 100%;
}

.color_input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: calc(36px * 1.5);
  height: 36px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
.color_input::-webkit-color-swatch {
  border-radius: 8px;
  border: none;
}
.color_input::-moz-color-swatch {
  border-radius: 8px;
  border: none;
}
</style>
