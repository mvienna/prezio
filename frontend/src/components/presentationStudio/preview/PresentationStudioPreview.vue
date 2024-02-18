<template>
  <q-card flat class="relative-position">
    <!-- header -->
    <q-toolbar class="items-center justify-center text-16" style="height: 74px">
      <span class="text-grey">
        {{ $t("presentationStudio.preview.title") }}
      </span>

      <span class="text-semibold q-ml-sm"> «{{ presentation.name }}» </span>
    </q-toolbar>

    <!-- cancel -->
    <div class="absolute-right q-mt-md q-mr-md">
      <q-btn
        icon="close"
        color="grey"
        flat
        round
        @click="$emit('cancel')"
        style="border-radius: 50%"
      />
    </div>

    <!-- content -->
    <q-card-section class="q-pa-none q-mx-md relative-position">
      <!-- slide preview -->
      <div id="presentationPreview"></div>

      <!-- previous slide -->
      <div class="absolute-left column no-wrap justify-center q-ml-md">
        <q-btn
          flat
          round
          class="presentation_preview__controls__btn"
          icon="r_arrow_back"
          no-caps
          no-wrap
          size="1em"
          :disable="slideIndex === 0"
          @click="handleSlideChange('backward')"
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
          </q-tooltip>
        </q-btn>
      </div>

      <!-- next slide -->
      <div class="absolute-right column no-wrap justify-center q-mr-md">
        <q-btn
          flat
          round
          class="presentation_preview__controls__btn"
          icon="r_arrow_forward"
          no-caps
          no-wrap
          size="1em"
          :disable="slideIndex === presentation.slides.length - 1"
          @click="handleSlideChange('forward')"
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
          </q-tooltip>
        </q-btn>
      </div>

      <div class="absolute-bottom justify-center row no-wrap q-mb-md">
        <div class="presentation_preview__slide__number q-px-sm">
          {{ slideIndex + 1 }}/{{ presentation.slides.length }}
        </div>
      </div>
    </q-card-section>

    <!-- progress -->
    <q-card-section>
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
import { computed, onBeforeMount, onMounted, onUnmounted } from "vue";
import { useQuasar } from "quasar";
import { useStudioStore } from "stores/studio";

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

const studioStore = useStudioStore();

/*
 * slide index
 */
const slideIndex = computed(() => {
  return presentation.value.slides.findIndex(
    (item) => item.id === slide.value.id,
  );
});

/*
 * handle slides change
 */
onBeforeMount(() => {
  document.addEventListener("keydown", handleKeyDownEvent);
});

onMounted(() => {
  studioStore.loadStudio();
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDownEvent);
});

const handleKeyDownEvent = (event) => {
  if (event.keyCode === 37) {
    event.preventDefault();
    handleSlideChange("backward");
  }

  if (event.keyCode === 39) {
    event.preventDefault();
    handleSlideChange("forward");
  }
};

const handleSlideChange = async (direction) => {
  const newSlide =
    presentation.value.slides?.[
      slideIndex.value + (direction === "forward" ? 1 : -1)
    ];
  if (!newSlide) return;

  presentationsStore.setSlide(newSlide, false);
};
</script>

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
  width: 100%;
}

.progress__bar {
  position: relative;
  height: 12px;
  background: $grey-2;
  border-radius: 8px;
}

.progress__bar__active {
  width: 100%;
  height: 12px;
  z-index: 1;
  border-radius: 8px;
  transition: 0.275s;
  animation-name: expand;
  position: relative;
}

.progress__bar__active__glance {
  width: calc(100% - 16px);
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  position: absolute;
  left: 8px;
  top: 3px;
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

.presentation_preview__slide__number {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  color: $grey-10;
}

.presentation_preview__controls__btn {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  color: $white;
  border-radius: 50%;
}
</style>
