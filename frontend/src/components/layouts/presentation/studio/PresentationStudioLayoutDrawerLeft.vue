<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    side="left"
    :width="200"
    bordered
    class="bg-white q-py-md hide-scrollbar"
  >
    <!-- header -->
    <div class="bg-white q-px-md">
      <!-- new slide -->
      <q-btn
        color="primary"
        icon="r_add"
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
          class="hide-scrollbar bg-white"
          max-height="85vh"
          style="width: 360px; padding: 16px"
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

      <!-- import -->
      <div class="relative-position q-mt-md">
        <q-btn
          unelevated
          :label="$t('presentationLayout.leftDrawer.import')"
          color="grey-2"
          text-color="black"
          no-caps
          disable
          class="full-width"
        />

        <div
          class="bg-purple absolute-top-right round-borders row items-center justify-center"
          style="
            margin-top: -6px;
            margin-right: -6px;
            height: 16px;
            width: 16px;
          "
        >
          <q-icon name="r_bolt" color="white" size="14px" />
        </div>
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
            @click="
              studioStore.deselectElements();
              presentationsStore.setSlide(element);
            "
            @contextmenu.prevent="
              showSlideContextMenu[index] = !showSlideContextMenu[index]
            "
          >
            <img
              :src="element.preview"
              :id="element.id === slide.id ? 'preview' : ''"
            />

            <!-- slide type -->
            <div
              v-if="element.type !== SLIDE_TYPES.CONTENT"
              class="absolute-center"
            >
              <div class="row justify-center">
                <q-img
                  :src="`/assets/icons/slide/types/${element.type}.svg`"
                  style="width: 36px; height: 36px; background: transparent"
                  :style="
                    element.color_scheme >= COLOR_SCHEME_OPTIONS.LIGHT
                      ? ''
                      : 'filter: invert(100%) grayscale(100%) brightness(200%);'
                  "
                />
              </div>

              <div
                class="text-semibold text-center text-caption text-no-wrap"
                :class="
                  element.color_scheme >= COLOR_SCHEME_OPTIONS.LIGHT
                    ? 'text-grey-7'
                    : 'text-white'
                "
              >
                {{
                  $t(
                    `presentationLayout.rightDrawer.tabs.types.options.${element.type}`,
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
                  element.color_scheme >= COLOR_SCHEME_OPTIONS.LIGHT
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
                  style="width: 250px"
                  @keydown="handleSlideMenuKeyDownEvent($event, element, index)"
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
                      class="hide-scrollbar bg-white"
                      max-height="85vh"
                      style="width: 360px; padding: 16px"
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
                    @click="handleDuplicatingSlide()"
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
          class="hide-scrollbar bg-white"
          max-height="85vh"
          style="width: 360px; padding: 16px"
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
import { useQuasar } from "quasar";
import PresentationStudioTabsTypesTab from "components/presentationStudio/tabs/types/PresentationStudioTabsTypesTab.vue";
import { COLOR_SCHEME_OPTIONS } from "src/constants/canvas/canvasVariables";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import { useI18n } from "vue-i18n";
import { useStudioStore } from "stores/studio";

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
const { presentation, slide } = storeToRefs(presentationsStore);

const studioStore = useStudioStore();
const { transformer } = storeToRefs(studioStore);

/*
 * slide context menu
 */
const showSlideContextMenu = ref([]);

const isDeletionAvailable = (item) => {
  const leaderboards = presentation.value.slides.filter(
    (slideItem) => slideItem.type === SLIDE_TYPES.LEADERBOARD,
  );

  const quizTypeSlides = presentation.value.slides.filter((slideItem) =>
    SLIDE_TYPES_OF_QUIZ.includes(slideItem.type),
  );

  const otherSlides = presentation.value.slides.filter(
    (slideItem) =>
      ![...SLIDE_TYPES_OF_QUIZ, SLIDE_TYPES.LEADERBOARD].includes(
        slideItem.type,
      ),
  );

  return (
    quizTypeSlides.length === 1 &&
    SLIDE_TYPES_OF_QUIZ.includes(item.type) &&
    leaderboards.length &&
    !otherSlides.length
  );
};

const handleSlideDeletion = async (item) => {
  if (presentation.value.slides.length === 1) return;

  // remove leaderboards
  const leaderboards = presentation.value.slides.filter(
    (slideItem) => slideItem.type === SLIDE_TYPES.LEADERBOARD,
  );
  const quizTypeSlides = presentation.value.slides.filter((slideItem) =>
    SLIDE_TYPES_OF_QUIZ.includes(slideItem.type),
  );

  if (
    quizTypeSlides.length === 1 &&
    SLIDE_TYPES_OF_QUIZ.includes(item.type) &&
    leaderboards.length
  ) {
    const deletePromises = leaderboards.map((leaderboard) => {
      return presentationsStore.deleteSlide(leaderboard);
    });

    await Promise.all(deletePromises);
  }

  // deselect elements
  studioStore.deselectElements();

  // change slide
  const currentSlideIndex = presentation.value.slides.findIndex(
    (presentationSlide) => presentationSlide.id === item.id,
  );
  if (presentation.value.slides?.[currentSlideIndex - 1]) {
    await presentationsStore.setSlide(
      presentation.value.slides?.[currentSlideIndex - 1],
    );
  } else {
    await presentationsStore.setSlide(
      presentation.value.slides?.[currentSlideIndex + 1],
    );
  }

  // delete slide
  await presentationsStore.deleteSlide(item);
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

const handleSlideMenuKeyDownEvent = (event, slide, index) => {
  // delete
  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    handleSlideDeletion(slide);
  }

  if (event.ctrlKey || event.metaKey) {
    // duplicate
    if (event.key === "d") {
      event.preventDefault();
      handleDuplicatingSlide(slide);
      showSlideContextMenu.value[index] = false;
    }
  }
};

const handleKeyDownEvent = (event) => {
  if (transformer.value.default.nodes().length) return;

  // change slide
  if (["ArrowDown", "ArrowUp"].includes(event.key)) {
    const currentSlideIndex = presentation.value.slides.findIndex(
      (item) => item.id === slide.value.id,
    );

    if (event.key === "ArrowDown") {
      const nextSlide = presentation.value.slides?.[currentSlideIndex + 1];
      if (nextSlide) {
        presentationsStore.setSlide(nextSlide);
      }
    }

    if (event.key === "ArrowUp") {
      const previousSlide = presentation.value.slides?.[currentSlideIndex - 1];
      if (previousSlide) {
        presentationsStore.setSlide(previousSlide);
      }
    }
  }
};

onBeforeMount(() => {
  document.addEventListener("keydown", handleKeyDownEvent);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDownEvent);
});

/*
 * slides selection
 */
const hoveredSlideIndex = ref(null);

// const prepareElementsForNewSlide = (type) => {
//   let preparedElements = [];
//   return [];
//
//   /*
//    * default elements
//    */
//   const layoutDefaultElementProps = {
//     mode: MODE_OPTIONS.value.TEXT,
//     isVisible: true,
//     isLocked: false,
//     fontFamily: customization.value.font,
//     lineHeight: customization.value.lineHeight,
//     fontWeight: "normal",
//     textDecoration: "none",
//     fontStyle: "normal",
//     textAlign: ALIGNMENT.horizontal.left,
//     verticalAlign: ALIGNMENT.vertical.top,
//     rotationAngle: 0,
//
//     /*
//      * editable
//      */
//     id: "layout-",
//     text: "",
//
//     fontSize: "68px",
//     color: customization.value.color,
//
//     x: canvasStore.computeAdjustedSize(
//       (canvasStore.canvasRect().width * 5) / 100
//     ),
//     y: canvasStore.computeAdjustedSize(
//       (canvasStore.canvasRect().width * 5) / 100
//     ),
//
//     width: canvasStore.computeAdjustedSize(
//       (canvasStore.canvasRect().width * 90) / 100
//     ),
//     height: canvasStore.computeAdjustedSize(30),
//   };
//
//   /*
//    * element:
//    * content
//    */
//   if (type === SLIDE_TYPES.CONTENT) {
//     const titleElement = {
//       ...layoutDefaultElementProps,
//
//       id: "layout-title-top-titleAndBody",
//       text: t("presentationStudio.layouts.defaultTexts.title"),
//
//       color: "#313232",
//       fontSize: "68px",
//       fontWeight: "bold",
//     };
//
//     const bodyElement = {
//       ...layoutDefaultElementProps,
//
//       id: "layout-body",
//       text: t("presentationStudio.layouts.defaultTexts.body"),
//
//       fontSize: "38px",
//       color: "#808080",
//
//       y: canvasStore.computeAdjustedSize(
//         (canvasStore.canvasRect().width * 5) / 100 + 48
//       ),
//       width: canvasStore.computeAdjustedSize(
//         (canvasStore.canvasRect().width * 45) / 100
//       ),
//     };
//
//     preparedElements = [titleElement, bodyElement];
//   }
//
//   /*
//    * quiz
//    * word cloud
//    */
//   if (
//     [
//       ...SLIDE_TYPES_OF_QUIZ,
//       SLIDE_TYPES.WORD_CLOUD,
//       SLIDE_TYPES.LEADERBOARD,
//     ].includes(type)
//   ) {
//     const titleElement = {
//       ...layoutDefaultElementProps,
//
//       id: "layout-title-top-titleAndBody",
//       text:
//         type === SLIDE_TYPES.LEADERBOARD
//           ? t("presentationStudio.layouts.defaultTexts.leaderboard")
//           : t("presentationStudio.layouts.defaultTexts.question"),
//       textAlign: "center",
//
//       color: "#313232",
//       fontSize: "68px",
//       fontWeight: "bold",
//     };
//
//     preparedElements = [titleElement];
//   }
//
//   /*
//    * add base fill
//    */
//   const baseFill = {
//     id: generateUniqueId(undefined, []),
//     mode: MODE_OPTIONS.value.BASE_FILL,
//     isVisible: true,
//     isLocked: true,
//     type: SHAPES_OPTIONS.RECT,
//     x: 0,
//     y: 0,
//     width: 2560,
//     height: 1440,
//     rotationAngle: 0,
//     strokeColor: "#FFFFFF",
//     fillColor: "#FFFFFF",
//     lineWidth: "4px",
//   };
//
//   preparedElements.push(baseFill);
//
//   return preparedElements;
// };

const handleAddingNewSlide = async (type) => {
  // if the current quiz-slide has a leaderboard after itself,
  // start adding new quiz-slide after that leaderboard
  if (
    SLIDE_TYPES_OF_QUIZ.includes(slide.value?.type) &&
    SLIDE_TYPES_OF_QUIZ.includes(type)
  ) {
    const newSlideIndex = presentation.value.slides.findIndex(
      (item) => item.id === slide.value.id,
    );

    const nextSlide = presentation.value.slides?.[newSlideIndex + 1];
    if (nextSlide && nextSlide.type === SLIDE_TYPES.LEADERBOARD) {
      await presentationsStore.setSlide(nextSlide);
    }
  }

  // hide slide type menu(s)
  showNewSlideTypeSelectionMenu.value = [false, false, false];

  // add new slide
  const newSlide = await presentationsStore.addNewSlide({ type: type });
  await presentationsStore.setSlide(newSlide);

  // add leaderboard after new quiz-type slide
  if (SLIDE_TYPES_OF_QUIZ.includes(type)) {
    const newSlideIndex = presentation.value.slides.findIndex(
      (item) => item.id === slide.value.id,
    );

    const nextSlide = presentation.value.slides?.[newSlideIndex + 1];
    if (
      !nextSlide ||
      (nextSlide && nextSlide.type !== SLIDE_TYPES.LEADERBOARD)
    ) {
      await presentationsStore.addNewSlide({
        type: SLIDE_TYPES.LEADERBOARD,
      });
    }
  }
};

const handleDuplicatingSlide = async () => {
  const duplicatedSlide = await presentationsStore.duplicateSlide();
  await presentationsStore.setSlide(duplicatedSlide);
};

/*
 * scroll slide into view when changed
 */
watch(
  () => slide.value,
  () => {
    const slideElement = document.getElementById(
      `slide_preview_${slide.value.id}`,
    );

    if (slideElement) {
      slideElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  },
);

/*
 * slides dragging
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
</script>

<style scoped lang="scss">
.slide {
  transition: 0.2s;
  border: 1px solid $grey-2;
  width: 140px;
  height: calc(140px * 9 / 16);
  border-radius: 6px;
  overflow: hidden;

  &.slide--hovered,
  &.slide--hoverable:hover {
    border: 1px solid $accent;
  }

  &.slide--active {
    border: 1px solid $primary;
  }
}

.slide_handle {
  cursor: grab;
}
</style>
