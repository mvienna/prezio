<template>
  <div class="presentation_toolbar__top bg-white q-pa-md row no-wrap">
    <template v-if="slide?.type === SLIDE_TYPES.CONTENT">
      <template
        v-if="
          mode &&
          (![MODE_OPTIONS.mediaEmoji, MODE_OPTIONS.media].includes(mode) ||
            (MODE_OPTIONS.media === mode && selectedElement))
        "
      >
        <q-btn
          icon="r_close"
          unelevated
          text-color="black"
          round
          size="12px"
          @click="$emit('switchMode', null)"
        />

        <q-separator vertical class="q-mx-sm" />
      </template>

      <template v-else>
        <q-btn
          v-if="slide?.type === SLIDE_TYPES.CONTENT"
          icon="icon-space_dashboard"
          unelevated
          text-color="black"
          :class="showLayoutsMenu ? 'bg-grey-2' : ''"
          class="q-mr-sm"
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
            class="q-pa-sm bg-white"
            max-height="70vh"
            style="width: 408px"
          >
            <PresentationStudioToolbarTopLayouts v-close-popup />
          </q-menu>
        </q-btn>

        <!-- modes -->
        <PresentationStudioToolbarTopModes
          :disabled="slide?.type !== SLIDE_TYPES.CONTENT"
          @switch-mode="$emit('switchMode', $event)"
          @add-image="$emit('addImage', $event)"
          @add-shape="$emit('addShape', $event)"
        />
      </template>

      <!-- modes customization -->
      <div
        v-if="showCustomizationMenu"
        class="row no-wrap items-center q-gutter-sm scroll--hidden"
        style="width: 100%; overflow-x: scroll"
      >
        <!-- drawing customization -->
        <PresentationStudioToolbarTopCustomizationDrawing
          v-if="mode === MODE_OPTIONS.drawing"
        />

        <!-- text customization -->
        <PresentationStudioToolbarTopCustomizationText
          v-if="[MODE_OPTIONS.text, MODE_OPTIONS.textEditing].includes(mode)"
        />

        <!-- shape customization -->
        <PresentationStudioToolbarTopCustomizationShape
          v-if="mode === MODE_OPTIONS.shape"
        />

        <!-- media customization -->
        <PresentationStudioToolbarTopCustomizationMedia
          v-if="mode === MODE_OPTIONS.media"
        />
      </div>

      <q-space />

      <!-- selected item actions -->
      <template v-if="copiedElement">
        <!-- deselect line button -->
        <q-btn
          icon="r_paste"
          unelevated
          text-color="black"
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
    </template>

    <template v-else>
      <q-space />
    </template>

    <div class="row items-center q-mr-md">
      <div class="text-sm text-no-wrap" style="opacity: 0.2">
        {{ Math.round(mouse.x) }}x{{ Math.round(mouse.y) }}
      </div>
    </div>

    <div class="row no-wrap">
      <!-- zoom out -->
      <q-btn
        icon="r_zoom_out"
        round
        size="12px"
        unelevated
        disable
        @click="$emit('zoomOut')"
      >
        <q-tooltip>
          {{ $t("presentationStudio.toolbar.zoom.in") }}
        </q-tooltip>
      </q-btn>

      <!-- current zoom -->
      <q-btn :label="`${Math.round(scale * 100)}%`" unelevated disable>
        <q-tooltip>
          {{ $t("presentationStudio.toolbar.zoom.select") }}
        </q-tooltip>

        <q-menu
          anchor="top middle"
          self="bottom middle"
          transition-show="jump-down"
          transition-hide="jump-up"
          :offset="[0, 8]"
          class="q-pa-sm"
        >
          <q-item
            v-for="option in ZOOM_OPTIONS"
            :key="option"
            clickable
            class="items-center justify-center"
            @click="$emit('zoom', option)"
          >
            {{ option * 100 }}%
          </q-item>
        </q-menu>
      </q-btn>

      <!-- zoom in -->
      <q-btn
        icon="r_zoom_in"
        round
        size="12px"
        unelevated
        disable
        @click="$emit('zoomIn')"
      >
        <q-tooltip>
          {{ $t("presentationStudio.toolbar.zoom.out") }}
        </q-tooltip>
      </q-btn>
    </div>
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
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { usePresentationsStore } from "stores/presentations";
import PresentationStudioToolbarTopCustomizationMedia from "components/presentationStudio/toolbar/top/customization/PresentationStudioToolbarTopCustomizationMedia.vue";
import { useCanvasMediaStore } from "stores/canvas/media";

/*
 * variables
 */
const $q = useQuasar();

/*
 * stores
 */
const canvasStore = useCanvasStore();
const {
  mode,
  scale,
  ZOOM_OPTIONS,
  MODE_OPTIONS,
  mouse,
  selectedElement,
  selectedElementIndex,
  copiedElement,
} = storeToRefs(canvasStore);

const drawingStore = useCanvasDrawingStore();
const textStore = useCanvasTextStore();
const shapeStore = useCanvasShapeStore();
const mediaStore = useCanvasMediaStore();

const presentationsStore = usePresentationsStore();
const { presentation, slide } = storeToRefs(presentationsStore);

/*
 * emits
 */
defineEmits([
  "switchMode",
  "addImage",
  "addShape",
  "zoomIn",
  "zoomOut",
  "zoom",
]);

/*
 * display variables
 */
const showLayoutsMenu = ref(false);

const showCustomizationMenu = computed(() => {
  return (
    mode.value &&
    [
      MODE_OPTIONS.value.drawing,
      MODE_OPTIONS.value.text,
      MODE_OPTIONS.value.textEditing,
      MODE_OPTIONS.value.shape,
      MODE_OPTIONS.value.media,
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
        case MODE_OPTIONS.value.text:
          textStore.loadSelectedElementCustomization();
          break;

        case MODE_OPTIONS.value.drawing:
          drawingStore.loadSelectedElementCustomization();
          break;

        case MODE_OPTIONS.value.shape:
          shapeStore.loadSelectedElementCustomization();
          break;

        case MODE_OPTIONS.value.media:
          mediaStore.loadSelectedElementCustomization();
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
  z-index: 1001;
  top: 0;
  left: 0;
  width: calc(100% + 481px);
  height: 68px;
  border-bottom: 1px solid $grey-2;
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
