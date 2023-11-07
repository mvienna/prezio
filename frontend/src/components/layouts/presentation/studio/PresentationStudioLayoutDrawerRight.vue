<template>
  <q-drawer
    v-model="rightDrawerOpen"
    show-if-above
    side="right"
    class="bg-white scroll--hidden"
    :width="400"
    bordered
  >
    <q-tabs
      v-model="rightDrawerTab"
      align="justify"
      indicator-color="primary"
      class="bg-white text-black text-white drawer_header"
      inline-label
    >
      <q-tab
        v-for="tab in rightDrawerTabs.filter((item) => !item.hidden)"
        :key="tab.name"
        :name="tab.name"
        :disable="tab.disable"
        no-caps
        style="height: 68px"
      >
        <div>
          <q-icon :name="tab.icon" size="22px" />
          <div class="text-caption q-mt-xs">{{ tab.label }}</div>
        </div>
      </q-tab>
    </q-tabs>

    <q-tab-panels v-model="rightDrawerTab" animated>
      <!-- type -->
      <q-tab-panel name="type">
        <PresentationStudioTabsTypesTab
          @select="handleChangingSlideType($event)"
        />
      </q-tab-panel>

      <!-- settings -->
      <q-tab-panel name="settings">
        <PresentationStudioTabsContentTab />
      </q-tab-panel>

      <!-- layers -->
      <q-tab-panel name="layers">
        <PresentationStudioTabsLayersManagementTab />
      </q-tab-panel>

      <!-- design -->
      <q-tab-panel name="design">
        <PresentationStudioTabsDesignTab />
      </q-tab-panel>

      <!-- template -->
      <q-tab-panel name="template">
        <PresentationStudioTabsTemplatesTab />
      </q-tab-panel>

      <!-- audio -->
      <q-tab-panel name="audio">
        <div class="text-h6 q-pb-md">
          {{ $t("presentationLayout.rightDrawer.tabs.audio.title") }}
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-drawer>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { useI18n } from "vue-i18n";
import PresentationStudioTabsLayersManagementTab from "components/presentationStudio/tabs/layers/PresentationStudioTabsLayersManagementTab.vue";
import PresentationStudioTabsDesignTab from "components/presentationStudio/tabs/design/PresentationStudioTabsDesignTab.vue";
import PresentationStudioTabsTemplatesTab from "components/presentationStudio/tabs/templates/PresentationStudioTabsTemplatesTab.vue";
import PresentationStudioTabsTypesTab from "components/presentationStudio/tabs/types/PresentationStudioTabsTypesTab.vue";
import { useCanvasStore } from "stores/canvas";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import { ALIGNMENT } from "src/constants/canvas/canvasVariables";
import { useCanvasTextStore } from "stores/canvas/text";
import PresentationStudioTabsContentTab from "components/presentationStudio/tabs/settings/PresentationStudioTabsSettingsTab.vue";

/*
 * variables
 */
const rightDrawerOpen = ref(true);

const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, slide } = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements, MODE_OPTIONS } = storeToRefs(canvasStore);

const textStore = useCanvasTextStore();
const { customization } = storeToRefs(textStore);

/*
 * tabs
 */
const rightDrawerTabs = computed(() => {
  return [
    {
      name: "type",
      icon: "r_extension",
      label: t("presentationLayout.rightDrawer.tabs.types.title"),
    },
    {
      name: "settings",
      icon: "r_view_in_ar",
      label: t("presentationLayout.rightDrawer.tabs.settings.title"),
      hidden: !SLIDE_TYPES_OF_QUIZ.includes(slide.value?.type),
    },
    {
      name: "layers",
      icon: "r_layers",
      label: t("presentationLayout.rightDrawer.tabs.layers.title"),
      hidden: slide.value?.type !== SLIDE_TYPES.CONTENT,
    },
    {
      name: "design",
      icon: "r_format_paint",
      label: t("presentationLayout.rightDrawer.tabs.design.title"),
    },
    {
      name: "template",
      icon: "r_grid_view",
      label: t("presentationLayout.rightDrawer.tabs.templates.title"),
      hidden: slide.value?.type !== SLIDE_TYPES.CONTENT,
    },
    {
      name: "audio",
      icon: "r_graphic_eq",
      label: t("presentationLayout.rightDrawer.tabs.audio.title"),
      disable: true,
    },
  ];
});
const rightDrawerTab = ref(rightDrawerTabs.value[0].name);

/*
 * handle slide change
 */
watch(
  () => slide.value,
  () => {
    if (slide.value?.type) {
      if (slide.value.type === SLIDE_TYPES.CONTENT) {
        rightDrawerTab.value = rightDrawerTabs.value[0].name;
      } else {
        rightDrawerTab.value = rightDrawerTabs.value[1].name;
      }
    }
  }
);

/*
 * change slide type
 */
const handleChangingSlideType = async (type) => {
  const newElements = elements.value.filter((element) =>
    [MODE_OPTIONS.value.background, MODE_OPTIONS.value.baseFill].includes(
      element.mode
    )
  );

  if (type !== SLIDE_TYPES.CONTENT) {
    const layoutDefaultElementProps = {
      mode: MODE_OPTIONS.value.text,
      isVisible: true,
      isLocked: false,
      fontFamily: customization.value.font,
      lineHeight: customization.value.lineHeight,
      fontWeight: "normal",
      textDecoration: "none",
      fontStyle: "normal",
      textAlign: ALIGNMENT.horizontal.center,
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

    const titleElement = {
      ...layoutDefaultElementProps,

      id: "layout-title-top-addon",
      text: t("presentationStudio.layouts.defaultTexts.title"),

      color: "#313232",
      fontSize: "48px",
      fontWeight: "bold",
    };

    newElements.push(titleElement);
  }

  slide.value = {
    ...slide.value,
    type: type,
    canvas_data: JSON.stringify(newElements),
  };
  presentationsStore.updateLocalSlide();
  await presentationsStore.saveSlide(slide.value, newElements);

  await canvasStore.setElementsFromSlide();
  canvasStore.redrawCanvas(false, false, undefined, false);
};
</script>

<style scoped lang="scss">
/*
 * tabs
 */
::v-deep(.q-tab) {
  color: $grey-5;

  .q-tab__indicator {
    background: $grey-5;
    opacity: 0.3;
    height: 1px;
  }
}

::v-deep(.q-tab--active) {
  color: $dark;

  .q-tab__indicator {
    background: currentColor;
    opacity: 1;
    height: 2px;
  }
}

/*
 * header
 */
.drawer_header {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
