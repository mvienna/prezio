<template>
  <div>
    <draggable
      v-if="nodes?.length"
      v-model="nodes"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        class: 'column no-wrap q-gutter-sm',
      }"
      v-bind="layersDraggingOptions"
      item-key="_id"
      handle=".layer__handle"
      @start="handleStartDragging"
      @end="handleEndDragging"
    >
      <template #item="{ element }">
        <q-card
          v-if="Object.values(MODE_OPTIONS).includes(element.getAttr('name'))"
          flat
          class="layer layer__handle cursor-pointer no-scroll"
          :class="`${
            transformer.default
              ?.nodes()
              ?.filter((node) => node._id === element._id)?.length
              ? 'layer--active'
              : ''
          }`"
          :style="!element.visible() ? 'opacity: 0.5;' : ''"
        >
          <q-card-section
            class="row no-wrap items-center q-py-none q-px-sm relative-position"
          >
            <q-icon name="r_drag_indicator" color="black" size="1.25rem" />

            <!-- layer mode icon -->
            <q-icon
              :name="
                element.getAttr('name') === MODE_OPTIONS.DRAWING
                  ? 'r_gesture'
                  : element.getAttr('name') === MODE_OPTIONS.TEXT
                    ? 'icon-insert_text'
                    : element.getAttr('name') === MODE_OPTIONS.IMAGE
                      ? 'o_add_photo_alternate'
                      : element.getAttr('name') === MODE_OPTIONS.EMOJI
                        ? 'icon-add_reaction'
                        : element.getAttr('name') === MODE_OPTIONS.SHAPE
                          ? Object.values(SHAPE_OPTIONS).find(
                              (shape) =>
                                shape.name === element.getAttr('shape'),
                            )?.icon || 'icon-shape_line'
                          : ''
              "
              size="1.25rem"
              class="q-ml-sm"
            />

            <!-- layer name -->
            <span
              class="text-semibold q-ml-sm q-py-xs"
              @click="handleLayerSelection($event, element)"
            >
              {{
                $t(
                  `presentationLayout.rightDrawer.tabs.layers.names.${element
                    .getAttr("name")
                    .toLowerCase()}`,
                )
              }}
            </span>

            <q-space />

            <!-- visibility button -->
            <q-btn
              :icon="element.visible() ? 'r_visibility' : 'r_visibility_off'"
              flat
              round
              size="10px"
              class="round-borders q-ml-xs"
              color="black"
              @click="element.visible(!element.visible())"
            >
              <q-tooltip :offset="[0, 4]">
                {{
                  $t(
                    `presentationLayout.rightDrawer.tabs.layers.layer.visibility.${
                      element.visible() ? "on" : "off"
                    }`,
                  )
                }}
              </q-tooltip>
            </q-btn>

            <!-- lock button -->
            <q-btn
              :icon="element.draggable() ? 'r_lock_open' : 'r_lock'"
              flat
              round
              size="10px"
              class="round-borders q-ml-xs"
              color="black"
              @click="element.draggable(!element.draggable())"
            >
              <q-tooltip :offset="[0, 4]">
                {{
                  $t(
                    `presentationLayout.rightDrawer.tabs.layers.layer.lock.${
                      element.draggable ? "on" : "off"
                    }`,
                  )
                }}
              </q-tooltip>
            </q-btn>

            <!-- delete button -->
            <q-btn
              icon="r_delete"
              flat
              round
              size="10px"
              class="round-borders q-ml-xs"
              color="black"
              @click="studioStore.deleteNodes([element])"
            >
              <q-tooltip :offset="[0, 4]">
                {{
                  $t("presentationLayout.rightDrawer.tabs.layers.layer.delete")
                }}
              </q-tooltip>
            </q-btn>
          </q-card-section>
        </q-card>
      </template>
    </draggable>

    <!-- no elements in layer -->
    <q-card v-else flat class="layer layer--disabled">
      <q-card-section
        class="row no-wrap items-center q-py-none q-px-sm relative-position"
      >
        <q-icon
          name="r_drag_indicator"
          color="black"
          size="1.25rem"
          class="layer_handle cursor-not-allowed"
        />

        <!-- layer name -->
        <span class="text-semibold q-ml-sm q-py-xs">
          {{ $t("presentationLayout.rightDrawer.tabs.layers.layer.title") }}
        </span>

        <q-space />

        <!-- visibility button -->
        <q-btn
          icon="r_visibility"
          class="round-borders q-ml-sm"
          flat
          round
          color="black"
          size="10px"
          disable
        />

        <!-- disable button -->
        <q-btn
          icon="r_lock_open"
          class="round-borders q-ml-sm"
          flat
          round
          color="black"
          size="10px"
          disable
        />

        <!-- delete button -->
        <q-btn
          icon="r_delete"
          flat
          round
          color="black"
          size="10px"
          class="q-ml-sm round-borders"
          disable
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { onBeforeMount, ref } from "vue";
import draggable from "vuedraggable/src/vuedraggable";
import { usePresentationsStore } from "stores/presentations";
import { useStudioStore } from "stores/studio";
import { SHAPE_OPTIONS } from "src/constants/canvas/canvasVariables";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const studioStore = useStudioStore();
const { layers, transformer, selection, MODE_OPTIONS } =
  storeToRefs(studioStore);

const presentationsStore = usePresentationsStore();
const { slide } = storeToRefs(presentationsStore);

/*
 * elements
 */
const nodes = ref([]);

onBeforeMount(() => {
  nodes.value = layers.value.default
    .getChildren(function (node) {
      return Object.values(MODE_OPTIONS.value).includes(node.getAttr("name"));
    })
    .reverse();

  layers.value.default.on("draw", () => {
    nodes.value = layers.value.default
      .getChildren((node) =>
        Object.values(MODE_OPTIONS.value).includes(node.getAttr("name")),
      )
      .reverse();
  });
});

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

  nodes.value.forEach((node, index) => {
    node.setZIndex(nodes.value.length - 1 - index); // reverse the reversed index of nodes array
  });

  transformer.value.default.moveToTop();
};

const handleLayerSelection = (event, element) => {
  if (!element.draggable()) return;

  if (event.shiftKey || event.ctrlKey || event.metaKey) {
    if (
      transformer.value.default
        ?.nodes()
        ?.filter((node) => node._id === element._id)?.length
    ) {
      transformer.value.default?.nodes(
        transformer.value.default
          ?.nodes()
          ?.filter((node) => node._id !== element._id),
      );
    } else {
      const nodes = transformer.value.default?.nodes()?.concat([element]);
      transformer.value.default?.nodes(nodes);
    }
  } else {
    transformer.value.default?.nodes([element]);
  }

  transformer.value.default.moveToTop();
};
</script>

<style scoped lang="scss">
.layer {
  border-radius: 6px;
  transition: 0.2s;
  outline: 1px solid $grey-2;
  overflow: hidden;

  &:hover {
    outline-color: $accent;
  }

  span {
    width: 100%;
    line-height: 30px;
  }

  .layer__handle {
    cursor: grab;
  }

  &.layer--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.layer--active {
    color: $primary;
    background: $background;
    outline-color: $primary;
  }
}
</style>
