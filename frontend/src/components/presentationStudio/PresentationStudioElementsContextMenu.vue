<template>
  <q-card
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
              .filter((node) => node.getAttr('name') === MODE_OPTIONS.image)
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
const { MODE_OPTIONS, transformer } = storeToRefs(studioStore);

/*
 * position
 */
const transformerPosition = computed(() => {
  return {
    x: transformer.value.default.x() + 215,
    y: transformer.value.default.y() + 80,
  };
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
