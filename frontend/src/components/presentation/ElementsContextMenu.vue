<template>
  <q-card
    :style="`top: ${y}px; left: ${x}px; z-index: 999; position: fixed;`"
    bordered
    flat
    class="row no-wrap"
  >
    <!-- deselect element -->
    <q-btn
      icon="r_done"
      round
      flat
      size="10px"
      color="grey"
      @click="deselectElement()"
    />

    <!-- delete element -->
    <q-btn
      icon="r_delete"
      color="red"
      round
      flat
      size="10px"
      @click="deleteElement()"
    />

    <q-separator vertical />

    <!-- more actions -->
    <q-btn icon="r_arrow_forward_ios" round color="grey" flat size="10px">
      <q-menu
        anchor="top right"
        self="top start"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[8, 8]"
        class="q-pa-sm"
        style="width: 324px"
      >
        <!-- copy -->
        <q-item
          class="items-center q-py-sm"
          clickable
          dense
          @click="copy()"
          v-close-popup
        >
          <q-icon name="r_copy" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentation.elementsContextMenu.copy") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>^</div>
            <div>C</div>
          </div>
        </q-item>

        <!-- cut -->
        <q-item
          class="items-center q-py-sm"
          clickable
          dense
          @click="cut()"
          v-close-popup
        >
          <q-icon name="r_cut" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentation.elementsContextMenu.cut") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>^</div>
            <div>X</div>
          </div>
        </q-item>

        <!-- duplicate -->
        <q-item
          class="items-center q-py-sm"
          clickable
          dense
          @click="duplicate()"
          v-close-popup
        >
          <q-icon name="r_dynamic_feed" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentation.elementsContextMenu.duplicate") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>^</div>
            <div>D</div>
          </div>
        </q-item>

        <q-separator class="q-my-sm" />

        <!-- move up-->
        <q-item
          v-if="selectedElementIndex !== 0"
          class="items-center q-py-sm text-grey"
          clickable
          dense
          v-close-popup
          @click="moveLayer(undefined, 1)"
        >
          <q-icon name="r_north" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentation.elementsContextMenu.moveUp") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>^</div>
            <div>↑</div>
          </div>
        </q-item>

        <!-- move to the top-->
        <q-item
          v-if="selectedElementIndex !== 0"
          class="items-center q-py-sm"
          clickable
          dense
          v-close-popup
          @click="moveLayerToTheTop()"
        >
          <q-icon name="r_vertical_align_top" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentation.elementsContextMenu.moveToTheTop") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>^</div>
            <div>⇧</div>
            <div>↑</div>
          </div>
        </q-item>

        <!-- move down -->
        <q-item
          v-if="selectedElementIndex !== elements.length - 1"
          class="items-center q-py-sm text-grey"
          clickable
          dense
          v-close-popup
          @click="moveLayer(undefined, -1)"
        >
          <q-icon name="r_south" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentation.elementsContextMenu.moveDown") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>^</div>
            <div>↓</div>
          </div>
        </q-item>

        <!-- move to the bottom -->
        <q-item
          v-if="selectedElementIndex !== elements.length - 1"
          class="items-center q-py-sm"
          clickable
          dense
          v-close-popup
          @click="moveLayerToTheBottom()"
        >
          <q-icon name="r_vertical_align_bottom" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentation.elementsContextMenu.moveToTheBottom") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>^</div>
            <div>⇧</div>
            <div>↓</div>
          </div>
        </q-item>

        <q-separator class="q-my-sm" />

        <!-- delete -->
        <q-item
          class="items-center q-py-sm text-red"
          clickable
          dense
          v-close-popup
          @click="deleteElement()"
        >
          <q-icon name="r_delete" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentation.elementsContextMenu.delete") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div>⌫</div>
          </div>
        </q-item>
      </q-menu>
    </q-btn>
  </q-card>
</template>

<script setup>
import { deleteElement, deselectElement } from "stores/canvas/helpers/select";
import {
  copy,
  cut,
  duplicate,
  moveLayer,
  moveLayerToTheBottom,
  moveLayerToTheTop,
} from "stores/canvas/helpers/elementsContextMenuActions";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { computed } from "vue";

/*
 * variables
 */
const $q = useQuasar();

/*
 * context menu position
 */
defineProps({
  x: { type: Number },
  y: { type: Number },
});

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { elements, selectedElementIndex } = storeToRefs(canvasStore);

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
.q-item {
  border-radius: 6px !important;
}

.q-btn {
  border-radius: 0;
}

.shortcut {
  div {
    background: $grey-2;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 12px;
    color: $black;
  }
}
</style>
