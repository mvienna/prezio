<template>
  <div>
    <!-- select background -->
    <div class="text-grey">
      {{
        $t("presentationLayout.rightDrawer.tabs.design.slideBackground.title")
      }}
    </div>

    <!-- categories -->
    <div class="q-gutter-sm q-mt-xs q-mb-md">
      <q-btn
        v-for="category in categories"
        :key="category.name"
        :label="category.label"
        :disable="category.disable"
        color="primary"
        :outline="selectedBackgroundsCategory !== category.name"
        :unelevated="selectedBackgroundsCategory === category.name"
        no-caps
        size="12px"
        style="padding: 0 8px; min-height: 28px"
        @click="selectedBackgroundsCategory = category.name"
      />
    </div>

    <!-- backgrounds -->
    <div class="q-pa-xs scroll-y scroll--hidden" style="max-height: 410px">
      <div class="backgrounds_grid">
        <div
          v-for="(background, backgroundIndex) in filteredBackgrounds"
          :key="backgroundIndex"
          class="background"
          :class="
            backgroundElement?.imageSrc === background.src
              ? 'background--active'
              : ''
          "
          @click="$emit('changeBackground', background)"
        >
          <q-img
            :src="background.src"
            @mouseover="handleBackgroundMouseOver(background)"
            @mouseleave="handleBackgroundMouseLeave()"
          />
          <div class="text-center q-mt-xs text-semibold">
            {{ background.name || backgroundIndex + 1 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { backgrounds } from "src/constants/assets/backgrounds";
import { useI18n } from "vue-i18n";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { elements, MODE_OPTIONS, canvas } = storeToRefs(canvasStore);

/*
 * props
 */
defineProps({
  backgroundElement: { type: Object, default: null },
});

/*
 * emits
 */
const emit = defineEmits(["changeBackground", "previewBackground"]);

/*
 * categories
 */
const categories = {
  prezio: {
    name: "prezio",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.prezio"
    ),
  },
  gradients: {
    name: "gradients",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.gradients"
    ),
  },
  minimalism: {
    name: "minimalism",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.minimalism"
    ),
    disable: true,
  },
  office: {
    name: "office",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.office"
    ),
    disable: true,
  },
  architecture: {
    name: "architecture",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.architecture"
    ),
    disable: true,
  },
  futuristic: {
    name: "futuristic",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.futuristic"
    ),
    disable: true,
  },
};
const selectedBackgroundsCategory = ref(categories.prezio.name);

/*
 * backgrounds
 */
const filteredBackgrounds = computed(() => {
  return backgrounds.filter(
    (background) => background.group === selectedBackgroundsCategory.value
  );
});

/*
 * preview background on hover
 */
const isHovered = ref(false);

const handleBackgroundMouseOver = (background) => {
  isHovered.value = true;

  setTimeout(() => {
    if (isHovered.value) {
      emit("previewBackground", background);
    }
  }, 500);
};

const handleBackgroundMouseLeave = () => {
  isHovered.value = false;

  // remove preview background
  elements.value = elements.value.filter(
    (element) => element.mode !== MODE_OPTIONS.value.backgroundPreview
  );

  // un-hide active background
  const backgroundElementIndex = elements.value.findIndex(
    (element) => element.mode === MODE_OPTIONS.value.background
  );
  if (backgroundElementIndex !== -1) {
    elements.value[backgroundElementIndex].isVisible = true;
  }

  // redraw canvas
  canvasStore.redrawCanvas(false);
};
</script>

<style scoped lang="scss">
/*
 * background options
 */
.backgrounds_grid {
  columns: 3;
  gap: 16px;

  .item:nth-last-child(-n + 3) {
    margin-bottom: 0;
  }
}

.background {
  width: 100%;
  display: inline-block;
  cursor: pointer;
  color: $grey;
  transition: 0.2s;
  margin-bottom: 16px;

  .q-img {
    aspect-ratio: 16/9;
    border-radius: 8px;
    border: 1.5px solid $grey-2;
    outline: 3px solid transparent;
    transition: 0.2s;
  }

  &:hover {
    .q-img {
      outline: 3px solid $blue-2;
    }
  }

  &.background--active {
    color: $black;

    .q-img {
      border: 1.5px solid $primary;
      outline: 3px solid $blue-2;
    }
  }
}
</style>
