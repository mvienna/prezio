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
      @click="$emit('switchMode', modes.drawing)"
    >
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
            :options="brushSizeOptions"
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
            :options="brushTypes"
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
      @click="$emit('switchMode', modes.text)"
    >
      <q-menu
        anchor="bottom left"
        self="top left"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 8]"
        class="q-pa-sm"
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
          />

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
          />

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
          />

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
          />
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
            :options="fontOptions"
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
            :options="fontSizeOptions"
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
        $emit('switchMode', modes.media);
        showSelectMediaDialog = true;
      "
    />

    <!-- emoji -->
    <q-btn
      icon="mood"
      unelevated
      text-color="dark"
      round
      size="12px"
      @click="$emit('switchMode', modes.mediaEmojis)"
    >
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
            v-for="emoji in emojis"
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
      disable
      size="12px"
      @click="$emit('switchMode', modes.mediaShapes)"
    >
      <q-menu
        anchor="bottom left"
        self="top left"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 8]"
        class="q-pa-sm"
        style="width: 140px"
      >
        <div class="row q-gutter-sm">
          <q-btn
            v-for="shape in shapes"
            :key="shape.name"
            unelevated
            round
            size="12px"
            class="q-pa-sm"
            v-close-popup
            @click="$emit('addImage', shape.src)"
          >
            <template #default>
              <q-img :src="shape.src" />
            </template>
          </q-btn>
        </div>
      </q-menu>

      <q-tooltip> {{ $t("tooltips.in_development") }}</q-tooltip>
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
import { emojis } from "src/constants/assets/emojis";
import { shapes } from "src/constants/assets/shapes";
import SelectMedia from "components/media/SelectMedia.vue";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCanvasDrawingStore } from "stores/canvas/drawing";
import { useCanvasTextStore } from "stores/canvas/text";
import { useCanvasStore } from "stores/canvas";
import { fontOptions, fontSizeOptions } from "src/constants/canvas/fonts";
import { brushSizeOptions, brushTypes } from "src/constants/canvas/brushes";

/*
 * stores
 */
const drawingStore = useCanvasDrawingStore();
const drawingState = storeToRefs(drawingStore);

const textStore = useCanvasTextStore();
const textState = storeToRefs(textStore);

const { mode, modes, selectedElement, selectedElementIndex } = storeToRefs(
  useCanvasStore()
);

/*
 * emits
 */
defineEmits([
  "switchMode",
  "deselect",
  "delete",
  "addImage",
  "applyFormatting",
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
        case modes.value.text:
          textStore.loadSelectedElementCustomization();
          break;

        case modes.value.drawing:
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
