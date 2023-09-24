<template>
  <div>
    <!-- backgrounds -->
    <PresentationStudioTabsDesignTabBackgrounds
      :background-element="backgroundElement"
      @change-background="handleBackgroundChange($event)"
      @preview-background="handleBackgroundChange($event, undefined, true)"
    />

    <q-separator class="q-mb-lg" />

    <!-- base fill -->
    <PresentationStudioTabsDesignTabBaseFill
      :base-fill-element="baseFillElement"
      @change-base-fill="handleBaseFillChange($event)"
    />

    <!-- selected background -->
    <PresentationStudioTabsDesignTabSelectedBackground
      :default-background-filters="defaultBackgroundFilters"
      :background-element="backgroundElement"
      @change-background-filters="changeBackgroundFilters($event)"
      @change-background="
        handleBackgroundChange($event.background, $event.backgroundFilters)
      "
    />

    <q-separator class="q-my-lg" />

    <!-- reset slide design -->
    <q-btn
      unelevated
      no-caps
      color="primary"
      icon-right="r_restart_alt"
      class="full-width q-py-sm q-mb-sm"
      :label="$t('presentationLayout.rightDrawer.tabs.design.reset.title')"
      @click="showResetDesignDialog = true"
    />

    <q-dialog v-model="showResetDesignDialog">
      <ConfirmationDialog
        icon="r_restart_alt"
        icon-color="primary"
        :title="
          $t(
            'presentationLayout.rightDrawer.tabs.design.reset.confirmation.title'
          )
        "
        :message="
          $t(
            'presentationLayout.rightDrawer.tabs.design.reset.confirmation.message'
          )
        "
        confirm-btn-color="primary"
        @cancel="showResetDesignDialog = false"
        @confirm="
          resetSlideDesign();
          showResetDesignDialog = false;
        "
      />
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { deleteElement } from "stores/canvas/helpers/select";
import { useCanvasMediaStore } from "stores/canvas/media";
import { useCanvasShapeStore } from "stores/canvas/shape";
import { SHAPES_OPTIONS } from "src/constants/canvas/canvasVariables";
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";
import PresentationStudioTabsDesignTabBackgrounds from "components/presentation/studio/tabs/design/PresentationStudioTabsDesignTabBackgrounds.vue";
import PresentationStudioTabsDesignTabBaseFill from "components/presentation/studio/tabs/design/PresentationStudioTabsDesignTabBaseFill.vue";
import PresentationStudioTabsDesignTabSelectedBackground from "components/presentation/studio/tabs/design/PresentationStudioTabsDesignTabSelectedBackground.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { elements, MODES_OPTIONS, canvas } = storeToRefs(canvasStore);

const mediaStore = useCanvasMediaStore();
const shapeStore = useCanvasShapeStore();

/*
 * background
 */
const backgroundElement = computed(() => {
  return elements.value.find(
    (element) => element.mode === MODES_OPTIONS.value.background
  );
});

const handleBackgroundChange = (
  background,
  backgroundFilters = backgroundElement.value
    ? {
        opacity: backgroundElement.value.opacity,
        blur: backgroundElement.value.blur,
        contrast: backgroundElement.value.contrast,
        brightness: backgroundElement.value.brightness,
        invert: backgroundElement.value.invert,
        grayscale: backgroundElement.value.grayscale,
      }
    : { ...defaultBackgroundFilters },
  isPreview = false
) => {
  // remove previous background
  if (!isPreview) {
    elements.value = elements.value.filter(
      (element) => element.mode !== MODES_OPTIONS.value.background
    );
  }

  const src = background?.src || background?.original_url;

  const image = new Image();
  image.src = src;

  image.onload = () => {
    const height = (canvas.value.width / image.width) * image.height;

    mediaStore.addImage(
      src,
      0,
      (canvas.value.height - height) / 2,
      canvas.value.width,
      height,
      "bottom",
      isPreview
        ? MODES_OPTIONS.value.backgroundPreview
        : MODES_OPTIONS.value.background,
      true,
      backgroundFilters.opacity,
      backgroundFilters.blur,
      backgroundFilters.contrast,
      backgroundFilters.brightness,
      backgroundFilters.invert,
      backgroundFilters.grayscale
    );
  };
};

/*
 * background filters
 */
const defaultBackgroundFilters = {
  opacity: 100,
  blur: 0,
  contrast: 100,
  brightness: 100,
  invert: 0,
  grayscale: 0,
};

const changeBackgroundFilters = (backgroundFilters) => {
  const backgroundElementIndex = elements.value.findIndex(
    (element) => element.mode === MODES_OPTIONS.value.background
  );

  elements.value[backgroundElementIndex] = {
    ...elements.value[backgroundElementIndex],
    opacity: backgroundFilters.opacity / 100,
    blur: backgroundFilters.blur,
    contrast: backgroundFilters.contrast,
    brightness: backgroundFilters.brightness,
    invert: backgroundFilters.invert,
    grayscale: backgroundFilters.grayscale,
  };

  canvasStore.redrawCanvas();
};

/*
 * base fill
 */
const baseFillElement = computed(() => {
  return elements.value.find(
    (element) => element.mode === MODES_OPTIONS.value.baseFill
  );
});

const handleBaseFillChange = (color) => {
  elements.value = elements.value.filter(
    (element) => element.mode !== MODES_OPTIONS.value.baseFill
  );

  shapeStore.addShape(
    SHAPES_OPTIONS.square,
    0,
    0,
    canvas.value.width,
    canvas.value.height,
    "bottom",
    MODES_OPTIONS.value.baseFill,
    true,
    color,
    color,
    undefined,
    false
  );
};

/*
 * reset design
 */
const showResetDesignDialog = ref(false);

const resetSlideDesign = () => {
  if (backgroundElement.value) {
    deleteElement(backgroundElement.value);
  }

  if (baseFillElement.value) {
    deleteElement(baseFillElement.value);
  }
};
</script>
