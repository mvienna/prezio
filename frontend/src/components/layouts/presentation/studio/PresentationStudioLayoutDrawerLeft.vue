<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    side="left"
    :width="220"
    bordered
    class="bg-white q-py-md scroll--hidden"
  >
    <!-- header -->
    <div
      class="bg-white q-px-md"
      style="position: sticky; top: -16px; z-index: 1"
    >
      <div class="row no-wrap q-gutter-md justify-center">
        <!-- new slide -->
        <q-btn
          color="primary"
          icon="r_loupe"
          no-caps
          unelevated
          :label="$t('presentationLayout.leftDrawer.newSlide')"
          style="width: 100%"
        >
          <q-menu
            v-model="showNewSlideTypeSelectionMenu[0]"
            anchor="bottom left"
            self="top left"
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[0, 16]"
            class="q-pa-md scroll--hidden bg-white"
            max-height="75vh"
            style="width: 399px; border-radius: 16px"
          >
            <PresentationStudioTabsTypesTab
              disable-layout-selection
              :highlight-active-type="false"
              v-close-popup
              style="z-index: 2"
              @select="handleAddingNewSlide($event)"
            />
          </q-menu>
        </q-btn>
      </div>

      <q-separator class="q-mt-md" />
    </div>

    <!-- slides -->
    <draggable
      v-if="presentation?.slides?.length"
      v-model="presentation.slides"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        class: 'column no-wrap',
      }"
      v-bind="slidesDraggingOptions"
      item-key="id"
      handle=".slide_handle"
      @start="handleStartDragging"
      @end="handleSlidesReorder"
      @reordered="handleSlidesReorder"
    >
      <template #item="{ element, index }">
        <div
          class="row no-wrap q-px-md q-py-md"
          :id="`slide_preview_${element.id}`"
          style="transition: 0.2s"
          :class="element.id === slide.id ? 'bg-blue-1' : ''"
        >
          <div class="column no-wrap q-pr-md">
            <!-- index -->
            <div
              class="text-center"
              :class="element.id === slide.id ? 'text-semibold' : ''"
            >
              {{ index + 1 }}
            </div>

            <q-icon
              v-if="element.id === presentation?.room?.slide_id"
              name="r_play_arrow"
              color="primary"
              class="q-mt-xs"
            />
          </div>

          <q-space />

          <!-- preview -->
          <q-card
            flat
            v-ripple
            class="slide slide_handle relative-position cursor-pointer q-hoverable"
            :class="`${element.id === slide.id ? 'slide--active' : ''} ${
              !isSlideDragging && hoveredSlideIndex === index
                ? 'slide--hovered'
                : ''
            }`"
            @mouseover="hoveredSlideIndex = index"
            @mouseleave="hoveredSlideIndex = null"
            @click="handleSlideChange(element)"
            @contextmenu.prevent="
              showSlideContextMenu[index] = !showSlideContextMenu[index]
            "
          >
            <!-- live preview -->
            <canvas
              v-show="element.isLivePreview"
              :id="`canvas_slide_preview_${index}`"
            />

            <!-- saved preview -->
            <q-img
              v-show="!element.isLivePreview"
              :src="element.preview"
              fit="cover"
            />

            <!-- slide type -->
            <div
              v-if="element.type !== SLIDE_TYPES.CONTENT"
              class="absolute-center"
            >
              <div class="row justify-center">
                <q-img
                  :src="`/assets/icons/temp/slideTypes/${element.type}.svg`"
                  style="width: 36px; height: 36px; background: transparent"
                  :style="
                    element.previewAverageBrightness >=
                    backgroundBrightnessThreshold
                      ? ''
                      : 'filter: invert(100%) grayscale(100%) brightness(200%);'
                  "
                />
              </div>

              <div
                class="text-semibold text-accent text-center text-caption text-no-wrap"
                :class="
                  element.previewAverageBrightness >=
                  backgroundBrightnessThreshold
                    ? 'text-accent'
                    : 'text-white'
                "
              >
                {{
                  $t(
                    `presentationLayout.rightDrawer.tabs.types.options.${element.type}`
                  )
                }}
              </div>
            </div>

            <!-- actions -->
            <div class="absolute-right q-pt-sm q-pr-sm">
              <q-btn
                icon="more_vert"
                round
                flat
                size="8px"
                :color="
                  element.previewAverageBrightness >=
                  backgroundBrightnessThreshold
                    ? 'black'
                    : 'white'
                "
              >
                <q-menu
                  v-model="showSlideContextMenu[index]"
                  anchor="bottom right"
                  self="top right"
                  transition-show="jump-down"
                  transition-hide="jump-up"
                  :offset="[0, 8]"
                  class="q-pa-sm"
                  style="width: 250px; border-radius: 16px"
                >
                  <!-- new slide -->
                  <q-item
                    class="items-center justify-start q-px-md q-py-sm"
                    clickable
                    dense
                  >
                    <q-icon name="r_add" size="16px" class="q-mr-sm" />

                    <div>
                      {{ $t("presentationStudio.slide.actions.newSlide") }}
                    </div>

                    <q-menu
                      v-model="showNewSlideTypeSelectionMenu[1]"
                      anchor="top right"
                      self="top left"
                      transition-show="jump-right"
                      transition-hide="jump-left"
                      :offset="[24, 8]"
                      class="q-pa-md scroll--hidden bg-white"
                      max-height="75vh"
                      style="width: 399px; border-radius: 16px"
                    >
                      <PresentationStudioTabsTypesTab
                        disable-layout-selection
                        :highlight-active-type="false"
                        v-close-popup
                        @select="
                          handleAddingNewSlide($event);
                          showSlideContextMenu[index] = false;
                        "
                      />
                    </q-menu>
                  </q-item>

                  <!-- duplicate -->
                  <q-item
                    class="items-center justify-start q-px-md q-py-sm"
                    clickable
                    dense
                    v-close-popup
                    @click="handleDuplicatingSlide(element)"
                  >
                    <q-icon name="r_dynamic_feed" size="16px" class="q-mr-sm" />

                    <div>
                      {{ $t("presentationStudio.slide.actions.duplicate") }}
                    </div>

                    <q-space />

                    <div
                      v-if="showShortcuts"
                      class="shortcut row no-wrap q-gutter-xs"
                    >
                      <div v-if="isMac">⌘</div>
                      <div v-else>Ctrl</div>
                      <div>D</div>
                    </div>
                  </q-item>

                  <q-separator class="q-my-sm" />

                  <!-- delete -->
                  <q-item
                    class="items-center justify-start q-px-md q-py-sm text-red"
                    clickable
                    dense
                    v-close-popup
                    :disable="
                      presentation.slides.length === 1 ||
                      isDeletionAvailable(element) !== false
                    "
                    @click="handleSlideDeletion(element)"
                  >
                    <q-icon
                      name="r_delete"
                      color="red"
                      size="16px"
                      class="q-mr-sm"
                    />

                    <div>
                      {{ $t("presentationStudio.slide.actions.delete") }}
                    </div>

                    <q-space />

                    <div
                      v-if="showShortcuts"
                      class="shortcut row no-wrap q-gutter-xs"
                    >
                      <div>⌫</div>
                    </div>
                  </q-item>
                </q-menu>
              </q-btn>
            </div>
          </q-card>
        </div>
      </template>
    </draggable>

    <!-- new slide -->
    <div class="row no-wrap justify-end q-px-md" style="aspect-ratio: 16/9">
      <q-card
        flat
        v-ripple
        color="primary"
        class="bg-blue-1 relative-position q-mt-md cursor-pointer q-hoverable slide slide--hoverable"
      >
        <q-icon
          name="r_add"
          color="primary"
          class="absolute-center"
          size="md"
        />

        <q-menu
          v-model="showNewSlideTypeSelectionMenu[2]"
          anchor="center right"
          self="center left"
          transition-show="jump-right"
          transition-hide="jump-left"
          :offset="[24, 0]"
          class="q-pa-md scroll--hidden bg-white"
          max-height="75vh"
          style="width: 399px; border-radius: 16px"
        >
          <PresentationStudioTabsTypesTab
            disable-layout-selection
            :highlight-active-type="false"
            v-close-popup
            @select="handleAddingNewSlide($event)"
          />
        </q-menu>
      </q-card>
    </div>
  </q-drawer>

  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div
      v-if="
        showNewSlideTypeSelectionMenu[0] ||
        showNewSlideTypeSelectionMenu[1] ||
        showNewSlideTypeSelectionMenu[2]
      "
      style="
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 100vw;
        background: rgba(0, 0, 0, 0.4);
        z-index: 2000;
      "
    ></div>
  </transition>
</template>

<script setup>
import { computed, onBeforeMount, onUnmounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import draggable from "vuedraggable/src/vuedraggable";
import { useCanvasStore } from "stores/canvas";
import { deselectElement } from "stores/canvas/helpers/select";
import { useQuasar } from "quasar";
import PresentationStudioTabsTypesTab from "components/presentationStudio/tabs/types/PresentationStudioTabsTypesTab.vue";
import {
  ALIGNMENT,
  SHAPES_OPTIONS,
} from "src/constants/canvas/canvasVariables";
import { useCanvasTextStore } from "stores/canvas/text";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import { useI18n } from "vue-i18n";
import { generateUniqueId } from "src/helpers/generationUtils";
import { computeAverageBrightness } from "src/helpers/colorUtils";

/*
 * variables
 */
const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const leftDrawerOpen = ref(true);

const showNewSlideTypeSelectionMenu = ref([false, false, false]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, slide, backgroundBrightnessThreshold } =
  storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements, MODE_OPTIONS, canvas } = storeToRefs(canvasStore);

const textStore = useCanvasTextStore();
const { customization } = storeToRefs(textStore);

/*
 * slide context menu
 */
const showSlideContextMenu = ref([]);

const handleKeyDownEvent = (event) => {
  const slideIndex = showSlideContextMenu.value.findIndex(
    (bool) => bool === true
  );

  if (event.key === "Delete" || event.key === "Backspace") {
    // delete
    if (slideIndex !== -1) {
      handleSlideDeletion(presentation.value.slides[slideIndex]);
    }
  }

  if (event.ctrlKey || event.metaKey) {
    if (slideIndex !== -1) {
      // duplicate
      if (event.key === "d") {
        event.preventDefault();
        handleDuplicatingSlide(presentation.value.slides[slideIndex]);
        showSlideContextMenu.value[slideIndex] = false;
      }
    }
  }
};

const isDeletionAvailable = (item) => {
  const leaderboards = presentation.value.slides.filter(
    (slideItem) => slideItem.type === SLIDE_TYPES.LEADERBOARD
  );

  const quizTypeSlides = presentation.value.slides.filter((slideItem) =>
    SLIDE_TYPES_OF_QUIZ.includes(slideItem.type)
  );

  const otherSlides = presentation.value.slides.filter(
    (slideItem) =>
      ![...SLIDE_TYPES_OF_QUIZ, SLIDE_TYPES.LEADERBOARD].includes(
        slideItem.type
      )
  );

  return (
    quizTypeSlides.length === 1 &&
    SLIDE_TYPES_OF_QUIZ.includes(item.type) &&
    leaderboards.length &&
    !otherSlides.length
  );
};

const handleSlideDeletion = async (item) => {
  const leaderboards = presentation.value.slides.filter(
    (slideItem) => slideItem.type === SLIDE_TYPES.LEADERBOARD
  );

  const quizTypeSlides = presentation.value.slides.filter((slideItem) =>
    SLIDE_TYPES_OF_QUIZ.includes(slideItem.type)
  );

  if (
    quizTypeSlides.length === 1 &&
    SLIDE_TYPES_OF_QUIZ.includes(item.type) &&
    leaderboards.length
  ) {
    for (const leaderboard of leaderboards) {
      await presentationsStore.deleteSlide(leaderboard);
    }
  }

  await presentationsStore.deleteSlide(item);
  await canvasStore.setElementsFromSlide();
  canvasStore.redrawCanvas(false);
  slide.value.isLivePreview = false;
};

onBeforeMount(() => {
  document.addEventListener("keydown", handleKeyDownEvent);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDownEvent);
});

/*
 * slides drag
 */
const isSlideDragging = ref(false);
const slidesDraggingOptions = ref({
  animation: 200,
  group: "attributes",
  direction: "vertical",
  disabled: false,
  ghostClass: "ghost",
});

const handleStartDragging = () => {
  isSlideDragging.value = true;
};

const handleEndDragging = () => {
  isSlideDragging.value = false;
};

const handleSlidesReorder = async () => {
  handleEndDragging();

  presentation.value.slides = presentation.value.slides.map((item, index) => {
    item.order = index;
    return item;
  });
  await presentationsStore.updateSlidesOrder();
};

/*
 * slides selection
 */
const hoveredSlideIndex = ref(null);

const handleSlideChange = async (newSlide) => {
  if (slide.value.id === newSlide.id) return;

  canvasStore.saveSlidePreview();
  deselectElement();

  await presentationsStore.setSlide(newSlide, elements.value);
  await canvasStore.setElementsFromSlide();
  canvasStore.redrawCanvas(false, undefined, false);
};

const prepareElementsForNewSlide = (type) => {
  let preparedElements = [];

  /*
   * default elements
   */
  const layoutDefaultElementProps = {
    mode: MODE_OPTIONS.value.text,
    isVisible: true,
    isLocked: false,
    fontFamily: customization.value.font,
    lineHeight: customization.value.lineHeight,
    fontWeight: "normal",
    textDecoration: "none",
    fontStyle: "normal",
    textAlign: ALIGNMENT.horizontal.left,
    verticalAlign: ALIGNMENT.vertical.top,
    rotationAngle: 0,

    /*
     * editable
     */
    id: "layout-",
    text: "",

    fontSize: "48px",
    color: customization.value.color,

    x: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 5) / 100
    ),
    y: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 5) / 100
    ),

    width: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 90) / 100
    ),
    height: canvasStore.computeAdjustedSize(30),
  };

  /*
   * element:
   * content
   */
  if (type === SLIDE_TYPES.CONTENT) {
    const titleElement = {
      ...layoutDefaultElementProps,

      id: "layout-title-top-titleAndBody",
      text: t("presentationStudio.layouts.defaultTexts.title"),

      color: "#313232",
      fontSize: "48px",
      fontWeight: "bold",
    };

    const bodyElement = {
      ...layoutDefaultElementProps,

      id: "layout-body",
      text: t("presentationStudio.layouts.defaultTexts.body"),

      fontSize: "16px",
      color: "#808080",

      y: titleElement.y + titleElement.height,

      height: canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().height * 65) / 100
      ),
    };

    preparedElements = [titleElement, bodyElement];
  }

  /*
   * quiz
   * word cloud
   */
  if (
    [
      ...SLIDE_TYPES_OF_QUIZ,
      SLIDE_TYPES.WORD_CLOUD,
      SLIDE_TYPES.LEADERBOARD,
    ].includes(type)
  ) {
    const titleElement = {
      ...layoutDefaultElementProps,

      id: "layout-title-top-titleAndBody",
      text:
        type === SLIDE_TYPES.LEADERBOARD
          ? t("presentationStudio.layouts.defaultTexts.leaderboard")
          : t("presentationStudio.layouts.defaultTexts.question"),
      textAlign: "center",

      color: "#313232",
      fontSize: "48px",
      fontWeight: "bold",
    };

    preparedElements = [titleElement];
  }

  /*
   * add base fill
   */
  const baseFill = {
    id: generateUniqueId(undefined, []),
    mode: MODE_OPTIONS.value.baseFill,
    isVisible: true,
    isLocked: true,
    type: SHAPES_OPTIONS.square,
    x: 0,
    y: 0,
    width: 2560,
    height: 1440,
    rotationAngle: 0,
    strokeColor: "#FFFFFF",
    fillColor: "#FFFFFF",
    lineWidth: "4px",
  };

  preparedElements.push(baseFill);

  return preparedElements;
};

const handleAddingNewSlide = async (type) => {
  /*
   * save previous slide
   */
  if (slide.value) {
    canvasStore.saveSlidePreview();
    deselectElement();

    slide.value.canvas_data = JSON.stringify(elements.value);
    presentationsStore.syncCurrentSlideWithPresentationSlides();
    presentationsStore.saveSlide(undefined, elements.value);
  }

  /*
   * if the current slide is type of quiz and has a leaderboard after itself,
   * start adding new slide type of quiz after that leaderboard
   */
  if (
    SLIDE_TYPES_OF_QUIZ.includes(slide.value?.type) &&
    SLIDE_TYPES_OF_QUIZ.includes(type)
  ) {
    const newSlideIndex = presentation.value.slides.findIndex(
      (item) => item.id === slide.value.id
    );

    const nextSlide = presentation.value.slides?.[newSlideIndex + 1];
    if (nextSlide && nextSlide.type === SLIDE_TYPES.LEADERBOARD) {
      await presentationsStore.setSlide(nextSlide);
    }
  }

  /*
   * hide type selection menu(s)
   */
  showNewSlideTypeSelectionMenu.value = [false, false, false];

  /*
   * add new slide
   */
  await presentationsStore.addNewSlide(prepareElementsForNewSlide(type), type);
  await canvasStore.setElementsFromSlide();

  canvasStore.renderSlidePreview();
  canvasStore.saveSlidePreview();

  /*
   * add leaderboard after new quiz-type slide
   */
  if (SLIDE_TYPES_OF_QUIZ.includes(type)) {
    const newSlideIndex = presentation.value.slides.findIndex(
      (item) => item.id === slide.value.id
    );

    const nextSlide = presentation.value.slides?.[newSlideIndex + 1];
    if (
      !nextSlide ||
      (nextSlide && nextSlide.type !== SLIDE_TYPES.LEADERBOARD)
    ) {
      const newSlide = await presentationsStore.addNewSlide(
        prepareElementsForNewSlide(SLIDE_TYPES.LEADERBOARD),
        SLIDE_TYPES.LEADERBOARD,
        false
      );

      const newSlideIndex = presentation.value.slides.findIndex(
        (item) => item.id === newSlide.id
      );
      presentation.value.slides[newSlideIndex].previewAverageBrightness =
        await computeAverageBrightness(JSON.parse(newSlide.canvas_data));
    }
  }
};

const handleDuplicatingSlide = (slide) => {
  presentationsStore
    .duplicateSlide(slide, elements.value)
    .then(async (newSlide) => {
      await canvasStore.setElementsFromSlide();

      const newSlideIndex = presentation.value.slides.findIndex(
        (item) => item?.id === newSlide?.id
      );
      presentation.value.slides[newSlideIndex].previewAverageBrightness =
        await computeAverageBrightness(JSON.parse(newSlide.canvas_data));

      canvasStore.renderSlidePreview();
      canvasStore.saveSlidePreview();
    })
    .catch((error) => {
      console.log(error);
    });
};

/*
 * shortcuts
 */
const showShortcuts = computed(() => {
  return $q.platform.is.desktop;
});

const isMac = computed(() => {
  return $q.platform.is.platform === "mac";
});

/*
 * scroll slide into view when changed
 */
watch(
  () => slide.value,
  () => {
    const slideElement = document.getElementById(
      `slide_preview_${slide.value.id}`
    );

    if (slideElement) {
      slideElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }
);

/*
 * slide preview avg. brightness generation
 */
watch(
  () => elements.value,
  () => {
    presentation.value.slides.forEach(async (item, index) => {
      if (
        item.id === slide.value.id ||
        !presentation.value.slides[index].previewAverageBrightness
      ) {
        presentation.value.slides[index].previewAverageBrightness =
          await computeAverageBrightness(
            item.id === slide.value.id
              ? JSON.parse(slide.value.canvas_data)
              : JSON.parse(item.canvas_data)
          );
      }
    });
  }
);
</script>

<style scoped lang="scss">
.slide {
  outline: 3px solid transparent;
  transition: 0.2s;
  border: 1.5px solid $grey-2;
  width: 160px;
  height: calc(160px * 9 / 16);
  border-radius: 8px;

  canvas,
  .q-img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: $white;
  }

  &.slide--hovered,
  &.slide--hoverable:hover {
    border: 1.5px solid $blue-4;
    outline: 1.5px solid $blue-4;
  }

  &:active {
    transform: scale(0.975);
  }

  &.slide--active {
    border: 1.5px solid $primary;
    outline: 2.5px solid $blue-4;
  }
}

.slide_handle {
  cursor: grab;
}
</style>
