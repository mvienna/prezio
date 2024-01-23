<template>
  <!-- replace image -->
  <q-btn
    flat
    round
    size="12px"
    icon="icon-image_edit"
    @click="showSelectMediaDialog = true"
  >
    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.image.replaceImage.title") }}
    </q-tooltip>
  </q-btn>

  <q-dialog v-model="showSelectMediaDialog">
    <SelectMedia
      @cancel="showSelectMediaDialog = false"
      @select="
        studioStore.replaceImage(
          undefined,
          $event?.preview_url || $event?.original_url || $event?.urls?.regular
        );
        showSelectMediaDialog = false;
      "
    />
  </q-dialog>

  <q-select
    v-model="image.clipPosition"
    :options="Object.values(CROP_POSITION_OPTIONS)"
    map-options
    emit-value
    hide-dropdown-icon
    dense
    borderless
    class="q-px-sm"
    :option-label="
      (option) => $t(`presentationStudio.toolbar.image.clipPosition.${option}`)
    "
    options-dense
    hide-selected
    @update:model-value="studioStore.applyCustomizationChanges()"
  >
    <template #prepend>
      <q-icon name="r_crop" class="text-semibold text-dark" size="20px" />
    </template>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.image.clipPosition.title") }}
    </q-tooltip>
  </q-select>

  <!-- shadow -->
  <q-btn flat round size="12px" icon="icon-shadow">
    <q-menu
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="no-padding"
    >
      <!-- shadow color -->
      <q-color
        format-model="hex"
        no-header-tabs
        style="min-width: 216px"
        default-view="palette"
        v-model="image.shadowColor"
        @change="studioStore.applyCustomizationChanges()"
      />

      <div class="q-py-sm q-px-lg">
        <!-- shadow opacity -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.image.shadow.opacity") }}
          </div>

          <q-slider
            v-model="image.shadowOpacity"
            :min="0"
            :max="1"
            :step="0.01"
            label
            thumb-size="14px"
            :label-value="Math.round(image.shadowOpacity * 100) + '%'"
            @change="studioStore.applyCustomizationChanges()"
          />
        </div>

        <!-- shadow blur -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.image.shadow.blur") }}
          </div>

          <q-slider
            v-model="image.shadowBlur"
            :min="0"
            :max="100"
            label
            thumb-size="14px"
            :label-value="image.shadowBlur + 'px'"
            @change="studioStore.applyCustomizationChanges()"
          />
        </div>

        <!-- shadow offset x -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.image.shadow.offsetX") }}
          </div>

          <q-slider
            v-model="image.shadowOffset.x"
            :min="-200"
            :max="200"
            label
            thumb-size="14px"
            :label-value="image.shadowOffset.x"
            @change="studioStore.applyCustomizationChanges()"
          />
        </div>

        <!-- shadow offset y -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.image.shadow.offsetY") }}
          </div>

          <q-slider
            v-model="image.shadowOffset.y"
            :min="-200"
            :max="200"
            label
            thumb-size="14px"
            :label-value="image.shadowOffset.y"
            @change="studioStore.applyCustomizationChanges()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.image.shadow.title") }}
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
            {{ $t("presentationStudio.toolbar.image.opacity.title") }}
          </div>

          <q-slider
            v-model="image.opacity"
            :min="0"
            :max="1"
            :step="0.01"
            label
            thumb-size="14px"
            :label-value="Math.round(image.opacity * 100) + '%'"
            @change="studioStore.applyCustomizationChanges()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.image.opacity.title") }}
    </q-tooltip>
  </q-btn>

  <!-- stroke -->
  <q-btn flat round size="12px" icon="r_border_outer">
    <q-menu
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="no-padding"
    >
      <!-- shadow color -->
      <q-color
        format-model="hex"
        no-header-tabs
        default-view="palette"
        v-model="image.stroke"
        @change="studioStore.applyCustomizationChanges()"
      />

      <div class="q-pa-sm">
        <div class="text-caption text-grey q-ml-sm">
          {{ $t("presentationStudio.toolbar.image.stroke.width") }}
        </div>

        <!-- line width -->
        <q-select
          v-model="image.strokeWidth"
          :options="SHAPE_LINE_WIDTH_OPTIONS"
          map-options
          emit-value
          borderless
          color="black"
          dense
          hide-dropdown-icon
          :option-label="(option) => option + 'px'"
          class="q-pl-sm"
          options-dense
          @update:model-value="studioStore.applyCustomizationChanges()"
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
      {{ $t("presentationStudio.toolbar.image.stroke.title") }}
    </q-tooltip>
  </q-btn>

  <!-- corner radius -->
  <q-btn flat round size="12px" icon="r_rounded_corner">
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
            {{ $t("presentationStudio.toolbar.image.cornerRadius.title") }}
          </div>

          <q-slider
            v-model="image.cornerRadius"
            :min="0"
            :max="50"
            label
            thumb-size="14px"
            :label-value="image.cornerRadius + '%'"
            @change="studioStore.applyCustomizationChanges()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.image.cornerRadius.title") }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useStudioStore } from "stores/studio";
import SelectMedia from "components/media/SelectMedia.vue";
import { ref } from "vue";
import {
  CROP_POSITION_OPTIONS,
  DRAWING_STROKE_WIDTH_OPTIONS,
  SHAPE_LINE_WIDTH_OPTIONS,
} from "src/constants/canvas/canvasVariables";

/*
 * stores
 */
const studioStore = useStudioStore();
const { image } = storeToRefs(studioStore);

/*
 * replace image
 */
const showSelectMediaDialog = ref(false);
</script>

<style scoped lang="scss">
::v-deep(.q-slider) {
  width: 168px;
}
</style>
