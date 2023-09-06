<template>
  <q-page style="">
    <!-- toolbar -->
    <PresentationToolbarTop
      :is-drawing-mode="mode === modes.drawing"
      :is-text-mode="mode === modes.text"
      :is-media-mode="[modes.media, modes.mediaEmojis].includes(mode)"
      @switch-mode="canvasStore.switchMode($event)"
      @deselect="selectedElement ? canvasStore.deselectElement() : ''"
      @delete="selectedElement ? canvasStore.deleteSelectedElement() : ''"
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
  modes,

  // select
  selectedElement,

  // drag
  isDragging,

  // resize
  isResizing,
  resizeHandle,
  resizeHandles,

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
      canvasStore.deleteSelectedElement();
    }

    // deselect
    if (event.key === "Escape" || event.key === "Enter") {
      event.preventDefault();
      canvasStore.deselectElement();
    }

    switch (selectedElement.value?.mode) {
      case modes.value.text:
        textStore.shortcuts(event);
    }
  }

  switch (mode.value) {
    case modes.value.text:
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
    case resizeHandles.value.topLeft:
      resizeCursor = "cursor-nw-resize";
      break;
    case resizeHandles.value.topRight:
      resizeCursor = "cursor-ne-resize";
      break;
    case resizeHandles.value.bottomLeft:
      resizeCursor = "cursor-sw-resize";
      break;
    case resizeHandles.value.bottomRight:
      resizeCursor = "cursor-se-resize";
      break;
    case resizeHandles.value.centerTop:
    case resizeHandles.value.centerBottom:
      resizeCursor = "cursor-row-resize";
      break;
    case resizeHandles.value.centerLeft:
    case resizeHandles.value.centerRight:
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

  switch (mode.value) {
    /*
     * start drawing
     */
    case modes.value.drawing:
      if (!isElementHovered.value) {
        drawingStore.startDrawing();
      }
      break;

    /*
     * start resizing
     * start rotating
     * start dragging
     */
    default:
      if (selectedElement.value) {
        // start resizing
        if (resizeHandle.value) {
          canvasStore.startResizing();
          return;
        }

        // start rotating
        if (rotationHandle.value) {
          canvasStore.startRotating();
          return;
        }

        // start dragging
        if (isElementHovered.value) {
          canvasStore.startDragging();
        }
      }
  }
};

const handleCanvasMouseMove = (event) => {
  /*
   * track mouse position
   */
  canvasStore.computePosition(event);

  switch (mode.value) {
    /*
     * drawing
     */
    case modes.value.drawing:
      if (drawingState.isDrawing.value) {
        drawingStore.draw();
      }
      break;

    /*
     * resizing
     * rotating
     * dragging
     */
    default:
      if (selectedElement.value) {
        // resizing
        if (isResizing.value) {
          canvasStore.resizeElement();
          return;
        } else {
          resizeHandle.value = canvasStore.getResizeHandle();
        }

        // rotation
        if (isRotating.value) {
          canvasStore.rotateElement();
          return;
        } else {
          rotationHandle.value = canvasStore.getRotationHandle();
        }

        // dragging
        if (isDragging.value) {
          canvasStore.dragElement();
          isJustDragged.value = true;
          return;
        }
      }
  }

  /*
   * on hover on an element, display ability to select it
   */
  const { hoveredElement } = canvasStore.getHoveredElement();
  isElementHovered.value = !!hoveredElement;
};

const handleCanvasMouseUp = () => {
  switch (mode.value) {
    /*
     * stop drawing
     */
    case modes.value.drawing:
      if (drawingState.isDrawing.value) {
        drawingStore.stopDrawing();
        return;
      }
      break;

    /*
     * stop resizing
     * stop rotating
     * stop dragging
     */
    default:
      if (selectedElement.value) {
        // stop resizing
        if (isResizing.value) {
          canvasStore.stopResizing();
          return;
        }

        // stop rotating
        if (isRotating.value) {
          canvasStore.stopRotating();
          return;
        }

        // stop dragging
        if (isDragging.value) {
          canvasStore.stopDragging();
          return;
        }
      }
  }
};

const handleCanvasClick = (event) => {
  switch (mode.value) {
    /*
     * text
     */
    case modes.value.text:
      if (!selectedElement.value && textState.isNewText.value) {
        textStore.addNewText(event);
        return;
      }

      // edit text on second selection
      // skip if just dragged
      if (selectedElement.value) {
        if (!isJustDragged.value) {
          canvasStore.doubleSelectElement();
          if (mode.value === modes.value.textEditing) {
            textStore.editText();
            return;
          }
        }
      } else {
        // select element
        canvasStore.selectElement();
      }
      break;

    /*
     * other
     */
    default:
      // select element
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
