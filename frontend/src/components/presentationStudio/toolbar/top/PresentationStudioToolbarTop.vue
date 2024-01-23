<template>
  <div
    class="presentation_toolbar__top bg-white row items-center no-wrap"
    style="padding: 9.5px 16px"
    :style="
      isDrawerRightPanelExpanded
        ? 'width: calc(100% + 471px);'
        : 'width: calc(100% + 110px);'
    "
  >
    <template v-if="slide?.type === SLIDE_TYPES.CONTENT">
      <!-- modes -->
      <PresentationStudioToolbarTopModes
        v-if="showModes"
        @switch-mode="switchMode($event)"
      />

      <template v-else>
        <!-- modes customization -->
        <q-btn
          icon="r_close"
          unelevated
          text-color="black"
          round
          size="12px"
          @click="
            switchMode(null);
            studioStore.deselectElements();
          "
        />

        <div class="row items-center q-mx-sm">
          <q-separator vertical style="height: 24px" />
        </div>

        <div
          class="row no-wrap items-center q-gutter-sm scroll--hidden"
          style="width: 100%; overflow-x: scroll"
        >
          <!-- drawing customization -->
          <PresentationStudioToolbarTopCustomizationDrawing
            v-if="
              mode === MODE_OPTIONS.drawing ||
              (transformer.default?.nodes()?.length &&
                transformer.default
                  ?.nodes()
                  .filter((node) => node.getClassName() === 'Line')?.length ===
                  transformer.default?.nodes()?.length)
            "
          />

          <!--          &lt;!&ndash; text customization &ndash;&gt;-->
          <!--          <PresentationStudioToolbarTopCustomizationText-->
          <!--            v-if="[MODE_OPTIONS.text, MODE_OPTIONS.textEditing].includes(mode)"-->
          <!--          />-->

          <!--          &lt;!&ndash; shape customization &ndash;&gt;-->
          <!--          <PresentationStudioToolbarTopCustomizationShape-->
          <!--            v-if="mode === MODE_OPTIONS.shape"-->
          <!--          />-->

          <!-- media customization -->
          <PresentationStudioToolbarTopCustomizationImage
            v-if="
              transformer.default?.nodes()?.length &&
              transformer.default
                ?.nodes()
                .filter((node) => node.getClassName() === 'Image')?.length ===
                transformer.default?.nodes()?.length
            "
          />
        </div>
      </template>

      <!--      &lt;!&ndash; open design tab & choose wallpaper dialog &ndash;&gt;-->
      <!--      <template-->
      <!--        v-if="-->
      <!--          slide?.type === SLIDE_TYPES.CONTENT &&-->
      <!--          !(-->
      <!--            mode &&-->
      <!--            (![MODE_OPTIONS.mediaEmoji, MODE_OPTIONS.media].includes(mode) ||-->
      <!--              (MODE_OPTIONS.media === mode && selectedElement))-->
      <!--          )-->
      <!--        "-->
      <!--      >-->
      <!--        <q-separator vertical class="q-mx-sm" />-->

      <!--        <q-btn-->
      <!--          icon="r_wallpaper"-->
      <!--          unelevated-->
      <!--          text-color="black"-->
      <!--          round-->
      <!--          size="12px"-->
      <!--          @click="-->
      <!--            drawerRightTab = PRESENTATION_TABS.DESIGN;-->
      <!--            showSelectBackgroundDialog = true;-->
      <!--          "-->
      <!--        >-->
      <!--          <q-tooltip>-->
      <!--            {{ $t("presentationStudio.toolbar.changeBackground.title") }}-->
      <!--          </q-tooltip>-->
      <!--        </q-btn>-->
      <!--      </template>-->
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import PresentationStudioToolbarTopCustomizationDrawing from "components/presentationStudio/toolbar/top/customization/PresentationStudioToolbarTopCustomizationDrawing.vue";
import PresentationStudioToolbarTopModes from "components/presentationStudio/toolbar/top/PresentationStudioToolbarTopModes.vue";
import { useQuasar } from "quasar";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { usePresentationsStore } from "stores/presentations";
import { useStudioStore } from "stores/studio";
import PresentationStudioToolbarTopCustomizationImage from "components/presentationStudio/toolbar/top/customization/PresentationStudioToolbarTopCustomizationImage.vue";

/*
 * variables
 */
const $q = useQuasar();

/*
 * stores
 */
const studioStore = useStudioStore();
const { mode, MODE_OPTIONS, transformer } = storeToRefs(studioStore);

const presentationsStore = usePresentationsStore();
const { presentation, slide, isDrawerRightPanelExpanded } =
  storeToRefs(presentationsStore);

const switchMode = (value) => {
  mode.value = value;
};

const showModes = computed(() => {
  return !mode.value && !transformer.value.default?.nodes()?.length;
});

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

<style scoped lang="scss">
.presentation_toolbar__top {
  position: absolute;
  z-index: 1001;
  top: 0;
  left: 0;
  height: 55px;
  border-bottom: 1px solid $grey-2;
}

::v-deep(.q-field--dense .q-field__marginal) {
  height: 36px;
}

::v-deep(.q-field--auto-height.q-field--dense) {
  .q-field__control,
  .q-field__native {
    min-height: 36px;
  }
}
</style>
