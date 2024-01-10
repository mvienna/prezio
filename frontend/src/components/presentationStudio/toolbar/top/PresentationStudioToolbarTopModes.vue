<template>
  <div class="row no-wrap q-gutter-sm">
    <!-- drawing -->
    <q-btn
      icon="r_gesture"
      unelevated
      text-color="black"
      round
      size="12px"
      :disable="disabled"
      @click="$emit('switchMode', MODE_OPTIONS.drawing)"
    >
      <q-tooltip>
        {{ $t("presentationStudio.toolbar.drawing.title") }}
      </q-tooltip>
    </q-btn>

    <!-- text -->
    <q-btn
      icon="icon-insert_text"
      unelevated
      text-color="black"
      round
      size="12px"
      :disable="disabled"
      @click="textStore.addNewText(undefined, t)"
    >
      <q-tooltip>
        {{ $t("presentationStudio.toolbar.text.title") }}
      </q-tooltip>
    </q-btn>

    <!-- image -->
    <q-btn
      icon="o_add_photo_alternate"
      unelevated
      text-color="black"
      round
      size="12px"
      :disable="disabled"
      @click="showSelectMediaDialog = true"
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
      icon="icon-add_reaction"
      unelevated
      text-color="black"
      round
      :disable="disabled"
      size="12px"
      @click="$emit('switchMode', MODE_OPTIONS.mediaEmoji)"
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
            @click="$emit('addEmoji', emoji.src)"
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
      icon="icon-shape_line"
      unelevated
      text-color="black"
      round
      :disable="disabled"
      size="12px"
    >
      <q-menu
        anchor="bottom left"
        self="top left"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 8]"
        class="no-padding"
      >
        <!-- lines -->
        <div class="text-grey q-px-md q-mt-md q-mb-sm">
          {{ $t("presentationStudio.toolbar.shape.groups.lines") }}
        </div>

        <div
          style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px"
          class="q-px-sm"
        >
          <q-btn
            v-for="shape in SHAPES.filter(
              (item) => item.group === SHAPE_TYPES.line
            )"
            :key="shape.name"
            unelevated
            round
            size="12px"
            class="q-pa-sm"
            text-color="grey-9"
            :disable="shape.disabled"
            v-close-popup
            @click="
              $emit('switchMode', MODE_OPTIONS.shape);
              $emit('addShape', shape.name);
            "
          >
            <q-icon :name="shape.icon" />

            <q-tooltip v-if="shape.disabled" :offset="[0, 4]">
              {{ $t("tooltips.comingSoon") }}
            </q-tooltip>
          </q-btn>
        </div>

        <q-separator class="q-mt-sm q-mb-md" />

        <!-- simple shapes -->
        <div class="text-grey q-px-md">
          {{ $t("presentationStudio.toolbar.shape.groups.simpleShapes") }}
        </div>

        <div
          style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px"
          class="q-pa-sm"
        >
          <q-btn
            v-for="shape in SHAPES.filter(
              (item) => item.group === SHAPE_TYPES.simpleShape
            )"
            :key="shape.name"
            unelevated
            round
            size="12px"
            class="q-pa-sm"
            text-color="grey-9"
            :disable="shape.disabled"
            v-close-popup
            @click="
              $emit('switchMode', MODE_OPTIONS.shape);
              $emit('addShape', shape.name);
            "
          >
            <q-icon :name="shape.icon" />

            <q-tooltip v-if="shape.disabled">
              {{ $t("tooltips.comingSoon") }}
            </q-tooltip>
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
import { SHAPE_TYPES, SHAPES } from "src/constants/assets/shapes";
import SelectMedia from "components/media/SelectMedia.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";
import { useCanvasTextStore } from "stores/canvas/text";
import { useI18n } from "vue-i18n";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

defineProps({
  disabled: { type: Boolean },
});

/*
 * emits
 */
defineEmits(["switchMode", "addImage", "addEmoji", "addShape"]);

/*
 * stores
 */
const { mode, MODE_OPTIONS, selectedElement } = storeToRefs(useCanvasStore());

const textStore = useCanvasTextStore();

/*
 * select media
 */
const showSelectMediaDialog = ref(false);
</script>
