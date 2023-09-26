<template>
  <div class="presentation_toolbar__top bg-white q-pa-md row no-wrap">
    <!-- modes -->
    <PresentationStudioToolbarTopModes
      @switch-mode="$emit('switchMode', $event)"
      @add-image="$emit('addImage', $event)"
      @add-shape="$emit('addShape', $event)"
    />

    <q-separator vertical class="q-ml-md q-mr-sm" />

    <div
      v-if="showCustomizationMenu"
      class="row no-wrap items-center q-gutter-sm scroll--hidden q-pl-sm"
      style="width: 100%; overflow-x: scroll"
    >
      <!-- drawing customization -->
      <PresentationStudioToolbarTopCustomizationDrawing
        v-if="mode === MODES_OPTIONS.drawing"
      />

      <!-- text customization -->
      <PresentationStudioToolbarTopCustomizationText
        v-if="mode === MODES_OPTIONS.text || mode === MODES_OPTIONS.textEditing"
      />

      <!-- shape customization -->
      <PresentationStudioToolbarTopCustomizationShape
        v-if="mode === MODES_OPTIONS.shape"
      />
    </div>

    <q-space />

    <!-- selected item actions -->
    <template v-if="copiedElement">
      <!-- deselect line button -->
      <q-btn
        icon="r_paste"
        unelevated
        text-color="dark"
        size="12px"
        round
        @click="paste()"
      >
        <q-tooltip>
          {{ $t("presentationStudio.elementsContextMenu.paste.shortcut") }}
        </q-tooltip>
      </q-btn>
    </template>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCanvasDrawingStore } from "stores/canvas/drawing";
import { useCanvasTextStore } from "stores/canvas/text";
import { useCanvasStore } from "stores/canvas";
import { useCanvasShapeStore } from "stores/canvas/shape";
import { paste } from "stores/canvas/helpers/elementsContextMenuActions";
import PresentationStudioToolbarTopCustomizationDrawing from "components/presentationStudio/toolbar/top/customization/PresentationStudioToolbarTopCustomizationDrawing.vue";
import PresentationStudioToolbarTopCustomizationText from "components/presentationStudio/toolbar/top/customization/PresentationStudioToolbarTopCustomizationText.vue";
import PresentationStudioToolbarTopCustomizationShape from "components/presentationStudio/toolbar/top/customization/PresentationStudioToolbarTopCustomizationShape.vue";
import PresentationStudioToolbarTopModes from "components/presentationStudio/toolbar/top/PresentationStudioToolbarTopModes.vue";

/*
 * stores
 */
const drawingStore = useCanvasDrawingStore();
const textStore = useCanvasTextStore();
const shapeStore = useCanvasShapeStore();

const {
  mode,
  MODES_OPTIONS,
  selectedElement,
  selectedElementIndex,
  copiedElement,
} = storeToRefs(useCanvasStore());

/*
 * emits
 */
defineEmits(["switchMode", "addImage", "addShape"]);

/*
 * variables
 */

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
</script>

<style scoped lang="scss">
.presentation_toolbar__top {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 68px;
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
