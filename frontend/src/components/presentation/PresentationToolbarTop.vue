<template>
  <div
    class="presentation_toolbar__top bg-white q-pb-md q-pr-lg row no-wrap q-gutter-md"
  >
    <!-- drawing -->
    <q-btn
      icon="gesture"
      unelevated
      text-color="dark"
      round
      size="12px"
      :class="isDrawingMode ? 'bg-grey-2' : ''"
      @click="$emit('switchMode', MODES_OPTIONS.drawing)"
    >
      <q-tooltip>
        {{ $t("presentationEditor.toolbar.drawing.title") }}
      </q-tooltip>

      <q-menu
        anchor="bottom left"
        self="top left"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 8]"
        class="q-pa-sm"
        style="width: 230px"
      >
        <!-- color picker -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders q-mt-sm"
        >
          <q-icon name="o_palette" class="q-mr-md text-semibold" size="20px" />
          <div class="q-mr-lg">
            {{ $t("presentationEditor.drawing.options.color") }}
          </div>

          <q-space />

          <input
            type="color"
            class="color_input"
            v-model="drawingState.customization.value.color"
            @input="drawingStore.applyStyles()"
          />
        </q-item>

        <!-- eraser -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders q-px-sm q-mt-sm"
        >
          <q-checkbox v-model="drawingState.eraserMode.value" class="q-mr-xs" />
          <div class="text-no-wrap">
            {{ $t("presentationEditor.drawing.options.erase") }}
          </div>
        </q-item>

        <!-- brush size -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders"
        >
          <q-select
            v-model="drawingState.customization.value.brushSize"
            :options="BRUSH_SIZE_OPTIONS"
            map-options
            emit-value
            borderless
            :label="$t('presentationEditor.drawing.options.brushSize')"
            class="full-width"
            color="dark"
            @update:model-value="drawingStore.applyStyles()"
          >
            <template #prepend>
              <q-icon
                name="line_weight"
                class="q-mr-xs text-semibold text-dark"
                size="20px"
              />
            </template>
          </q-select>
        </q-item>

        <!-- brush type -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders"
        >
          <q-select
            v-model="drawingState.customization.value.selectedBrushType"
            :options="BRUSH_TYPES"
            map-options
            emit-value
            :option-label="(option) => $t(option.label)"
            borderless
            class="full-width"
            color="dark"
            :label="$t('presentationEditor.drawing.options.brushType')"
            @update:model-value="drawingStore.applyStyles()"
          >
            <template #prepend>
              <q-icon
                name="brush"
                class="q-mr-xs text-semibold text-dark"
                size="20px"
              />
            </template>
          </q-select>
        </q-item>
      </q-menu>
    </q-btn>

    <!-- text -->
    <q-btn
      icon="text_fields"
      unelevated
      text-color="dark"
      round
      size="12px"
      :class="isTextMode ? 'bg-grey-2' : ''"
      @click="$emit('switchMode', MODES_OPTIONS.text)"
    >
      <q-tooltip>
        {{ $t("presentationEditor.toolbar.text.title") }}
      </q-tooltip>

      <q-menu
        anchor="bottom left"
        self="top left"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 8]"
        class="q-pa-sm"
        style="width: 230px"
      >
        <!-- formatting -->
        <div class="row no-wrap justify-between q-px-sm q-pt-sm">
          <!-- bold -->
          <q-btn
            outline
            size="10px"
            round
            icon="format_bold"
            :text-color="
              textState.customization.value.formatting.isBold
                ? 'white'
                : 'black'
            "
            :class="
              textState.customization.value.formatting.isBold
                ? 'bg-primary'
                : 'bg-white'
            "
            @click="
              textState.customization.value.formatting.isBold =
                !textState.customization.value.formatting.isBold;
              $emit('applyFormatting');
            "
          >
            <q-tooltip class="text-bold">
              {{ $t("presentationEditor.toolbar.text.formatting.bold") }}
            </q-tooltip>
          </q-btn>

          <!-- underline -->
          <q-btn
            outline
            size="10px"
            round
            icon="format_underlined"
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
              $emit('applyFormatting');
            "
          >
            <q-tooltip style="text-decoration: underline">
              {{ $t("presentationEditor.toolbar.text.formatting.underline") }}
            </q-tooltip>
          </q-btn>

          <!-- strike-through -->
          <q-btn
            outline
            size="10px"
            round
            icon="strikethrough_s"
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
              $emit('applyFormatting');
            "
          >
            <q-tooltip style="text-decoration: line-through">
              {{
                $t("presentationEditor.toolbar.text.formatting.strikeThrough")
              }}
            </q-tooltip>
          </q-btn>

          <!-- italic -->
          <q-btn
            outline
            size="10px"
            round
            icon="format_italic"
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
              $emit('applyFormatting');
            "
          >
            <q-tooltip class="text-italic">
              {{ $t("presentationEditor.toolbar.text.formatting.italic") }}
            </q-tooltip>
          </q-btn>

          <!-- alignment -->
          <q-btn
            unelevated
            size="10px"
            round
            color="black"
            :icon="
              textState.customization.value.formatting.alignment.horizontal ===
              ALIGNMENT.horizontal.left
                ? 'format_align_left'
                : textState.customization.value.formatting.alignment
                    .horizontal === ALIGNMENT.horizontal.right
                ? 'format_align_right'
                : textState.customization.value.formatting.alignment
                    .horizontal === ALIGNMENT.horizontal.center
                ? 'format_align_center'
                : ''
            "
          >
            <q-tooltip>
              {{ $t("presentationEditor.toolbar.text.formatting.alignment") }}
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
                        ? 'format_align_left'
                        : item === ALIGNMENT.horizontal.right
                        ? 'format_align_right'
                        : item === ALIGNMENT.horizontal.center
                        ? 'format_align_center'
                        : ''
                    "
                    @click="
                      textState.customization.value.formatting.alignment.horizontal =
                        item;
                      $emit('applyFormatting');
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
                      textState.customization.value.formatting.alignment
                        .vertical
                        ? 'text-black'
                        : 'text-grey'
                    "
                    :icon="
                      item === ALIGNMENT.vertical.top
                        ? 'vertical_align_top'
                        : item === ALIGNMENT.vertical.bottom
                        ? 'vertical_align_bottom'
                        : item === ALIGNMENT.vertical.middle
                        ? 'align_vertical_center'
                        : ''
                    "
                    @click="
                      textState.customization.value.formatting.alignment.vertical =
                        item;
                      $emit('applyFormatting');
                    "
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>

        <!-- color picker -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders q-mt-md"
        >
          <q-icon name="o_palette" class="q-mr-md text-semibold" size="20px" />
          <div class="q-mr-lg">
            {{ $t("presentationEditor.drawing.options.color") }}
          </div>

          <q-space />

          <input
            type="color"
            class="color_input"
            v-model="textState.customization.value.color"
            @input="$emit('applyFormatting')"
          />
        </q-item>

        <!-- font -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders q-mt-sm"
        >
          <q-select
            v-model="textState.customization.value.font"
            :options="FONT_OPTIONS"
            emit-value
            borderless
            :label="$t('presentationEditor.text.options.font')"
            class="full-width"
            color="dark"
            @update:model-value="$emit('applyFormatting')"
          >
            <template #prepend>
              <q-icon
                name="text_fields"
                class="q-mr-xs text-semibold text-dark"
                size="20px"
              />
            </template>
          </q-select>
        </q-item>

        <!-- font size -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders"
        >
          <q-select
            v-model="textState.customization.value.fontSize"
            :options="FONT_SIZE_OPTIONS"
            emit-value
            borderless
            :label="$t('presentationEditor.text.options.fontSize')"
            class="full-width"
            color="dark"
            @update:model-value="$emit('applyFormatting')"
          >
            <template #prepend>
              <q-icon
                name="sort_by_alpha"
                class="q-mr-xs text-semibold text-dark"
                size="20px"
              />
            </template>
          </q-select>
        </q-item>

        <q-item class="q-px-sm">
          <q-btn
            icon="fiber_new"
            :label="$t('presentationEditor.text.options.newText')"
            :color="!textState.isNewText.value ? 'primary' : 'grey'"
            unelevated
            no-caps
            class="full-width"
            v-close-popup
            @click="textState.isNewText.value = !textState.isNewText.value"
          >
            <q-tooltip>
              {{ $t("presentationEditor.toolbar.text.newText") }}
            </q-tooltip>
          </q-btn>
        </q-item>
      </q-menu>
    </q-btn>

    <!-- image -->
    <q-btn
      icon="o_image"
      unelevated
      text-color="dark"
      round
      size="12px"
      @click="
        $emit('switchMode', MODES_OPTIONS.media);
        showSelectMediaDialog = true;
      "
    >
      <q-tooltip>
        {{ $t("presentationEditor.toolbar.media.title") }}
      </q-tooltip>
    </q-btn>

    <!-- emoji -->
    <q-btn
      icon="mood"
      unelevated
      text-color="dark"
      round
      size="12px"
      @click="$emit('switchMode', MODES_OPTIONS.mediaEmoji)"
    >
      <q-tooltip>
        {{ $t("presentationEditor.toolbar.emoji.title") }}
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
      icon="o_shape_line"
      unelevated
      text-color="dark"
      round
      size="12px"
      @click="$emit('switchMode', MODES_OPTIONS.shape)"
    >
      <q-tooltip>
        {{ $t("presentationEditor.toolbar.shape.title") }}
      </q-tooltip>

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
            @click="$emit('addShape', shape.name)"
          >
            <template #default>
              <q-img :src="shape.src" />
            </template>
          </q-btn>
        </div>

        <q-separator class="q-my-sm" />

        <!-- color picker -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders q-mt-sm q-pl-sm q-pr-none"
        >
          <q-icon name="o_palette" class="q-mr-md text-semibold" size="20px" />
          <div class="q-mr-lg">
            {{ $t("presentationEditor.shapes.options.color") }}
          </div>

          <q-space />

          <input
            type="color"
            class="color_input"
            v-model="shapeState.customization.value.color"
            @input="shapeStore.applyStyles()"
          />
        </q-item>

        <!-- fill color picker -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders q-mt-sm q-pl-sm q-pr-none"
        >
          <q-icon
            :name="
              [
                SHAPES_OPTIONS.circle,
                SHAPES_OPTIONS.square,
                SHAPES_OPTIONS.triangle,
                SHAPES_OPTIONS.star,
              ].includes(selectedElement?.type) &&
              shapeState.customization.value.fill
                ? 'done'
                : 'close'
            "
            class="q-mr-md text-semibold"
            size="20px"
            @click="
              shapeState.customization.value.fill = null;
              shapeStore.applyStyles();
            "
          />

          <div class="q-mr-lg">
            {{ $t("presentationEditor.shapes.options.fill") }}
          </div>

          <q-space />

          <input
            type="color"
            class="color_input"
            v-model="shapeState.customization.value.fill"
            @input="shapeStore.applyStyles()"
          />
        </q-item>

        <!-- line width -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders"
        >
          <q-select
            v-model="shapeState.customization.value.lineWidth"
            :options="SHAPE_LINE_WIDTH_OPTIONS"
            map-options
            emit-value
            borderless
            :label="$t('presentationEditor.shapes.options.lineWidth')"
            class="full-width"
            color="dark"
            @update:model-value="shapeStore.applyStyles()"
          >
            <template #prepend>
              <q-icon
                name="line_weight"
                class="q-mr-xs text-semibold text-dark"
                size="20px"
              />
            </template>
          </q-select>
        </q-item>
      </q-menu>
    </q-btn>

    <q-space />

    <!-- undo / redo -->
    <template v-if="isDrawingMode">
      <!-- undo button -->
      <q-btn icon="undo" unelevated text-color="dark" size="12px" round />

      <!-- redo button -->
      <q-btn icon="redo" unelevated text-color="dark" size="12px" round />
    </template>

    <!-- selected item actions -->
    <template v-if="selectedElement">
      <!-- deselect line button -->
      <q-btn
        icon="done"
        unelevated
        text-color="dark"
        size="12px"
        round
        @click="$emit('deselect')"
      />

      <!-- delete line button -->
      <q-btn
        icon="o_backspace"
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
import { ref, watch } from "vue";
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
  SHAPES_OPTIONS,
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
defineEmits([
  "switchMode",
  "deselect",
  "delete",
  "addImage",
  "applyFormatting",
  "addShape",
]);

/*
 * props
 */
defineProps({
  isDrawingMode: { type: Boolean },
  isMediaMode: { type: Boolean },
  isTextMode: { type: Boolean },
});

/*
 * handle element selection - apply customization styles
 */
watch(
  () => selectedElementIndex.value,
  () => {
    if (selectedElementIndex.value !== -1) {
      switch (selectedElementIndex.value.mode) {
        case MODES_OPTIONS.value.text:
          textStore.loadSelectedElementCustomization();
          break;

        case MODES_OPTIONS.value.drawing:
          drawingStore.loadSelectedElementCustomization();
          break;
      }
    }
  }
);

/*
 * variables
 */
const showSelectMediaDialog = ref(false);
</script>

<style scoped lang="scss">
.presentation_toolbar__top {
  position: absolute;
  z-index: 2;
  top: 16px;
  left: 16px;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.05) 0 6px 24px 0;
}

.color_input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: calc(36px * 1.5);
  height: 36px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
.color_input::-webkit-color-swatch {
  border-radius: 8px;
  border: none;
}
.color_input::-moz-color-swatch {
  border-radius: 8px;
  border: none;
}
</style>
