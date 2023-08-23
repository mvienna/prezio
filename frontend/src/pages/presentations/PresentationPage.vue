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

      <!-- delete line button -->
      <q-btn
        v-if="drawingState.selectedLineIndex !== -1"
        icon="o_backspace"
        unelevated
        text-color="dark"
        size="12px"
        round
        @click="drawingStore.deleteSelectedLine()"
      />
    </div>

    <!-- slide -->
    <div class="q-pa-lg">
      <!-- canvas -->
      <canvas
        ref="canvasRef"
        id="canvas"
        @mousedown="handleCanvasMouseDown"
        @mousemove="handleCanvasMouseMove"
        @mouseup="handleCanvasMouseUp"
        @click="drawingStore.selectLine($event)"
      ></canvas>

      <!-- mouse position -->
      <div class="q-mt-md text-right">
        Mouse Position: {{ mouse.x }}, {{ Math.round(mouse.y) }}
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useDrawingStore } from "stores/canvas/drawing";
import { useCanvasStore } from "stores/canvas";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const { canvas, ctx, mouse } = storeToRefs(useCanvasStore());
const canvasStore = useCanvasStore();

const { drawingState } = storeToRefs(useDrawingStore());
const drawingStore = useDrawingStore();

/*
 * canvas init, setup
 */
const canvasRef = ref();

onMounted(() => {
  canvas.value = canvasRef.value;
  ctx.value = canvas.value.getContext("2d");

  // set default stroke color
  ctx.value.strokeStyle = drawingState.value.customization.strokeColor;

  // resize canvas
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // shortcuts
  document.addEventListener("keydown", (event) => {
    event.preventDefault();
    drawingStore.shortcuts(event);
  });
});

const resizeCanvas = () => {
  const page = document.getElementsByClassName("q-page")[0];
  const aspectRatio = 16 / 9;
  canvas.value.width = page.offsetWidth;
  canvas.value.height = page.offsetWidth / aspectRatio;
  drawingStore.redrawCanvas();
};

/*
 * canvas events
 */
const handleCanvasMouseDown = (event) => {
  if (drawingState.value.selectedLineIndex !== -1) {
    drawingStore.startDrag(event);
  } else {
    drawingStore.startPainting(event);
  }
};

const handleCanvasMouseMove = (event) => {
  mouse.value = {
    x: event.clientX - canvasStore.canvasRect().left,
    y: event.clientY - canvasStore.canvasRect().top,
  };

  if (drawingState.value.selectedLineIndex !== -1) {
    drawingStore.dragLine(event);
  } else {
    drawingStore.draw(event);
  }
};

const handleCanvasMouseUp = () => {
  if (drawingState.value.selectedLineIndex !== -1) {
    drawingStore.endDrag();
  } else {
    drawingStore.finishedPainting();
  }
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
