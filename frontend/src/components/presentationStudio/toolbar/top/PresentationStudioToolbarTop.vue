<template>
  <div class="presentation_toolbar__top bg-white q-pa-md row no-wrap">
    <q-btn
      icon="r_space_dashboard"
      unelevated
      text-color="dark"
      :class="showLayoutsMenu ? 'bg-grey-2' : ''"
      round
      size="12px"
    >
      <q-tooltip>
        {{ $t("presentationStudio.toolbar.layouts.title") }}
      </q-tooltip>

      <!-- layouts -->
      <q-menu
        v-model="showLayoutsMenu"
        anchor="top left"
        self="bottom left"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 16]"
        class="q-pa-md"
        max-height="70vh"
        style="
          width: 424px;
          backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.5);
        "
      >
        <PresentationStudioToolbarTopLayouts v-close-popup />
      </q-menu>
    </q-btn>

    <q-separator vertical class="q-mx-sm" />

    <!-- modes -->
    <PresentationStudioToolbarTopModes
      @switch-mode="$emit('switchMode', $event)"
      @add-image="$emit('addImage', $event)"
      @add-shape="$emit('addShape', $event)"
    />

    <q-separator vertical class="q-mx-sm" />

    <div
      v-if="showCustomizationMenu"
      class="row no-wrap items-center q-gutter-sm scroll--hidden"
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
          <div class="text-center">
            {{ $t("presentationStudio.elementsContextMenu.paste") }}
          </div>

          <div
            v-if="showShortcuts"
            class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm"
          >
            <div v-if="isMac">⌘</div>
            <div v-else>Ctrl</div>
            <div>V</div>
          </div>
        </q-tooltip>
      </q-btn>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
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
import PresentationStudioToolbarTopLayouts from "components/presentationStudio/toolbar/top/PresentationStudioToolbarTopLayouts.vue";
import { useQuasar } from "quasar";

/*
 * variables
 */
const $q = useQuasar();

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
const showLayoutsMenu = ref(false);

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

/*
 * shortcuts
 */
const showShortcuts = computed(() => {
  return $q.platform.is.desktop;
});

const isMac = computed(() => {
  return $q.platform.is.platform === "mac";
});
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
