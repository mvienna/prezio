<template>
  <!-- fill color -->
  <q-btn
    v-if="!transformer.custom.shape.node"
    flat
    round
    size="12px"
    class="relative-position"
    :ripple="false"
    :class="{ 'bg-grey-2': showMenu.fill }"
  >
    <div>
      <q-icon name="icon-mdi_format_color_fill_top" class="absolute-center" />

      <div
        v-if="shape.fillLinearGradientColorStops"
        class="absolute-bottom q-mb-sm relative-position"
        style="height: 3.5px; width: 100%; padding: 0 10px"
      >
        <div
          class="full-width full-height rounded-md"
          :style="`background: linear-gradient(45deg, ${shape.fillLinearGradientColorStops[1]}, ${shape.fillLinearGradientColorStops[3]});`"
        ></div>
      </div>

      <q-icon
        v-else
        name="icon-mdi_format_color_fill_bottom"
        :style="`color: ${shape.fill}`"
        class="absolute-center"
      />
    </div>

    <q-menu
      v-model="showMenu.fill"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="no-padding"
    >
      <!-- fill mode -->
      <q-tabs
        v-if="
          !transformer.default.nodes().filter((node) =>
            Object.values(SHAPE_OPTIONS)
              .filter((item) => item.group === SHAPE_TYPES.ABSTRACT)
              .map((item) => item.name)
              .includes(node.getAttr('shape')),
          ).length
        "
        v-model="fillMode"
        dense
        no-caps
        @update:model-value="handleFillModeUpdate()"
      >
        <q-tab :name="FILL_MODE_OPTIONS.SOLID" icon="r_square" />
        <q-tab :name="FILL_MODE_OPTIONS.LINEAR_GRADIENT" icon="r_blur_linear" />
      </q-tabs>

      <!-- gradient -->
      <q-slide-transition>
        <div v-if="fillMode === 'linearGradient'">
          <div class="q-px-sm q-py-md">
            <div class="row no-wrap justify-between q-px-md">
              <!-- from -->
              <div class="column no-wrap items-center">
                <q-icon
                  name="r_circle"
                  class="rounded-lg cursor-pointer"
                  style="border: 1px solid transparent"
                  :style="`color: ${shape.fillLinearGradientColorStops[1]}; ${
                    selectedLinearGradientStop ===
                    shape.fillLinearGradientColorStops[0]
                      ? 'outline: 2px solid var(--q-primary);'
                      : ''
                  }`"
                  size="1.5rem"
                  @click="
                    selectedLinearGradientStop =
                      shape.fillLinearGradientColorStops[0]
                  "
                />

                <div>
                  <q-separator vertical style="height: 2rem" />
                </div>
              </div>

              <!-- to -->
              <div class="column no-wrap items-center">
                <q-icon
                  name="r_circle"
                  class="rounded-lg cursor-pointer"
                  style="border: 1px solid transparent"
                  :style="`color: ${shape.fillLinearGradientColorStops[3]}; ${
                    selectedLinearGradientStop ===
                    shape.fillLinearGradientColorStops[2]
                      ? 'outline: 2px solid var(--q-primary);'
                      : ''
                  }`"
                  size="1.5rem"
                  @click="
                    selectedLinearGradientStop =
                      shape.fillLinearGradientColorStops[2]
                  "
                />

                <div>
                  <q-separator vertical style="height: 2rem" />
                </div>
              </div>
            </div>

            <div
              :style="{ 'background-image': `url(${chessboard})` }"
              style="width: 100%; height: 20px"
              class="rounded-sm relative-position overflow-hidden"
            >
              <div
                class="absolute-center"
                style="width: 100%; height: 100%"
                :style="`background: linear-gradient(45deg, ${shape.fillLinearGradientColorStops[1]}, ${shape.fillLinearGradientColorStops[3]});`"
              ></div>
            </div>
          </div>
        </div>
      </q-slide-transition>

      <!-- color picker -->
      <q-color
        v-model="shape.fill"
        format-model="hex"
        no-header-tabs
        default-view="palette"
        style="border-radius: 0"
        @change="handleFillColorPickerChange()"
      />

      <!-- remove fill -->
      <div class="q-pa-sm">
        <q-btn
          icon="r_remove"
          class="full-width"
          color="grey"
          flat
          dense
          no-caps
          :label="$t('presentationStudio.toolbar.shape.fill.remove')"
          @click="
            shape.fill = 'transparent';
            studioStore.applyCustomization();
          "
        />
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      <div>
        {{ $t("presentationStudio.toolbar.shape.fill.title") }}
      </div>
    </q-tooltip>
  </q-btn>

  <!-- stroke -->
  <q-btn
    flat
    round
    size="12px"
    :class="{ 'bg-grey-2': showMenu.stroke }"
    :ripple="false"
    class="relative-position"
  >
    <div>
      <q-icon name="icon-mdi_border_outer_dots" class="absolute-center" />
      <q-icon
        name="icon-mdi_border_outer_stroke"
        :style="`color: ${shape.stroke}`"
        class="absolute-center"
      />
    </div>

    <q-menu
      v-model="showMenu.stroke"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="no-padding"
    >
      <!-- stroke color -->
      <q-color
        format-model="hex"
        no-header-tabs
        default-view="palette"
        v-model="shape.stroke"
        @change="studioStore.applyCustomization()"
      />

      <!-- stroke width -->
      <div class="q-pt-md q-px-md">
        <div class="text-caption text-grey">
          {{ $t("presentationStudio.toolbar.shape.stroke.width") }}
        </div>

        <q-slider
          v-model="shape.strokeWidth"
          :min="0"
          :max="20"
          label
          thumb-size="14px"
          :label-value="shape.strokeWidth + 'px'"
          @change="studioStore.applyCustomization()"
        />

        <q-input
          v-model.number="shape.strokeWidth"
          :min="0"
          :max="20"
          type="number"
          placeholder="0"
          suffix="px"
          style="min-width: 90px; width: 80px"
          outlined
          dense
          @change="studioStore.applyCustomization()"
        />

        <template
          v-if="
            [
              SHAPE_OPTIONS.ARROW.name,
              SHAPE_OPTIONS.ARROW_DOUBLE.name,
            ].includes(transformer.custom.shape?.node?.getAttr('shape'))
          "
        >
          <div class="text-caption text-grey q-mt-md">
            {{ $t("presentationStudio.toolbar.shape.stroke.pointerSize") }}
          </div>

          <q-slider
            v-model="shape.pointerSize"
            :min="0"
            :max="200"
            label
            thumb-size="14px"
            :label-value="shape.pointerSize + 'px'"
            @change="studioStore.applyCustomization()"
          />

          <q-input
            v-model.number="shape.pointerSize"
            :min="0"
            :max="200"
            type="number"
            placeholder="0"
            suffix="px"
            style="min-width: 90px; width: 80px"
            outlined
            dense
            @change="studioStore.applyCustomization()"
          />
        </template>
      </div>

      <!-- dash width -->
      <div class="q-py-md q-px-md">
        <div class="text-caption text-grey">
          {{ $t("presentationStudio.toolbar.shape.stroke.dash.width") }}
        </div>

        <q-slider
          v-model="shape.dash[0]"
          :min="0"
          :max="100"
          label
          thumb-size="14px"
          :label-value="shape.dash[0] + 'px'"
          @change="studioStore.applyCustomization()"
        />

        <q-input
          v-model.number="shape.dash[0]"
          :min="0"
          :max="100"
          type="number"
          placeholder="0"
          suffix="px"
          style="min-width: 90px; width: 80px"
          outlined
          dense
          @change="studioStore.applyCustomization()"
        />
      </div>

      <!-- dash gap -->
      <div class="q-pb-md q-px-md">
        <div class="text-caption text-grey">
          {{ $t("presentationStudio.toolbar.shape.stroke.dash.gap") }}
        </div>

        <q-slider
          v-model="shape.dash[1]"
          :min="0"
          :max="50"
          label
          thumb-size="14px"
          :label-value="shape.dash[1] + 'px'"
          @change="studioStore.applyCustomization()"
        />

        <q-input
          v-model.number="shape.dash[1]"
          :min="0"
          :max="50"
          type="number"
          placeholder="0"
          suffix="px"
          style="min-width: 90px; width: 80px"
          outlined
          dense
          @change="studioStore.applyCustomization()"
        />
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.shape.stroke.title") }}
    </q-tooltip>
  </q-btn>

  <!-- shadow -->
  <q-btn
    flat
    round
    size="12px"
    icon="icon-shadow"
    :class="{ 'bg-grey-2': showMenu.shadow }"
    :ripple="false"
  >
    <q-menu
      v-model="showMenu.shadow"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="no-padding hide-scrollbar no-padding"
    >
      <!-- shadow color -->
      <q-color
        format-model="hex"
        no-header-tabs
        style="min-width: 216px"
        default-view="palette"
        v-model="shape.shadowColor"
        @change="studioStore.applyCustomization()"
      />

      <div class="q-px-md q-pt-md q-pb-sm">
        <!-- shadow opacity -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.shape.shadow.opacity") }}
          </div>

          <q-slider
            v-model="shape.shadowOpacity"
            :min="0"
            :max="1"
            :step="0.01"
            label
            thumb-size="14px"
            :label-value="Math.round(shape.shadowOpacity * 100) + '%'"
            @change="studioStore.applyCustomization()"
          />
        </div>

        <!-- shadow blur -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.shape.shadow.blur") }}
          </div>

          <q-slider
            v-model="shape.shadowBlur"
            :min="0"
            :max="100"
            label
            thumb-size="14px"
            :label-value="shape.shadowBlur + 'px'"
            @change="studioStore.applyCustomization()"
          />
        </div>

        <!-- shadow offset x -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.shape.shadow.offsetX") }}
          </div>

          <q-slider
            v-model="shape.shadowOffset.x"
            :min="-200"
            :max="200"
            label
            thumb-size="14px"
            :label-value="shape.shadowOffset.x"
            @change="studioStore.applyCustomization()"
          />
        </div>

        <!-- shadow offset y -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.shape.shadow.offsetY") }}
          </div>

          <q-slider
            v-model="shape.shadowOffset.y"
            :min="-200"
            :max="200"
            label
            thumb-size="14px"
            :label-value="shape.shadowOffset.y"
            @change="studioStore.applyCustomization()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.shape.shadow.title") }}
    </q-tooltip>
  </q-btn>

  <!-- opacity -->
  <q-btn
    flat
    round
    size="12px"
    icon="r_opacity"
    :class="{ 'bg-grey-2': showMenu.opacity }"
    :ripple="false"
  >
    <q-menu
      v-model="showMenu.opacity"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      style="width: 220px"
      class="hide-scrollbar no-padding"
    >
      <div class="q-px-md q-pt-md q-pb-sm">
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.shape.opacity.title") }}
          </div>

          <q-slider
            v-model="shape.opacity"
            :min="0"
            :max="1"
            :step="0.01"
            label
            thumb-size="14px"
            :label-value="Math.round(shape.opacity * 100) + '%'"
            @change="studioStore.applyCustomization()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.shape.opacity.title") }}
    </q-tooltip>
  </q-btn>

  <!-- corner radius -->
  <q-btn
    v-if="
      transformer.default
        .nodes()
        .filter((node) => node.getAttr('shape') === SHAPE_OPTIONS.RECT.name)
        .length
    "
    flat
    round
    size="12px"
    icon="r_rounded_corner"
    :class="{ 'bg-grey-2': showMenu.cornerRadius }"
    :ripple="false"
  >
    <q-menu
      v-model="showMenu.cornerRadius"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="hide-scrollbar no-padding"
      style="width: 250px"
    >
      <div class="q-pa-md">
        <div class="text-caption text-grey">
          {{ $t("presentationStudio.toolbar.shape.cornerRadius.title") }}
        </div>

        <div class="row no-wrap items-center q-gutter-md q-pt-sm">
          <q-slider
            v-model="shape.cornerRadius"
            :min="0"
            :max="50"
            label
            thumb-size="14px"
            :label-value="shape.cornerRadius + '%'"
            @change="studioStore.applyCustomization()"
          />

          <q-input
            v-model.number="shape.cornerRadius"
            :min="0"
            :max="50"
            type="number"
            placeholder="0"
            suffix="%"
            style="min-width: 80px; width: 80px"
            outlined
            dense
            @change="studioStore.applyCustomization()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.shape.cornerRadius.title") }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStudioStore } from "stores/studio";
import { storeToRefs } from "pinia";
import {
  SHAPE_OPTIONS,
  SHAPE_TYPES,
} from "src/constants/canvas/canvasVariables";

/*
 * stores
 */
const studioStore = useStudioStore();
const { shape, transformer } = storeToRefs(studioStore);

const showMenu = ref({
  fill: false,
  stroke: false,
  opacity: false,
  cornerRadius: false,
});

/*
 * fill mode
 */
const FILL_MODE_OPTIONS = {
  LINEAR_GRADIENT: "linearGradient",
  SOLID: "solid",
};
const fillMode = ref(
  shape.value.fillLinearGradientColorStops
    ? FILL_MODE_OPTIONS.LINEAR_GRADIENT
    : FILL_MODE_OPTIONS.SOLID,
);
watch(
  () => transformer.value.default.nodes(),
  () => {
    fillMode.value = shape.value.fillLinearGradientColorStops
      ? FILL_MODE_OPTIONS.LINEAR_GRADIENT
      : FILL_MODE_OPTIONS.SOLID;
  },
);

const chessboard =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAH0lEQVQoU2NkYGAwZkAFZ5G5jPRRgOYEVDeB3EBjBQBOZwTVugIGyAAAAABJRU5ErkJggg==";

const selectedLinearGradientStop = ref(0);

const handleFillColorPickerChange = () => {
  if (fillMode.value === FILL_MODE_OPTIONS.LINEAR_GRADIENT) {
    shape.value.fillLinearGradientColorStops[
      selectedLinearGradientStop.value === 0 ? 1 : 3
    ] = shape.value.fill;
  }

  studioStore.applyCustomization();
};

const handleFillModeUpdate = () => {
  if (fillMode.value === FILL_MODE_OPTIONS.SOLID) {
    shape.value.fill = shape.value.fillLinearGradientColorStops[1];
    shape.value.fillLinearGradientColorStops = null;
  }

  if (fillMode.value === FILL_MODE_OPTIONS.LINEAR_GRADIENT) {
    shape.value.fillLinearGradientColorStops =
      shape.value.default.fillLinearGradientColorStops;
    shape.value.fillLinearGradientColorStops[1] = shape.value.fill;
  }

  studioStore.applyCustomization();
};
</script>

<style scoped lang="scss">
::v-deep(.q-field--dense .q-field__control) {
  height: 30px !important;

  .q-field__suffix {
    padding: 0;
  }
}

/*
 * gradient
 */
.chessboard {
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0.1;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      $black 0,
      $black 5px,
      $white 5px,
      $white 10px
    );
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      90deg,
      $black 0,
      $black 5px,
      $white 5px,
      $white 10px
    );
    mix-blend-mode: difference;
  }
}
</style>
