<template>
  <q-card
    v-if="!isTransforming"
    :style="`top: ${transformerPosition?.y}px; left: ${transformerPosition?.x}px; z-index: 999; position: fixed;`"
    bordered
    flat
    class="row no-wrap"
  >
    <!-- deselect element -->
    <q-btn
      icon="r_close"
      round
      flat
      size="10px"
      color="grey"
      @click="studioStore.deselectElements()"
    />

    <!-- delete element -->
    <q-btn
      icon="r_delete"
      color="red"
      round
      flat
      size="10px"
      @click="studioStore.deleteNodes()"
    />

    <q-separator vertical />

    <!-- more actions -->
    <q-btn icon="r_arrow_forward_ios" round color="grey" flat size="10px">
      <q-menu
        anchor="top right"
        self="top start"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[8, 0]"
        style="width: 300px"
      >
        <!-- copy -->
        <q-item
          class="items-center"
          clickable
          dense
          @click="studioStore.copyNodes()"
          v-close-popup
        >
          <q-icon name="r_copy" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentationStudio.elementsContextMenu.copy") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>Ctrl</div>
            <div>C</div>
          </div>
        </q-item>

        <!-- cut -->
        <q-item
          class="items-center"
          clickable
          dense
          @click="studioStore.cutNodes()"
          v-close-popup
        >
          <q-icon name="r_cut" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentationStudio.elementsContextMenu.cut") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>Ctrl</div>
            <div>X</div>
          </div>
        </q-item>

        <!-- duplicate -->
        <q-item
          class="items-center"
          clickable
          dense
          @click="studioStore.duplicateNodes()"
          v-close-popup
        >
          <q-icon name="r_dynamic_feed" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentationStudio.elementsContextMenu.duplicate") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>Ctrl</div>
            <div>D</div>
          </div>
        </q-item>

        <template
          v-if="
            transformer.default
              ?.nodes()
              .filter((node) => node.getAttr('name') === MODE_OPTIONS.IMAGE)
              ?.length
          "
        >
          <q-separator class="q-my-sm" />

          <!-- replace -->
          <q-item
            class="items-center"
            clickable
            dense
            @click="showSelectMediaDialog = true"
          >
            <q-icon name="icon-image_edit" class="q-mr-sm" size="xs" />
            <div>
              {{ $t("presentationStudio.elementsContextMenu.replaceImage") }}
            </div>
          </q-item>

          <q-dialog v-model="showSelectMediaDialog">
            <SelectMedia
              @cancel="showSelectMediaDialog = false"
              @select="
                studioStore.replaceImage(
                  undefined,
                  $event?.preview_url ||
                    $event?.original_url ||
                    $event?.urls?.regular,
                );
                showSelectMediaDialog = false;
              "
            />
          </q-dialog>
        </template>

        <q-separator class="q-my-sm" />

        <!-- move up-->
        <q-item
          class="items-center"
          clickable
          dense
          v-close-popup
          @click="studioStore.moveUp()"
        >
          <q-icon name="r_north" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentationStudio.elementsContextMenu.moveUp") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>Ctrl</div>
            <div>↑</div>
          </div>
        </q-item>

        <!-- move to the top-->
        <q-item
          class="items-center"
          clickable
          dense
          v-close-popup
          @click="studioStore.moveToTop()"
        >
          <q-icon name="r_vertical_align_top" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentationStudio.elementsContextMenu.moveToTheTop") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>Ctrl</div>
            <div>⇧</div>
            <div>↑</div>
          </div>
        </q-item>

        <!-- move down -->
        <q-item
          class="items-center"
          clickable
          dense
          v-close-popup
          @click="studioStore.moveDown()"
        >
          <q-icon name="r_south" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentationStudio.elementsContextMenu.moveDown") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>Ctrl</div>
            <div>↓</div>
          </div>
        </q-item>

        <!-- move to the bottom -->
        <q-item
          class="items-center"
          clickable
          dense
          v-close-popup
          @click="studioStore.moveToBottom()"
        >
          <q-icon name="r_vertical_align_bottom" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentationStudio.elementsContextMenu.moveToTheBottom") }}
          </div>

          <q-space />

          <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs">
            <div v-if="isMac">⌘</div>
            <div v-else>Ctrl</div>
            <div>⇧</div>
            <div>↓</div>
          </div>
        </q-item>

        <q-separator class="q-my-sm" />

        <!-- delete -->
        <q-item
          class="items-center text-red"
          clickable
          dense
          v-close-popup
          @click="studioStore.deleteNodes()"
        >
          <q-icon name="r_delete" class="q-mr-sm" size="xs" />
          <div>
            {{ $t("presentationStudio.elementsContextMenu.delete") }}
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
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { computed, ref } from "vue";
import SelectMedia from "components/media/SelectMedia.vue";
import { useStudioStore } from "stores/studio";

/*
 * variables
 */
const $q = useQuasar();

const showSelectMediaDialog = ref(false);

/*
 * stores
 */
const studioStore = useStudioStore();
const { MODE_OPTIONS, transformer, stages, scene, isTransforming } =
  storeToRefs(studioStore);

/*
 * position
 */
const transformerPosition = computed(() => {
  if (transformer.value.default.nodes()?.length) {
    const box = stages.value.default.container().getBoundingClientRect();

    const x = box.left + transformer.value.default.getAbsolutePosition().x;
    const y = box.top + transformer.value.default.getAbsolutePosition().y;
    const width = transformer.value.default.width();
    const height = transformer.value.default.height();
    let rotation = transformer.value.default.rotation();
    if (rotation < 0) rotation += 360;

    const menuWidth = 93;
    const menuHeight = 33;
    const menuOffset = 67;

    if (rotation >= 0 && rotation <= 45)
      return {
        x: x + width / 2 - menuWidth / 2,
        y: y - menuHeight - menuOffset,
      };

    if (rotation > 45 && rotation <= 90)
      return {
        x: x - width / 2 - menuWidth / 2,
        y: y - menuOffset,
      };

    if (rotation > 90 && rotation <= 135)
      return {
        x: x - width / 2 - menuWidth / 2,
        y: y - menuHeight * 2 - menuOffset,
      };

    if (rotation > 135 && rotation <= 180)
      return {
        x: x - width / 2 - menuWidth / 2,
        y: y - menuOffset - height,
      };

    if (rotation > 180 && rotation <= 225)
      return {
        x: x - width / 2 - menuWidth / 2,
        y: y - menuHeight - menuOffset - height,
      };

    if (rotation > 225 && rotation <= 270)
      return {
        x: x + width / 2 - menuWidth / 2,
        y: y - menuOffset - height,
      };

    if (rotation > 270 && rotation <= 315)
      return {
        x: x + width / 2 - menuWidth / 2,
        y: y - menuHeight - height,
      };

    if (rotation > 315 && rotation <= 360)
      return {
        x: x + width / 2 - menuWidth / 2,
        y: y - menuHeight * 2 - menuOffset,
      };

    return { x: x + width / 2 - menuWidth / 2, y: y - menuOffset - menuHeight };
  } else {
    const box = stages.value.default.container().getBoundingClientRect();

    const scaleX = box.width / scene.value.width;
    const scaleY = box.height / scene.value.height;

    const menuWidth = 93;
    const menuHeight = 32;

    const maxLeft = box.left;
    const maxRight = box.left + box.width - menuWidth;
    const maxTop = box.top;
    const maxBottom = box.top + box.height - menuHeight;

    const x =
      box.left -
      menuWidth / 2 +
      (transformer.value.custom.shape.node.x() +
        (transformer.value.custom.shape.node.points()[0] +
          transformer.value.custom.shape.node.points()[2]) /
          2) *
        scaleX;

    const y =
      box.top -
      menuHeight * 2 +
      transformer.value.custom.shape.node.y() * scaleY;

    return {
      x: x < maxLeft ? maxLeft : x > maxRight ? maxRight : x,
      y: y < maxTop ? maxTop : y > maxBottom ? maxBottom : y,
    };
  }
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
.q-btn {
  border-radius: 0;
}
</style>
