<template>
  <div class="q-pa-md column no-wrap q-gutter-lg">
    <div v-for="category in categories" :key="category.name">
      <div class="q-mb-sm rounded-borders text-grey-9">
        {{ category.label }}
      </div>

      <div class="themes_grid">
        <div
          v-for="(theme, themeIndex) in THEMES.filter(
            (item) => item.group === category.name
          )"
          :key="themeIndex"
          class="theme relative-position"
          :class="
            backgroundElement?.imageSrc === theme.src
              ? 'theme--active shadow--primary'
              : ''
          "
          @click="$emit('changeBackground', theme)"
        >
          <q-img
            :src="theme.src"
            @mouseover="handleBackgroundMouseOver(theme, themeIndex)"
            @mouseleave="handleBackgroundMouseLeave(themeIndex)"
          />

          <div
            class="text-center absolute-bottom-left q-mb-sm q-ml-sm text-sm"
            :style="`font-family: ${theme.font || 'Arial'}; color: ${
              theme.color || 'white'
            }`"
          >
            {{
              theme.name || category.label.slice(0, -1) + " " + (themeIndex + 1)
            }}
          </div>

          <div
            class="text-center absolute-bottom-right q-mb-xs q-mr-sm text-h5"
            :style="`font-family: ${theme.font || 'Arial'}; color: ${
              theme.color || 'white'
            }`"
          >
            Aa
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { THEMES } from "src/constants/assets/themes";
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
  // stock: {
  //   name: "stock",
  //   label: t(
  //     "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.stock"
  //   ),
  // },
};

/*
 * preview background on hover
 */
const isThemesHovered = ref([]);

const handleBackgroundMouseOver = (theme, themeIndex) => {
  isThemesHovered.value[themeIndex] = true;

  setTimeout(() => {
    if (isThemesHovered.value[themeIndex]) {
      emit("previewBackground", theme);
    }
  }, 500);
};

const handleBackgroundMouseLeave = (themeIndex) => {
  isThemesHovered.value[themeIndex] = false;

  // remove preview background
  elements.value = elements.value.filter(
    (element) => element.mode !== MODE_OPTIONS.value.backgroundPreview
  );

  // un-hide active background
  const themeElementIndex = elements.value.findIndex(
    (element) => element.mode === MODE_OPTIONS.value.background
  );
  if (themeElementIndex !== -1) {
    elements.value[themeElementIndex].isVisible = true;
  }

  // redraw canvas
  canvasStore.redrawCanvas(false);
};
</script>

<style scoped lang="scss">
/*
 * background options
 */
.themes_grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  .item:nth-last-child(-n + 3) {
    margin-bottom: 0;
  }
}

.theme {
  width: 100%;
  display: inline-block;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 6px !important;
  overflow: hidden;
  border: 1px solid $grey-2;

  .q-img {
    aspect-ratio: 16/9;
    transition: 0.2s;
  }

  &:hover {
    border-color: $accent;
  }

  &.theme--active {
    border-color: $primary;
  }
}
</style>
