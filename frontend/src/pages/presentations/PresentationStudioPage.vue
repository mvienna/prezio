<template>
  <q-page>
    <!-- websockets connection interrupted -->
    <WebSocketsConnectionInterrupted
      v-if="!isConnectedToWebSockets"
      @reconnect="connectToRoomChannels()"
    />

    <!-- top toolbar -->
    <PresentationStudioToolbarTop
      @switch-mode="canvasStore.switchMode($event)"
      @deselect="selectedElement ? deselectElement() : ''"
      @delete="selectedElement ? deleteElement() : ''"
      @add-image="mediaStore.addImage($event)"
      @add-emoji="
        mediaStore.addImage(
          $event,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          MODE_OPTIONS.mediaEmoji
        )
      "
      @add-shape="shapeStore.addShape($event)"
      @zoom="canvasStore.handleZoom(null, mouse.x, mouse.y, $event)"
      @zoomIn="
        scale !== 3
          ? canvasStore.handleZoom(null, mouse.x, mouse.y, scale + 0.25)
          : ''
      "
      @zoomOut="
        scale !== 0.5
          ? canvasStore.handleZoom(null, mouse.x, mouse.y, scale - 0.25)
          : ''
      "
    />

    <!-- canvas -->
    <div
      class="canvas__container row justify-center"
      :style="`height: calc(100%${
        presentation?.slides?.filter((slide) => slide?.answers?.length).length
          ? ' - 61px'
          : ''
      });`"
      @click="handleClickOutsideOfCanvas"
    >
      <teleport
        :disabled="!isPresentationPreview"
        :to="isPresentationPreview ? '#presentationPreview' : 'body'"
      >
        <!-- INFO: to justify center vertically add classes: "column justify-center" -->
        <div class="canvas__wrapper relative-position column no-wrap">
          <canvas
            ref="canvasRef"
            id="canvas"
            :class="[canvasCursorClass, canvasHighlightClass]"
            @mousedown="handleCanvasMouseDown"
            @click="handleCanvasClick"
          ></canvas>

          <template v-if="isCanvasReady && !isPresentationPreview">
            <!-- slide data (reactions, answers, participants online) -->
            <PresentationStudioRoomData />

            <!-- actions (results) -->
            <PresentationStudioRoomActions />
          </template>
        </div>
      </teleport>
    </div>

    <!-- slide header (invitation link, open sharing modal) -->
    <PresentationStudioSlideHeader
      v-if="isCanvasReady && !isPresentationPreview"
    />

    <!-- context menu -->
    <transition
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
    >
      <PresentationStudioElementsContextMenu
        v-if="showElementsContextMenu && slide?.type === SLIDE_TYPES.CONTENT"
        :x="elementsContextMenuPosition.x"
        :y="elementsContextMenuPosition.y"
      />
    </transition>

    <!-- addons -->
    <PresentationStudioAddons
      v-if="isCanvasReady && slide?.type !== SLIDE_TYPES.CONTENT"
      :hovered-element="
        lastElementHovered && isElementHovered ? lastElementHovered : null
      "
    />

    <!-- bottom toolbar -->
    <PresentationStudioToolbarBottom />
  </q-page>
</template>

<script setup>
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useCanvasDrawingStore } from "stores/canvas/drawing";
import { useCanvasStore } from "stores/canvas";
import { useCanvasTextStore } from "stores/canvas/text";
import { useCanvasMediaStore } from "stores/canvas/media";
import PresentationStudioToolbarTop from "components/presentationStudio/toolbar/top/PresentationStudioToolbarTop.vue";
import PresentationStudioToolbarBottom from "components/presentationStudio/toolbar/bottom/PresentationStudioToolbarBottom.vue";
import {
  dragElement,
  startDragging,
  stopDragging,
} from "stores/canvas/helpers/drag";
import {
  getResizeHandle,
  resizeElement,
  startResizing,
  stopResizing,
} from "stores/canvas/helpers/resize";
import {
  getRotationHandle,
  rotateElement,
  startRotating,
  stopRotating,
} from "stores/canvas/helpers/rotate";
import {
  deleteElement,
  deselectElement,
  doubleSelectElement,
  getHoveredElement,
  selectElement,
} from "stores/canvas/helpers/select";
import { useCanvasShapeStore } from "stores/canvas/shape";
import { useRouter } from "vue-router";
import { QSpinnerIos, useQuasar } from "quasar";
import { ROUTE_PATHS } from "src/constants/routes";
import { usePresentationsStore } from "stores/presentations";
import {
  copy,
  cut,
  duplicate,
  moveLayer,
  moveLayerToTheBottom,
  moveLayerToTheTop,
  paste,
} from "stores/canvas/helpers/elementsContextMenuActions";
import PresentationStudioElementsContextMenu from "components/presentationStudio/PresentationStudioElementsContextMenu.vue";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import PresentationStudioAddons from "components/presentation/addons/PresentationAddons.vue";
import PresentationStudioSlideHeader from "components/presentationStudio/PresentationStudioSlideHeader.vue";
import { useAuthStore } from "stores/auth";
import Echo from "laravel-echo";
import PresentationStudioRoomData from "components/presentationStudio/PresentationStudioRoomData.vue";
import { computeAverageBrightness } from "src/helpers/colorUtils";
import PresentationStudioRoomActions from "components/presentationStudio/toolbar/PresentationStudioRoomActions.vue";
import WebSocketsConnectionInterrupted from "components/WebSocketsConnectionInterrupted.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const $q = useQuasar();

const router = useRouter();

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const {
  presentation,
  isPresentationPreview,
  slide,
  room,
  isHost,
  participants,
  averageBackgroundBrightness,
  backgroundBrightnessThreshold,
} = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const {
  // canvas
  canvas,

  ctx,
  elements,
  mouse,
  scale,

  // mode
  mode,
  MODE_OPTIONS,

  // select
  selectedElement,
  selectedElementIndex,

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

const shapeStore = useCanvasShapeStore();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

/*
 * canvas setup
 */
const canvasRef = ref();
const isCanvasReady = ref(false);

onBeforeMount(() => {
  $q.loading.show({
    spinner: QSpinnerIos,
    message: t("loading.fetchingData"),
  });
});

onMounted(async () => {
  canvas.value = canvasRef.value;
  ctx.value = canvas.value.getContext("2d");
  ctx.value.imageSmoothingEnabled = true;

  /*
   * fetch presentation data
   */
  await presentationsStore
    .fetchPresentationData(router.currentRoute.value.params.presentation_id)
    .then(() => {
      canvasStore.setElementsFromSlide();
    })
    .catch((error) => {
      $q.notify({
        message: error,
        color: "red",
        icon: "r_crisis_alert",
      });

      router.push(ROUTE_PATHS.PRESENTATIONS_BROWSER);
    });

  /*
   * compute background brightness
   */
  presentation.value.slides.map(async (item, index) => {
    presentation.value.slides[index].previewAverageBrightness =
      await computeAverageBrightness(
        item.id === slide.value.id
          ? JSON.parse(slide.value.canvas_data)
          : JSON.parse(item.canvas_data)
      );

    if (item.id === slide.value.id) {
      averageBackgroundBrightness.value =
        presentation.value.slides[index].previewAverageBrightness;
    }
  });

  /*
   * resize canvas
   */
  resizeCanvas();
  // TODO: get rid of timeout by making canvasStore.redrawCanvas() async function (add promise)
  setTimeout(() => {
    canvasStore.redrawCanvas(false);
  }, 100);
  window.addEventListener("resize", resizeCanvas);

  /*
   * canvas zoom
   */
  canvas.value.addEventListener("wheel", handleWheelEvent);

  /*
   * mouse events
   */
  document.addEventListener("mousemove", handleCanvasMouseMove);
  document.addEventListener("mouseup", handleCanvasMouseUp);

  /*
   * shortcuts
   */
  document.addEventListener("keydown", handleKeyDownEvent);

  /*
   * establish connection to room channels
   */
  connectToRoomChannels();

  /*
   * hide loader
   */
  $q.loading.hide();
  isCanvasReady.value = true;
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
  canvas.value.removeEventListener("wheel", handleWheelEvent);
  document.removeEventListener("mousemove", handleCanvasMouseMove);
  document.removeEventListener("mouseup", handleCanvasMouseUp);
  document.removeEventListener("keydown", handleKeyDownEvent);

  if (presentation.value?.room?.id) {
    window.Echo.leave(`presence.room.${presentation.value.room.id}`);
    window.Echo.leave(`public.room.${presentation.value.room.id}`);
  }
});

const resizeCanvas = () => {
  canvas.value.width = 2560;
  canvas.value.height = 1440;

  ctx.value.scale(scale.value, scale.value);

  canvasStore.redrawCanvas(false);
};

const handleWheelEvent = (event) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();

    const delta = event.deltaY > 0 ? -1 : 1;
    canvasStore.handleZoom(delta, event.clientX, event.clientY);
  }
};

const handleKeyDownEvent = (event) => {
  if (event.ctrlKey || event.metaKey) {
    // save slide
    if (event.key === "s") {
      event.preventDefault();
      canvasStore.saveSlidePreview();
      presentationsStore.saveSlide(undefined, elements.value);
    }

    // paste element
    if (event.key === "v") {
      if (mode.value === MODE_OPTIONS.value.textEditing) return;
      if (slide.value?.type !== SLIDE_TYPES.CONTENT) return;

      event.preventDefault();
      paste();
    }

    if (selectedElement.value) {
      // copy element
      if (event.key === "c") {
        event.preventDefault();
        copy();
      }

      // cut element
      if (event.key === "x" && !event.shiftKey) {
        if (slide.value?.type !== SLIDE_TYPES.CONTENT) return;

        event.preventDefault();
        cut();
      }

      // duplicate element
      if (event.key === "d") {
        if (slide.value?.type !== SLIDE_TYPES.CONTENT) return;

        event.preventDefault();
        duplicate();
      }

      // move up
      if (event.keyCode === 38) {
        if (selectedElementIndex !== 0) {
          moveLayer(undefined, 1);
        }
      }

      // move down
      if (event.keyCode === 40) {
        if (selectedElementIndex !== elements.length - 1) {
          moveLayer(undefined, -1);
        }
      }

      if (event.shiftKey) {
        // move to the top
        if (event.keyCode === 38) {
          moveLayerToTheTop();
        }

        // move to the bottom
        if (event.keyCode === 40) {
          moveLayerToTheBottom();
        }
      }
    }
  }

  if (selectedElement.value) {
    // delete selected element
    if (event.key === "Delete" || event.key === "Backspace") {
      if (mode.value === MODE_OPTIONS.value.textEditing) return;
      if (slide.value?.type !== SLIDE_TYPES.CONTENT) return;

      event.preventDefault();
      deleteElement();
    }

    // deselect
    if (event.key === "Escape" || event.key === "Enter") {
      if (mode.value === MODE_OPTIONS.value.textEditing) return;

      event.preventDefault();
      deselectElement();
    }
  }

  switch (mode.value) {
    /*
     * turn off adding new text
     * text shortcuts (formatting)
     */
    case MODE_OPTIONS.value.text:
    case MODE_OPTIONS.value.textEditing:
      textStore.shortcuts(event);
      break;
  }
};

/*
 * canvas cursor
 */
const isElementHovered = ref(false);
const lastElementHovered = ref();

const canvasCursorClass = computed(() => {
  if (isPresentationPreview.value) return "default";

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

  return mode.value === MODE_OPTIONS.value.drawing
    ? "cursor-crosshair"
    : mode.value === MODE_OPTIONS.value.text && !selectedElement.value
    ? "cursor-text"
    : resizeHandle.value
    ? resizeCursor
    : rotationHandle.value
    ? "cursor-alias"
    : isElementHovered.value
    ? "cursor-move"
    : "default";
});

/*
 * canvas events
 */
const isJustDragged = ref(false);
const timesSelected = ref(0);

const handleCanvasMouseDown = () => {
  if (isPresentationPreview.value) return;

  isJustDragged.value = false;

  if (
    ![MODE_OPTIONS.value.textEditing, MODE_OPTIONS.value.drawing].includes(
      mode.value
    )
  ) {
    if (!resizeHandle.value && !rotationHandle.value) {
      const selectedElementCopy = selectedElement.value;

      selectElement();

      if (selectedElement.value?.id === selectedElementCopy?.id) {
        timesSelected.value++;
      } else if (selectedElement.value) {
        timesSelected.value = 1;
      }
    }
  }

  /*
   * start resizing
   * start rotating
   * start dragging
   */
  if (selectedElement.value) {
    /*
     * allow only for content slide
     */
    if (slide.value?.type !== SLIDE_TYPES.CONTENT) return;

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
    case MODE_OPTIONS.value.drawing:
      drawingStore.startDrawing();
      break;
  }
};

const handleCanvasMouseMove = (event) => {
  if (isPresentationPreview.value) return;

  /*
   * track mouse position
   */
  canvasStore.computePosition(event);

  /*
   * on hover on an element, display ability to select it
   */
  const { hoveredElement } = getHoveredElement();
  isElementHovered.value = !!hoveredElement;

  if (hoveredElement && hoveredElement?.id !== selectedElement.value?.id) {
    canvasStore.redrawCanvas(false);
    canvasStore.renderBorderForElement(hoveredElement);

    lastElementHovered.value = hoveredElement;
  } else if (lastElementHovered.value) {
    canvasStore.redrawCanvas(false);
  }

  /*
   * resizing
   * rotating
   * dragging
   */
  if (selectedElement.value) {
    // resizing
    if (isResizing.value) {
      resizeElement(event);
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
    case MODE_OPTIONS.value.drawing:
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
  if (isPresentationPreview.value) return;

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
    case MODE_OPTIONS.value.drawing:
      if (drawingState.isDrawing.value) {
        drawingStore.stopDrawing();
        return;
      }
      break;
  }
};

const handleCanvasClick = (event) => {
  if (isPresentationPreview.value) return;

  switch (mode.value) {
    /*
     * text
     */
    case MODE_OPTIONS.value.text:
      // // create new text
      // if (!selectedElement.value) {
      //   textStore.addNewText(event, t);
      //   return;
      // }

      // edit text on second selection
      // skip if just dragged
      if (
        selectedElement.value &&
        !isJustDragged.value &&
        timesSelected.value > 1
      ) {
        doubleSelectElement();
        timesSelected.value = 0;

        if (mode.value === MODE_OPTIONS.value.textEditing) {
          if (
            [
              ...SLIDE_TYPES_OF_QUIZ,
              SLIDE_TYPES.LEADERBOARD,
              SLIDE_TYPES.WORD_CLOUD,
            ].includes(slide.value?.type)
          ) {
            textState.customization.value.color =
              averageBackgroundBrightness.value >=
              backgroundBrightnessThreshold.value
                ? "#000000"
                : "#FFFFFF";
          }
          textStore.editText();
          return;
        }
      }
      break;

    /*
     * drawing
     */
    case MODE_OPTIONS.value.drawing:
      selectElement();
      break;
  }
};

const handleClickOutsideOfCanvas = (event) => {
  if (event.target?.id !== "canvas") {
    deselectElement();
  }
};

/*
 * highlight canvas on
 */
const canvasHighlightClass = ref(""); // canvas--highlighted

/*
 * element's context menu
 */
const showElementsContextMenu = ref(false);
const elementsContextMenuPosition = computed(() => {
  const canvasRect = canvasStore.canvasRect();

  return selectedElement.value
    ? {
        x:
          canvasRect.x +
          (selectedElement.value.x / canvas.value.width) * canvasRect.width,
        y:
          canvasRect.y +
          (selectedElement.value.y / canvas.value.height) * canvasRect.height -
          40,
      }
    : null;
});

watch(
  () => selectedElement.value,
  () => {
    showElementsContextMenu.value = false;

    setTimeout(() => {
      showElementsContextMenu.value = !!selectedElement.value;
    });
  }
);

watch(
  () => isDragging.value,
  () => {
    showElementsContextMenu.value = !isDragging.value;
  }
);

watch(
  () => isResizing.value,
  () => {
    showElementsContextMenu.value = !isResizing.value;
  }
);

watch(
  () => isRotating.value,
  () => {
    showElementsContextMenu.value = !isRotating.value;
  }
);

/*
 * slide average background brightness
 */
watch(
  () => elements.value,
  async () => {
    averageBackgroundBrightness.value = await computeAverageBrightness(
      elements.value
    );
    slide.value.previewAverageBrightness = averageBackgroundBrightness.value;
    presentationsStore.syncCurrentSlideWithPresentationSlides();
  }
);

/*
 * webhooks
 */
const isConnectedToWebSockets = ref(true);

const connectToRoomChannels = () => {
  const channel = window.Echo.channel(
    `public.room.${presentation.value.room.id}`
  );

  isHost.value = true;

  window.Echo = new Echo({
    ...window.Echo.options,
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-CSRF-Token": "CSRF_TOKEN",
      },
    },
  });

  window.Echo.join(`presence.room.${presentation.value.room.id}`)
    .here((users) => {
      participants.value = users.filter(
        (item) => item.id !== user.value?.id && item.room_id
      );
    })
    .joining((userJoined) => {
      participants.value.push(userJoined);
    })
    .leaving((userLeft) => {
      participants.value = participants.value.filter(
        (item) => item.id !== userLeft?.id && item.room_id
      );
    });

  window.Echo.connector.pusher.connection.bind("connected", () => {
    isConnectedToWebSockets.value = true;
  });

  window.Echo.connector.pusher.connection.bind("disconnected", () => {
    isConnectedToWebSockets.value = false;
  });

  /*
   * listen for new reactions
   */
  channel.listen("PresentationRoomNewReactionEvent", (event) => {
    if (!presentation.value.room) {
      presentation.value.room = {};
    }

    presentation.value.room.reactions = event.reactions;
  });

  /*
   * listen for new submitted answers
   */
  channel.listen("PresentationRoomAnswersSubmittedEvent", (event) => {
    slide.value.answers = [...slide.value.answers, ...event.answers];
    presentationsStore.syncCurrentSlideWithPresentationSlides();
  });

  channel.listen("PresentationRoomAnswerUpdatedEvent", (event) => {
    const answerIndex = slide.value.answers.findIndex(
      (answer) => answer.id === event.data.id
    );
    slide.value.answers[answerIndex] = event.data;
  });

  /*
   * listen for room termination
   */
  channel.listen("PresentationRoomTerminatedEvent", () => {});
};
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,400;1,700&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap");

.q-page {
  height: calc(100vh - 66px);
}

.canvas__container {
  width: 100%;
  padding: calc(61px + 24px) 24px 24px;
  overflow-y: hidden;

  .canvas__wrapper {
    max-height: calc(100% - 61px);
    aspect-ratio: 16/9;
    max-width: 100%;
    z-index: 1;

    canvas {
      background-color: $white;
      width: 100%;
      height: 16/9;
      border-radius: 8px;
      z-index: 1;
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
.cursor-text {
  cursor: text;
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
