<template>
  <div class="row no-wrap q-gutter-sm">
    <!-- layouts -->
    <q-btn
      icon="icon-space_dashboard"
      unelevated
      text-color="black"
      :class="showLayoutsMenu ? 'bg-grey-2' : ''"
      round
      size="12px"
    >
      <q-tooltip
        anchor="top middle"
        self="bottom middle"
        transition-show="jump-up"
        transition-hide="jump-down"
      >
        {{ $t("presentationStudio.toolbar.layouts.placeholder") }}
      </q-tooltip>

      <q-menu
        v-model="showLayoutsMenu"
        anchor="top left"
        self="bottom left"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 16]"
        class="q-pa-sm bg-white hide-scrollbar"
        style="width: 384px; max-height: 100%"
      >
        <PresentationStudioToolbarTopLayouts v-close-popup />
      </q-menu>
    </q-btn>

    <q-separator vertical />

    <!-- drawing -->
    <q-btn
      icon="r_gesture"
      unelevated
      text-color="black"
      round
      size="12px"
      @click="$emit('switchMode', MODE_OPTIONS.DRAWING)"
    >
      <q-tooltip
        anchor="top middle"
        self="bottom middle"
        transition-show="jump-up"
        transition-hide="jump-down"
      >
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
      @click="studioStore.addText()"
    >
      <q-tooltip
        anchor="top middle"
        self="bottom middle"
        transition-show="jump-up"
        transition-hide="jump-down"
      >
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
      @click="showSelectMediaDialog = true"
    >
      <q-tooltip
        anchor="top middle"
        self="bottom middle"
        transition-show="jump-up"
        transition-hide="jump-down"
      >
        {{ $t("presentationStudio.toolbar.image.title") }}
      </q-tooltip>
    </q-btn>

    <!-- select media -->
    <q-dialog v-model="showSelectMediaDialog">
      <SelectMedia
        @cancel="showSelectMediaDialog = false"
        @select="
          $event.origin === MEDIA_ORIGIN_OPTIONS.GIPHY ||
          $event.mime_type === 'image/gif'
            ? studioStore.addGif($event?.preview_url || $event?.original_url)
            : studioStore.addImage(
                $event?.preview_url ||
                  $event?.original_url ||
                  $event?.urls?.regular,
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
      size="12px"
    >
      <q-tooltip
        anchor="top middle"
        self="bottom middle"
        transition-show="jump-up"
        transition-hide="jump-down"
      >
        {{ $t("presentationStudio.toolbar.emoji.title") }}
      </q-tooltip>

      <q-menu
        anchor="bottom left"
        self="top left"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 8]"
        style="padding: 0"
      >
        <EmojiPicker
          :native="true"
          theme="light"
          :offset="16"
          style="box-shadow: none !important"
          :static-texts="{
            placeholder: $t('emoji.searchPlaceholder'),
            skinTone: $t('emoji.skinTone'),
          }"
          :group-names="{
            smileys_people: $t('emoji.smileys_people'),
            animals_nature: $t('emoji.animals_nature'),
            food_drink: $t('emoji.food_drink'),
            activities: $t('emoji.activities'),
            travel_places: $t('emoji.travel_places'),
            objects: $t('emoji.objects'),
            symbols: $t('emoji.symbols'),
            flags: $t('emoji.flags'),
          }"
          v-close-popup
          @select="studioStore.addEmoji($event.i)"
        />
      </q-menu>
    </q-btn>

    <!-- shapes -->
    <q-btn
      icon="icon-shape_line"
      unelevated
      text-color="black"
      round
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
            v-for="shape in Object.values(SHAPE_OPTIONS).filter(
              (item) => item.group === SHAPE_TYPES.LINE,
            )"
            :key="shape.name"
            unelevated
            round
            size="12px"
            class="q-pa-sm"
            text-color="grey-9"
            :disable="shape.disabled"
            v-close-popup
            @click="studioStore.addShape(shape.name)"
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
            v-for="shape in Object.values(SHAPE_OPTIONS).filter(
              (item) => item.group === SHAPE_TYPES.SIMPLE_SHAPE,
            )"
            :key="shape.name"
            unelevated
            round
            size="12px"
            class="q-pa-sm"
            text-color="grey-9"
            :disable="shape.disabled"
            v-close-popup
            @click="studioStore.addShape(shape.name)"
          >
            <q-icon :name="shape.icon" />

            <q-tooltip v-if="shape.disabled">
              {{ $t("tooltips.comingSoon") }}
            </q-tooltip>
          </q-btn>
        </div>

        <q-separator class="q-mt-sm q-mb-md" />

        <!-- abstract shapes -->
        <div class="text-grey q-px-md">
          {{ $t("presentationStudio.toolbar.shape.groups.abstract") }}
        </div>

        <div
          style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px"
          class="q-pa-sm"
        >
          <q-btn
            v-for="shape in Object.values(SHAPE_OPTIONS).filter(
              (item) => item.group === SHAPE_TYPES.ABSTRACT,
            )"
            :key="shape.name"
            unelevated
            round
            size="12px"
            class="q-pa-sm"
            text-color="grey-9"
            :disable="shape.disabled"
            v-close-popup
            @click="studioStore.addShape(shape.name)"
          >
            <q-img :src="`/assets/icons/shapes/${shape.name}.png`" />

            <q-tooltip v-if="shape.disabled">
              {{ $t("tooltips.comingSoon") }}
            </q-tooltip>
          </q-btn>
        </div>
      </q-menu>

      <q-tooltip
        anchor="top middle"
        self="bottom middle"
        transition-show="jump-up"
        transition-hide="jump-down"
      >
        {{ $t("presentationStudio.toolbar.shape.title") }}
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import SelectMedia from "components/media/SelectMedia.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import PresentationStudioToolbarTopLayouts from "components/presentationStudio/toolbar/top/PresentationStudioToolbarTopLayouts.vue";
import { useStudioStore } from "stores/studio";
import {
  SHAPE_OPTIONS,
  SHAPE_TYPES,
} from "src/constants/canvas/canvasVariables";
import { MEDIA_ORIGIN_OPTIONS } from "src/constants/integrations";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const showLayoutsMenu = ref(false);

/*
 * emits
 */
const emit = defineEmits(["switchMode"]);

/*
 * stores
 */
const studioStore = useStudioStore();
const { mode, MODE_OPTIONS, layers } = storeToRefs(studioStore);

/*
 * select media
 */
const showSelectMediaDialog = ref(false);


// function emojiToSVG(emoji) {
//   const div = document.createElement('div');
//   div.innerHTML = emoji;
//   const svg = div.firstChild.outerHTML;
//   console.log(svg);
//   return svg;
// }
</script>

<style>
.v3-emoji-picker .v3-body .v3-body-inner.is-mac .v3-emojis button {

  font-family: "Noto Color Emoji", sans-serif;
  /* font-family: "Apple Color Emoji"; */
  font-weight: 400;
  font-style: normal;
}
</style>
