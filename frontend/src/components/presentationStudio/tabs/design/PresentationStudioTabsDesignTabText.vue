<template>
  <div class="text-grey">
    {{
      $t(
        "presentationLayout.rightDrawer.tabs.design.defaultTextCustomization.title"
      )
    }}
  </div>

  <div class="row no-wrap items-center q-gutter-md q-pt-sm">
    <!-- font -->
    <q-select
      v-model="customization.default.font"
      :options="FONT_OPTIONS"
      emit-value
      outlined
      color="primary"
      dense
      style="width: 100%"
      class="text-no-wrap"
      @update:model-value="customization.font = customization.default.font"
    >
      <template #prepend>
        <q-icon
          name="r_text_fields"
          class="text-semibold text-dark"
          size="20px"
        />
      </template>

      <q-tooltip :offset="[0, 4]">
        {{ $t("presentationStudio.toolbar.text.options.font") }}
      </q-tooltip>
    </q-select>

    <!-- default text colors -->
    <div
      v-for="color in defaultTextColors"
      :key="color"
      class="text_color_box"
      :class="color === customization.color ? 'text_color_box--active' : ''"
      :style="`background: ${color};`"
      @click="
        customization.default.color = color;
        customization.color = customization.default.color;
      "
    ></div>

    <q-separator vertical />

    <!-- custom color -->
    <div
      class="text_color_box relative-position"
      :style="`background: ${customization.default.color};`"
      :class="
        !defaultTextColors.includes(customization.default.color)
          ? 'base_fill_color_box--active'
          : ''
      "
    >
      <q-icon
        name="r_colorize"
        class="absolute-center"
        :style="`color: ${textColorOnAColoredBackground(
          customization.default.color
        )};`"
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
          default-view="palette"
          v-model="customization.default.color"
          @change="customization.color = customization.default.color"
        />
      </q-menu>
    </div>
  </div>
</template>

<script setup>
import { FONT_OPTIONS } from "src/constants/canvas/canvasVariables";
import { useCanvasTextStore } from "stores/canvas/text";
import { storeToRefs } from "pinia";
import { textColorOnAColoredBackground } from "src/helpers/colorUtils";

const textStore = useCanvasTextStore();
const { customization } = storeToRefs(textStore);

const defaultTextColors = ["#313132", "#FFFFFF"];
</script>

<style scoped lang="scss">
/*
 * default text colors
 */
.text_color_box {
  cursor: pointer;
  width: 24px;
  min-width: 24px;
  height: 24px;
  border-radius: 8px;
  outline: 2px solid $grey-2;
  transition: 0.2s;

  &.text_color_box--active {
    outline: 2px solid $primary;
  }
}
</style>
