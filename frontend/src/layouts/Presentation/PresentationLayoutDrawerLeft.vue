<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    side="left"
    class="bg-white q-px-sm q-py-md"
  >
    <!-- header -->
    <div class="row no-wrap q-gutter-md justify-center">
      <!-- new slide -->
      <q-btn
        color="primary"
        icon-right="r_add"
        no-caps
        unelevated
        :label="$t('presentationLayout.leftDrawer.newSlide')"
        @click="handleAddingNewSlide()"
      />

      <!-- import -->
      <q-btn
        outline
        color="primary"
        no-caps
        disable
        :label="$t('presentationLayout.leftDrawer.import')"
      />
    </div>

    <q-separator class="q-my-md" />

    <div class="q-px-sm">
      <!-- slides -->
      <draggable
        v-if="presentation?.slides?.length"
        v-model="presentation.slides"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          class: 'column no-wrap q-gutter-lg',
        }"
        v-bind="slidesDraggingOptions"
        item-key="id"
        handle=".slide_handle"
        @start="handleStartDragging"
        @end="handleSlidesReorder"
        @reordered="handleSlidesReorder"
      >
        <template #item="{ element, index }">
          <div class="row no-wrap">
            <div class="column no-wrap justify-between q-pr-md">
              <!-- index -->
              <div
                class="text-center"
                :class="element.id === slide.id ? 'text-semibold' : ''"
              >
                {{ index + 1 }}
              </div>
            </div>

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
              style="width: 100%"
              @mouseover="hoveredSlideIndex = index"
              @mouseleave="hoveredSlideIndex = null"
              @click="handleSlideSelection(element)"
              @contextmenu.prevent="
                showSlideContextMenu[index] = !showSlideContextMenu[index]
              "
            >
              <canvas
                v-show="element.isLivePreview"
                :id="`canvas_slide_preview_${index}`"
              />

              <q-img
                v-show="!element.isLivePreview"
                :src="element.preview"
                fit="fill"
              />

              <!-- actions -->
              <div class="absolute-right q-pt-sm q-pr-sm">
                <q-btn icon="more_vert" round flat size="10px">
                  <q-menu
                    v-model="showSlideContextMenu[index]"
                    anchor="bottom right"
                    self="top right"
                    transition-show="jump-down"
                    transition-hide="jump-up"
                    :offset="[0, 8]"
                    class="q-pa-sm"
                    style="width: 250px"
                  >
                    <!-- new slide -->
                    <q-item
                      class="items-center justify-start q-px-md q-py-sm"
                      clickable
                      dense
                      v-close-popup
                      @click="handleAddingNewSlide()"
                    >
                      <q-icon name="r_add" size="16px" class="q-mr-sm" />

                      <div>
                        {{ $t("presentation.slide.actions.newSlide") }}
                      </div>
                    </q-item>

                    <!-- duplicate -->
                    <q-item
                      class="items-center justify-start q-px-md q-py-sm"
                      clickable
                      dense
                      v-close-popup
                      @click="handleDuplicatingSlide(element)"
                    >
                      <q-icon
                        name="r_dynamic_feed"
                        size="16px"
                        class="q-mr-sm"
                      />

                      <div>
                        {{ $t("presentation.slide.actions.duplicate") }}
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
                      :disable="presentation.slides.length === 1"
                      @click="handleSlideDeletion(element)"
                    >
                      <q-icon
                        name="r_delete"
                        color="red"
                        size="16px"
                        class="q-mr-sm"
                      />

                      <div>
                        {{ $t("presentation.slide.actions.delete") }}
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
      <div class="row no-wrap justify-end">
        <q-card
          flat
          v-ripple
          color="primary"
          class="bg-blue-1 relative-position q-py-xl q-mt-md cursor-pointer q-hoverable slide"
          style="width: 244px"
          @click="handleAddingNewSlide()"
        >
          <q-icon
            name="r_add"
            color="primary"
            class="absolute-center"
            size="md"
          />
        </q-card>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { computed, onBeforeMount, onUnmounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import draggable from "vuedraggable/src/vuedraggable";
import { useCanvasStore } from "stores/canvas";
import { deselectElement } from "stores/canvas/helpers/select";
import { useQuasar } from "quasar";

/*
 * variables
 */
const leftDrawerOpen = ref(true);

const $q = useQuasar();

/*
 * stores
 */
const presentationStore = usePresentationsStore();
const { presentation, slide } = storeToRefs(presentationStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

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

const handleSlideDeletion = async (element) => {
  await presentationStore.deleteSlide(element);
  canvasStore.setElementsFromSlide();
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
  await presentationStore.updateSlidesOrder();
};

/*
 * slides selection
 */
const hoveredSlideIndex = ref(null);

const handleSlideSelection = async (newSlide) => {
  if (slide.value.id === newSlide.id) return;

  canvasStore.saveSlidePreview();
  deselectElement();

  await presentationStore.setSlide(newSlide, elements.value);

  canvasStore.setElementsFromSlide();
  canvasStore.redrawCanvas(false, false, undefined, false);
};

const handleAddingNewSlide = async () => {
  canvasStore.saveSlidePreview();
  deselectElement();

  slide.value.canvas_data = JSON.stringify(elements.value);
  presentationStore.updateLocalSlide();
  presentationStore.saveSlide(undefined, elements.value);

  await presentationStore.addNewSlide();

  canvasStore.setElementsFromSlide();
  canvasStore.redrawCanvas(false);
};

const handleDuplicatingSlide = async (slide) => {
  await presentationStore.duplicateSlide(slide, elements.value);
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
</script>

<style scoped lang="scss">
.slide {
  outline: 3px solid transparent;
  transition: 0.2s;
  border: 1.5px solid $grey-2;
  width: 245px;
  height: calc(245px * 9 / 16);
  border-radius: 8px;

  canvas,
  .q-img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  &.slide--hovered {
    outline: 3px solid $blue-3;
  }

  &:active {
    transform: scale(0.975);
  }

  &.slide--active {
    border: 1.5px solid $primary;
    outline: 3px solid $blue-3;
  }
}

.slide_handle {
  cursor: grab;
}
</style>
