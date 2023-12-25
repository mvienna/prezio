<template>
  <div>
    <draggable
      v-if="elements.length"
      v-model="elements"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        class: 'column no-wrap q-gutter-md',
      }"
      v-bind="layersDraggingOptions"
      item-key="id"
      handle=".layer_handle"
      @start="handleStartDragging"
      @end="handleLayersReorder"
      @reordered="handleLayersReorder"
    >
      <template #item="{ element }">
        <q-card
          flat
          class="layer cursor-pointer no-scroll"
          :class="`${
            element.id === selectedElement?.id ? 'layer--active' : ''
          } ${
            [MODE_OPTIONS.background, MODE_OPTIONS.baseFill].includes(
              element.mode
            )
              ? 'layer--background'
              : ''
          }`"
        >
          <!-- slide background / base fill -->
          <div
            v-if="
              [MODE_OPTIONS.background, MODE_OPTIONS.baseFill].includes(
                element.mode
              )
            "
            class="layer__background"
            :style="`${
              element.mode === MODE_OPTIONS.background
                ? `background: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${
                    elements.find(
                      (item) => item.mode === MODE_OPTIONS.background
                    ).imageSrc
                  }); filter: opacity(${element.opacity}%) blur(${
                    element.blur
                  }px) contrast(${element.contrast}%) brightness(${
                    element.brightness
                  }%) invert(${element.invert}%) grayscale(${
                    element.grayscale
                  }%);`
                : element.mode === MODE_OPTIONS.baseFill
                ? `background: ${
                    elements.find((item) => item.mode === MODE_OPTIONS.baseFill)
                      .fillColor
                  };`
                : ''
            }`"
          ></div>

          <q-card-section
            class="row no-wrap items-center q-py-none relative-position"
          >
            <!-- drag handle -->
            <q-icon
              v-if="
                [MODE_OPTIONS.background, MODE_OPTIONS.baseFill].includes(
                  element.mode
                )
              "
              name="r_drag_indicator"
              color="black"
              size="sm"
              class="layer_handle--disabled"
            />
            <q-icon
              v-else
              name="r_drag_indicator"
              color="grey"
              size="sm"
              class="layer_handle"
            />

            <!-- layer name -->
            <span
              class="text-semibold q-pl-md q-py-sm q-my-xs"
              :style="
                element.mode === MODE_OPTIONS.baseFill
                  ? `color: ${textColorOnAColoredBackground(
                      element.fillColor
                    )};`
                  : ''
              "
              @click="!element.isLocked ? selectElement(element) : ''"
            >
              {{
                $t(
                  `presentationLayout.rightDrawer.tabs.layers.names.${element.mode}`
                )
              }}
            </span>

            <q-space />

            <!-- visibility button -->
            <q-btn
              v-if="
                ![MODE_OPTIONS.background, MODE_OPTIONS.baseFill].includes(
                  element.mode
                )
              "
              :icon="element.isVisible ? 'r_visibility' : 'r_visibility_off'"
              flat
              round
              color="grey"
              size="10px"
              class="q-ml-sm"
              @click="
                element.isVisible = !element.isVisible;
                canvasStore.redrawCanvas();
              "
            >
              <q-tooltip>
                {{
                  $t(
                    `presentationLayout.rightDrawer.tabs.layers.layer.visibility.${
                      element.isVisible ? "on" : "off"
                    }`
                  )
                }}
              </q-tooltip>
            </q-btn>

            <!-- lock button -->
            <q-btn
              v-if="
                ![MODE_OPTIONS.background, MODE_OPTIONS.baseFill].includes(
                  element.mode
                )
              "
              :icon="element.isLocked ? 'r_lock' : 'r_lock_open'"
              flat
              round
              color="grey"
              size="10px"
              class="q-ml-sm"
              @click="element.isLocked = !element.isLocked"
            >
              <q-tooltip>
                {{
                  $t(
                    `presentationLayout.rightDrawer.tabs.layers.layer.lock.${
                      element.isLocked ? "off" : "on"
                    }`
                  )
                }}
              </q-tooltip>
            </q-btn>

            <!-- delete button -->
            <q-btn
              v-if="
                ![MODE_OPTIONS.background, MODE_OPTIONS.baseFill].includes(
                  element.mode
                )
              "
              icon="r_delete"
              flat
              round
              color="red"
              size="10px"
              class="q-ml-sm"
              @click="deleteElement(element)"
            >
              <q-tooltip>
                {{
                  $t("presentationLayout.rightDrawer.tabs.layers.layer.delete")
                }}
              </q-tooltip>
            </q-btn>
          </q-card-section>
        </q-card>
      </template>
    </draggable>

    <q-card v-else flat class="layer layer--disabled bg-grey-2">
      <q-card-section class="row no-wrap items-center q-py-none">
        <!-- drag handle -->
        <q-icon
          name="r_drag_indicator"
          color="grey"
          size="sm"
          class="layer_handle"
        />

        <!-- layer name -->
        <span class="text-semibold q-pl-md q-py-sm q-my-xs">
          {{ $t("presentationLayout.rightDrawer.tabs.layers.layer.title") }}
        </span>

        <q-space />

        <!-- visibility button -->
        <q-btn
          icon="r_visibility"
          class="q-ml-sm"
          flat
          round
          color="grey"
          size="10px"
        />

        <!-- disable button -->
        <q-btn
          icon="r_lock_open"
          class="q-ml-sm"
          flat
          round
          color="grey"
          size="10px"
        />

        <!-- delete button -->
        <q-btn
          icon="r_delete"
          class="q-ml-sm"
          flat
          round
          color="red"
          size="10px"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import draggable from "vuedraggable/src/vuedraggable";
import { deleteElement, selectElement } from "stores/canvas/helpers/select";
import { textColorOnAColoredBackground } from "src/helpers/colorUtils";
import { usePresentationsStore } from "stores/presentations";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { elements, selectedElement, MODE_OPTIONS } = storeToRefs(canvasStore);

const presentationsStore = usePresentationsStore();
const { slide } = storeToRefs(presentationsStore);

/*
 * drag
 */
const isLayerDragging = ref(false);
const layersDraggingOptions = ref({
  animation: 200,
  group: "attributes",
  direction: "vertical",
  disabled: false,
  ghostClass: "ghost",
});

const handleStartDragging = () => {
  isLayerDragging.value = true;
};

const handleEndDragging = () => {
  isLayerDragging.value = false;
};

const handleLayersReorder = async () => {
  handleEndDragging();

  // re-select element after updating elements (otherwise index might be lost)
  selectElement(selectedElement.value);

  // redraw canvas with updated layers
  canvasStore.redrawCanvas();
};
</script>

<style scoped lang="scss">
.layer {
  background: $grey-2;
  border: 1.5px solid transparent;
  outline: 3px solid transparent;
  transition: 0.2s;

  span {
    width: 100%;
    line-height: 30px;
  }

  .layer_handle {
    cursor: grab;
  }

  &.layer--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.layer--active {
    border: 1.5px solid $primary;
    outline: 3px solid $background;

    color: $primary;
  }

  &.layer--background {
    cursor: default !important;
    color: $white;

    .layer_handle--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .q-card__section {
      background-size: cover !important;
      background-repeat: no-repeat !important;
    }
  }
}

.layer__background {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 8px !important;
  background-size: cover !important;
}
</style>
