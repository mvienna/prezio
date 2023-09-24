<template>
  <!-- formatting - bold -->
  <q-btn
    outline
    size="10px"
    round
    icon="r_format_bold"
    :text-color="
      textState.customization.value.formatting.isBold ? 'white' : 'black'
    "
    :class="
      textState.customization.value.formatting.isBold
        ? 'bg-primary'
        : 'bg-white'
    "
    @click="
      textState.customization.value.formatting.isBold =
        !textState.customization.value.formatting.isBold;
      textStore.applyStyles();
    "
  >
    <q-tooltip class="text-bold">
      {{ $t("presentation.toolbar.text.formatting.bold") }}
    </q-tooltip>
  </q-btn>

  <!-- formatting - underline -->
  <q-btn
    outline
    size="10px"
    round
    icon="r_format_underlined"
    :text-color="
      textState.customization.value.formatting.isUnderline ? 'white' : 'black'
    "
    :class="
      textState.customization.value.formatting.isUnderline
        ? 'bg-primary'
        : 'bg-white'
    "
    @click="
      textState.customization.value.formatting.isUnderline =
        !textState.customization.value.formatting.isUnderline;
      textStore.applyStyles();
    "
  >
    <q-tooltip style="text-decoration: underline">
      {{ $t("presentation.toolbar.text.formatting.underline") }}
    </q-tooltip>
  </q-btn>

  <!-- formatting - strike-through -->
  <q-btn
    outline
    size="10px"
    round
    icon="r_strikethrough_s"
    :text-color="
      textState.customization.value.formatting.isLineThrough ? 'white' : 'black'
    "
    :class="
      textState.customization.value.formatting.isLineThrough
        ? 'bg-primary'
        : 'bg-white'
    "
    @click="
      textState.customization.value.formatting.isLineThrough =
        !textState.customization.value.formatting.isLineThrough;
      textStore.applyStyles();
    "
  >
    <q-tooltip style="text-decoration: line-through">
      {{ $t("presentation.toolbar.text.formatting.strikeThrough") }}
    </q-tooltip>
  </q-btn>

  <!-- formatting - italic -->
  <q-btn
    outline
    size="10px"
    round
    icon="r_format_italic"
    :text-color="
      textState.customization.value.formatting.isItalic ? 'white' : 'black'
    "
    :class="
      textState.customization.value.formatting.isItalic
        ? 'bg-primary'
        : 'bg-white'
    "
    @click="
      textState.customization.value.formatting.isItalic =
        !textState.customization.value.formatting.isItalic;
      textStore.applyStyles();
    "
  >
    <q-tooltip class="text-italic">
      {{ $t("presentation.toolbar.text.formatting.italic") }}
    </q-tooltip>
  </q-btn>

  <q-separator vertical class="q-ml-md q-mr-sm" />

  <!-- formatting - alignment -->
  <q-btn
    unelevated
    size="10px"
    round
    color="black"
    :icon="
      textState.customization.value.formatting.alignment.horizontal ===
      ALIGNMENT.horizontal.left
        ? 'r_format_align_left'
        : textState.customization.value.formatting.alignment.horizontal ===
          ALIGNMENT.horizontal.right
        ? 'r_format_align_right'
        : textState.customization.value.formatting.alignment.horizontal ===
          ALIGNMENT.horizontal.center
        ? 'r_format_align_center'
        : ''
    "
  >
    <q-tooltip>
      {{ $t("presentation.toolbar.text.formatting.alignment") }}
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
            size="10px"
            round
            :class="
              item ===
              textState.customization.value.formatting.alignment.horizontal
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
                : ''
            "
            @click="
              textState.customization.value.formatting.alignment.horizontal =
                item;
              textStore.applyStyles();
            "
          />
        </div>

        <div class="row no-wrap q-mt-sm">
          <q-btn
            v-for="item in Object.keys(ALIGNMENT.vertical)"
            :key="item"
            flat
            size="10px"
            round
            :class="
              item ===
              textState.customization.value.formatting.alignment.vertical
                ? 'text-black'
                : 'text-grey'
            "
            :icon="
              item === ALIGNMENT.vertical.top
                ? 'r_vertical_align_top'
                : item === ALIGNMENT.vertical.bottom
                ? 'r_vertical_align_bottom'
                : item === ALIGNMENT.vertical.middle
                ? 'r_align_vertical_center'
                : ''
            "
            @click="
              textState.customization.value.formatting.alignment.vertical =
                item;
              textStore.applyStyles();
            "
          />
        </div>
      </div>
    </q-menu>
  </q-btn>

  <q-separator vertical class="q-ml-md q-mr-sm" />

  <!-- color picker -->
  <q-btn flat round size="12px">
    <q-icon
      name="r_colorize"
      :style="`color: ${textState.customization.value.color}`"
    />

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
        v-model="textState.customization.value.color"
        @update:model-value="textStore.applyStyles()"
      />
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentation.drawing.options.color") }}
    </q-tooltip>
  </q-btn>

  <!-- font -->
  <q-select
    v-model="textState.customization.value.font"
    :options="FONT_OPTIONS"
    emit-value
    borderless
    color="dark"
    hide-dropdown-icon
    dense
    class="q-pl-sm text-no-wrap"
    @update:model-value="textStore.applyStyles()"
  >
    <template #prepend>
      <q-icon
        name="r_text_fields"
        class="text-semibold text-dark"
        size="20px"
      />
    </template>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentation.text.options.font") }}
    </q-tooltip>
  </q-select>

  <!-- font size -->
  <q-select
    v-model="textState.customization.value.fontSize"
    :options="FONT_SIZE_OPTIONS"
    emit-value
    borderless
    color="dark"
    hide-dropdown-icon
    dense
    class="q-px-md"
    @update:model-value="textStore.applyStyles()"
  >
    <template #prepend>
      <q-icon
        name="r_sort_by_alpha"
        class="text-semibold text-dark"
        size="20px"
      />
    </template>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentation.text.options.fontSize") }}
    </q-tooltip>
  </q-select>

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
      {{ $t("presentation.text.options.clearFormatting") }}
    </q-tooltip>
  </q-btn>

  <!-- new text -->
  <q-btn
    icon="r_fiber_new"
    :label="$t('presentation.text.options.newText')"
    :color="!textState.isNewText.value ? 'primary' : 'grey'"
    unelevated
    no-caps
    no-wrap
    class="q-mr-sm"
    @click="textState.isNewText.value = !textState.isNewText.value"
  >
    <q-tooltip>
      {{ $t("presentation.toolbar.text.newText") }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import {
  ALIGNMENT,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
} from "src/constants/canvas/canvasVariables";
import { useCanvasTextStore } from "stores/canvas/text";
import { storeToRefs } from "pinia";

/*
 * stores
 */
const textStore = useCanvasTextStore();
const textState = storeToRefs(textStore);
</script>
