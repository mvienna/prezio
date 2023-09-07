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
          class="layer bg-grey-2 cursor-pointer"
          :class="element.id === selectedElement?.id ? 'layer--active' : ''"
        >
          <q-card-section class="row no-wrap items-center">
            <!-- drag handle -->
            <q-icon
              name="drag_indicator"
              color="grey"
              size="sm"
              class="layer_handle"
            />

            <!-- layer name -->
            <span class="text-semibold q-pl-md" @click="selectElement(element)">
              {{
                $t(
                  `presentationLayout.rightDrawer.layers.names.${element.mode}`
                )
              }}
            </span>

            <q-space />

            <!-- delete button -->
            <q-btn
              icon="delete"
              flat
              round
              color="red"
              size="10px"
              @click="deleteElement(element)"
            />
          </q-card-section>
        </q-card>
      </template>
    </draggable>

    <q-card v-else flat class="layer layer--disabled bg-grey-2">
      <q-card-section class="row no-wrap items-center">
        <!-- drag handle -->
        <q-icon
          name="drag_indicator"
          color="grey"
          size="sm"
          class="layer_handle"
        />

        <!-- layer name -->
        <span class="text-semibold q-pl-md">
          {{ $t("presentationLayout.rightDrawer.layers.layer.title") }}
        </span>

        <q-space />

        <!-- delete button -->
        <q-btn icon="delete" flat round color="red" size="10px" />
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

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { elements, selectedElement } = storeToRefs(canvasStore);

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
  border: 1px solid transparent;
  outline: 3px solid transparent;
  transition: 0.2s;

  span {
    width: 100%;
    line-height: 30px;
  }
}

.layer--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.layer--active {
  border: 1px solid $primary;
  outline: 3px solid $blue-2;

  color: $primary;
}
</style>
