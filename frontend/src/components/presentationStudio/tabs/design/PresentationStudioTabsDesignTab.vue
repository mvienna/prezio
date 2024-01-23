<template>
  <div class="column no-wrap">
    <q-tabs
      v-model="tab"
      align="justify"
      inline-label
      dense
      class="q-mx-md q-mt-md q-mb-xs"
    >
      <q-tab
        name="design"
        :label="$t('presentationLayout.rightDrawer.tabs.design.tabs.design')"
        no-caps
        :ripple="false"
        class="q-mr-xs"
      />
      <q-tab
        name="themes"
        :label="$t('presentationLayout.rightDrawer.tabs.design.tabs.themes')"
        no-caps
        :ripple="false"
        class="q-ml-xs"
      />
    </q-tabs>

    <q-tab-panels v-model="tab">
      <!-- design -->
      <q-tab-panel name="design" class="q-pa-md" style="overflow-x: hidden">
        <!-- base fill -->
        <PresentationStudioTabsDesignTabBaseFill />

        <!-- selected background -->
        <PresentationStudioTabsDesignTabSelectedBackground />

        <q-separator class="q-my-lg" />

        <!-- text -->
        <PresentationStudioTabsDesignTabText />

        <q-separator class="q-my-lg" />

        <!-- apply design to all slides -->
        <div class="row justify-center">
          <q-btn
            unelevated
            no-caps
            icon="r_copy_all"
            text-color="black"
            class="bg-grey-2"
            :label="
              $t(
                'presentationLayout.rightDrawer.tabs.design.applyToAllSlides.title'
              )
            "
            @click="showApplyDesignToAllSlidesDialog = true"
          />
        </div>

        <q-dialog v-model="showApplyDesignToAllSlidesDialog">
          <ConfirmationDialog
            icon="r_copy_all"
            icon-color="primary"
            :title="
              $t(
                'presentationLayout.rightDrawer.tabs.design.applyToAllSlides.confirmation.title'
              )
            "
            :message="
              $t(
                'presentationLayout.rightDrawer.tabs.design.applyToAllSlides.confirmation.message'
              )
            "
            confirm-btn-color="primary"
            @cancel="showApplyDesignToAllSlidesDialog = false"
            @confirm="
              studioStore.applyDesignToAllSlides();
              showApplyDesignToAllSlidesDialog = false;
            "
          />
        </q-dialog>

        <!-- reset slide design -->
        <div
          class="text-center text-grey-9 q-mt-sm q-mb-sm link"
          @click="showResetDesignDialog = true"
        >
          {{ $t("presentationLayout.rightDrawer.tabs.design.reset.title") }}
        </div>

        <q-dialog v-model="showResetDesignDialog">
          <ConfirmationDialog
            icon="r_restart_alt"
            icon-color="primary"
            :title="
              $t(
                'presentationLayout.rightDrawer.tabs.design.reset.confirmation.title'
              )
            "
            :message="
              $t(
                'presentationLayout.rightDrawer.tabs.design.reset.confirmation.message'
              )
            "
            confirm-btn-color="primary"
            @cancel="showResetDesignDialog = false"
            @confirm="
              resetSlideDesign();
              showResetDesignDialog = false;
            "
          />
        </q-dialog>
      </q-tab-panel>

      <!-- themes -->
      <q-tab-panel name="themes" class="q-pa-none">
        <PresentationStudioTabsDesignTabThemes />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";
import PresentationStudioTabsDesignTabThemes from "components/presentationStudio/tabs/design/PresentationStudioTabsDesignTabThemes.vue";
import PresentationStudioTabsDesignTabBaseFill from "components/presentationStudio/tabs/design/PresentationStudioTabsDesignTabBaseFill.vue";
import PresentationStudioTabsDesignTabSelectedBackground from "components/presentationStudio/tabs/design/PresentationStudioTabsDesignTabSelectedBackground.vue";
import { usePresentationsStore } from "stores/presentations";
import PresentationStudioTabsDesignTabText from "components/presentationStudio/tabs/design/PresentationStudioTabsDesignTabText.vue";
import { useStudioStore } from "stores/studio";
import { COLOR_PALETTE } from "src/constants/canvas/canvasVariables";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, slide, averageBackgroundBrightness } =
  storeToRefs(presentationsStore);

const studioStore = useStudioStore();
const { layers } = storeToRefs(studioStore);

/*
 * tabs
 */
const tab = ref("design");

/*
 * reset design
 */
const showResetDesignDialog = ref(false);

const resetSlideDesign = () => {
  const baseBackground = layers.value.base?.findOne(".baseBackground");
  if (baseBackground) {
    studioStore.deleteNodes([baseBackground]);
  }

  studioStore.updateBaseLayer(COLOR_PALETTE.WHITE);
};

/*
 * apply slide design to all slides
 */
const showApplyDesignToAllSlidesDialog = ref(false);
</script>

<style scoped lang="scss">
::v-deep(.q-tabs) {
  padding: 4px;
  border-radius: 6px;
}

::v-deep(.q-tab) {
  width: 50%;
  border-radius: 6px;
  overflow: hidden;

  &.q-tab--active {
    .q-tab__label {
      font-weight: 600;
      color: $secondary;
    }
  }
}

::v-deep(.q-tab__content) {
  z-index: 2;
}

::v-deep(.q-tab__indicator) {
  background: $blue-1;
  height: 100%;
  z-index: 1;

  transition: none !important;
}
</style>
