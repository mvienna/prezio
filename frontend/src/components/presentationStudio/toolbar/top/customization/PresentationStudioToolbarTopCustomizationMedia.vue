<template>
  <!-- shadow -->
  <q-btn flat round size="12px" icon="r_texture">
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
        v-model="mediaState.customization.value.shadowColor"
        @change="mediaStore.applyStyles()"
      />

      <div class="q-py-sm q-px-lg">
        <!-- shadow opacity -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.media.options.shadow.opacity") }}
          </div>

          <q-slider
            v-model="mediaState.customization.value.shadowOpacity"
            :min="0"
            :max="100"
            label
            thumb-size="14px"
            :label-value="mediaState.customization.value.shadowOpacity + '%'"
            @change="mediaStore.applyStyles()"
          />
        </div>

        <!-- shadow blur -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.media.options.shadow.blur") }}
          </div>

          <q-slider
            v-model="mediaState.customization.value.shadowBlur"
            :min="0"
            :max="100"
            label
            thumb-size="14px"
            :label-value="mediaState.customization.value.shadowBlur"
            @change="mediaStore.applyStyles()"
          />
        </div>

        <!-- shadow offset x -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.media.options.shadow.offsetX") }}
          </div>

          <q-slider
            v-model="mediaState.customization.value.shadowOffsetX"
            :min="-200"
            :max="200"
            label
            thumb-size="14px"
            :label-value="mediaState.customization.value.shadowOffsetX"
            @change="mediaStore.applyStyles()"
          />
        </div>

        <!-- shadow offset y -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.media.options.shadow.offsetY") }}
          </div>

          <q-slider
            v-model="mediaState.customization.value.shadowOffsetY"
            :min="-200"
            :max="200"
            label
            thumb-size="14px"
            :label-value="mediaState.customization.value.shadowOffsetY"
            @change="mediaStore.applyStyles()"
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
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.media.options.opacity.title") }}
          </div>

          <q-slider
            v-model="mediaState.customization.value.opacity"
            :min="0"
            :max="100"
            label
            thumb-size="14px"
            :label-value="mediaState.customization.value.opacity + '%'"
            @change="mediaStore.applyStyles()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.media.options.opacity.title") }}
    </q-tooltip>
  </q-btn>

  <!-- border -->
  <q-btn flat round size="12px" icon="r_border_outer">
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
        v-model="mediaState.customization.value.borderColor"
        @change="mediaStore.applyStyles()"
      />

      <div class="q-pa-sm">
        <div class="text-caption text-grey q-ml-sm">
          {{ $t("presentationStudio.toolbar.media.options.border.width") }}
        </div>

        <!-- line width -->
        <q-select
          v-model="mediaState.customization.value.borderWidth"
          :options="SHAPE_LINE_WIDTH_OPTIONS"
          map-options
          emit-value
          borderless
          color="dark"
          dense
          hide-dropdown-icon
          class="q-pl-sm"
          options-dense
          @update:model-value="mediaStore.applyStyles()"
        >
          <template #prepend>
            <q-icon
              name="line_weight"
              class="text-semibold text-dark"
              size="20px"
            />
          </template>
        </q-select>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.media.options.border.title") }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCanvasMediaStore } from "stores/canvas/media";
import { SHAPE_LINE_WIDTH_OPTIONS } from "src/constants/canvas/canvasVariables";

/*
 * stores
 */
const mediaStore = useCanvasMediaStore();
const mediaState = storeToRefs(mediaStore);
</script>

<style scoped lang="scss">
::v-deep(.q-slider) {
  width: 200px;
}
</style>
