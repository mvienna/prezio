<template>
  <div>
    <div class="q-mb-sm">
      {{
        $t(
          "presentationLayout.rightDrawer.tabs.design.defaultTextCustomization.font.title",
        )
      }}
    </div>

    <!-- font -->
    <q-select
      v-model="text.default.fontFamily"
      :options="FONT_OPTIONS"
      emit-value
      outlined
      color="primary"
      dense
      options-dense
      style="width: 100%"
      class="text-no-wrap"
      @update:model-value="handleDefaultTextFormattingUpdate()"
    >
      <template #prepend>
        <q-icon
          name="r_text_fields"
          class="text-semibold text-dark"
          size="20px"
        />
      </template>

      <template #option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label :style="`font-family: ${scope.opt}`">
              {{ scope.opt }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <q-tooltip :offset="[0, 4]">
        {{ $t("presentationStudio.toolbar.text.options.font") }}
      </q-tooltip>
    </q-select>

    <div class="q-mt-md q-mb-sm">
      {{
        $t(
          "presentationLayout.rightDrawer.tabs.design.defaultTextCustomization.color.title",
        )
      }}
    </div>

    <div class="row no-wrap items-center q-gutter-sm">
      <!-- default text colors -->
      <div
        v-for="color in defaultTextColors"
        :key="color"
        class="text_color_box"
        :class="color === text.default.fill ? 'text_color_box--active' : ''"
        :style="`background: ${color};`"
        @click="
          text.default.fill = color;
          handleDefaultTextFormattingUpdate();
        "
      ></div>

      <q-separator vertical class="q-ml-md q-mr-sm" />

      <div class="text-13">
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.design.defaultTextCustomization.color.set",
          )
        }}
      </div>

      <!-- custom color -->
      <div
        class="text_color_box relative-position"
        :style="{
          background: !defaultTextColors.includes(text.default.fill)
            ? text.default.fill
            : '',
        }"
        :class="
          !defaultTextColors.includes(text.default.fill)
            ? 'text_color_box--active'
            : ''
        "
      >
        <q-icon
          name="r_colorize"
          class="absolute-center"
          :style="`color: ${
            !defaultTextColors.includes(text.default.fill)
              ? textColorOnAColoredBackground(text.default.fill)
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
            v-model="text.default.fill"
            @change="handleDefaultTextFormattingUpdate()"
          />
        </q-menu>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FONT_OPTIONS } from "src/constants/canvas/canvasVariables";
import { storeToRefs } from "pinia";
import { textColorOnAColoredBackground } from "src/helpers/colorUtils";
import { useStudioStore } from "stores/studio";
import { usePresentationsStore } from "stores/presentations";

/*
 * stores
 */
const studioStore = useStudioStore();
const { text } = storeToRefs(studioStore);

const presentationsStore = usePresentationsStore();
const { slideSettings } = storeToRefs(presentationsStore);

const defaultTextColors = ["#0A090B", "#ffffff"];

const handleDefaultTextFormattingUpdate = () => {
  slideSettings.value.defaultTextCustomization = text.value.default;
  presentationsStore.syncCurrentSlideWithPresentationSlides();
  presentationsStore.saveSlide();
};
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
  border-radius: 6px;
  border: 1px solid $grey-2;
  transition: 0.2s;
  background: $grey-2;

  &.text_color_box--active {
    border: 1px solid $primary;
  }
}
</style>
