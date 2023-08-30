<template>
  <div class="bg-white q-py-md q-px-lg row no-wrap q-gutter-md">
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
          class="items-center text-semibold justify-start rounded-borders"
        >
          <q-icon
            name="o_palette"
            class="q-mr-md text-semibold"
            :style="`color: ${drawingState.customization.strokeColor}`"
            size="20px"
          />
          <div
            class="q-mr-lg"
            :style="`color: ${drawingState.customization.strokeColor}`"
          >
            {{ $t("presentationEditor.drawing.options.color") }}
          </div>

          <q-space />

          <input
            type="color"
            class="color_input"
            v-model="drawingState.customization.strokeColor"
          />
        </q-item>

        <!-- eraser -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders q-py-sm q-mt-md"
          :class="drawingState.eraserMode ? 'text-black' : 'text-grey-5'"
          clickable
          v-close-popup
          @click="$emit('toggleEraser')"
        >
          <q-icon
            name="icon-eraser"
            class="q-mr-md text-semibold"
            size="20px"
          />
          <div class="q-mr-lg text-no-wrap">
            {{ $t("presentationEditor.drawing.options.erase") }}
          </div>
        </q-item>

        <!-- brush size -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders q-mt-sm"
        >
          <q-select
            v-model="drawingState.customization.brushSize"
            :options="drawingState.customization.brushSizeOptions"
            map-options
            emit-value
            borderless
            :label="$t('presentationEditor.drawing.options.brushSize')"
            class="full-width"
            color="dark"
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
            v-model="drawingState.customization.selectedBrushType"
            :options="drawingState.customization.brushTypes"
            map-options
            emit-value
            :option-label="(option) => $t(option.label)"
            borderless
            class="full-width"
            color="dark"
            :label="$t('presentationEditor.drawing.options.brushType')"
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
        <div class="row no-wrap q-mx-sm q-mt-sm">
          <q-btn
            outline
            size="10px"
            round
            icon="format_bold"
            style="width: 100%"
            :text-color="
              textState.customization.formatting.isBold ? 'white' : 'black'
            "
            :class="
              textState.customization.formatting.isBold
                ? 'bg-primary'
                : 'bg-white'
            "
            v-close-popup
            @click="
              textState.customization.formatting.isBold =
                !textState.customization.formatting.isBold;
              $emit('formatText', 'b');
            "
          />
          <q-btn
            outline
            size="10px"
            round
            icon="format_underlined"
            style="width: 100%"
            class="q-mx-sm"
            :text-color="
              textState.customization.formatting.isUnderline ? 'white' : 'black'
            "
            :class="
              textState.customization.formatting.isUnderline
                ? 'bg-primary'
                : 'bg-white'
            "
            v-close-popup
            @click="
              textState.customization.formatting.isUnderline =
                !textState.customization.formatting.isUnderline;
              $emit('formatText', 'u');
            "
          />
          <q-btn
            outline
            size="10px"
            round
            icon="format_italic"
            class="full-width"
            :text-color="
              textState.customization.formatting.isItalic ? 'white' : 'black'
            "
            :class="
              textState.customization.formatting.isItalic
                ? 'bg-primary'
                : 'bg-white'
            "
            style="width: 100%"
            v-close-popup
            @click="
              textState.customization.formatting.isItalic =
                !textState.customization.formatting.isItalic;
              $emit('formatText', 'i');
            "
          />
        </div>

        <!-- color picker -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders q-mt-md"
        >
          <q-icon
            name="o_palette"
            class="q-mr-md text-semibold"
            :style="`color: ${textState.customization.color}`"
            size="20px"
          />
          <div
            class="q-mr-lg"
            :style="`color: ${textState.customization.color}`"
          >
            {{ $t("presentationEditor.drawing.options.color") }}
          </div>

          <q-space />

          <input
            type="color"
            class="color_input"
            v-model="textState.customization.color"
            @input="$emit('formatText', 'span')"
          />
        </q-item>

        <!-- font -->
        <q-item
          dense
          class="items-center text-semibold justify-start rounded-borders q-mt-sm"
        >
          <q-select
            v-model="textState.customization.font"
            :options="textState.customization.fontOptions"
            emit-value
            borderless
            :label="$t('presentationEditor.text.options.font')"
            class="full-width"
            color="dark"
            @update:model-value="$emit('formatText', 'span')"
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
            v-model="textState.customization.fontSize"
            :options="textState.customization.fontSizeOptions"
            emit-value
            borderless
            :label="$t('presentationEditor.text.options.fontSize')"
            class="full-width"
            color="dark"
            @update:model-value="$emit('formatText', 'span')"
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

        <!-- apply -->
        <q-item class="q-px-sm">
          <q-btn
            :label="$t('presentationEditor.text.apply')"
            icon="done"
            color="black"
            no-caps
            unelevated
            class="full-width"
            v-close-popup
            @click="$emit('formatText', 'span')"
          />
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
    </q-btn>

    <q-space />

    <!-- undo / redo -->
    <template v-if="isDrawingMode">
      <!-- undo button -->
      <q-btn
        icon="undo"
        unelevated
        text-color="dark"
        size="12px"
        round
        :disable="!drawingState.undoStack.length"
        @click="$emit('undo')"
      />

      <!-- redo button -->
      <q-btn
        icon="redo"
        unelevated
        text-color="dark"
        size="12px"
        round
        :disable="!drawingState.redoStack.length"
        @click="$emit('redo')"
      />
    </template>

    <!-- selected item actions -->
    <template
      v-if="
        drawingState.selectedLineIndex !== -1 ||
        textState.selectedTextIndex !== -1 ||
        mediaState.selectedImageIndex !== -1
      "
    >
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
  </div>

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
</template>

<script setup>
import { emojis } from "src/constants/assets/emojis";
import { shapes } from "src/constants/assets/shapes";
import SelectMedia from "components/media/SelectMedia.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useCanvasDrawingStore } from "stores/canvas/drawing";
import { useCanvasTextStore } from "stores/canvas/text";
import { useCanvasMediaStore } from "stores/canvas/media";

/*
 * stores
 */
const { drawingState } = storeToRefs(useCanvasDrawingStore());
const { textState } = storeToRefs(useCanvasTextStore());
const { mediaState } = storeToRefs(useCanvasMediaStore());

/*
 * emits
 */
defineEmits([
  "switchMode",
  "deselect",
  "delete",
  "undo",
  "redo",
  "addImage",
  "formatText",
  "toggleEraser",
]);

/*
 * props
 */
defineProps({
  modes: { type: Object, default: null },
  isDrawingMode: { type: Boolean },
  isMediaMode: { type: Boolean },
  isTextMode: { type: Boolean },
});

/*
 * variables
 */
const showSelectMediaDialog = ref(false);
</script>

<style scoped lang="scss">
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
