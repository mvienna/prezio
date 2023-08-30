<template>
  <q-page>
    <!-- toolbar -->
    <PresentationToolbar
      :modes="modes"
      :is-drawing-mode="isDrawingMode"
      :is-media-mode="isMediaMode"
      :is-text-mode="isTextMode"
      @switch-mode="canvasStore.switchMode($event)"
      @deselect="
        drawingState.selectedLineIndex !== -1
          ? drawingStore.deselectLine()
          : textState.selectedTextIndex !== -1
          ? textStore.deselectText()
          : mediaState.selectedImageIndex !== -1
          ? mediaStore.deselectImage()
          : ''
      "
      @delete="
        drawingState.selectedLineIndex !== -1
          ? drawingStore.deleteSelectedLine()
          : textState.selectedTextIndex !== -1
          ? textStore.deleteSelectedText
          : mediaState.selectedImageIndex !== -1
          ? mediaStore.deleteSelectedImage()
          : ''
      "
      @undo="drawingStore.undo()"
      @redo="drawingStore.redo()"
      @add-image="mediaStore.addImage($event)"
      @format-text="textStore.applyFormattingToSelectedText($event)"
      @toggle-eraser="drawingStore.toggleEraser()"
    />

    <!-- canvas -->
    <div class="q-pa-lg">
      <canvas
        ref="canvasRef"
        id="canvas"
        :style="`cursor: ${canvasCursor}`"
        @mousedown="handleCanvasMouseDown"
        @mousemove="handleCanvasMouseMove"
        @mouseup="handleCanvasMouseUp"
        @click="handleCanvasClick"
      ></canvas>

      <!-- mouse position -->
      <div class="q-mt-md text-right">
        Mouse Position: {{ mouse.x }}, {{ Math.round(mouse.y) }}
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useCanvasDrawingStore } from "stores/canvas/drawing";
import { useCanvasStore } from "stores/canvas";
import { useCanvasTextStore } from "stores/canvas/text";
import { useCanvasMediaStore } from "stores/canvas/media";
import PresentationToolbar from "components/presentation/PresentationToolbar.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { canvas, ctx, mouse, mode, texts } = storeToRefs(canvasStore);

const drawingStore = useCanvasDrawingStore();
const { drawingState } = storeToRefs(drawingStore);

const textStore = useCanvasTextStore();
const { textState } = storeToRefs(textStore);

const mediaStore = useCanvasMediaStore();
const { mediaState } = storeToRefs(mediaStore);

/*
 * modes
 */
const modes = {
  drawing: "drawing",
  text: "text",
  media: "media",
  mediaShapes: "media-shapes",
  mediaEmojis: "media-emojis",
};

const isDrawingMode = computed(() => {
  return mode.value === modes.drawing;
});

const isTextMode = computed(() => {
  return mode.value === modes.text;
});

const isMediaMode = computed(() => {
  return mode.value === modes.media;
});

const isMediaShapesMode = computed(() => {
  return mode.value === modes.mediaShapes;
});

const isMediaEmojisMode = computed(() => {
  return mode.value === modes.mediaEmojis;
});

/*
 * canvas init, setup
 */
const canvasRef = ref();

onMounted(() => {
  canvas.value = canvasRef.value;
  ctx.value = canvas.value.getContext("2d");
  ctx.value.imageSmoothingEnabled = true;

  // set default stroke color
  ctx.value.strokeStyle = drawingState.value.customization.strokeColor;

  // resize canvas
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // shortcuts
  document.addEventListener("keydown", (event) => {
    if (isDrawingMode.value) drawingStore.shortcuts(event);
    if (isTextMode.value) textStore.shortcuts(event);
    if (isMediaMode.value || isMediaShapesMode.value || isMediaEmojisMode.value)
      mediaStore.shortcuts(event);
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "Shift") {
      mediaState.value.isShiftKeyPressed = false;
    }
  });
});

const resizeCanvas = () => {
  const page = document.getElementsByClassName("q-page")[0];
  const aspectRatio = 16 / 9;
  canvas.value.width = page.offsetWidth;
  canvas.value.height = page.offsetWidth / aspectRatio;

  canvasStore.clearCanvas();
  drawingStore.redrawCanvas();
  textStore.redrawCanvas();
};

/*
 * canvas cursor
 */
const canvasCursor = computed(() => {
  return mediaState.value.resizeHandle
    ? mediaState.value.resizeHandle === "top-left"
      ? "nw-resize"
      : mediaState.value.resizeHandle === "top-right"
      ? "ne-resize"
      : mediaState.value.resizeHandle === "bottom-left"
      ? "sw-resize"
      : mediaState.value.resizeHandle === "bottom-right"
      ? "se-resize"
      : ""
    : mediaState.value.rotationHandle
    ? "alias"
    : drawingState.value.selectedLineIndex !== -1 ||
      textState.value.selectedTextIndex !== -1 ||
      mediaState.value.selectedImageIndex !== -1
    ? "move"
    : "crosshair";
});

/*
 * canvas events
 */
const handleCanvasMouseDown = (event) => {
  // drawing
  if (isDrawingMode.value) {
    if (drawingState.value.selectedLineIndex !== -1) {
      drawingStore.startDrag(event);
    } else {
      drawingStore.startPainting(event);
    }
  }

  // text
  if (isTextMode.value) {
    if (textState.value.selectedTextIndex !== -1) {
      textStore.startDrag(event);
    }
  }

  // media
  if (isMediaMode.value || isMediaShapesMode.value || isMediaEmojisMode.value) {
    if (mediaState.value.selectedImageIndex !== -1) {
      if (mediaState.value.resizeHandle) {
        mediaStore.startResize(event);
      } else if (mediaState.value.rotationHandle) {
        mediaStore.startRotate(event);
      } else {
        mediaStore.startDrag(event);
      }
    }
  }
};

const handleCanvasMouseUp = () => {
  // drawing
  if (isDrawingMode.value) {
    if (drawingState.value.selectedLineIndex !== -1) {
      drawingStore.endDrag();
    } else {
      drawingStore.finishedPainting();
    }
  }

  // text
  if (isTextMode.value) {
    if (textState.value.selectedTextIndex !== -1) {
      textStore.endDrag();
    }
  }

  // media
  if (isMediaMode.value || isMediaShapesMode.value || isMediaEmojisMode.value) {
    if (mediaState.value.selectedImageIndex !== -1) {
      if (mediaState.value.isResizing) {
        mediaStore.endResize();
      } else if (mediaState.value.isRotating) {
        mediaStore.endRotate();
      } else {
        mediaStore.endDrag();
      }
    }
  }
};

const handleCanvasMouseMove = (event) => {
  // track mouse
  mouse.value = {
    x: event.clientX - canvasStore.canvasRect().left,
    y: event.clientY - canvasStore.canvasRect().top,
  };

  // drawing
  if (isDrawingMode.value) {
    if (drawingState.value.selectedLineIndex !== -1) {
      drawingStore.dragLine(event);
    } else {
      drawingStore.draw(event);
    }
  }

  // text
  if (isTextMode.value) {
    if (textState.value.selectedTextIndex !== -1) {
      textStore.dragText(event);
    } else {
      const hoveredTextIndex = textStore.findText(event);

      if (hoveredTextIndex !== -1) {
        const hoveredText = texts.value[hoveredTextIndex];

        const { paddingLeft } = canvasStore.getPaddings();
        const paddingTop = 8;

        textStore.drawBorder(
          hoveredText.x + paddingLeft,
          hoveredText.y + paddingTop,
          hoveredText.box.width,
          hoveredText.box.height
        );
      } else {
        textStore.redrawCanvas();
      }
    }
  }

  // media
  if (isMediaMode.value || isMediaShapesMode.value || isMediaEmojisMode.value) {
    if (mediaState.value.selectedImageIndex !== -1) {
      mediaState.value.resizeHandle = mediaStore.getResizeHandle(event);
      mediaState.value.rotationHandle = mediaStore.getRotationHandle(event);

      if (mediaState.value.isResizing) {
        mediaStore.resizeImage(event);
      } else if (mediaState.value.isRotating) {
        mediaStore.rotateImage(event);
      } else {
        mediaStore.dragImage(event);
      }
    }
  }
};

const handleCanvasClick = (event) => {
  // drawing
  if (isDrawingMode.value) {
    drawingStore.selectLine(event);
  }

  // text
  if (isTextMode.value) {
    const clickedTextIndex = textStore.findText(event);

    if (clickedTextIndex !== -1) {
      textStore.selectText(clickedTextIndex);
    } else {
      textStore.createNewText(event);
    }
  }

  // media
  if (isMediaMode.value || isMediaShapesMode.value || isMediaEmojisMode.value) {
    mediaStore.selectImage(event);
  }
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,400;1,700&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap");

.q-page {
  height: calc(100vh - 66px);
  overflow-y: scroll;
}

canvas {
  background-color: $white;
  border-radius: 6px;
  width: 100%;
}
</style>
