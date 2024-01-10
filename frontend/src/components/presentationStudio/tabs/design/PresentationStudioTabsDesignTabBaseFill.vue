<template>
  <div>
    <div class="text-grey q-mb-sm">
      {{ $t("presentationLayout.rightDrawer.tabs.design.slideBaseFill.title") }}
    </div>

    <div class="row no-wrap items-center justify-between">
      <div
        v-for="color in baseFillColors"
        :key="color"
        class="base_fill_color_box"
        :class="
          color === selectedBaseFillColor ? 'base_fill_color_box--active' : ''
        "
        :style="`background: ${color};`"
        @click="
          selectedBaseFillColor = color;
          $emit('changeBaseFill', selectedBaseFillColor);
        "
      ></div>

      <q-separator vertical />

      <div class="text-caption text-grey">
        {{ $t("presentationLayout.rightDrawer.tabs.design.slideBaseFill.set") }}
      </div>

      <div
        class="base_fill_color_box relative-position"
        :style="{
          background: !baseFillColors.includes(selectedBaseFillColor)
            ? selectedBaseFillColor
            : '',
        }"
        :class="
          !baseFillColors.includes(selectedBaseFillColor)
            ? 'base_fill_color_box--active'
            : ''
        "
      >
        <q-icon
          name="r_colorize"
          class="absolute-center"
          :style="`color: ${
            !baseFillColors.includes(selectedBaseFillColor)
              ? textColorOnAColoredBackground(selectedBaseFillColor)
              : 'black'
          };`"
        />

        <q-menu
          anchor="bottom left"
          self="top left"
          transition-show="jump-down"
          transition-hide="jump-up"
          :offset="[0, 8]"
          class="no-padding"
        >
          <q-color
            format-model="hex"
            no-header-tabs
            default-view="palette"
            v-model="selectedBaseFillColor"
            @change="$emit('changeBaseFill', selectedBaseFillColor)"
          />
        </q-menu>
      </div>
    </div>
  </div>
</template>

<script setup>
import { textColorOnAColoredBackground } from "src/helpers/colorUtils";
import { onBeforeMount, ref } from "vue";

/*
 * props
 */
const props = defineProps({
  baseFillElement: { type: Object, default: null },
});

onBeforeMount(() => {
  if (props.baseFillElement) {
    selectedBaseFillColor.value = props.baseFillElement?.fillColor;
  }
});

/*
 * emits
 */
defineEmits(["changeBaseFill"]);

/*
 * colors
 */
const defaultBaseFillColor = "#FFFFFF";
const selectedBaseFillColor = ref(defaultBaseFillColor);

const baseFillColors = [
  "#ffffff",
  "#000000",
  "#1751D0",
  "#db4437",
  "#f4b400",
  "#0f9d58",
];
</script>

<style scoped lang="scss">
/*
 * base fill
 */
.base_fill_color_box {
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid $grey-2;
  background: $grey-2;
  transition: 0.2s;

  &.base_fill_color_box--active {
    border: 1px solid $primary;
  }
}
</style>
