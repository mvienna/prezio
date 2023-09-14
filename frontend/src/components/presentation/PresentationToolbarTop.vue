<template>
  <div class="presentation_toolbar__top bg-white q-pa-md row no-wrap">
    <div class="row no-wrap q-gutter-sm">
      <!-- drawing -->
      <q-btn
        icon="r_gesture"
        unelevated
        text-color="primary"
        round
        size="12px"
        :class="mode === MODES_OPTIONS.drawing ? 'bg-blue-1' : ''"
        @click="$emit('switchMode', MODES_OPTIONS.drawing)"
      >
        <q-tooltip>
          {{ $t("presentation.toolbar.drawing.title") }}
        </q-tooltip>
      </q-btn>

      <!-- text -->
      <q-btn
        icon="r_text_fields"
        unelevated
        text-color="primary"
        round
        size="12px"
        :class="mode === MODES_OPTIONS.text ? 'bg-blue-1' : ''"
        @click="$emit('switchMode', MODES_OPTIONS.text)"
      >
        <q-tooltip>
          {{ $t("presentation.toolbar.text.title") }}
        </q-tooltip>
      </q-btn>

      <!-- image -->
      <q-btn
        icon="r_image"
        unelevated
        text-color="primary"
        round
        size="12px"
        @click="
          $emit('switchMode', MODES_OPTIONS.media);
          showSelectMediaDialog = true;
        "
      >
        <q-tooltip>
          {{ $t("presentation.toolbar.media.title") }}
        </q-tooltip>
      </q-btn>

      <!-- emoji -->
      <q-btn
        icon="r_add_reaction"
        unelevated
        text-color="primary"
        round
        size="12px"
        @click="$emit('switchMode', MODES_OPTIONS.mediaEmoji)"
      >
        <q-tooltip>
          {{ $t("presentation.toolbar.emoji.title") }}
        </q-tooltip>

        <q-menu
          anchor="bottom left"
          self="top left"
          transition-show="jump-down"
          transition-hide="jump-up"
          :offset="[0, 8]"
          class="q-pa-sm"
          style="width: 240px"
        >
          <div class="row q-gutter-sm">
            <q-btn
              v-for="emoji in EMOJIS"
              :key="emoji.name"
              unelevated
              round
              size="16px"
              class="q-pa-sm"
              v-close-popup
              @click="$emit('addImage', emoji.src)"
            >
              <template #default>
                <q-img :src="emoji.src" />
              </template>
            </q-btn>
          </div>
        </q-menu>
      </q-btn>

      <!-- shapes -->
      <q-btn
        icon="r_shape_line"
        :class="mode === MODES_OPTIONS.shape ? 'bg-blue-1' : ''"
        unelevated
        text-color="primary"
        round
        size="12px"
      >
        <q-menu
          anchor="bottom left"
          self="top left"
          transition-show="jump-down"
          transition-hide="jump-up"
          :offset="[0, 8]"
          class="q-pa-sm"
          style="width: 184px"
        >
          <div class="row q-gutter-sm">
            <q-btn
              v-for="shape in SHAPES"
              :key="shape.name"
              unelevated
              round
              size="12px"
              class="q-pa-sm"
              v-close-popup
              @click="
                $emit('switchMode', MODES_OPTIONS.shape);
                $emit('addShape', shape.name);
              "
            >
              <template #default>
                <q-img :src="shape.src" />
              </template>
            </q-btn>
          </div>
        </q-menu>

        <q-tooltip>
          {{ $t("presentation.toolbar.shape.title") }}
        </q-tooltip>
      </q-btn>
    </div>

    <q-separator vertical class="q-ml-md q-mr-sm" />

    <div
      v-if="showCustomizationMenu"
      class="row no-wrap items-center q-gutter-sm full-width"
    >
      <!-- drawing customization -->
      <template v-if="mode === MODES_OPTIONS.drawing">
        <!-- color picker -->
        <q-btn flat round size="12px">
          <q-icon
            name="r_colorize"
            :style="`color: ${drawingState.customization.value.color}`"
          />

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
              v-model="drawingState.customization.value.color"
              @update:model-value="drawingStore.applyStyles()"
            />
          </q-menu>

          <q-tooltip :offset="[0, 4]">
            {{ $t("presentation.drawing.options.color") }}
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
            {{ $t("presentation.drawing.options.brushSize") }}
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
          @update:model-value="drawingStore.applyStyles()"
        >
          <template #prepend>
            <q-icon
              name="r_brush"
              class="text-semibold text-dark"
              size="20px"
            />
          </template>

          <q-tooltip :offset="[0, 4]">
            {{ $t("presentation.drawing.options.brushType") }}
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
            {{ $t("presentation.drawing.options.erase") }}
          </q-tooltip>
        </q-checkbox>
      </template>

      <!-- text customization -->
      <template
        v-if="mode === MODES_OPTIONS.text || mode === MODES_OPTIONS.textEditing"
      >
        <!-- formatting - bold -->
        <q-btn
          outline
          size="10px"
          round
          icon="r_format_bold"
          :text-color="
            textState.customization.value.formatting.isBold ? 'white' : 'black'
          "
          :class="
            textState.customization.value.formatting.isBold
              ? 'bg-primary'
              : 'bg-white'
          "
          @click="
            textState.customization.value.formatting.isBold =
              !textState.customization.value.formatting.isBold;
            textStore.applyStyles();
          "
        >
          <q-tooltip class="text-bold">
            {{ $t("presentation.toolbar.text.formatting.bold") }}
          </q-tooltip>
        </q-btn>

        <!-- formatting - underline -->
        <q-btn
          outline
          size="10px"
          round
          icon="r_format_underlined"
          :text-color="
            textState.customization.value.formatting.isUnderline
              ? 'white'
              : 'black'
          "
          :class="
            textState.customization.value.formatting.isUnderline
              ? 'bg-primary'
              : 'bg-white'
          "
          @click="
            textState.customization.value.formatting.isUnderline =
              !textState.customization.value.formatting.isUnderline;
            textStore.applyStyles();
          "
        >
          <q-tooltip style="text-decoration: underline">
            {{ $t("presentation.toolbar.text.formatting.underline") }}
          </q-tooltip>
        </q-btn>

        <!-- formatting - strike-through -->
        <q-btn
          outline
          size="10px"
          round
          icon="r_strikethrough_s"
          :text-color="
            textState.customization.value.formatting.isLineThrough
              ? 'white'
              : 'black'
          "
          :class="
            textState.customization.value.formatting.isLineThrough
              ? 'bg-primary'
              : 'bg-white'
          "
          @click="
            textState.customization.value.formatting.isLineThrough =
              !textState.customization.value.formatting.isLineThrough;
            textStore.applyStyles();
          "
        >
          <q-tooltip style="text-decoration: line-through">
            {{ $t("presentation.toolbar.text.formatting.strikeThrough") }}
          </q-tooltip>
        </q-btn>

        <!-- formatting - italic -->
        <q-btn
          outline
          size="10px"
          round
          icon="r_format_italic"
          :text-color="
            textState.customization.value.formatting.isItalic
              ? 'white'
              : 'black'
          "
          :class="
            textState.customization.value.formatting.isItalic
              ? 'bg-primary'
              : 'bg-white'
          "
          @click="
            textState.customization.value.formatting.isItalic =
              !textState.customization.value.formatting.isItalic;
            textStore.applyStyles();
          "
        >
          <q-tooltip class="text-italic">
            {{ $t("presentation.toolbar.text.formatting.italic") }}
          </q-tooltip>
        </q-btn>

        <q-separator vertical class="q-ml-md q-mr-sm" />

        <!-- formatting - alignment -->
        <q-btn
          unelevated
          size="10px"
          round
          color="black"
          :icon="
            textState.customization.value.formatting.alignment.horizontal ===
            ALIGNMENT.horizontal.left
              ? 'r_format_align_left'
              : textState.customization.value.formatting.alignment
                  .horizontal === ALIGNMENT.horizontal.right
              ? 'r_format_align_right'
              : textState.customization.value.formatting.alignment
                  .horizontal === ALIGNMENT.horizontal.center
              ? 'r_format_align_center'
              : ''
          "
        >
          <q-tooltip>
            {{ $t("presentation.toolbar.text.formatting.alignment") }}
          </q-tooltip>

          <q-menu
            anchor="bottom right"
            self="top right"
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[0, 8]"
            class="q-pa-sm"
          >
            <div class="column no-wrap">
              <div class="row no-wrap">
                <q-btn
                  v-for="item in Object.keys(ALIGNMENT.horizontal)"
                  :key="item"
                  flat
                  size="10px"
                  round
                  :class="
                    item ===
                    textState.customization.value.formatting.alignment
                      .horizontal
                      ? 'text-black'
                      : 'text-grey'
                  "
                  :icon="
                    item === ALIGNMENT.horizontal.left
                      ? 'r_format_align_left'
                      : item === ALIGNMENT.horizontal.right
                      ? 'r_format_align_right'
                      : item === ALIGNMENT.horizontal.center
                      ? 'r_format_align_center'
                      : ''
                  "
                  @click="
                    textState.customization.value.formatting.alignment.horizontal =
                      item;
                    textStore.applyStyles();
                  "
                />
              </div>

              <div class="row no-wrap q-mt-sm">
                <q-btn
                  v-for="item in Object.keys(ALIGNMENT.vertical)"
                  :key="item"
                  flat
                  size="10px"
                  round
                  :class="
                    item ===
                    textState.customization.value.formatting.alignment.vertical
                      ? 'text-black'
                      : 'text-grey'
                  "
                  :icon="
                    item === ALIGNMENT.vertical.top
                      ? 'r_vertical_align_top'
                      : item === ALIGNMENT.vertical.bottom
                      ? 'r_vertical_align_bottom'
                      : item === ALIGNMENT.vertical.middle
                      ? 'r_align_vertical_center'
                      : ''
                  "
                  @click="
                    textState.customization.value.formatting.alignment.vertical =
                      item;
                    textStore.applyStyles();
                  "
                />
              </div>
            </div>
          </q-menu>
        </q-btn>

        <q-separator vertical class="q-ml-md q-mr-sm" />

        <!-- color picker -->
        <q-btn flat round size="12px">
          <q-icon
            name="r_colorize"
            :style="`color: ${textState.customization.value.color}`"
          />

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
              v-model="textState.customization.value.color"
              @update:model-value="textStore.applyStyles()"
            />
          </q-menu>

          <q-tooltip :offset="[0, 4]">
            {{ $t("presentation.drawing.options.color") }}
          </q-tooltip>
        </q-btn>

        <!-- font -->
        <q-select
          v-model="textState.customization.value.font"
          :options="FONT_OPTIONS"
          emit-value
          borderless
          color="dark"
          hide-dropdown-icon
          dense
          class="q-pl-sm"
          @update:model-value="textStore.applyStyles()"
        >
          <template #prepend>
            <q-icon
              name="r_text_fields"
              class="text-semibold text-dark"
              size="20px"
            />
          </template>

          <q-tooltip :offset="[0, 4]">
            {{ $t("presentation.text.options.font") }}
          </q-tooltip>
        </q-select>

        <!-- font size -->
        <q-select
          v-model="textState.customization.value.fontSize"
          :options="FONT_SIZE_OPTIONS"
          emit-value
          borderless
          color="dark"
          hide-dropdown-icon
          dense
          class="q-px-md"
          @update:model-value="textStore.applyStyles()"
        >
          <template #prepend>
            <q-icon
              name="r_sort_by_alpha"
              class="text-semibold text-dark"
              size="20px"
            />
          </template>

          <q-tooltip :offset="[0, 4]">
            {{ $t("presentation.text.options.fontSize") }}
          </q-tooltip>
        </q-select>

        <q-space />

        <!-- new text -->
        <q-btn
          icon="r_fiber_new"
          :label="$t('presentation.text.options.newText')"
          :color="!textState.isNewText.value ? 'primary' : 'grey'"
          unelevated
          no-caps
          no-wrap
          class="q-mr-sm"
          @click="textState.isNewText.value = !textState.isNewText.value"
        >
          <q-tooltip>
            {{ $t("presentation.toolbar.text.newText") }}
          </q-tooltip>
        </q-btn>
      </template>

      <!-- shape customization -->
      <template v-if="mode === MODES_OPTIONS.shape">
        <!-- color picker -->
        <q-btn flat round size="12px">
          <q-icon
            name="r_colorize"
            :style="`color: ${shapeState.customization.value.strokeColor}`"
          />

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
                :label="$t('presentation.shapes.options.removeStrokeColor')"
                @click="
                  shapeState.customization.value.strokeColor = null;
                  shapeStore.applyStyles();
                "
              />
            </div>
          </q-menu>

          <q-tooltip :offset="[0, 4]">
            {{ $t("presentation.shapes.options.strokeColor") }}
          </q-tooltip>
        </q-btn>

        <!-- fill color picker -->
        <q-btn flat round size="12px">
          <q-icon
            name="r_format_color_fill"
            :style="`color: ${shapeState.customization.value.fillColor}`"
          />

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
                :label="$t('presentation.shapes.options.removeFillColor')"
                @click="
                  shapeState.customization.value.fillColor = null;
                  shapeStore.applyStyles();
                "
              />
            </div>
          </q-menu>

          <q-tooltip :offset="[0, 4]">
            <div>
              {{ $t("presentation.shapes.options.fillColor") }}
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
          @update:model-value="shapeStore.applyStyles()"
        >
          <template #prepend>
            <q-icon
              name="line_weight"
              class="text-semibold text-dark"
              size="20px"
            />
          </template>

          <q-tooltip :offset="[0, 4]">
            {{ $t("presentation.shapes.options.lineWidth") }}
          </q-tooltip>
        </q-select>
      </template>
    </div>

    <q-space />

    <!-- selected item actions -->
    <template v-if="selectedElement">
      <!-- deselect line button -->
      <q-btn
        icon="r_done"
        unelevated
        text-color="dark"
        size="12px"
        round
        @click="$emit('deselect')"
      />

      <!-- delete line button -->
      <q-btn
        icon="r_backspace"
        unelevated
        text-color="dark"
        size="12px"
        round
        @click="$emit('delete')"
      />
    </template>

    <!-- select media -->
    <q-dialog v-model="showSelectMediaDialog">
      <SelectMedia
        @close="showSelectMediaDialog = false"
        @select="
          $emit('addImage', $event.original_url);
          showSelectMediaDialog = false;
        "
      />
    </q-dialog>
  </div>
</template>

<script setup>
import { EMOJIS } from "src/constants/assets/emojis";
import { SHAPES } from "src/constants/assets/shapes";
import SelectMedia from "components/media/SelectMedia.vue";
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCanvasDrawingStore } from "stores/canvas/drawing";
import { useCanvasTextStore } from "stores/canvas/text";
import { useCanvasStore } from "stores/canvas";
import {
  BRUSH_SIZE_OPTIONS,
  BRUSH_TYPES,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  ALIGNMENT,
  SHAPE_LINE_WIDTH_OPTIONS,
} from "src/constants/canvas/canvasVariables";
import { useCanvasShapeStore } from "stores/canvas/shape";

/*
 * stores
 */
const drawingStore = useCanvasDrawingStore();
const drawingState = storeToRefs(drawingStore);

const textStore = useCanvasTextStore();
const textState = storeToRefs(textStore);

const shapeStore = useCanvasShapeStore();
const shapeState = storeToRefs(shapeStore);

const { mode, MODES_OPTIONS, selectedElement, selectedElementIndex } =
  storeToRefs(useCanvasStore());

/*
 * emits
 */
defineEmits(["switchMode", "deselect", "delete", "addImage", "addShape"]);

/*
 * handle element selection - apply customization styles
 */
watch(
  () => selectedElementIndex.value,
  () => {
    if (selectedElementIndex.value !== -1) {
      switch (selectedElement.value.mode) {
        case MODES_OPTIONS.value.text:
          textStore.loadSelectedElementCustomization();
          break;

        case MODES_OPTIONS.value.drawing:
          drawingStore.loadSelectedElementCustomization();
          break;

        case MODES_OPTIONS.value.shape:
          shapeStore.loadSelectedElementCustomization();
          break;
      }
    }
  }
);

/*
 * variables
 */
const showSelectMediaDialog = ref(false);

const showCustomizationMenu = computed(() => {
  return (
    mode.value &&
    [
      MODES_OPTIONS.value.drawing,
      MODES_OPTIONS.value.text,
      MODES_OPTIONS.value.textEditing,
      MODES_OPTIONS.value.shape,
    ].includes(mode.value)
  );
});
</script>

<style scoped lang="scss">
.presentation_toolbar__top {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.05) 0 6px 24px 0;
}

::v-deep(.q-field--dense .q-field__marginal) {
  height: 36px;
}

::v-deep(.q-field--auto-height.q-field--dense) {
  .q-field__control,
  .q-field__native {
    min-height: 36px;
  }
}
</style>
