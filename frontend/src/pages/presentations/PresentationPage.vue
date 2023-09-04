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
        :class="[canvasCursor, canvasFocus]"
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
import { computed, onMounted, ref, watch } from "vue";
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

const textStore = useCanvasTextStore();
const textState = storeToRefs(textStore);

const mediaStore = useCanvasMediaStore();

/*
 * canvas init, setup
 */
const canvasRef = ref();

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

      switch (selectedElement.value.mode) {
        case modes.value.text:
          textStore.shortcuts(event);
      }
    }

    switch (mode.value) {
      case modes.value.text:
        // turn off adding new text
        if (event.key === "Escape") {
          textState.isNewText.value = false;
        }
        break;
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
    : selectedElement.value
    ? "cursor-move"
    : "cursor-crosshair";
});

/*
 * canvas events
 */
const handleCanvasMouseDown = () => {
  /*
   * START:
   *
   * resize
   * drag
   */
  if (selectedElement.value) {
    if (resizeHandle.value) {
      canvasStore.startResize();
    } else if (rotationHandle.value) {
      canvasStore.startRotating();
    } else {
      canvasStore.startDrag();
    }
    return;
  }

  /*
   * START:
   *
   * draw
   */
  switch (mode.value) {
    // drawing
    case modes.value.drawing:
      drawingStore.startDrawing();
      break;
  }
};

const handleCanvasMouseUp = () => {
  /*
   * END:
   *
   * resize
   * drag
   */
  if (selectedElement.value) {
    if (isResizing.value) {
      canvasStore.endResize();
    } else if (isRotating.value) {
      canvasStore.endRotating();
    } else {
      canvasStore.endDrag();
    }
    return;
  }

  /*
   * END:
   *
   * draw
   */
  switch (mode.value) {
    // drawing
    case modes.value.drawing:
      drawingStore.finishDrawing();
      break;
  }
};

const handleCanvasMouseMove = (event) => {
  /*
   * track mouse
   */
  canvasStore.computePosition(event);

  /*
   * DO:
   *
   * resize
   * drag
   */
  if (selectedElement.value) {
    if (isResizing.value) {
      canvasStore.resizeElement();
      return;
    } else {
      resizeHandle.value = canvasStore.getResizeHandle();
    }

    if (isRotating.value) {
      canvasStore.rotateElement();
      return;
    } else {
      rotationHandle.value = canvasStore.getRotationHandle();
    }

    canvasStore.dragElement();
    return;
  }

  /*
   * DO:
   *
   * draw
   */
  switch (mode.value) {
    // drawing
    case modes.value.drawing:
      drawingStore.draw();
      break;
  }
};

const handleCanvasClick = (event) => {
  /*
   * select element
   */
  canvasStore.selectElement();

  /*
   * no selected element, add text
   */
  if (!selectedElement.value) {
    switch (mode.value) {
      // text
      case modes.value.text:
        textStore.addNewText(event);
        break;
    }
  }
};

const handleCanvasMouseLeave = () => {
  isDragging.value = false;
};

/*
 * handle editing text
 */
watch(
  () => mode.value,
  () => {
    switch (mode.value) {
      case modes.value.textEditing:
        textStore.editText();
    }
  }
);

const canvasFocus = ref("");
watch(
  () => textState.isNewText.value,
  () => {
    if (textState.isNewText.value) {
      canvasFocus.value = "canvas--focus";

      setTimeout(() => {
        canvasFocus.value = "";
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
  .canvas--focus {
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
