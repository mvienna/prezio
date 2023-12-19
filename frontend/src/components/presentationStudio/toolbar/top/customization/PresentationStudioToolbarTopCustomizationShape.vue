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
        @change="shapeStore.applyStyles()"
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
        @change="shapeStore.applyStyles()"
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

  <!-- shadow -->
  <q-btn flat round size="12px" icon="r_texture" class="q-ml-md">
    <q-menu
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
    >
      <!-- shadow color -->
      <q-color
        format-model="hex"
        no-header-tabs
        default-view="palette"
        v-model="shapeState.customization.value.shadowColor"
        @change="shapeStore.applyStyles()"
      />

      <div class="q-py-sm q-px-lg">
        <!-- shadow opacity -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.media.options.shadow.opacity") }}
          </div>

          <q-slider
            v-model="shapeState.customization.value.shadowOpacity"
            :min="0"
            :max="100"
            label
            thumb-size="14px"
            :label-value="shapeState.customization.value.shadowOpacity + '%'"
            @change="shapeStore.applyStyles()"
          />
        </div>

        <!-- shadow blur -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.media.options.shadow.blur") }}
          </div>

          <q-slider
            v-model="shapeState.customization.value.shadowBlur"
            :min="0"
            :max="100"
            label
            thumb-size="14px"
            :label-value="shapeState.customization.value.shadowBlur"
            @change="shapeStore.applyStyles()"
          />
        </div>

        <!-- shadow offset x -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.media.options.shadow.offsetX") }}
          </div>

          <q-slider
            v-model="shapeState.customization.value.shadowOffsetX"
            :min="-200"
            :max="200"
            label
            thumb-size="14px"
            :label-value="shapeState.customization.value.shadowOffsetX"
            @change="shapeStore.applyStyles()"
          />
        </div>

        <!-- shadow offset y -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.media.options.shadow.offsetY") }}
          </div>

          <q-slider
            v-model="shapeState.customization.value.shadowOffsetY"
            :min="-200"
            :max="200"
            label
            thumb-size="14px"
            :label-value="shapeState.customization.value.shadowOffsetY"
            @change="shapeStore.applyStyles()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.media.options.shadow.title") }}
    </q-tooltip>
  </q-btn>

  <!-- opacity -->
  <q-btn flat round size="12px" icon="r_opacity">
    <q-menu
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
    >
      <div class="q-pt-sm q-pl-md q-pr-lg">
        <!-- shadow opacity -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.media.options.opacity.title") }}
          </div>

          <q-slider
            v-model="shapeState.customization.value.opacity"
            :min="0"
            :max="100"
            label
            thumb-size="14px"
            :label-value="shapeState.customization.value.opacity + '%'"
            @change="shapeStore.applyStyles()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.media.options.opacity.title") }}
    </q-tooltip>
  </q-btn>
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

<style scoped lang="scss">
::v-deep(.q-slider) {
  width: 200px;
}
</style>
