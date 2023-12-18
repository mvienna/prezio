<template>
  <!-- formatting - bold -->
  <q-btn
    flat
    size="12px"
    round
    icon="r_format_bold"
    :text-color="customization.formatting.isBold ? 'black' : 'grey'"
    @click="
      () => {
        customization.formatting.isBold = !customization.formatting.isBold;
        textStore.applyStyles();
      }
    "
  >
    <q-tooltip>
      <div class="text-bold text-center">
        {{ $t("presentationStudio.toolbar.text.options.formatting.bold") }}
      </div>

      <div
        v-if="showShortcuts"
        class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm"
      >
        <div v-if="isMac">⌘</div>
        <div v-else>Ctrl</div>
        <div>B</div>
      </div>
    </q-tooltip>
  </q-btn>

  <!-- formatting - underline -->
  <q-btn
    flat
    size="12px"
    round
    icon="r_format_underlined"
    :text-color="customization.formatting.isUnderline ? 'black' : 'grey'"
    @click="
      () => {
        customization.formatting.isUnderline =
          !customization.formatting.isUnderline;
        textStore.applyStyles();
      }
    "
  >
    <q-tooltip>
      <div style="text-decoration: underline" class="text-center">
        {{ $t("presentationStudio.toolbar.text.options.formatting.underline") }}
      </div>

      <div
        v-if="showShortcuts"
        class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm"
      >
        <div v-if="isMac">⌘</div>
        <div v-else>Ctrl</div>
        <div>U</div>
      </div>
    </q-tooltip>
  </q-btn>

  <!-- formatting - strike-through -->
  <q-btn
    flat
    size="12px"
    round
    icon="r_strikethrough_s"
    :text-color="customization.formatting.isLineThrough ? 'black' : 'grey'"
    @click="
      () => {
        customization.formatting.isLineThrough =
          !customization.formatting.isLineThrough;
        textStore.applyStyles();
      }
    "
  >
    <q-tooltip>
      <div style="text-decoration: line-through" class="text-center">
        {{
          $t("presentationStudio.toolbar.text.options.formatting.strikeThrough")
        }}
      </div>

      <div
        v-if="showShortcuts"
        class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm"
      >
        <div v-if="isMac">⌘</div>
        <div v-else>Ctrl</div>
        <div>⇧</div>
        <div>X</div>
      </div>
    </q-tooltip>
  </q-btn>

  <!-- formatting - italic -->
  <q-btn
    flat
    size="12px"
    round
    icon="r_format_italic"
    :text-color="customization.formatting.isItalic ? 'black' : 'grey'"
    @click="
      () => {
        customization.formatting.isItalic = !customization.formatting.isItalic;
        textStore.applyStyles();
      }
    "
  >
    <q-tooltip>
      <div class="text-italic text-center">
        {{ $t("presentationStudio.toolbar.text.options.formatting.italic") }}
      </div>

      <div
        v-if="showShortcuts"
        class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm"
      >
        <div v-if="isMac">⌘</div>
        <div v-else>Ctrl</div>
        <div>I</div>
      </div>
    </q-tooltip>
  </q-btn>

  <!-- formatting - alignment -->
  <q-btn
    flat
    size="12px"
    round
    color="black"
    :icon="
      customization.formatting.textAlign === ALIGNMENT.horizontal.left
        ? 'r_format_align_left'
        : customization.formatting.textAlign === ALIGNMENT.horizontal.right
        ? 'r_format_align_right'
        : customization.formatting.textAlign === ALIGNMENT.horizontal.center
        ? 'r_format_align_center'
        : ''
    "
  >
    <q-tooltip>
      {{ $t("presentationStudio.toolbar.text.options.formatting.alignment") }}
    </q-tooltip>

    <q-menu
      anchor="bottom right"
      self="top right"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="q-pa-sm"
    >
      <div class="column no-wrap">
        <div class="row no-wrap">
          <q-btn
            v-for="item in Object.keys(ALIGNMENT.horizontal)"
            :key="item"
            flat
            size="12px"
            round
            :class="
              item === customization.formatting.textAlign
                ? 'text-black'
                : 'text-grey'
            "
            :icon="
              item === ALIGNMENT.horizontal.left
                ? 'r_format_align_left'
                : item === ALIGNMENT.horizontal.right
                ? 'r_format_align_right'
                : item === ALIGNMENT.horizontal.center
                ? 'r_format_align_center'
                : 'r_format_align_left'
            "
            @click="
              () => {
                customization.formatting.textAlign = item;
                textStore.applyStyles();
              }
            "
          />
        </div>

        <!--        <div class="row no-wrap q-mt-sm">-->
        <!--          <q-btn-->
        <!--            v-for="item in Object.keys(ALIGNMENT.vertical)"-->
        <!--            :key="item"-->
        <!--            flat-->
        <!--            size="12px"-->
        <!--            round-->
        <!--            :class="-->
        <!--              item ===-->
        <!--              customization.formatting.verticalAlign-->
        <!--                ? 'text-black'-->
        <!--                : 'text-grey'-->
        <!--            "-->
        <!--            :icon="-->
        <!--              item === ALIGNMENT.vertical.top-->
        <!--                ? 'r_vertical_align_top'-->
        <!--                : item === ALIGNMENT.vertical.bottom-->
        <!--                ? 'r_vertical_align_bottom'-->
        <!--                : item === ALIGNMENT.vertical.middle-->
        <!--                ? 'r_align_vertical_center'-->
        <!--                : ''-->
        <!--            "-->
        <!--            @click="-->
        <!--              customization.formatting.verticalAlign =-->
        <!--                item;-->
        <!--              textStore.applyStyles();-->
        <!--            "-->
        <!--          />-->
        <!--        </div>-->
      </div>
    </q-menu>
  </q-btn>

  <q-separator vertical />

  <!-- color picker -->
  <q-btn flat round size="12px" class="relative-position">
    <div>
      <q-icon name="icon-mdi_format_color_top" class="absolute-center" />
      <q-icon
        name="icon-mdi_format_color_bottom"
        :style="`color: ${customization.color}`"
        class="absolute-center"
      />
    </div>

    <q-menu
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
    >
      <q-color
        format-model="hex"
        no-header-tabs
        default-view="palette"
        v-model="customization.color"
        @change="textStore.applyStyles()"
      />
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.drawing.options.color") }}
    </q-tooltip>
  </q-btn>

  <!-- font -->
  <q-select
    v-model="customization.font"
    :options="FONT_OPTIONS"
    emit-value
    borderless
    color="dark"
    dense
    options-dense
    class="text-no-wrap"
    @update:model-value="textStore.applyStyles()"
  >
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label :style="`font-family: ${scope.opt}`">{{
            scope.opt
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.text.options.font") }}
    </q-tooltip>
  </q-select>

  <!-- font size -->
  <q-input
    v-model="fontSizeNumber"
    type="number"
    color="primary"
    dense
    style="width: 70px; min-width: 70px; max-width: 70px"
    @update:model-value="
      () => {
        customization.fontSize = fontSizeNumber + 'px';
        textStore.applyStyles();
      }
    "
  >
    <template #after> <div class="text-caption">px</div> </template>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.text.options.fontSize") }}
    </q-tooltip>
  </q-input>

  <q-space />

  <!-- clear formatting -->
  <q-btn
    icon="r_restart_alt"
    flat
    round
    size="12px"
    color="grey"
    @click="textStore.clearFormatting()"
  >
    <q-tooltip :offset="[0, 4]">
      {{
        $t("presentationStudio.toolbar.text.options.formatting.clearFormatting")
      }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { ALIGNMENT, FONT_OPTIONS } from "src/constants/canvas/canvasVariables";
import { useCanvasTextStore } from "stores/canvas/text";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { computed } from "vue";

/*
 * variables
 */
const $q = useQuasar();

/*
 * stores
 */
const textStore = useCanvasTextStore();
const { customization, fontSizeNumber } = storeToRefs(textStore);

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
::v-deep(.q-field__control) {
  height: 36px;
}

::v-deep(input) {
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
}
</style>
