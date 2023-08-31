<template>
  <q-page style="">
    <!-- toolbar -->
    <PresentationToolbarTop
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
    <div class="canvas__wrapper q-pa-lg">
      <canvas
        ref="canvasRef"
        id="canvas"
        :class="canvasCursor"
        @mousedown="handleCanvasMouseDown"
        @mousemove="handleCanvasMouseMove"
        @mouseup="handleCanvasMouseUp"
        @click="handleCanvasClick"
      ></canvas>
    </div>

    <PresentationToolbarBottom
      @zoom="canvasStore.handleZoom(null, mouse.x, mouse.y, $event)"
      @zoomIn="canvasStore.handleZoom(null, mouse.x, mouse.y, scale + 0.25)"
      @zoomOut="canvasStore.handleZoom(null, mouse.x, mouse.y, scale - 0.25)"
    />
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
import PresentationToolbarTop from "components/presentation/PresentationToolbarTop.vue";
import PresentationToolbarBottom from "components/presentation/PresentationToolbarBottom.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { canvas, ctx, mouse, scale, mode, texts } = storeToRefs(canvasStore);

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

  /*
   * canvas zoom
   */
  canvas.value.addEventListener("wheel", (event) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();

      const delta = event.deltaY > 0 ? -1 : 1;
      canvasStore.handleZoom(delta, event.clientX, event.clientY);
    }
  });

  /*
   * canvas shortcuts
   */
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
  canvas.value.width = 1920;
  canvas.value.height = 1080;

  ctx.value.scale(scale.value, scale.value);

  canvasStore.redrawCanvas();
};

/*
 * canvas cursor
 */
const canvasCursor = computed(() => {
  return mediaState.value.resizeHandle
    ? mediaState.value.resizeHandle === "top-left"
      ? "cursor-nw-resize"
      : mediaState.value.resizeHandle === "top-right"
      ? "cursor-ne-resize"
      : mediaState.value.resizeHandle === "bottom-left"
      ? "cursor-sw-resize"
      : mediaState.value.resizeHandle === "bottom-right"
      ? "cursor-se-resize"
      : ""
    : mediaState.value.rotationHandle
    ? "cursor-alias"
    : drawingState.value.selectedLineIndex !== -1 ||
      textState.value.selectedTextIndex !== -1 ||
      mediaState.value.selectedImageIndex !== -1
    ? "cursor-move"
    : "cursor-crosshair";
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
      textStore.startDrag();
    }
  }

  // media
  if (isMediaMode.value || isMediaShapesMode.value || isMediaEmojisMode.value) {
    if (mediaState.value.selectedImageIndex !== -1) {
      if (mediaState.value.resizeHandle) {
        mediaStore.startResize(event);
      } else if (mediaState.value.rotationHandle) {
        mediaStore.startRotate();
      } else {
        mediaStore.startDrag();
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
  const canvasRect = canvasStore.canvasRect();

  const scaledX = event.clientX - canvasRect.left;
  const scaledY = event.clientY - canvasRect.top;

  const actualX = (scaledX / canvasRect.width) * canvas.value.width;
  const actualY = (scaledY / canvasRect.height) * canvas.value.height;

  mouse.value = {
    x: actualX,
    y: actualY,
  };

  // drawing
  if (isDrawingMode.value) {
    if (drawingState.value.selectedLineIndex !== -1) {
      drawingStore.dragLine();
    } else {
      drawingStore.draw();
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
      mediaState.value.resizeHandle = mediaStore.getResizeHandle();
      mediaState.value.rotationHandle = mediaStore.getRotationHandle();

      if (mediaState.value.isResizing) {
        mediaStore.resizeImage(event);
      } else if (mediaState.value.isRotating) {
        mediaStore.rotateImage();
      } else {
        mediaStore.dragImage();
      }
    }
  }
};

const handleCanvasClick = (event) => {
  // drawing
  if (isDrawingMode.value) {
    drawingStore.selectLine();
  }

  // text
  if (isTextMode.value) {
    const clickedTextIndex = textStore.findText();

    if (clickedTextIndex !== -1) {
      textStore.selectText(clickedTextIndex);
    } else {
      textStore.createNewText(event);
    }
  }

  // media
  if (isMediaMode.value || isMediaShapesMode.value || isMediaEmojisMode.value) {
    mediaStore.selectImage();
  }
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,400;1,700&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap");

.q-page {
  height: calc(100vh - 66px);
  overflow-y: scroll;
}

.canvas__wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
  z-index: 1;

  canvas {
    background-color: $white;
    border-radius: 6px;
    width: 100%;
    z-index: 1;
  }
}

.cursor-nw-resize {
  cursor: nw-resize;
}
.cursor-ne-resize {
  cursor: ne-resize;
}
.cursor-sw-resize {
  cursor: sw-resize;
}
.cursor-se-resize {
  cursor: se-resize;
}
.cursor-alias {
  cursor: alias;
}
.cursor-move {
  cursor: move;
}
.cursor-crosshair {
  cursor: crosshair;
}
</style>
