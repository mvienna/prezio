<template>
  <!-- stroke color -->
  <q-btn
    flat
    round
    size="12px"
    class="relative-position"
    :class="{ 'bg-grey-2': showMenu.strokeColor }"
    :ripple="false"
  >
    <div>
      <q-icon name="icon-mdi_border_color_top" class="absolute-center" />
      <q-icon
        name="icon-mdi_border_color_bottom"
        :style="`color: ${drawing.stroke}`"
        class="absolute-center"
      />
    </div>

    <q-menu
      v-model="showMenu.strokeColor"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="no-padding"
    >
      <q-color
        format-model="hex"
        no-header-tabs
        default-view="palette"
        v-model="drawing.stroke"
        @change="studioStore.applyCustomization()"
      />
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.drawing.options.strokeColor") }}
    </q-tooltip>
  </q-btn>

  <!-- stroke width -->
  <q-btn
    flat
    round
    size="12px"
    icon="r_line_weight"
    class="relative-position"
    :class="{ 'bg-grey-2': showMenu.strokeWidth }"
    :ripple="false"
  >
    <q-menu
      v-model="showMenu.strokeWidth"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      style="width: 220px"
      class="no-padding"
    >
      <div class="q-pa-md">
        <div class="text-grey text-caption">
          {{ $t("presentationStudio.toolbar.drawing.options.strokeWidth") }}
        </div>

        <div class="row no-wrap items-center q-gutter-md q-pt-sm">
          <q-slider
            v-model="drawing.strokeWidth"
            :min="0"
            :max="300"
            label
            thumb-size="14px"
            :label-value="drawing.strokeWidth + 'px'"
            @change="studioStore.applyCustomization()"
          />

          <q-input
            v-model.number="drawing.strokeWidth"
            :min="0"
            :max="300"
            type="number"
            placeholder="0"
            suffix="px"
            style="min-width: 90px; width: 80px"
            outlined
            dense
            @change="studioStore.applyCustomization()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.drawing.options.strokeWidth") }}
    </q-tooltip>
  </q-btn>

  <!-- drawing mode -->
  <q-btn
    flat
    round
    size="12px"
    :icon="
      drawing.mode === DRAWING_MODES.BRUSH
        ? 'r_brush'
        : drawing.mode === DRAWING_MODES.ERASER
          ? 'icon-eraser'
          : ''
    "
    :class="{ 'bg-grey-2': showMenu.mode }"
    :ripple="false"
  >
    <q-menu
      v-model="showMenu.mode"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="no-padding hide-scrollbar no-padding"
    >
      <div class="column no-wrap q-py-sm">
        <q-item
          v-for="item in Object.values(DRAWING_MODES)"
          :key="item"
          :active="drawing.mode === item"
          clickable
          dense
          @click="
            drawing.mode = item;
            studioStore.applyCustomization();
          "
        >
          <q-item-section>
            <q-item-label>
              {{ $t(`presentationStudio.toolbar.drawing.modes.${item}`) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.drawing.options.mode") }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { DRAWING_MODES } from "src/constants/canvas/canvasVariables";
import { storeToRefs } from "pinia";
import { useStudioStore } from "stores/studio";
import { ref } from "vue";

/*
 * stores
 */
const studioStore = useStudioStore();
const { drawing } = storeToRefs(studioStore);

/*
 * menus
 */
const showMenu = ref({
  strokeColor: false,
  strokeWidth: false,
  mode: false,
});
</script>

<style lang="scss">
.q-field--dense .q-field__control {
  height: 30px !important;

  .q-field__suffix {
    padding: 0;
  }
}
</style>
