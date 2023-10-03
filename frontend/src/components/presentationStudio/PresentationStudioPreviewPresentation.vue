<template>
  <q-card flat class="relative-position">
    <!-- header -->
    <q-toolbar class="items-center justify-center text-h7" style="height: 74px">
      <span class="text-grey q-mr-sm">
        {{ $t("presentationStudio.preview.title") }}
      </span>

      <span class="text-semibold"> «{{ presentation.name }}» </span>
    </q-toolbar>

    <!-- cancel -->
    <div class="absolute-right q-mt-md q-mr-md">
      <q-btn icon="close" color="grey" flat round @click="$emit('cancel')" />
    </div>

    <!-- content -->
    <q-card-section class="q-pa-none q-mx-md q-mb-md relative-position">
      <div
        id="presentationPreview"
        class="presentation_preview__slide column no-wrap justify-center"
      ></div>

      <!-- previous slide -->
      <div class="absolute-left column no-wrap justify-center q-ml-md">
        <q-btn
          flat
          round
          icon="r_arrow_back_ios_new"
          no-caps
          no-wrap
          size="12px"
          class="q-px-sm q-py-xl"
          style="
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(4px);
          "
          :disable="slideIndex === 0"
          @click="handleChangeSlides('backward')"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            transition-show="jump-right"
            transition-hide="jump-left"
            :offset="[8, 0]"
          >
            <div class="text-bold text-center">
              {{ $t("presentationStudio.preview.controls.previous") }}
            </div>

            <div
              v-if="showShortcuts"
              class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm"
            >
              <div v-if="isMac">⌘</div>
              <div v-else>Ctrl</div>
              <div>←</div>
            </div>
          </q-tooltip>
        </q-btn>
      </div>

      <!-- next slide -->
      <div class="absolute-right column no-wrap justify-center q-mr-md">
        <q-btn
          flat
          round
          icon="r_arrow_forward_ios"
          no-caps
          no-wrap
          size="12px"
          class="q-px-sm q-py-xl"
          style="
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(4px);
          "
          :disable="slideIndex === presentation.slides.length - 1"
          @click="handleChangeSlides('forward')"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            transition-show="jump-left"
            transition-hide="jump-right"
            :offset="[8, 0]"
          >
            <div class="text-bold text-center">
              {{ $t("presentationStudio.preview.controls.next") }}
            </div>

            <div
              v-if="showShortcuts"
              class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm"
            >
              <div v-if="isMac">⌘</div>
              <div v-else>Ctrl</div>
              <div>→</div>
            </div>
          </q-tooltip>
        </q-btn>
      </div>

      <!-- progress -->
      <div class="progress">
        <div class="progress__bar">
          <div
            class="progress__bar__active bg-primary"
            :style="`width: ${
              (slideIndex * 100) / (presentation.slides.length - 1)
            }%;`"
          >
            <div class="progress__bar__active__glance"></div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onUnmounted } from "vue";
import { deselectElement } from "stores/canvas/helpers/select";
import { useCanvasStore } from "stores/canvas";
import { useQuasar } from "quasar";

/*
 * variables
 */
const $q = useQuasar();

/*
 * emits
 */
defineEmits(["cancel"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, slide } = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

/*
 * slide index
 */
const slideIndex = computed(() => {
  return presentation.value.slides.findIndex(
    (item) => item.id === slide.value.id
  );
});

/*
 * handle change slides
 */
onBeforeMount(() => {
  document.addEventListener("keydown", handleKeyDownEvent);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDownEvent);
});

const handleKeyDownEvent = (event) => {
  if (event.ctrlKey || event.metaKey) {
    if (event.keyCode === 37) {
      event.preventDefault();
      handleChangeSlides("backward");
    }

    if (event.keyCode === 39) {
      event.preventDefault();
      handleChangeSlides("forward");
    }
  }
};

const handleChangeSlides = async (direction) => {
  const newSlide =
    presentation.value.slides?.[
      slideIndex.value + (direction === "forward" ? 1 : -1)
    ];
  if (!newSlide) return;

  await presentationsStore.setSlide(newSlide, elements.value, false);
  await canvasStore.setElementsFromSlide();
  canvasStore.redrawCanvas(false, false, undefined, false);
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

<style lang="scss">
.presentation_preview__slide {
  height: 100%;
  canvas {
    width: 100%;
    border-radius: 12px;
    border: 3px solid $grey-2;
  }
}
</style>

<style scoped lang="scss">
.q-card {
  width: 100%;
  max-width: 1000px;
  max-height: 100%;
  overflow-y: hidden;
  border-radius: 16px !important;
}

.presentation_preview__footer {
  position: sticky;
  bottom: 0;
}

/*
 * progress
 */
.progress {
  width: calc(100% - 32px);
  position: absolute;
  bottom: 16px;
  margin: 0 16px;
}

.progress__bar {
  position: relative;
  height: 16px;
  background: rgba(225, 225, 225, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 8px;
}

.progress__bar__active {
  width: 100%;
  height: 16px;
  z-index: 1;
  border-radius: 8px;
  transition: 0.275s;
  animation-name: expand;
  position: relative;
}

.progress__bar__active__glance {
  width: calc(100% - 16px);
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  position: absolute;
  left: 8px;
  top: 4px;
  animation-name: expand;
}

@keyframes expand {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
