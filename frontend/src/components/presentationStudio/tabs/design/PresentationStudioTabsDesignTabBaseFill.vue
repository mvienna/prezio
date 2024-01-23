<template>
  <div>
    <div class="q-mb-sm">
      {{ $t("presentationLayout.rightDrawer.tabs.design.slideBaseFill.title") }}
    </div>

    <div
      v-if="baseFill?.attrs?.fill"
      class="row no-wrap items-center justify-between"
    >
      <div
        v-for="color in BASE_FILL_COLOR_OPTIONS"
        :key="color"
        class="base_fill_color_box"
        :class="
          color === baseFill?.attrs?.fill ? 'base_fill_color_box--active' : ''
        "
        :style="`background: ${color};`"
        @click="studioStore.updateBaseLayer(color)"
      ></div>

      <q-separator vertical />

      <div class="text-caption text-grey">
        {{ $t("presentationLayout.rightDrawer.tabs.design.slideBaseFill.set") }}
      </div>

      <div
        class="base_fill_color_box relative-position"
        :style="{
          background: isCustomBaseFill ? baseFill?.attrs?.fill : '',
        }"
        :class="isCustomBaseFill ? 'base_fill_color_box--active' : ''"
      >
        <q-icon
          name="r_colorize"
          class="absolute-center"
          :style="`color: ${
            isCustomBaseFill
              ? textColorOnAColoredBackground(baseFill?.attrs?.fill)
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
            v-model="customBaseFill"
            @change="studioStore.updateBaseLayer(customBaseFill)"
          />
        </q-menu>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStudioStore } from "stores/studio";
import { storeToRefs } from "pinia";
import { BASE_FILL_COLOR_OPTIONS } from "src/constants/canvas/canvasVariables";
import { textColorOnAColoredBackground } from "src/helpers/colorUtils";

/*
 * stores
 */
const studioStore = useStudioStore();
const { layers } = storeToRefs(studioStore);

/*
 * base fill
 */
const baseFill = computed(() => {
  return layers.value.base?.findOne(".baseFill");
});

const customBaseFill = ref();

const isCustomBaseFill = computed(() => {
  return !BASE_FILL_COLOR_OPTIONS.map((color) => color?.toLowerCase()).includes(
    baseFill.value?.attrs?.fill?.toLowerCase()
  );
});
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
