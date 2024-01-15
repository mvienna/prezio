<template>
  <!-- fill color -->
  <q-btn
    v-if="
      ![SHAPES_OPTIONS.arrow, SHAPES_OPTIONS.line].includes(
        selectedElement.type
      )
    "
    flat
    round
    size="12px"
    class="relative-position"
  >
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
      class="no-padding"
    >
      <q-tabs
        v-model="shapeState.customization.value.fillStyle"
        align="justify"
        indicator-color="primary"
        inline-label
        dense
        @update:model-value="
          colorInput = 1;
          shapeStore.applyStyles();
        "
      >
        <q-tab
          name="solid"
          :label="
            $t('presentationStudio.toolbar.shape.options.fill.style.solid')
          "
          no-caps
        >
        </q-tab>
        <q-tab
          name="gradient"
          :label="
            $t('presentationStudio.toolbar.shape.options.fill.style.gradient')
          "
          no-caps
        >
        </q-tab>
      </q-tabs>

      <div
        v-if="shapeState.customization.value.fillStyle === 'gradient'"
        class="gradient q-ma-md"
      >
        <div class="row no-wrap justify-between">
          <!-- from color -->
          <div class="gradient__anchor">
            <div
              class="gradient__anchor__color relative-position"
              :class="`${
                colorInput === 1 ? 'gradient__anchor__color--active' : ''
              } ${
                !shapeState.customization.value.fillColor
                  ? 'gradient__anchor__color--error'
                  : ''
              }`"
              :style="`background: ${shapeState.customization.value.fillColor}`"
              @click="colorInput = 1"
            >
              <q-icon
                v-if="!shapeState.customization.value.fillColor"
                name="r_priority_high"
                class="absolute-center"
                color="red"
              />
            </div>
            <div class="gradient__anchor__connector"></div>
          </div>

          <!-- from color -->
          <div class="gradient__anchor">
            <div
              class="gradient__anchor__color"
              :class="colorInput === 2 ? 'gradient__anchor__color--active' : ''"
              :style="`background: ${shapeState.customization.value.fillColor2}`"
              @click="colorInput = 2"
            ></div>
            <div class="gradient__anchor__connector"></div>
          </div>
        </div>

        <div class="gradient__preview">
          <!-- chessboard -->
          <div class="gradient__preview__background"></div>

          <!-- gradient -->
          <div
            class="gradient__preview__gradient"
            :style="`background: linear-gradient(45deg, ${shapeState.customization.value.fillColor}, ${shapeState.customization.value.fillColor2});`"
          ></div>
        </div>
      </div>

      <!-- first color -->
      <q-color
        v-if="colorInput === 1"
        v-model="shapeState.customization.value.fillColor"
        no-header-tabs
        default-view="palette"
        style="border-radius: 0"
        @change="shapeStore.applyStyles()"
      />

      <!-- second color -->
      <q-color
        v-if="colorInput === 2"
        v-model="shapeState.customization.value.fillColor2"
        no-header-tabs
        default-view="palette"
        style="border-radius: 0"
        @change="shapeStore.applyStyles()"
      />

      <div class="q-pa-sm">
        <q-btn
          icon="r_remove"
          class="full-width"
          color="grey"
          flat
          dense
          no-caps
          :label="$t('presentationStudio.toolbar.shape.options.fill.remove')"
          @click="handleFillRemove()"
        />
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      <div>
        {{ $t("presentationStudio.toolbar.shape.options.fill.title") }}
      </div>
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
      <q-color
        no-header-tabs
        default-view="palette"
        v-model="shapeState.customization.value.strokeColor"
        @change="shapeStore.applyStyles()"
      />

      <div class="q-pa-sm">
        <div class="text-caption text-grey q-ml-sm">
          {{ $t("presentationStudio.toolbar.shape.options.stroke.width") }}
        </div>

        <!-- line width -->
        <q-select
          v-model="shapeState.customization.value.lineWidth"
          :options="SHAPE_LINE_WIDTH_OPTIONS"
          map-options
          emit-value
          borderless
          color="black"
          dense
          hide-dropdown-icon
          class="q-pl-sm"
          options-dense
          @update:model-value="shapeStore.applyStyles()"
        >
          <template #prepend>
            <q-icon
              name="line_weight"
              class="text-semibold text-dark"
              size="20px"
            />
          </template>
        </q-select>

        <div
          v-if="shapeState.customization.value.lineWidth !== '0px'"
          class="q-pa-sm"
        >
          <q-btn
            icon="r_remove"
            class="full-width"
            color="grey"
            flat
            dense
            no-caps
            :label="
              $t('presentationStudio.toolbar.shape.options.stroke.remove')
            "
            @click="
              shapeState.customization.value.lineWidth = '0px';
              shapeStore.applyStyles();
            "
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.shape.options.stroke.title") }}
    </q-tooltip>
  </q-btn>

  <!-- shadow -->
  <q-btn flat round size="12px" icon="icon-shadow " class="q-ml-sm">
    <q-menu
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      style="overflow-x: hidden"
      class="no-padding"
    >
      <!-- shadow color -->
      <q-color
        format-model="hex"
        no-header-tabs
        default-view="palette"
        v-model="shapeState.customization.value.shadowColor"
        @change="shapeStore.applyStyles()"
      />

      <div class="q-py-sm q-px-md">
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

        <!-- remove shadow -->
        <q-btn
          v-if="shapeState.customization.value.shadowOpacity > 0"
          flat
          dense
          icon="r_remove"
          :label="$t('presentationStudio.toolbar.media.options.shadow.remove')"
          color="grey"
          class="full-width q-my-sm"
          no-caps
          @click="
            shapeState.customization.value.shadowOpacity = 0;
            shapeStore.applyStyles();
          "
        />
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
import {
  SHAPE_LINE_WIDTH_OPTIONS,
  SHAPES_OPTIONS,
} from "src/constants/canvas/canvasVariables";
import { useCanvasShapeStore } from "stores/canvas/shape";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useCanvasStore } from "stores/canvas";

/*
 * stores
 */
const shapeStore = useCanvasShapeStore();
const shapeState = storeToRefs(shapeStore);

const canvasStore = useCanvasStore();
const { selectedElement } = storeToRefs(canvasStore);

/*
 * fill color
 */
const colorInput = ref(1);

const handleFillRemove = () => {
  shapeState.customization.value.fillStyle = "solid";
  shapeState.customization.value.fillColor = null;
  shapeStore.applyStyles();
};
</script>

<style scoped lang="scss">
::v-deep(.q-slider) {
  width: 100%;
}

.gradient {
  .gradient__anchor {
    .gradient__anchor__color {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      margin: 0 auto;
      cursor: pointer;
      border: 1px solid $grey-2;

      &.gradient__anchor__color--active {
        border: 1px solid $white;
        outline: 2px solid $primary;
      }

      &.gradient__anchor__color--error {
        border: 1px solid $white;
        outline: 2px solid $red;
      }
    }

    .gradient__anchor__connector {
      height: 16px;
      width: 2px;
      margin: 4px auto;
      background: $black;
      opacity: 0.1;
    }
  }

  .gradient__preview {
    width: calc(100%);
    height: 20px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;

    .gradient__preview__gradient {
      width: 100%;
      height: 100%;
      z-index: 2;
      position: absolute;
    }

    .gradient__preview__background {
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
  }
}
</style>
