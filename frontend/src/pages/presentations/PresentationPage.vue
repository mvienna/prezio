<template>
  <q-page style="">
    <!-- toolbar -->
    <PresentationToolbarTop
      :is-drawing-mode="mode === MODES_OPTIONS.drawing"
      :is-text-mode="mode === MODES_OPTIONS.text"
      :is-media-mode="
        [MODES_OPTIONS.media, MODES_OPTIONS.mediaEmojis].includes(mode)
      "
      @switch-mode="canvasStore.switchMode($event)"
      @deselect="selectedElement ? canvasStore.deselectElement() : ''"
      @delete="selectedElement ? canvasStore.deleteElement() : ''"
      @add-image="mediaStore.addImage($event)"
      @apply-formatting="textStore.applyStyles()"
    />

    <!-- canvas -->
    <div class="canvas__wrapper q-pa-lg">
      <canvas
        ref="canvasRef"
        id="canvas"
        :class="[canvasCursorClass, canvasHighlightClass]"
        @mousedown="handleCanvasMouseDown"
        @mousemove="handleCanvasMouseMove"
        @mouseup="handleCanvasMouseUp"
        @mouseleave="handleCanvasMouseLeave"
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
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useCanvasDrawingStore } from "stores/canvas/drawing";
import { useCanvasStore } from "stores/canvas";
import { useCanvasTextStore } from "stores/canvas/text";
import { useCanvasMediaStore } from "stores/canvas/media";
import PresentationToolbarTop from "components/presentation/PresentationToolbarTop.vue";
import PresentationToolbarBottom from "components/presentation/PresentationToolbarBottom.vue";
import {
  dragElement,
  startDragging,
  stopDragging,
} from "src/stores/canvas/helpers/dragging";
import {
  getResizeHandle,
  resizeElement,
  startResizing,
  stopResizing,
} from "src/stores/canvas/helpers/resizing";
import {
  getRotationHandle,
  rotateElement,
  startRotating,
  stopRotating,
} from "src/stores/canvas/helpers/rotating";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const canvasStore = useCanvasStore();
const {
  // canvas
  canvas,
  ctx,
  mouse,
  scale,

  // mode
  mode,
  MODES_OPTIONS,

  // select
  selectedElement,

  // drag
  isDragging,

  // resize
  isResizing,
  resizeHandle,
  RESIZE_HANDLES_OPTIONS,

  // rotation
  isRotating,
  rotationHandle,
} = storeToRefs(canvasStore);

const drawingStore = useCanvasDrawingStore();
const drawingState = storeToRefs(drawingStore);

const textStore = useCanvasTextStore();
const textState = storeToRefs(textStore);

const mediaStore = useCanvasMediaStore();

/*
 * canvas init, setup
 */
const canvasRef = ref();

const resizeCanvas = () => {
  canvas.value.width = 1920;
  canvas.value.height = 1080;

  ctx.value.scale(scale.value, scale.value);

  canvasStore.redrawCanvas();
};

const handleWheelEvent = (event) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();

    const delta = event.deltaY > 0 ? -1 : 1;
    canvasStore.handleZoom(delta, event.clientX, event.clientY);
  }
};

const handleKeyDownEvent = (event) => {
  if (selectedElement.value) {
    // delete selected element
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      canvasStore.deleteElement();
    }

    // deselect
    if (event.key === "Escape" || event.key === "Enter") {
      event.preventDefault();
      canvasStore.deselectElement();
    }

    switch (selectedElement.value?.mode) {
      case MODES_OPTIONS.value.text:
        textStore.shortcuts(event);
    }
  }

  switch (mode.value) {
    case MODES_OPTIONS.value.text:
      // turn off adding new text
      if (event.key === "Escape") {
        event.preventDefault();
        textState.isNewText.value = false;
      }

      if (event.key === "t") {
        event.preventDefault();
        textState.isNewText.value = !textState.isNewText.value;
      }
      break;
  }
};

onMounted(() => {
  canvas.value = canvasRef.value;
  ctx.value = canvas.value.getContext("2d");
  ctx.value.imageSmoothingEnabled = true;

  /*
   * resize canvas
   */
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  /*
   * canvas zoom
   */
  canvas.value.addEventListener("wheel", handleWheelEvent);

  /*
   * shortcuts
   */
  document.addEventListener("keydown", handleKeyDownEvent);
});

onUnmounted(() => {
  document.removeEventListener("resize", resizeCanvas);
  document.removeEventListener("keydown", handleKeyDownEvent);
  canvas.value.removeEventListener("wheel", handleWheelEvent);
});

/*
 * canvas cursor
 */
const isElementHovered = ref(false);

const canvasCursorClass = computed(() => {
  let resizeCursor;
  switch (resizeHandle.value) {
    case RESIZE_HANDLES_OPTIONS.value.topLeft:
      resizeCursor = "cursor-nw-resize";
      break;
    case RESIZE_HANDLES_OPTIONS.value.topRight:
      resizeCursor = "cursor-ne-resize";
      break;
    case RESIZE_HANDLES_OPTIONS.value.bottomLeft:
      resizeCursor = "cursor-sw-resize";
      break;
    case RESIZE_HANDLES_OPTIONS.value.bottomRight:
      resizeCursor = "cursor-se-resize";
      break;
    case RESIZE_HANDLES_OPTIONS.value.centerTop:
    case RESIZE_HANDLES_OPTIONS.value.centerBottom:
      resizeCursor = "cursor-row-resize";
      break;
    case RESIZE_HANDLES_OPTIONS.value.centerLeft:
    case RESIZE_HANDLES_OPTIONS.value.centerRight:
      resizeCursor = "cursor-col-resize";
      break;
  }

  return resizeHandle.value
    ? resizeCursor
    : rotationHandle.value
    ? "cursor-alias"
    : isElementHovered.value
    ? "cursor-move"
    : "cursor-crosshair";
});

/*
 * canvas events
 */
const isJustDragged = ref(false);

const handleCanvasMouseDown = () => {
  isJustDragged.value = false;

  /*
   * start resizing
   * start rotating
   * start dragging
   */
  if (selectedElement.value) {
    // start resizing
    if (resizeHandle.value) {
      startResizing();
      return;
    }

    // start rotating
    if (rotationHandle.value) {
      startRotating();
      return;
    }

    // start dragging
    if (isElementHovered.value) {
      startDragging();
      return;
    }
  }

  /*
   * start drawing
   */
  switch (mode.value) {
    case MODES_OPTIONS.value.drawing:
      // if (!isElementHovered.value) {
      drawingStore.startDrawing();
      // }
      break;
  }
};

const handleCanvasMouseMove = (event) => {
  /*
   * track mouse position
   */
  canvasStore.computePosition(event);

  /*
   * on hover on an element, display ability to select it
   */
  const { hoveredElement } = canvasStore.getHoveredElement();
  isElementHovered.value = !!hoveredElement;

  /*
   * resizing
   * rotating
   * dragging
   */
  if (selectedElement.value) {
    // resizing
    if (isResizing.value) {
      resizeElement();
      return;
    } else {
      resizeHandle.value = getResizeHandle();
    }

    // rotation
    if (isRotating.value) {
      rotateElement();
      return;
    } else {
      rotationHandle.value = getRotationHandle();
    }

    // dragging
    if (isDragging.value) {
      dragElement();
      isJustDragged.value = true;
      return;
    }
  }

  /*
   * drawing
   */
  switch (mode.value) {
    case MODES_OPTIONS.value.drawing:
      if (drawingState.isDrawing.value) {
        if (drawingState.eraserMode.value) {
          drawingStore.erase();
        } else {
          drawingStore.draw();
        }
      }
      break;
  }
};

const handleCanvasMouseUp = () => {
  /*
   * stop resizing
   * stop rotating
   * stop dragging
   */
  if (selectedElement.value) {
    // stop resizing
    if (isResizing.value) {
      stopResizing();
      return;
    }

    // stop rotating
    if (isRotating.value) {
      stopRotating();
      return;
    }

    // stop dragging
    if (isDragging.value) {
      stopDragging();
      return;
    }
  }

  /*
   * stop drawing
   */
  switch (mode.value) {
    case MODES_OPTIONS.value.drawing:
      if (drawingState.isDrawing.value) {
        drawingStore.stopDrawing();
        return;
      }
      break;
  }
};

const handleCanvasClick = (event) => {
  switch (mode.value) {
    /*
     * text
     */
    case MODES_OPTIONS.value.text:
      if (!selectedElement.value && textState.isNewText.value) {
        textStore.addNewText(event);
        return;
      }

      // edit text on second selection
      // skip if just dragged
      if (selectedElement.value) {
        if (!isJustDragged.value) {
          canvasStore.doubleSelectElement();
          if (mode.value === MODES_OPTIONS.value.textEditing) {
            textStore.editText();
            return;
          }
        }
      } else {
        canvasStore.selectElement();
      }
      break;

    /*
     * other elements
     */
    default:
      canvasStore.selectElement();
  }
};

const handleCanvasMouseLeave = () => {
  isDragging.value = false;
};

/*
 * highlight canvas on
 */
const canvasHighlightClass = ref("");
watch(
  () => textState.isNewText.value,
  () => {
    if (textState.isNewText.value) {
      canvasHighlightClass.value = "canvas--highlighted";

      setTimeout(() => {
        canvasHighlightClass.value = "";
      }, 2000);
    }
  }
);
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

  /*
   * highlight canvas
   */
  .canvas--highlighted {
    border: 2px solid transparent;
    animation: pulse 4s infinite;
    box-shadow: 0 0 0 0 $primary;
    transition: box-shadow 1s ease-in-out;

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 $primary;
      }
      50% {
        box-shadow: 0 0 20px 10px transparent;
      }
      100% {
        box-shadow: 0 0 0 0 transparent;
      }
    }
  }
}

/*
 * cursors
 */
.cursor-move {
  cursor: move;
}
.cursor-crosshair {
  cursor: crosshair;
}

// resize
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

.cursor-col-resize {
  cursor: col-resize;
}
.cursor-row-resize {
  cursor: row-resize;
}

// rotate
.cursor-alias {
  cursor: alias;
}
</style>
