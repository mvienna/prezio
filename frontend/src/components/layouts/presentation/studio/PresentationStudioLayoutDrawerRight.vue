<template>
  <q-drawer
    v-model="rightDrawerOpen"
    show-if-above
    side="right"
    class="bg-white scroll--hidden presentation_studio__layout__drawer_right"
    :width="isRightSidebarPanelExpanded ? 471 : 110"
    bordered
  >
    <div style="padding-top: 55px; display: flex; height: 100%">
      <!-- content -->
      <q-tab-panels
        v-if="isRightSidebarPanelExpanded"
        v-model="rightDrawerTab"
        animated
        vertical
        class="presentation_studio__layout__drawer_right__tab_panels"
      >
        <!-- type -->
        <q-tab-panel
          name="type"
          class="presentation_studio__layout__drawer_right__tab_panel"
        >
          <PresentationStudioTabsTypesTab
            @select="handleChangingSlideType($event)"
          />
        </q-tab-panel>

        <!-- settings -->
        <q-tab-panel
          name="settings"
          class="presentation_studio__layout__drawer_right__tab_panel"
        >
          <PresentationStudioTabsSettingsTab />
        </q-tab-panel>

        <!-- layers -->
        <q-tab-panel
          name="layers"
          class="presentation_studio__layout__drawer_right__tab_panel"
        >
          <PresentationStudioTabsLayersManagementTab />
        </q-tab-panel>

        <!-- design -->
        <q-tab-panel
          name="design"
          class="presentation_studio__layout__drawer_right__tab_panel"
        >
          <PresentationStudioTabsDesignTab />
        </q-tab-panel>

        <!-- template -->
        <q-tab-panel
          name="template"
          class="presentation_studio__layout__drawer_right__tab_panel"
        >
          <PresentationStudioTabsTemplatesTab />
        </q-tab-panel>

        <!-- audio -->
        <q-tab-panel
          name="audio"
          class="presentation_studio__layout__drawer_right__tab_panel"
        >
          <div class="text-h6 q-pb-md">
            {{ $t("presentationLayout.rightDrawer.tabs.audio.title") }}
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <!-- tabs -->
      <div class="column no-wrap jutify-between">
        <q-tabs
          v-model="rightDrawerTab"
          align="justify"
          class="bg-white text-black text-white q-pa-sm presentation_studio__layout__drawer_right__tabs"
          inline-label
          vertical
        >
          <q-tab
            v-for="tab in rightDrawerTabs.filter((item) => !item.hidden)"
            :key="tab.name"
            :name="tab.name"
            :disable="tab.disable"
            no-caps
            style="width: 93px; height: 68px"
            class="presentation_studio__layout__drawer_right__tab"
          >
            <div>
              <q-icon :name="tab.icon" size="24px" />
              <div class="q-mt-sm q-mb-xs text-sm-plus">
                {{ tab.label }}
              </div>
            </div>
          </q-tab>
        </q-tabs>

        <div class="row justify-center">
          <q-btn
            :icon="
              isRightSidebarPanelExpanded
                ? 'r_keyboard_double_arrow_right'
                : 'r_keyboard_double_arrow_left'
            "
            flat
            color="grey"
            round
            size="1.25em"
            class="q-ma-sm round-borders"
            @click="isRightSidebarPanelExpanded = !isRightSidebarPanelExpanded"
          >
            <q-tooltip :offset="[0, 8]">
              {{
                $t(
                  `presentationLayout.rightDrawer.panel.${
                    isRightSidebarPanelExpanded ? "hide" : "expand"
                  }`
                )
              }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
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
import {
  ALIGNMENT,
  SHAPES_OPTIONS,
} from "src/constants/canvas/canvasVariables";
import { useCanvasTextStore } from "stores/canvas/text";
import PresentationStudioTabsSettingsTab from "components/presentationStudio/tabs/settings/PresentationStudioTabsSettingsTab.vue";
import { generateUniqueId } from "src/helpers/generationUtils";

/*
 * variables
 */
const rightDrawerOpen = ref(true);

const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, slide, isRightSidebarPanelExpanded } =
  storeToRefs(presentationsStore);

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
      hidden: ![
        ...SLIDE_TYPES_OF_QUIZ,
        SLIDE_TYPES.WORD_CLOUD,
        SLIDE_TYPES.LEADERBOARD,
      ].includes(slide.value?.type),
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
      if ([SLIDE_TYPES.CONTENT].includes(slide.value.type)) {
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
  if (type === slide.value?.type) return;
  const newElements = prepareElementsForNewSlide(type);

  slide.value = {
    ...slide.value,
    type: type,
    canvas_data: JSON.stringify(newElements),
    settings_data: null,
  };
  presentationsStore.syncCurrentSlideWithPresentationSlides();
  await presentationsStore.saveSlide(slide.value, newElements);

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

    fontSize: "68px",
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
      fontSize: "68px",
      fontWeight: "bold",
    };

    const bodyElement = {
      ...layoutDefaultElementProps,

      id: "layout-body",
      text: t("presentationStudio.layouts.defaultTexts.body"),

      fontSize: "38px",
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
      fontSize: "68px",
      fontWeight: "bold",
    };

    preparedElements = [titleElement];
  }

  /*
   * add base fill
   */
  if (slide.value) {
    const designElements = elements.value.filter((element) =>
      [MODE_OPTIONS.value.background, MODE_OPTIONS.value.baseFill].includes(
        element.mode
      )
    );

    preparedElements = [...preparedElements, ...designElements];
  } else {
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
  }

  return preparedElements;
};
</script>

<style scoped lang="scss">
/*
 * tabs
 */
::v-deep(.presentation_studio__layout__drawer_right) {
  .presentation_studio__layout__drawer_right__tab_panels {
    width: 384px;
    border-right: 1px solid $grey-2;
  }

  .presentation_studio__layout__drawer_right__tab_panel {
    overflow-y: scroll;

    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .presentation_studio__layout__drawer_right__tabs {
    height: 100%;
  }

  .presentation_studio__layout__drawer_right__tab {
    color: $black;
    border-radius: 8px !important;
    overflow: hidden;
    margin-bottom: 8px;
    border: 2px solid transparent;

    &:hover {
      border: 2px solid $accent;
      background: $background;
    }

    .q-tab__indicator,
    .q-focus-helper {
      display: none;
    }

    &.q-tab--active {
      color: $secondary;
      background: $background;
      border: 2px solid $accent;
    }
  }
}
</style>
