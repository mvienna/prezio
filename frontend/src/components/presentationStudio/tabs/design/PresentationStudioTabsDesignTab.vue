<template>
  <div class="column no-wrap">
    <q-tabs
      v-model="tab"
      align="justify"
      inline-label
      dense
      class="q-mx-md q-mt-md q-mb-xs"
    >
      <q-tab
        name="design"
        :label="$t('presentationLayout.rightDrawer.tabs.design.tabs.design')"
        no-caps
        :ripple="false"
        class="q-mr-xs"
      />
      <q-tab
        name="themes"
        :label="$t('presentationLayout.rightDrawer.tabs.design.tabs.themes')"
        no-caps
        :ripple="false"
        class="q-ml-xs"
      />
    </q-tabs>

    <q-tab-panels v-model="tab">
      <!-- design -->
      <q-tab-panel name="design" class="q-pa-md" style="overflow-x: hidden">
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

        <!-- text -->
        <PresentationStudioTabsDesignTabText />

        <q-separator class="q-my-lg" />

        <!-- apply design to all slides -->
        <div class="row justify-center">
          <q-btn
            unelevated
            no-caps
            icon="r_copy_all"
            text-color="black"
            class="bg-grey-2"
            :label="
              $t(
                'presentationLayout.rightDrawer.tabs.design.applyToAllSlides.title'
              )
            "
            @click="showApplyDesignToAllSlidesDialog = true"
          />
        </div>

        <q-dialog v-model="showApplyDesignToAllSlidesDialog">
          <ConfirmationDialog
            icon="r_copy_all"
            icon-color="primary"
            :title="
              $t(
                'presentationLayout.rightDrawer.tabs.design.applyToAllSlides.confirmation.title'
              )
            "
            :message="
              $t(
                'presentationLayout.rightDrawer.tabs.design.applyToAllSlides.confirmation.message'
              )
            "
            confirm-btn-color="primary"
            @cancel="showApplyDesignToAllSlidesDialog = false"
            @confirm="
              applyDesignToAllSlides();
              showApplyDesignToAllSlidesDialog = false;
            "
          />
        </q-dialog>

        <!-- reset slide design -->
        <div
          class="text-center text-grey-9 q-mt-sm q-mb-sm link"
          @click="showResetDesignDialog = true"
        >
          {{ $t("presentationLayout.rightDrawer.tabs.design.reset.title") }}
        </div>

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
      </q-tab-panel>

      <!-- themes -->
      <q-tab-panel name="themes" class="q-pa-none">
        <PresentationStudioTabsDesignTabThemes
          :background-element="backgroundElement"
          @change-background="handleBackgroundChange($event)"
          @preview-background="handleBackgroundChange($event, undefined, true)"
        />
      </q-tab-panel>
    </q-tab-panels>
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
import PresentationStudioTabsDesignTabThemes from "components/presentationStudio/tabs/design/PresentationStudioTabsDesignTabThemes.vue";
import PresentationStudioTabsDesignTabBaseFill from "components/presentationStudio/tabs/design/PresentationStudioTabsDesignTabBaseFill.vue";
import PresentationStudioTabsDesignTabSelectedBackground from "components/presentationStudio/tabs/design/PresentationStudioTabsDesignTabSelectedBackground.vue";
import { usePresentationsStore } from "stores/presentations";
import PresentationStudioTabsDesignTabText from "components/presentationStudio/tabs/design/PresentationStudioTabsDesignTabText.vue";
import { computeAverageBrightness } from "src/helpers/colorUtils";
import { fetchAndConvertToBase64Image } from "src/helpers/imageUtils";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { elements, MODE_OPTIONS, canvas } = storeToRefs(canvasStore);

const mediaStore = useCanvasMediaStore();
const shapeStore = useCanvasShapeStore();

const presentationsStore = usePresentationsStore();
const { presentation, slide, averageBackgroundBrightness } =
  storeToRefs(presentationsStore);

/*
 * tabs
 */
const tab = ref("design");

/*
 * background
 */
const backgroundElement = computed(() => {
  return elements.value.find(
    (element) => element.mode === MODE_OPTIONS.value.background
  );
});

const handleBackgroundChange = async (
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
  // remove previous backgrounds
  if (!isPreview) {
    elements.value = elements.value.filter(
      (element) =>
        ![
          MODE_OPTIONS.value.background,
          MODE_OPTIONS.value.backgroundPreview,
        ].includes(element.mode)
    );
  }

  // hide active background (for preview)
  if (isPreview) {
    const backgroundElementIndex = elements.value.findIndex(
      (element) => element.mode === MODE_OPTIONS.value.background
    );
    if (backgroundElementIndex !== -1) {
      elements.value[backgroundElementIndex].isVisible = false;
    }
  }

  const src =
    background?.src || background?.preview_url || background?.original_url;

  const image = new Image();

  let base64;
  if (src.includes("http")) {
    base64 = await fetchAndConvertToBase64Image(src);
    image.src = base64;
  } else {
    image.src = src;
  }

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
        ? MODE_OPTIONS.value.backgroundPreview
        : MODE_OPTIONS.value.background,
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

const changeBackgroundFilters = async (backgroundFilters) => {
  const backgroundElementIndex = elements.value.findIndex(
    (element) => element.mode === MODE_OPTIONS.value.background
  );

  elements.value[backgroundElementIndex] = {
    ...elements.value[backgroundElementIndex],
    opacity: backgroundFilters.opacity,
    blur: backgroundFilters.blur,
    contrast: backgroundFilters.contrast,
    brightness: backgroundFilters.brightness,
    invert: backgroundFilters.invert,
    grayscale: backgroundFilters.grayscale,
  };

  averageBackgroundBrightness.value = await computeAverageBrightness(
    elements.value
  );
  slide.value.previewAverageBrightness = averageBackgroundBrightness.value;
  presentationsStore.syncCurrentSlideWithPresentationSlides();

  canvasStore.redrawCanvas(false);
};

/*
 * base fill
 */
const baseFillElement = computed(() => {
  return elements.value.find(
    (element) => element.mode === MODE_OPTIONS.value.baseFill
  );
});

const handleBaseFillChange = (color) => {
  elements.value = elements.value.filter(
    (element) => element.mode !== MODE_OPTIONS.value.baseFill
  );

  shapeStore.addShape(
    SHAPES_OPTIONS.square,
    0,
    0,
    canvas.value.width,
    canvas.value.height,
    "bottom",
    MODE_OPTIONS.value.baseFill,
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

/*
 * apply slide design to all slides
 */
const showApplyDesignToAllSlidesDialog = ref(false);

const applyDesignToAllSlides = async () => {
  await Promise.all(
    presentation.value.slides.map(async (item) => {
      // extract elements, remove old background and base fill
      item.canvas_data = item.canvas_data ? JSON.parse(item.canvas_data) : [];
      item.canvas_data = item.canvas_data?.filter(
        (element) =>
          ![
            MODE_OPTIONS.value.background,
            MODE_OPTIONS.value.baseFill,
          ].includes(element.mode)
      );

      // add new background and base fill
      if (backgroundElement.value) {
        item.canvas_data.push(backgroundElement.value);
      }
      if (baseFillElement.value) {
        item.canvas_data.push(baseFillElement.value);
      }

      // compute avg. brightness
      item.previewAverageBrightness = await computeAverageBrightness(
        item.canvas_data
      );

      // prepare new canvas data
      item.canvas_data = JSON.stringify(item.canvas_data);

      // set new elements & render preview
      await canvasStore.setElementsFromSlide(item.canvas_data);
      await canvasStore.redrawCanvas(false, undefined, false);

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      tempCanvas.width = 512;
      tempCanvas.height = 288;

      tempCtx.drawImage(
        canvas.value,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );

      item.preview = tempCanvas.toDataURL("image/png");
      tempCanvas.remove();

      // save slide
      await presentationsStore.saveSlide(
        item,
        JSON.parse(item.canvas_data),
        slide.value
      );

      item.isLivePreview = false;
    })
  );

  // redraw canvas & preview of the current slide
  await canvasStore.setElementsFromSlide();
  await canvasStore.redrawCanvas(false);
};
</script>

<style scoped lang="scss">
::v-deep(.q-tabs) {
  outline: 1px solid $grey-2;
  padding: 4px;
  border-radius: 6px;
}

::v-deep(.q-tab) {
  width: 50%;
  border-radius: 6px;
  overflow: hidden;

  &.q-tab--active {
    .q-tab__label {
      font-weight: 600;
      color: $secondary;
    }
  }
}

::v-deep(.q-tab__content) {
  z-index: 2;
}

::v-deep(.q-tab__indicator) {
  background: $blue-1;
  height: 100%;
  z-index: 1;

  transition: none !important;
}
</style>
