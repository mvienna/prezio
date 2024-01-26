<template>
  <!-- fill color -->
  <q-btn
    v-if="!transformer.custom.shape.node"
    flat
    round
    size="12px"
    class="relative-position"
    :ripple="false"
    :class="{ 'bg-grey-2': showMenu.fill }"
  >
    <div>
      <q-icon name="icon-mdi_format_color_fill_top" class="absolute-center" />
      <q-icon
        name="icon-mdi_format_color_fill_bottom"
        :style="`color: ${shape.fill}`"
        class="absolute-center"
      />
    </div>

    <q-menu
      v-model="showMenu.fill"
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
        v-model="shape.fill"
        @change="studioStore.applyCustomization()"
      />

      <!-- remove fill -->
      <div class="q-pa-sm">
        <q-btn
          icon="r_remove"
          class="full-width"
          color="grey"
          flat
          dense
          no-caps
          :label="$t('presentationStudio.toolbar.shape.fill.remove')"
          @click="
            shape.fill = 'transparent';
            studioStore.applyCustomization();
          "
        />
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      <div>
        {{ $t("presentationStudio.toolbar.shape.fill.title") }}
      </div>
    </q-tooltip>
  </q-btn>

  <!-- stroke -->
  <q-btn
    flat
    round
    size="12px"
    icon="r_border_outer"
    :class="{ 'bg-grey-2': showMenu.stroke }"
    :ripple="false"
  >
    <q-menu
      v-model="showMenu.stroke"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="no-padding"
    >
      <!-- stroke color -->
      <q-color
        format-model="hex"
        no-header-tabs
        default-view="palette"
        v-model="shape.stroke"
        @change="studioStore.applyCustomization()"
      />

      <!-- line width -->
      <div class="q-py-md q-px-md">
        <div class="text-caption text-grey">
          {{ $t("presentationStudio.toolbar.shape.stroke.width") }}
        </div>

        <div class="row no-wrap items-center q-gutter-md q-pt-sm">
          <q-slider
            v-model="shape.strokeWidth"
            :min="0"
            :max="200"
            label
            thumb-size="14px"
            :label-value="shape.strokeWidth + 'px'"
            @change="studioStore.applyCustomization()"
          />

          <q-input
            v-model.number="shape.strokeWidth"
            :min="0"
            :max="200"
            type="number"
            placeholder="0"
            suffix="px"
            style="min-width: 90px; width: 80px"
            outlined
            dense
            @change="studioStore.applyCustomization()"
          />
        </div>

        <template v-if="transformer.custom.shape.node">
          <div class="text-caption text-grey q-mt-md">
            {{ $t("presentationStudio.toolbar.shape.stroke.pointerSize") }}
          </div>

          <div class="row no-wrap items-center q-gutter-md q-pt-sm">
            <q-slider
              v-model="shape.pointerSize"
              :min="0"
              :max="200"
              label
              thumb-size="14px"
              :label-value="shape.pointerSize + 'px'"
              @change="studioStore.applyCustomization()"
            />

            <q-input
              v-model.number="shape.pointerSize"
              :min="0"
              :max="200"
              type="number"
              placeholder="0"
              suffix="px"
              style="min-width: 90px; width: 80px"
              outlined
              dense
              @change="studioStore.applyCustomization()"
            />
          </div>
        </template>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.shape.stroke.title") }}
    </q-tooltip>
  </q-btn>

  <!-- shadow -->
  <q-btn
    flat
    round
    size="12px"
    icon="icon-shadow"
    :class="{ 'bg-grey-2': showMenu.shadow }"
    :ripple="false"
  >
    <q-menu
      v-model="showMenu.shadow"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="no-padding hide-scrollbar no-padding"
    >
      <!-- shadow color -->
      <q-color
        format-model="hex"
        no-header-tabs
        style="min-width: 216px"
        default-view="palette"
        v-model="shape.shadowColor"
        @change="studioStore.applyCustomization()"
      />

      <div class="q-px-md q-pt-md q-pb-sm">
        <!-- shadow opacity -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.shape.shadow.opacity") }}
          </div>

          <q-slider
            v-model="shape.shadowOpacity"
            :min="0"
            :max="1"
            :step="0.01"
            label
            thumb-size="14px"
            :label-value="Math.round(shape.shadowOpacity * 100) + '%'"
            @change="studioStore.applyCustomization()"
          />
        </div>

        <!-- shadow blur -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.shape.shadow.blur") }}
          </div>

          <q-slider
            v-model="shape.shadowBlur"
            :min="0"
            :max="100"
            label
            thumb-size="14px"
            :label-value="shape.shadowBlur + 'px'"
            @change="studioStore.applyCustomization()"
          />
        </div>

        <!-- shadow offset x -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.shape.shadow.offsetX") }}
          </div>

          <q-slider
            v-model="shape.shadowOffset.x"
            :min="-200"
            :max="200"
            label
            thumb-size="14px"
            :label-value="shape.shadowOffset.x"
            @change="studioStore.applyCustomization()"
          />
        </div>

        <!-- shadow offset y -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.shape.shadow.offsetY") }}
          </div>

          <q-slider
            v-model="shape.shadowOffset.y"
            :min="-200"
            :max="200"
            label
            thumb-size="14px"
            :label-value="shape.shadowOffset.y"
            @change="studioStore.applyCustomization()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.shape.shadow.title") }}
    </q-tooltip>
  </q-btn>

  <!-- opacity -->
  <q-btn
    flat
    round
    size="12px"
    icon="r_opacity"
    :class="{ 'bg-grey-2': showMenu.opacity }"
    :ripple="false"
  >
    <q-menu
      v-model="showMenu.opacity"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      style="width: 220px"
      class="hide-scrollbar no-padding"
    >
      <div class="q-px-md q-pt-md q-pb-sm">
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.shape.opacity.title") }}
          </div>

          <q-slider
            v-model="shape.opacity"
            :min="0"
            :max="1"
            :step="0.01"
            label
            thumb-size="14px"
            :label-value="Math.round(shape.opacity * 100) + '%'"
            @change="studioStore.applyCustomization()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.shape.opacity.title") }}
    </q-tooltip>
  </q-btn>

  <!-- corner radius -->
  <q-btn
    v-if="
      transformer.default
        .nodes()
        .filter((node) => node.getClassName() === SHAPES_OPTIONS.RECT).length
    "
    flat
    round
    size="12px"
    icon="r_rounded_corner"
    :class="{ 'bg-grey-2': showMenu.cornerRadius }"
    :ripple="false"
  >
    <q-menu
      v-model="showMenu.cornerRadius"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="hide-scrollbar no-padding"
      style="width: 250px"
    >
      <div class="q-pa-md">
        <div class="text-caption text-grey">
          {{ $t("presentationStudio.toolbar.shape.cornerRadius.title") }}
        </div>

        <div class="row no-wrap items-center q-gutter-md q-pt-sm">
          <q-slider
            v-model="shape.cornerRadius"
            :min="0"
            :max="50"
            label
            thumb-size="14px"
            :label-value="shape.cornerRadius + '%'"
            @change="studioStore.applyCustomization()"
          />

          <q-input
            v-model.number="shape.cornerRadius"
            :min="0"
            :max="50"
            type="number"
            placeholder="0"
            suffix="%"
            style="min-width: 80px; width: 80px"
            outlined
            dense
            @change="studioStore.applyCustomization()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.shape.cornerRadius.title") }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { ref } from "vue";
import { useStudioStore } from "stores/studio";
import { storeToRefs } from "pinia";
import { SHAPES_OPTIONS } from "src/constants/canvas/canvasVariables";

/*
 * stores
 */
const studioStore = useStudioStore();
const { shape, transformer } = storeToRefs(studioStore);

const showMenu = ref({
  fill: false,
  stroke: false,
  opacity: false,
  cornerRadius: false,
});
</script>

<style lang="scss">
.q-field--dense .q-field__control {
  height: 30px !important;

  .q-field__suffix {
    padding: 0;
  }
}
</style>
