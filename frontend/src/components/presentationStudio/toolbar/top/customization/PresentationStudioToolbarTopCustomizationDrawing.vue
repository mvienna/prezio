<template>
  <!-- stroke color -->
  <q-btn flat round size="12px" class="relative-position">
    <div>
      <q-icon name="icon-mdi_border_color_top" class="absolute-center" />
      <q-icon
        name="icon-mdi_border_color_bottom"
        :style="`color: ${drawing.stroke}`"
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
        v-model="drawing.stroke"
        @change="studioStore.applyCustomizationChanges()"
      />
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.drawing.options.strokeColor") }}
    </q-tooltip>
  </q-btn>

  <!-- stroke width -->
  <q-select
    v-model="drawing.strokeWidth"
    :options="DRAWING_STROKE_WIDTH_OPTIONS"
    map-options
    emit-value
    hide-dropdown-icon
    dense
    borderless
    :option-label="(option) => option + 'px'"
    class="q-px-sm"
    options-dense
    @update:model-value="studioStore.applyCustomizationChanges()"
  >
    <template #prepend>
      <q-icon
        name="r_line_weight"
        class="text-semibold text-dark"
        size="20px"
      />
    </template>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.drawing.options.strokeWidth") }}
    </q-tooltip>
  </q-select>

  <!-- mode -->
  <q-select
    v-model="drawing.mode"
    :options="Object.values(DRAWING_MODES)"
    emit-value
    :option-label="
      (option) => $t(`presentationStudio.toolbar.drawing.modes.${option}`)
    "
    borderless
    color="black"
    hide-dropdown-icon
    dense
    options-dense
    @update:model-value="studioStore.applyCustomizationChanges()"
  >
    <template #prepend>
      <q-icon name="r_brush" class="text-semibold text-dark" size="20px" />
    </template>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.drawing.options.mode") }}
    </q-tooltip>
  </q-select>
</template>

<script setup>
import {
  DRAWING_MODES,
  DRAWING_STROKE_WIDTH_OPTIONS,
} from "src/constants/canvas/canvasVariables";
import { storeToRefs } from "pinia";
import { useStudioStore } from "stores/studio";
import { onMounted, onUnmounted } from "vue";
import Konva from "konva";

/*
 * stores
 */
const studioStore = useStudioStore();
const { drawing } = storeToRefs(studioStore);
</script>
