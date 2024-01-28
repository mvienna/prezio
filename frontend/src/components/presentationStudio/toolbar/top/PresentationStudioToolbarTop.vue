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
          class="row no-wrap items-center q-gutter-sm hide-scrollbar"
          style="width: 100%; overflow-x: scroll"
        >
          <!-- drawing customization -->
          <PresentationStudioToolbarTopCustomizationDrawing
            v-if="
              mode === MODE_OPTIONS.DRAWING ||
              (transformer.default?.nodes()?.length &&
                transformer.default
                  ?.nodes()
                  .filter(
                    (node) => node.getAttr('name') === MODE_OPTIONS.DRAWING,
                  )?.length === transformer.default?.nodes()?.length)
            "
          />

          <!-- text customization -->
          <PresentationStudioToolbarTopCustomizationText
            v-if="
              transformer.default?.nodes()?.length &&
              transformer.default
                ?.nodes()
                ?.filter((node) => node.getAttr('name') === MODE_OPTIONS.TEXT)
                ?.length === transformer.default?.nodes()?.length
            "
          />

          <!-- shape customization -->
          <PresentationStudioToolbarTopCustomizationShape
            v-if="
              (transformer.default?.nodes()?.length &&
                transformer.default
                  ?.nodes()
                  ?.filter(
                    (node) => node.getAttr('name') === MODE_OPTIONS.SHAPE,
                  )?.length === transformer.default?.nodes()?.length) ||
              transformer.custom.shape.node
            "
          />

          <!-- image customization -->
          <PresentationStudioToolbarTopCustomizationImage
            v-if="
              transformer.default?.nodes()?.length &&
              transformer.default
                ?.nodes()
                .filter((node) => node.getAttr('name') === MODE_OPTIONS.IMAGE)
                ?.length === transformer.default?.nodes()?.length
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
      <!--            (![MODE_OPTIONS.EMOJI, MODE_OPTIONS.MEDIA].includes(mode) ||-->
      <!--              (MODE_OPTIONS.MEDIA === mode && selectedElement))-->
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

      <q-space />

      <div class="row no-wrap">
        <!-- zoom out -->
        <q-btn
          icon="r_zoom_out"
          round
          size="12px"
          unelevated
          @click="
            studioStore.setZoom(
              ((stages.default.scale().x /
                stages.default.container().getBoundingClientRect().width) *
                scene.width) /
                zoom.coefficient,
            )
          "
        >
          <q-tooltip>
            {{ $t("presentationStudio.toolbar.zoom.out") }}
          </q-tooltip>
        </q-btn>

        <!-- current zoom -->
        <q-btn
          :label="`${Math.round(stages.default.scale().x * 100)}%`"
          unelevated
        >
          <q-tooltip>
            {{ $t("presentationStudio.toolbar.zoom.select") }}
          </q-tooltip>

          <q-menu
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[0, 8]"
          >
            <q-item
              v-for="option in zoom.OPTIONS"
              :key="option"
              clickable
              dense
              class="items-center justify-center"
              @click="studioStore.setZoom(option)"
            >
              {{
                Math.round(
                  ((option *
                    stages.default.container().getBoundingClientRect().width) /
                    scene.width) *
                    100,
                )
              }}%
            </q-item>
          </q-menu>
        </q-btn>

        <!-- zoom in -->
        <q-btn
          icon="r_zoom_in"
          round
          size="12px"
          unelevated
          @click="
            studioStore.setZoom(
              (stages.default.scale().x /
                stages.default.container().getBoundingClientRect().width) *
                scene.width *
                zoom.coefficient,
            )
          "
        >
          <q-tooltip>
            {{ $t("presentationStudio.toolbar.zoom.in") }}
          </q-tooltip>
        </q-btn>
      </div>
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
import PresentationStudioToolbarTopCustomizationShape from "components/presentationStudio/toolbar/top/customization/PresentationStudioToolbarTopCustomizationShape.vue";
import PresentationStudioToolbarTopCustomizationText from "components/presentationStudio/toolbar/top/customization/PresentationStudioToolbarTopCustomizationText.vue";

/*
 * variables
 */
const $q = useQuasar();

/*
 * stores
 */
const studioStore = useStudioStore();
const { mode, MODE_OPTIONS, transformer, zoom, stages, scene } =
  storeToRefs(studioStore);

const presentationsStore = usePresentationsStore();
const { presentation, slide, isDrawerRightPanelExpanded } =
  storeToRefs(presentationsStore);

const switchMode = (value) => {
  mode.value = value;
};

const showModes = computed(() => {
  return (
    !mode.value &&
    !transformer.value.default?.nodes()?.length &&
    !transformer.value.custom.shape.node
  );
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
</style>
