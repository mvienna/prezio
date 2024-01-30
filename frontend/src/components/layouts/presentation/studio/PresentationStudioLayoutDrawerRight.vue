<template>
  <q-drawer
    v-model="rightDrawerOpen"
    show-if-above
    side="right"
    class="bg-white hide-scrollbar presentation_studio__layout__drawer_right"
    :width="isDrawerRightPanelExpanded ? 471 : 110"
    bordered
  >
    <div style="padding-top: 55px; display: flex; height: 100%">
      <div
        v-if="isDrawerRightPanelExpanded"
        class="presentation_studio__layout__drawer_right__content hide-scrollbar"
      >
        <div style="position: sticky; top: 0; z-index: 9" class="bg-white">
          <div
            class="row no-wrap items-center justify-between"
            style="padding: 10.5px 18px"
          >
            <div class="text-weight-medium">
              {{
                drawerRightTabs.find((tab) => tab.name === drawerRightTab).title
              }}
            </div>

            <q-btn
              round
              flat
              icon="r_close"
              class="round-borders"
              size="10px"
              @click="
                isDrawerRightPanelExpanded = false;
                handleTabSelect();
              "
            />
          </div>

          <q-separator />
        </div>

        <!-- content -->
        <q-tab-panels v-model="drawerRightTab" vertical>
          <!-- type -->
          <q-tab-panel
            name="type"
            class="presentation_studio__layout__drawer_right__tab_panel"
          >
            <PresentationStudioTabsTypesTab
              @select="
                handleChangingSlideType($event);
                handleTabSelect();
              "
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
            class="presentation_studio__layout__drawer_right__tab_panel q-pa-none"
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
      </div>

      <!-- tabs -->
      <div class="column no-wrap justify-between">
        <q-tabs
          v-model="drawerRightTab"
          align="justify"
          class="bg-white text-black text-white q-pa-sm presentation_studio__layout__drawer_right__tabs"
          inline-label
          vertical
        >
          <q-tab
            v-for="tab in drawerRightTabs.filter((item) => !item.hidden)"
            :key="tab.name"
            :name="tab.name"
            :disable="tab.disable"
            no-caps
            style="width: 93px; height: 68px"
            class="presentation_studio__layout__drawer_right__tab"
            @click="isDrawerRightPanelExpanded = true"
          >
            <div>
              <q-icon :name="tab.icon" size="24px" />
              <div class="q-mt-sm q-mb-xs text-13">
                {{ tab.label }}
              </div>
            </div>
          </q-tab>
        </q-tabs>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { computed, onBeforeMount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { useI18n } from "vue-i18n";
import PresentationStudioTabsLayersManagementTab from "components/presentationStudio/tabs/layers/PresentationStudioTabsLayersManagementTab.vue";
import PresentationStudioTabsDesignTab from "components/presentationStudio/tabs/design/PresentationStudioTabsDesignTab.vue";
import PresentationStudioTabsTemplatesTab from "components/presentationStudio/tabs/templates/PresentationStudioTabsTemplatesTab.vue";
import PresentationStudioTabsTypesTab from "components/presentationStudio/tabs/types/PresentationStudioTabsTypesTab.vue";
import {
  PRESENTATION_TABS,
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import PresentationStudioTabsSettingsTab from "components/presentationStudio/tabs/settings/PresentationStudioTabsSettingsTab.vue";
import { useStudioStore } from "stores/studio";

/*
 * variables
 */
const rightDrawerOpen = ref(true);

const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, slide, drawerRightTab, isDrawerRightPanelExpanded } =
  storeToRefs(presentationsStore);

const studioStore = useStudioStore();

/*
 * tabs
 */
const drawerRightTabs = computed(() => {
  return [
    {
      name: PRESENTATION_TABS.TYPE,
      icon: "r_extension",
      label: t("presentationLayout.rightDrawer.tabs.types.label"),
      title: t("presentationLayout.rightDrawer.tabs.types.title"),
    },
    {
      name: PRESENTATION_TABS.SETTINGS,
      icon: "r_tune",
      label: t("presentationLayout.rightDrawer.tabs.settings.label"),
      title: t("presentationLayout.rightDrawer.tabs.settings.title"),
      hidden: ![
        ...SLIDE_TYPES_OF_QUIZ,
        SLIDE_TYPES.WORD_CLOUD,
        SLIDE_TYPES.LEADERBOARD,
      ].includes(slide.value?.type),
    },
    {
      name: PRESENTATION_TABS.LAYERS,
      icon: "r_layers",
      label: t("presentationLayout.rightDrawer.tabs.layers.label"),
      title: t("presentationLayout.rightDrawer.tabs.layers.title"),
      hidden: slide.value?.type !== SLIDE_TYPES.CONTENT,
    },
    {
      name: PRESENTATION_TABS.DESIGN,
      icon: "r_format_paint",
      label: t("presentationLayout.rightDrawer.tabs.design.label"),
      title: t("presentationLayout.rightDrawer.tabs.design.title"),
    },
    {
      name: PRESENTATION_TABS.TEMPLATE,
      icon: "r_grid_view",
      label: t("presentationLayout.rightDrawer.tabs.templates.label"),
      title: t("presentationLayout.rightDrawer.tabs.templates.title"),
      hidden: slide.value?.type !== SLIDE_TYPES.CONTENT,
      disable: true,
    },
    {
      name: PRESENTATION_TABS.AUDIO,
      icon: "r_graphic_eq",
      label: t("presentationLayout.rightDrawer.tabs.audio.label"),
      title: t("presentationLayout.rightDrawer.tabs.audio.title"),
      disable: true,
    },
  ];
});

/*
 * handle tab selection
 */
watch(
  () => slide.value,
  () => {
    handleTabSelect();
  },
);

onBeforeMount(() => {
  handleTabSelect();
});

const handleTabSelect = () => {
  if (slide.value?.type) {
    if ([SLIDE_TYPES.CONTENT].includes(slide.value.type)) {
      drawerRightTab.value = drawerRightTabs.value[0].name;
    } else {
      drawerRightTab.value = drawerRightTabs.value[1].name;
    }
  }
};

watch(
  () => isDrawerRightPanelExpanded.value,
  () => {
    setTimeout(() => {
      studioStore.fitStageIntoParentContainer();
    });
  },
);

/*
 * change slide type
 */
const handleChangingSlideType = async (type) => {
  if (type === slide.value?.type) return;

  slide.value.type = type;
  slide.value.canvas_data = null;
  await studioStore.loadStudio();
  await studioStore.handleSlideUpdate();
};
</script>

<style scoped lang="scss">
/*
 * tabs
 */
::v-deep(.presentation_studio__layout__drawer_right) {
  .presentation_studio__layout__drawer_right__content {
    width: 384px;
    overflow-y: scroll;
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
    border-radius: 6px !important;
    overflow: hidden;
    margin-bottom: 8px;
    border: 1px solid transparent;

    &:hover {
      border: 1px solid $accent;
      background: $background;
    }

    .q-tab__indicator,
    .q-focus-helper {
      display: none;
    }

    &.q-tab--active {
      color: $secondary;
      background: $background;
      border: 1px solid $accent;
    }
  }
}
</style>
