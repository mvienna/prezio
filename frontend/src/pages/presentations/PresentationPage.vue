<template>
  <q-page>
    <!-- header -->
    <div class="bg-white q-py-md q-px-lg row no-wrap q-gutter-md">
      <!-- drawing -->
      <q-btn
        icon="gesture"
        unelevated
        text-color="dark"
        round
        size="12px"
        :class="mode === 'drawing' ? 'bg-grey-2' : ''"
        @click="canvasStore.switchMode('drawing')"
        @mouseover="showTextMenu = false"
      >
        <q-menu
          v-model="showDrawingMenu"
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
              :style="`color: ${drawingState.customization.strokeColor}`"
              size="20px"
            />
            <div
              class="q-mr-lg"
              :style="`color: ${drawingState.customization.strokeColor}`"
            >
              {{ $t("presentationEditor.drawing.options.color") }}
            </div>

            <q-space />

            <input
              type="color"
              class="color_input"
              v-model="drawingState.customization.strokeColor"
            />
          </q-item>

          <!-- eraser -->
          <q-item
            dense
            class="items-center text-semibold justify-start rounded-borders q-py-sm q-mt-md"
            :class="drawingState.eraserMode ? 'text-black' : 'text-grey-5'"
            clickable
            v-close-popup
            @click="drawingStore.toggleEraser()"
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
              v-model="drawingState.customization.brushSize"
              :options="drawingState.customization.brushSizeOptions"
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
              v-model="drawingState.customization.selectedBrushType"
              :options="drawingState.customization.brushTypes"
              map-options
              emit-value
              :option-label="(option) => $t(option.label)"
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
        :class="mode === 'text' ? 'bg-grey-2' : ''"
        @click="canvasStore.switchMode('text')"
        @mouseover="showDrawingMenu = false"
      >
        <q-menu
          v-model="showTextMenu"
          anchor="bottom left"
          self="top left"
          transition-show="jump-down"
          transition-hide="jump-up"
          :offset="[0, 8]"
          class="q-pa-sm"
        >
          <!-- formatting -->
          <div class="row no-wrap q-mx-sm q-mt-sm">
            <q-btn
              outline
              size="10px"
              round
              icon="format_bold"
              style="width: 100%"
              :text-color="
                textState.customization.formatting.isBold ? 'white' : 'black'
              "
              :class="
                textState.customization.formatting.isBold
                  ? 'bg-primary'
                  : 'bg-white'
              "
              v-close-popup
              @click="
                textState.customization.formatting.isBold =
                  !textState.customization.formatting.isBold;
                textStore.applyFormattingToSelectedText('b');
              "
            />
            <q-btn
              outline
              size="10px"
              round
              icon="format_underlined"
              style="width: 100%"
              class="q-mx-sm"
              :text-color="
                textState.customization.formatting.isUnderline
                  ? 'white'
                  : 'black'
              "
              :class="
                textState.customization.formatting.isUnderline
                  ? 'bg-primary'
                  : 'bg-white'
              "
              v-close-popup
              @click="
                textState.customization.formatting.isUnderline =
                  !textState.customization.formatting.isUnderline;
                textStore.applyFormattingToSelectedText('u');
              "
            />
            <q-btn
              outline
              size="10px"
              round
              icon="format_italic"
              class="full-width"
              :text-color="
                textState.customization.formatting.isItalic ? 'white' : 'black'
              "
              :class="
                textState.customization.formatting.isItalic
                  ? 'bg-primary'
                  : 'bg-white'
              "
              style="width: 100%"
              v-close-popup
              @click="
                textState.customization.formatting.isItalic =
                  !textState.customization.formatting.isItalic;
                textStore.applyFormattingToSelectedText('i');
              "
            />
          </div>

          <!-- color picker -->
          <q-item
            dense
            class="items-center text-semibold justify-start rounded-borders q-mt-md"
          >
            <q-icon
              name="o_palette"
              class="q-mr-md text-semibold"
              :style="`color: ${textState.customization.color}`"
              size="20px"
            />
            <div
              class="q-mr-lg"
              :style="`color: ${textState.customization.color}`"
            >
              {{ $t("presentationEditor.drawing.options.color") }}
            </div>

            <q-space />

            <input
              type="color"
              class="color_input"
              v-model="textState.customization.color"
              @input="textStore.applyFormattingToSelectedText(`span`)"
            />
          </q-item>

          <!-- font -->
          <q-item
            dense
            class="items-center text-semibold justify-start rounded-borders q-mt-sm"
          >
            <q-select
              v-model="textState.customization.font"
              :options="textState.customization.fontOptions"
              emit-value
              borderless
              :label="$t('presentationEditor.text.options.font')"
              class="full-width"
              color="dark"
              @update:model-value="
                textStore.applyFormattingToSelectedText(`span`)
              "
            >
              <template #prepend>
                <q-icon
                  name="text_fields"
                  class="q-mr-xs text-semibold text-dark"
                  size="20px"
                />
              </template>
            </q-select>
          </q-item>

          <!-- font size -->
          <q-item
            dense
            class="items-center text-semibold justify-start rounded-borders"
          >
            <q-select
              v-model="textState.customization.fontSize"
              :options="textState.customization.fontSizeOptions"
              emit-value
              borderless
              :label="$t('presentationEditor.text.options.fontSize')"
              class="full-width"
              color="dark"
              @update:model-value="
                textStore.applyFormattingToSelectedText(`span`)
              "
            >
              <template #prepend>
                <q-icon
                  name="sort_by_alpha"
                  class="q-mr-xs text-semibold text-dark"
                  size="20px"
                />
              </template>
            </q-select>
          </q-item>

          <!-- apply -->
          <q-item class="q-px-sm">
            <q-btn
              :label="$t('presentationEditor.text.apply')"
              icon="done"
              color="black"
              no-caps
              unelevated
              class="full-width"
              v-close-popup
              @click="textStore.applyFormattingToSelectedText(`span`)"
            />
          </q-item>
        </q-menu>
      </q-btn>

      <!-- image -->
      <q-btn
        icon="o_image"
        unelevated
        text-color="dark"
        round
        size="12px"
        :class="mode === 'media' ? 'bg-grey-2' : ''"
        @click="
          canvasStore.switchMode('media');
          showSelectMediaDialog = true;
        "
      />

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
        :disable="!drawingState.undoStack.length"
        @click="drawingStore.undo()"
      />

      <!-- redo button -->
      <q-btn
        icon="redo"
        unelevated
        text-color="dark"
        size="12px"
        round
        :disable="!drawingState.redoStack.length"
        @click="drawingStore.redo()"
      />

      <template
        v-if="
          drawingState.selectedLineIndex !== -1 ||
          textState.selectedTextIndex !== -1 ||
          mediaState.selectedImageIndex !== -1
        "
      >
        <!-- deselect line button -->
        <q-btn
          icon="done"
          unelevated
          text-color="dark"
          size="12px"
          round
          @click="
            drawingState.selectedLineIndex !== -1
              ? drawingStore.deselectLine()
              : textState.selectedTextIndex !== -1
              ? textStore.deselectText()
              : mediaState.selectedImageIndex !== -1
              ? mediaStore.deselectImage()
              : ''
          "
        />

        <!-- delete line button -->
        <q-btn
          icon="o_backspace"
          unelevated
          text-color="dark"
          size="12px"
          round
          @click="
            drawingState.selectedLineIndex !== -1
              ? drawingStore.deleteSelectedLine()
              : textState.selectedTextIndex !== -1
              ? textStore.deleteSelectedText
              : mediaState.selectedImageIndex !== -1
              ? mediaStore.deleteSelectedImage()
              : ''
          "
        />
      </template>
    </div>

    <!-- slide -->
    <div class="q-pa-lg">
      <!-- canvas -->
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

    <q-dialog v-model="showSelectMediaDialog">
      <SelectMedia
        @close="showSelectMediaDialog = false"
        @select="
          mediaStore.addImage($event.original_url);
          showSelectMediaDialog = false;
        "
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useCanvasDrawingStore } from "stores/canvas/drawing";
import { useCanvasStore } from "stores/canvas";
import { useCanvasTextStore } from "stores/canvas/text";
import SelectMedia from "components/media/SelectMedia.vue";
import { useCanvasMediaStore } from "stores/canvas/media";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

// canvas store
const canvasStore = useCanvasStore();
const { canvas, ctx, mouse, mode, texts } = storeToRefs(canvasStore);

// drawing store
const drawingStore = useCanvasDrawingStore();
const { drawingState } = storeToRefs(drawingStore);

// text store
const textStore = useCanvasTextStore();
const { textState } = storeToRefs(textStore);

// media store
const mediaStore = useCanvasMediaStore();
const { mediaState } = storeToRefs(mediaStore);

// media
const showSelectMediaDialog = ref(false);

/*
 * menu
 */
const showTextMenu = ref(false);
const showDrawingMenu = ref(false);

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
    if (mode.value === "drawing") drawingStore.shortcuts(event);
    if (mode.value === "text") textStore.shortcuts(event);
    if (mode.value === "media") mediaStore.shortcuts(event);
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
 * canvas events
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
    ? "crosshair"
    : drawingState.value.selectedLineIndex !== -1 ||
      textState.value.selectedTextIndex !== -1 ||
      mediaState.value.selectedImageIndex !== -1
    ? "move"
    : "default";
});

const handleCanvasMouseDown = (event) => {
  if (mode.value === "drawing") {
    if (drawingState.value.selectedLineIndex !== -1) {
      drawingStore.startDrag(event);
    } else {
      drawingStore.startPainting(event);
    }
  }

  if (mode.value === "text") {
    if (textState.value.selectedTextIndex !== -1) {
      textStore.startDrag(event);
    }
  }

  if (mode.value === "media") {
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
  if (mode.value === "drawing") {
    if (drawingState.value.selectedLineIndex !== -1) {
      drawingStore.endDrag();
    } else {
      drawingStore.finishedPainting();
    }
  }

  if (mode.value === "text") {
    if (textState.value.selectedTextIndex !== -1) {
      textStore.endDrag();
    }
  }

  if (mode.value === "media") {
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

  if (mode.value === "drawing") {
    if (drawingState.value.selectedLineIndex !== -1) {
      drawingStore.dragLine(event);
    } else {
      drawingStore.draw(event);
    }
  }

  if (mode.value === "text") {
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

  if (mode.value === "media") {
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
  if (mode.value === "drawing") {
    drawingStore.selectLine(event);
  }

  if (mode.value === "text") {
    const clickedTextIndex = textStore.findText(event);

    if (clickedTextIndex !== -1) {
      textStore.selectText(clickedTextIndex);
    } else {
      textStore.createNewText(event);
    }
  }

  if (mode.value === "media") {
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
