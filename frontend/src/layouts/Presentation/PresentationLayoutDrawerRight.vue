<template>
  <q-drawer
    v-model="rightDrawerOpen"
    show-if-above
    side="right"
    class="bg-white scroll--hidden"
    :width="400"
  >
    <q-tabs
      v-model="rightDrawerTab"
      align="justify"
      indicator-color="primary"
      class="bg-white text-black text-white drawer_header"
      inline-label
    >
      <q-tab
        v-for="tab in rightDrawerTabs"
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
      <!-- layers -->
      <q-tab-panel name="layers">
        <div class="text-h6 q-pb-md">
          {{ $t("presentationLayout.rightDrawer.tabs.layers.title") }}
        </div>

        <PresentationStudioTabsLayersManagementTab />
      </q-tab-panel>

      <!-- design -->
      <q-tab-panel name="design">
        <div class="text-h6 q-pb-md">
          {{ $t("presentationLayout.rightDrawer.tabs.design.title") }}
        </div>

        <PresentationStudioTabsDesignTab />
      </q-tab-panel>

      <!-- template -->
      <q-tab-panel name="template">
        <div class="text-h6 q-pb-md">
          {{ $t("presentationLayout.rightDrawer.tabs.template.title") }}
        </div>
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
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { useI18n } from "vue-i18n";
import PresentationStudioTabsLayersManagementTab from "components/presentation/studio/tabs/PresentationStudioTabsLayersManagementTab.vue";
import PresentationStudioTabsDesignTab from "components/presentation/studio/tabs/PresentationStudioTabsDesignTab.vue";

/*
 * variables
 */
const rightDrawerOpen = ref(true);

const { t } = useI18n({ useScope: "global" });

/*
 * presentation store
 */
const presentationStore = usePresentationsStore();
const { presentation } = storeToRefs(presentationStore);

/*
 * tabs
 */
const rightDrawerTabs = [
  {
    name: "layers",
    icon: "r_layers",
    label: t("presentationLayout.rightDrawer.tabs.layers.title"),
  },
  {
    name: "design",
    icon: "r_format_paint",
    label: t("presentationLayout.rightDrawer.tabs.design.title"),
  },
  {
    name: "template",
    icon: "r_grid_view",
    label: t("presentationLayout.rightDrawer.tabs.template.title"),
    disable: true,
  },
  {
    name: "audio",
    icon: "r_graphic_eq",
    label: t("presentationLayout.rightDrawer.tabs.audio.title"),
    disable: true,
  },
];
const rightDrawerTab = ref(rightDrawerTabs[0].name);
</script>

<style scoped lang="scss">
/*
 * tabs
 */
::v-deep(.q-tab) {
  color: $grey-5;
  height: 50px;

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

.drawer_header {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
