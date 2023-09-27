<template>
  <div class="row no-wrap q-gutter-sm">
    <!-- drawing -->
    <q-btn
      icon="r_gesture"
      unelevated
      text-color="dark"
      round
      size="12px"
      :class="mode === MODES_OPTIONS.drawing ? 'bg-grey-1' : ''"
      @click="$emit('switchMode', MODES_OPTIONS.drawing)"
    >
      <q-tooltip>
        {{ $t("presentationStudio.toolbar.drawing.title") }}
      </q-tooltip>
    </q-btn>

    <!-- text -->
    <q-btn
      icon="r_text_fields"
      unelevated
      text-color="dark"
      round
      size="12px"
      :class="mode === MODES_OPTIONS.text ? 'bg-grey-1' : ''"
      @click="$emit('switchMode', MODES_OPTIONS.text)"
    >
      <q-tooltip>
        {{ $t("presentationStudio.toolbar.text.title") }}
      </q-tooltip>
    </q-btn>

    <!-- image -->
    <q-btn
      icon="r_image"
      unelevated
      text-color="dark"
      round
      size="12px"
      @click="
        $emit('switchMode', MODES_OPTIONS.media);
        showSelectMediaDialog = true;
      "
    >
      <q-tooltip>
        {{ $t("presentationStudio.toolbar.media.title") }}
      </q-tooltip>
    </q-btn>

    <!-- select media -->
    <q-dialog v-model="showSelectMediaDialog">
      <SelectMedia
        @cancel="showSelectMediaDialog = false"
        @select="
          $emit(
            'addImage',
            $event?.preview_url || $event?.original_url || $event?.urls?.regular
          );
          showSelectMediaDialog = false;
        "
      />
    </q-dialog>

    <!-- emoji -->
    <q-btn
      icon="r_add_reaction"
      unelevated
      text-color="dark"
      round
      size="12px"
      @click="$emit('switchMode', MODES_OPTIONS.mediaEmoji)"
    >
      <q-tooltip>
        {{ $t("presentationStudio.toolbar.emoji.title") }}
      </q-tooltip>

      <q-menu
        anchor="bottom left"
        self="top left"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 8]"
        class="q-pa-sm"
        style="width: 240px"
      >
        <div class="row q-gutter-sm">
          <q-btn
            v-for="emoji in EMOJIS"
            :key="emoji.name"
            unelevated
            round
            size="16px"
            class="q-pa-sm"
            v-close-popup
            @click="$emit('addImage', emoji.src)"
          >
            <template #default>
              <q-img :src="emoji.src" />
            </template>
          </q-btn>
        </div>
      </q-menu>
    </q-btn>

    <!-- shapes -->
    <q-btn
      icon="r_shape_line"
      :class="mode === MODES_OPTIONS.shape ? 'bg-grey-1' : ''"
      unelevated
      text-color="dark"
      round
      size="12px"
    >
      <q-menu
        anchor="bottom left"
        self="top left"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 8]"
        class="q-pa-sm"
        style="width: 184px"
      >
        <div class="row q-gutter-sm">
          <q-btn
            v-for="shape in SHAPES"
            :key="shape.name"
            unelevated
            round
            size="12px"
            class="q-pa-sm"
            v-close-popup
            @click="
              $emit('switchMode', MODES_OPTIONS.shape);
              $emit('addShape', shape.name);
            "
          >
            <template #default>
              <q-img :src="shape.src" />
            </template>
          </q-btn>
        </div>
      </q-menu>

      <q-tooltip>
        {{ $t("presentationStudio.toolbar.shape.title") }}
      </q-tooltip>
    </q-btn>
  </div>
</template>
<script setup>
import { EMOJIS } from "src/constants/assets/emojis";
import { SHAPES } from "src/constants/assets/shapes";
import SelectMedia from "components/media/SelectMedia.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";

/*
 * emits
 */
defineEmits(["switchMode", "addImage", "addShape"]);

/*
 * stores
 */
const { mode, MODES_OPTIONS, selectedElement } = storeToRefs(useCanvasStore());

/*
 * select media
 */
const showSelectMediaDialog = ref(false);
</script>
