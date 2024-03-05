<template>
  <!-- formatting - bold -->
  <q-btn flat size="12px" round :ripple="false" icon="icon-format_bold" text-color="black"
    :class="{ 'bg-grey-2': text.fontStyle.includes('bold') }" @click="() => {
      text.fontStyle = (
        text.fontStyle.includes('bold')
          ? text.fontStyle.replace('bold', '')
          : text.fontStyle.replace('normal', '') + ' bold'
      )
        .replace(/\s+/g, ' ')
        .trim();
      studioStore.applyCustomization();
    }
      ">
    <q-tooltip>
      <div class="text-bold text-center">
        {{ $t("presentationStudio.toolbar.text.options.formatting.bold") }}
      </div>

      <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm">
        <div v-if="isMac">⌘</div>
        <div v-else>Ctrl</div>
        <div>B</div>
      </div>
    </q-tooltip>
  </q-btn>

  <div id="editor-container"></div>

  <!-- formatting - line hight -->

  <q-select v-model="text.lineHeight" :options="LINE_HEIGHT_OPTIONS" emit-value borderless color="black" dense
    options-dense style="width: 80px; min-width: 25px; max-width: 70px" @update:model-value="() => {
      studioStore.applyCustomization();
    }">
    <template #prepend>
      <q-icon name="r_height" />
    </template>
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label :style="`line-height: ${scope.opt}`">
            {{ scope.opt }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>

  <!-- formatting - letter spacing  -->

  <q-select v-model="text.letterSpacing" :options="LETTER_SPACING_OPTIONS" emit-value borderless color="black" dense
    options-dense style="max-width: 80px; min-width: 25px" @update:model-value="() => {
      studioStore.applyCustomization();
    }">
    <template #prepend>
      <q-icon name="icon-letter_spacing" />
    </template>
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label :style="`line-height: ${scope.opt}px`">
            {{ scope.opt }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>

  <!-- formatting - vertical align  -->

  <q-select v-model="text.verticalAlign" :options="VERTICAL_ALIGN_OPTIONS" emit-value borderless color="black" dense
    options-dense style="max-width: 120px; min-width: 110px;" @update:model-value="applyCustomization">
    <template #prepend>
      <q-icon name="r_vertical_align_center" />
    </template>
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>
            {{ scope.opt }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>





  <!-- formatting - underline -->
  <q-btn flat size="12px" round :ripple="false" icon="icon-format_underlined" text-color="black"
    :class="{ 'bg-grey-2': text.textDecoration.includes('underline') }" @click="() => {
      text.textDecoration = (
        text.textDecoration.includes('underline')
          ? text.textDecoration.replace('underline', '')
          : text.textDecoration + ' underline'
      )
        .replace(/\s+/g, ' ')
        .trim();
      studioStore.applyCustomization();
    }
      ">
    <q-tooltip>
      <div style="text-decoration: underline" class="text-center">
        {{ $t("presentationStudio.toolbar.text.options.formatting.underline") }}
      </div>

      <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm">
        <div v-if="isMac">⌘</div>
        <div v-else>Ctrl</div>
        <div>U</div>
      </div>
    </q-tooltip>
  </q-btn>

  <!-- formatting - strike-through -->
  <q-btn flat size="12px" round :ripple="false" icon="icon-format_strikethough_s" text-color="black"
    :class="{ 'bg-grey-2': text.textDecoration.includes('line-through') }" @click="() => {
      text.textDecoration = (
        text.textDecoration.includes('line-through')
          ? text.textDecoration.replace('line-through', '')
          : text.textDecoration + ' line-through'
      )
        .replace(/\s+/g, ' ')
        .trim();
      studioStore.applyCustomization();
    }
      ">
    <q-tooltip>
      <div style="text-decoration: line-through" class="text-center">
        {{
          $t("presentationStudio.toolbar.text.options.formatting.strikeThrough")
        }}
      </div>

      <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm">
        <div v-if="isMac">⌘</div>
        <div v-else>Ctrl</div>
        <div>⇧</div>
        <div>X</div>
      </div>
    </q-tooltip>
  </q-btn>

  <!-- formatting - italic -->
  <q-btn flat size="12px" round :ripple="false" icon="icon-format_italic" text-color="black"
    :class="{ 'bg-grey-2': text.fontStyle.includes('italic') }" @click="() => {
      text.fontStyle = (
        text.fontStyle.includes('italic')
          ? text.fontStyle.replace('italic', '')
          : text.fontStyle.replace('normal', '') + ' italic'
      )
        .replace(/\s+/g, ' ')
        .trim();
      studioStore.applyCustomization();
    }
      ">
    <q-tooltip>
      <div class="text-italic text-center">
        {{ $t("presentationStudio.toolbar.text.options.formatting.italic") }}
      </div>

      <div v-if="showShortcuts" class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm">
        <div v-if="isMac">⌘</div>
        <div v-else>Ctrl</div>
        <div>I</div>
      </div>
    </q-tooltip>
  </q-btn>

  <!-- formatting - alignment -->
  <q-btn flat size="12px" round color="black" :icon="text.align === ALIGNMENT.horizontal.left
    ? 'r_format_align_left'
    : text.align === ALIGNMENT.horizontal.right
      ? 'r_format_align_right'
      : text.align === ALIGNMENT.horizontal.center
        ? 'r_format_align_center'
        : ''
    ">
    <q-tooltip>
      {{ $t("presentationStudio.toolbar.text.options.formatting.alignment") }}
    </q-tooltip>

    <q-menu anchor="bottom right" self="top right" transition-show="jump-down" transition-hide="jump-up" :offset="[0, 8]"
      class="q-pa-sm">
      <div class="column no-wrap">
        <div class="row no-wrap">
          <q-btn v-for="item in Object.keys(ALIGNMENT.horizontal)" :key="item" flat :ripple="false" size="12px" round
            :class="item === text.align ? 'text-black bg-grey-2' : 'text-grey'" :icon="item === ALIGNMENT.horizontal.left
              ? 'r_format_align_left'
              : item === ALIGNMENT.horizontal.right
                ? 'r_format_align_right'
                : item === ALIGNMENT.horizontal.center
                  ? 'r_format_align_center'
                  : 'r_format_align_left'
              " @click="() => {
    text.align = item;
    studioStore.applyCustomization();
  }
    " />
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

  <div class="row items-center">
    <q-separator vertical style="height: 24px" />
  </div>

  <!-- color picker -->
  <q-btn flat round size="12px" class="relative-position">
    <div>
      <q-icon name="icon-mdi_format_color_top" class="absolute-center" />
      <q-icon name="icon-mdi_format_color_bottom" :style="`color: ${text.fill}`" class="absolute-center" />
    </div>

    <q-menu anchor="bottom left" self="top left" transition-show="jump-down" transition-hide="jump-up" :offset="[0, 8]"
      class="no-padding">
      <q-color format-model="hex" no-header-tabs default-view="palette" v-model="text.fill"
        @change="studioStore.applyCustomization()" />
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.text.options.color") }}
    </q-tooltip>
  </q-btn>

  <!-- font -->
  <q-select v-model="text.fontFamily" :options="FONT_OPTIONS" emit-value borderless color="black" dense options-dense
    class="text-no-wrap" @update:model-value="studioStore.applyCustomization()">
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

  <!-- font size -->
  <q-input v-model.number="text.fontSize" type="number" color="primary" dense borderless
    style="width: 64px; min-width: 64px; max-width: 64px" @update:model-value="studioStore.applyCustomization()">
    <template #after>
      <div class="text-caption">px</div>
    </template>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.text.options.fontSize") }}
    </q-tooltip>
  </q-input>
</template>

<script setup>
import { ALIGNMENT, FONT_OPTIONS, LINE_HEIGHT_OPTIONS, LETTER_SPACING_OPTIONS, VERTICAL_ALIGN_OPTIONS } from "src/constants/canvas/canvasVariables";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { computed } from "vue";
import { useStudioStore } from "stores/studio";

/*
 * variables
 */
const $q = useQuasar();

/*
 * stores
 */
const studioStore = useStudioStore();
const { text } = storeToRefs(studioStore);

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
::v-deep(input) {

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
}
</style>
