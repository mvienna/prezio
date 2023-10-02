<template>
  <!-- color picker -->
  <q-btn flat round size="12px" class="relative-position">
    <div>
      <q-icon name="icon-mdi_border_color_top" class="absolute-center" />
      <q-icon
        name="icon-mdi_border_color_bottom"
        :style="`color: ${shapeState.customization.value.strokeColor}`"
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
        v-model="shapeState.customization.value.strokeColor"
        @update:model-value="shapeStore.applyStyles()"
      />

      <div class="q-pa-sm">
        <q-btn
          icon="r_format_color_reset"
          class="full-width"
          color="red"
          flat
          no-caps
          :label="
            $t('presentationStudio.toolbar.shape.options.removeStrokeColor')
          "
          @click="
            shapeState.customization.value.strokeColor = null;
            shapeStore.applyStyles();
          "
        />
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.shape.options.strokeColor") }}
    </q-tooltip>
  </q-btn>

  <!-- fill color picker -->
  <q-btn flat round size="12px" class="relative-position">
    <div>
      <q-icon name="icon-mdi_format_color_fill_top" class="absolute-center" />
      <q-icon
        name="icon-mdi_format_color_fill_bottom"
        :style="`color: ${shapeState.customization.value.fillColor}`"
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
        v-model="shapeState.customization.value.fillColor"
        @update:model-value="shapeStore.applyStyles()"
      />

      <div class="q-pa-sm">
        <q-btn
          icon="r_format_color_reset"
          class="full-width"
          color="red"
          flat
          no-caps
          :label="
            $t('presentationStudio.toolbar.shape.options.removeFillColor')
          "
          @click="
            shapeState.customization.value.fillColor = null;
            shapeStore.applyStyles();
          "
        />
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      <div>
        {{ $t("presentationStudio.toolbar.shape.options.fillColor") }}
      </div>
    </q-tooltip>
  </q-btn>

  <!-- line width -->
  <q-select
    v-model="shapeState.customization.value.lineWidth"
    :options="SHAPE_LINE_WIDTH_OPTIONS"
    map-options
    emit-value
    borderless
    color="dark"
    dense
    hide-dropdown-icon
    class="q-pl-sm"
    options-dense
    @update:model-value="shapeStore.applyStyles()"
  >
    <template #prepend>
      <q-icon name="line_weight" class="text-semibold text-dark" size="20px" />
    </template>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.shape.options.lineWidth") }}
    </q-tooltip>
  </q-select>
</template>

<script setup>
import { SHAPE_LINE_WIDTH_OPTIONS } from "src/constants/canvas/canvasVariables";
import { useCanvasShapeStore } from "stores/canvas/shape";
import { storeToRefs } from "pinia";

/*
 * stores
 */
const shapeStore = useCanvasShapeStore();
const shapeState = storeToRefs(shapeStore);
</script>
