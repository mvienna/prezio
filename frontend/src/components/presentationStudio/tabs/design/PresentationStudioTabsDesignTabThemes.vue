<template>
  <div class="q-pa-md column no-wrap q-gutter-lg">
    <div v-for="category in categories" :key="category.name">
      <div class="q-mb-sm rounded-sm text-grey-9">
        {{ category.label }}
      </div>

      <div class="themes_grid">
        <div
          v-for="(theme, themeIndex) in THEMES.filter(
            (item) => item.group === category.name,
          )"
          :key="themeIndex"
          class="theme relative-position"
          :class="
            baseBackgroundUrl === theme.src
              ? 'theme--active shadow--primary'
              : ''
          "
          @click="studioStore.updateBaseLayer(undefined, theme.src)"
        >
          <q-img
            :src="theme.src"
            @mouseover="handleBackgroundMouseOver(theme, themeIndex)"
            @mouseleave="handleBackgroundMouseLeave(themeIndex)"
          />

          <div
            class="text-center absolute-bottom-left q-mb-sm q-ml-sm text-12"
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
import { computed, ref } from "vue";
import { THEMES } from "src/constants/assets/themes";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useStudioStore } from "stores/studio";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const studioStore = useStudioStore();
const { layers } = storeToRefs(studioStore);

/*
 * categories
 */
const categories = {
  prezio: {
    name: "prezio",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.prezio",
    ),
  },
  gradients: {
    name: "gradients",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.gradients",
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
      studioStore.updateBaseLayer(undefined, undefined, undefined, theme.src);
    }
  }, 500);
};

const baseBackgroundUrl = computed(() => {
  return layers.value.base.findOne(".baseBackground")?.getAttr("source");
});

const handleBackgroundMouseLeave = (themeIndex) => {
  isThemesHovered.value[themeIndex] = false;
  studioStore.updateBaseLayer(undefined, baseBackgroundUrl.value, undefined);
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
