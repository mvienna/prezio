<template>
  <!-- color picker -->
  <q-btn flat round size="12px" class="relative-position">
    <div>
      <q-icon name="icon-mdi_border_color_top" class="absolute-center" />
      <q-icon
        name="icon-mdi_border_color_bottom"
        :style="`color: ${drawingState.customization.value.color}`"
        class="absolute-center"
      />
    </div>

    <q-menu
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
    >
      <q-color
        format-model="hex"
        no-header-tabs
        default-view="palette"
        v-model="drawingState.customization.value.color"
        @update:model-value="drawingStore.applyStyles()"
      />
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.drawing.options.color") }}
    </q-tooltip>
  </q-btn>

  <!-- brush size -->
  <q-select
    v-model="drawingState.customization.value.brushSize"
    :options="BRUSH_SIZE_OPTIONS"
    map-options
    emit-value
    borderless
    color="dark"
    hide-dropdown-icon
    dense
    class="q-px-sm"
    options-dense
    @update:model-value="drawingStore.applyStyles()"
  >
    <template #prepend>
      <q-icon
        name="r_line_weight"
        class="text-semibold text-dark"
        size="20px"
      />
    </template>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.drawing.options.brushSize") }}
    </q-tooltip>
  </q-select>

  <!-- brush type -->
  <q-select
    v-model="drawingState.customization.value.selectedBrushType"
    :options="BRUSH_TYPES"
    map-options
    emit-value
    :option-label="(option) => $t(option.label)"
    borderless
    color="dark"
    hide-dropdown-icon
    dense
    options-dense
    @update:model-value="drawingStore.applyStyles()"
  >
    <template #prepend>
      <q-icon name="r_brush" class="text-semibold text-dark" size="20px" />
    </template>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.drawing.options.brushType") }}
    </q-tooltip>
  </q-select>

  <q-separator vertical class="q-ml-md q-mr-sm" />

  <!-- eraser -->
  <q-checkbox
    v-model="drawingState.eraserMode.value"
    size="36px"
    checked-icon="icon-eraser"
    unchecked-icon="icon-eraser_off"
    indeterminate-icon="help"
  >
    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.drawing.options.erase") }}
    </q-tooltip>
  </q-checkbox>
</template>

<script setup>
import {
  BRUSH_SIZE_OPTIONS,
  BRUSH_TYPES,
} from "src/constants/canvas/canvasVariables";
import { storeToRefs } from "pinia";
import { useCanvasDrawingStore } from "stores/canvas/drawing";

/*
 * stores
 */
const drawingStore = useCanvasDrawingStore();
const drawingState = storeToRefs(drawingStore);
</script>
