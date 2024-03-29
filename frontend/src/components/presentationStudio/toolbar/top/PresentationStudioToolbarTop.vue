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
                .filter((node) =>
                  [MODE_OPTIONS.IMAGE, MODE_OPTIONS.GIF].includes(
                    node.getAttr('name'),
                  ),
                )?.length === transformer.default?.nodes()?.length
            "
          />
        </div>
      </template>

      <q-space />

      <!-- clear formatting -->
      <template v-if="transformer.default?.nodes()?.length">
        <q-btn
          flat
          no-caps
          no-wrap
          size="12px"
          :label="$t('presentationStudio.toolbar.resetCustomization.title')"
          @click="handleCustomizationReset()"
        >
          <q-tooltip
            :offset="[0, 4]"
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down"
          >
            {{ $t("presentationStudio.toolbar.resetCustomization.tooltip") }}
          </q-tooltip>
        </q-btn>

        <q-separator vertical class="q-mx-sm" />

        <!-- position -->
        <q-btn
          flat
          size="12px"
          no-caps
          class="q-mr-sm"
          :label="$t('presentationStudio.toolbar.node.position.title')"
          :ripple="false"
        >
          <q-menu
            anchor="bottom left"
            self="top left"
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[0, 8]"
            class="hide-scrollbar no-padding"
            style="width: 280px"
          >
            <div class="q-pa-md">
              <div class="row justify-between q-pl-sm">
                <div class="col-6 flex-col q-gutter-sm">
                  <!-- left -->
                  <q-btn
                    flat
                    class="bg-grey-2 col-3 full-width"
                    :label="
                      $t(
                        'presentationStudio.toolbar.node.position.options.left',
                      )
                    "
                    align="left"
                    no-wrap
                    no-caps
                    icon="icon-align_justify_flex_start"
                    @click="
                      studioStore.repositionNode(
                        undefined,
                        ALIGNMENT.horizontal.left,
                      )
                    "
                  />

                  <!-- center -->
                  <q-btn
                    flat
                    class="bg-grey-2 full-width"
                    :label="
                      $t(
                        'presentationStudio.toolbar.node.position.options.center',
                      )
                    "
                    align="left"
                    no-wrap
                    no-caps
                    icon="icon-align_horizontal_center"
                    @click="
                      studioStore.repositionNode(
                        undefined,
                        ALIGNMENT.horizontal.center,
                      )
                    "
                  />

                  <!-- right -->
                  <q-btn
                    flat
                    class="bg-grey-2 full-width"
                    :label="
                      $t(
                        'presentationStudio.toolbar.node.position.options.right',
                      )
                    "
                    align="left"
                    no-wrap
                    no-caps
                    icon="icon-align_justify_flex_end"
                    @click="
                      studioStore.repositionNode(
                        undefined,
                        ALIGNMENT.horizontal.right,
                      )
                    "
                  />
                </div>

                <div class="col-6 flex-col q-gutter-sm">
                  <!-- top -->
                  <q-btn
                    flat
                    class="bg-grey-2 full-width"
                    :label="
                      $t('presentationStudio.toolbar.node.position.options.top')
                    "
                    align="left"
                    no-wrap
                    no-caps
                    icon="icon-align_flex_start"
                    @click="
                      studioStore.repositionNode(
                        undefined,
                        ALIGNMENT.vertical.top,
                      )
                    "
                  />

                  <!-- center -->
                  <q-btn
                    flat
                    class="bg-grey-2 full-width"
                    :label="
                      $t(
                        'presentationStudio.toolbar.node.position.options.middle',
                      )
                    "
                    align="left"
                    no-wrap
                    no-caps
                    icon="icon-align_vertical_center"
                    @click="
                      studioStore.repositionNode(
                        undefined,
                        ALIGNMENT.vertical.middle,
                      )
                    "
                  />

                  <!-- bottom -->
                  <q-btn
                    flat
                    class="bg-grey-2 full-width"
                    :label="
                      $t(
                        'presentationStudio.toolbar.node.position.options.bottom',
                      )
                    "
                    align="left"
                    no-wrap
                    no-caps
                    icon="icon-align_flex_end"
                    @click="
                      studioStore.repositionNode(
                        undefined,
                        ALIGNMENT.vertical.bottom,
                      )
                    "
                  />
                </div>
              </div>
            </div>
          </q-menu>
        </q-btn>
      </template>

      <!-- open design tab & choose wallpaper dialog -->
      <q-btn
        icon="r_wallpaper"
        unelevated
        text-color="black"
        round
        size="12px"
        @click="
          drawerRightTab = PRESENTATION_TABS.DESIGN;
          showSelectBackgroundDialog = true;
        "
      >
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          transition-show="jump-up"
          transition-hide="jump-down"
        >
          {{ $t("presentationStudio.toolbar.changeBackground.title") }}
        </q-tooltip>
      </q-btn>

      <q-separator vertical class="q-mx-sm" />

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
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down"
          >
            {{ $t("presentationStudio.toolbar.zoom.out") }}
          </q-tooltip>
        </q-btn>

        <!-- current zoom -->
        <q-btn
          :label="`${Math.round(stages.default.scale().x * 100)}%`"
          unelevated
        >
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down"
          >
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
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down"
          >
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
import {
  PRESENTATION_TABS,
  SLIDE_TYPES,
} from "src/constants/presentationStudio";
import { usePresentationsStore } from "stores/presentations";
import { useStudioStore } from "stores/studio";
import PresentationStudioToolbarTopCustomizationImage from "components/presentationStudio/toolbar/top/customization/PresentationStudioToolbarTopCustomizationImage.vue";
import PresentationStudioToolbarTopCustomizationShape from "components/presentationStudio/toolbar/top/customization/PresentationStudioToolbarTopCustomizationShape.vue";
import PresentationStudioToolbarTopCustomizationText from "components/presentationStudio/toolbar/top/customization/PresentationStudioToolbarTopCustomizationText.vue";
import { ALIGNMENT } from "src/constants/canvas/canvasVariables";

/*
 * variables
 */
const $q = useQuasar();

/*
 * stores
 */
const studioStore = useStudioStore();
const {
  mode,
  MODE_OPTIONS,
  transformer,
  zoom,
  stages,
  scene,
  text,
  drawing,
  image,
  shape,
} = storeToRefs(studioStore);

const presentationsStore = usePresentationsStore();
const {
  presentation,
  slide,
  isDrawerRightPanelExpanded,
  drawerRightTab,
  showSelectBackgroundDialog,
} = storeToRefs(presentationsStore);

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
 * reset customization
 */
const handleCustomizationReset = () => {
  transformer.value.default.nodes().forEach((node) => {
    switch (node.getAttr("name")) {
      case MODE_OPTIONS.value.TEXT:
        text.value = { default: text.value.default, ...text.value.default };
        break;

      case MODE_OPTIONS.value.IMAGE:
        image.value = { default: image.value.default, ...image.value.default };
        break;

      case MODE_OPTIONS.value.SHAPE:
        shape.value = { default: shape.value.default, ...shape.value.default };
        break;

      case MODE_OPTIONS.value.DRAWING:
        drawing.value = {
          default: drawing.value.default,
          ...drawing.value.default,
        };
        break;
    }
  });

  studioStore.applyCustomization();
};
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
