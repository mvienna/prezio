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
              class="slide slide_handle relative-position q-py-xl cursor-pointer q-hoverable"
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
              <q-img :src="element.preview" style="width: 100%; height: 100%" />

              <!-- actions -->
              <div class="absolute-right q-pt-sm q-pr-sm">
                <q-btn
                  v-if="presentation.slides.length !== 1"
                  icon="more_vert"
                  round
                  flat
                  size="10px"
                >
                  <q-menu
                    v-model="showSlideContextMenu[index]"
                    anchor="bottom right"
                    self="top right"
                    transition-show="jump-down"
                    transition-hide="jump-up"
                    :offset="[0, 8]"
                  >
                    <q-list
                      class="full-height column q-gutter-sm text-semibold"
                    >
                      <!-- delete -->
                      <q-item
                        class="items-center justify-start q-px-md q-py-sm text-red"
                        style="border-radius: 8px"
                        clickable
                        dense
                        v-close-popup
                        @click="handleSlideDeletion(element)"
                      >
                        <q-icon
                          name="r_delete"
                          color="red"
                          size="16px"
                          class="q-mr-sm"
                        />

                        <div>
                          {{ $t("presentations.slide.actions.delete") }}
                        </div>
                      </q-item>
                    </q-list>
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
import { onBeforeMount, onUnmounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { usePresentationStore } from "stores/presentation";
import draggable from "vuedraggable/src/vuedraggable";
import { useCanvasStore } from "stores/canvas";

/*
 * variables
 */
const leftDrawerOpen = ref(true);

/*
 * stores
 */
const presentationStore = usePresentationStore();
const { presentation, slide } = storeToRefs(presentationStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

/*
 * slide context menu
 */
const showSlideContextMenu = ref([]);

const handleKeyDownEvent = (event) => {
  if (event.key === "Delete" || event.key === "Backspace") {
    const slideIndex = showSlideContextMenu.value.findIndex(
      (value) => value === true
    );

    if (slideIndex) {
      handleSlideDeletion(presentation.value.slides[slideIndex]);
    }
  }
};

const handleSlideDeletion = async (element) => {
  await presentationStore.deleteSlide(element);
  canvasStore.redrawCanvas();
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
  canvasStore.redrawCanvas();
};

/*
 * slides selection
 */
const hoveredSlideIndex = ref(null);

const handleSlideSelection = async (slide) => {
  await presentationStore.setSlide(slide, elements.value);
  canvasStore.setElementsFromSlide();
  canvasStore.redrawCanvas();
};

const handleAddingNewSlide = async () => {
  await presentationStore.addNewSlide();
  canvasStore.setElementsFromSlide();
  canvasStore.redrawCanvas();
};
</script>

<style scoped lang="scss">
.slide {
  outline: 3px solid transparent;
  transition: 0.2s;
  border: 1.5px solid $grey-2;
  aspect-ratio: 16/9;

  &.slide--hovered {
    outline: 3px solid $blue-3;
  }

  &:active {
    transform: scale(0.98);
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
