<template>
  <!-- replace image -->
  <q-btn
    flat
    round
    size="12px"
    icon="icon-image_edit"
    :class="{ 'bg-grey-2': showSelectMediaDialog }"
    :ripple="false"
    @click="showSelectMediaDialog = true"
  >
    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.image.replaceImage.title") }}
    </q-tooltip>
  </q-btn>

  <q-dialog v-model="showSelectMediaDialog">
    <SelectMedia
      @cancel="showSelectMediaDialog = false"
      @select="
        studioStore.replaceImage(
          undefined,
          $event?.preview_url || $event?.original_url || $event?.urls?.regular,
        );
        showSelectMediaDialog = false;
      "
    />
  </q-dialog>

  <!-- clip position -->
  <q-btn
    flat
    round
    size="12px"
    icon="r_crop"
    :class="{ 'bg-grey-2': showMenu.clipPosition }"
    :ripple="false"
  >
    <q-menu
      v-model="showMenu.clipPosition"
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 8]"
      class="no-padding hide-scrollbar no-padding"
    >
      <div class="column no-wrap q-py-sm">
        <q-item
          v-for="item in Object.values(CROP_POSITION_OPTIONS)"
          :key="item"
          :active="image.clipPosition === item"
          clickable
          dense
          @click="
            image.clipPosition = item;
            studioStore.applyCustomization();
          "
        >
          <q-item-section avatar style="min-width: 20px">
            <q-icon :name="`icon-clipPosition-${item}`" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ $t(`presentationStudio.toolbar.image.clipPosition.${item}`) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.image.clipPosition.title") }}
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
        v-model="image.shadowColor"
        @change="studioStore.applyCustomization()"
      />

      <div class="q-px-md q-pt-md q-pb-sm">
        <!-- shadow opacity -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.image.shadow.opacity") }}
          </div>

          <q-slider
            v-model="image.shadowOpacity"
            :min="0"
            :max="1"
            :step="0.01"
            label
            thumb-size="14px"
            :label-value="Math.round(image.shadowOpacity * 100) + '%'"
            @change="studioStore.applyCustomization()"
          />
        </div>

        <!-- shadow blur -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.image.shadow.blur") }}
          </div>

          <q-slider
            v-model="image.shadowBlur"
            :min="0"
            :max="100"
            label
            thumb-size="14px"
            :label-value="image.shadowBlur + 'px'"
            @change="studioStore.applyCustomization()"
          />
        </div>

        <!-- shadow offset x -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.image.shadow.offsetX") }}
          </div>

          <q-slider
            v-model="image.shadowOffset.x"
            :min="-200"
            :max="200"
            label
            thumb-size="14px"
            :label-value="image.shadowOffset.x"
            @change="studioStore.applyCustomization()"
          />
        </div>

        <!-- shadow offset y -->
        <div>
          <div class="text-caption text-grey">
            {{ $t("presentationStudio.toolbar.image.shadow.offsetY") }}
          </div>

          <q-slider
            v-model="image.shadowOffset.y"
            :min="-200"
            :max="200"
            label
            thumb-size="14px"
            :label-value="image.shadowOffset.y"
            @change="studioStore.applyCustomization()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.image.shadow.title") }}
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
            {{ $t("presentationStudio.toolbar.image.opacity.title") }}
          </div>

          <q-slider
            v-model="image.opacity"
            :min="0"
            :max="1"
            :step="0.01"
            label
            thumb-size="14px"
            :label-value="Math.round(image.opacity * 100) + '%'"
            @change="studioStore.applyCustomization()"
          />
        </div>
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.image.opacity.title") }}
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
        v-model="image.stroke"
        @change="studioStore.applyCustomization()"
      />

      <!-- line width -->
      <div class="q-py-md q-px-md">
        <div class="text-caption text-grey">
          {{ $t("presentationStudio.toolbar.image.stroke.width") }}
        </div>

        <div class="row no-wrap items-center q-gutter-md q-pt-sm">
          <q-slider
            v-model="image.strokeWidth"
            :min="0"
            :max="200"
            label
            thumb-size="14px"
            :label-value="image.strokeWidth + 'px'"
            @change="studioStore.applyCustomization()"
          />

          <q-input
            v-model.number="image.strokeWidth"
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
      </div>
    </q-menu>

    <q-tooltip :offset="[0, 4]">
      {{ $t("presentationStudio.toolbar.image.stroke.title") }}
    </q-tooltip>
  </q-btn>

  <!-- corner radius -->
  <q-btn
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
          {{ $t("presentationStudio.toolbar.image.cornerRadius.title") }}
        </div>

        <div class="row no-wrap items-center q-gutter-md q-pt-sm">
          <q-slider
            v-model="image.cornerRadius"
            :min="0"
            :max="50"
            label
            thumb-size="14px"
            :label-value="image.cornerRadius + '%'"
            @change="studioStore.applyCustomization()"
          />

          <q-input
            v-model.number="image.cornerRadius"
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
      {{ $t("presentationStudio.toolbar.image.cornerRadius.title") }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useStudioStore } from "stores/studio";
import SelectMedia from "components/media/SelectMedia.vue";
import { ref } from "vue";
import { CROP_POSITION_OPTIONS } from "src/constants/canvas/canvasVariables";

/*
 * stores
 */
const studioStore = useStudioStore();
const { image } = storeToRefs(studioStore);

/*
 * menus
 */
const showSelectMediaDialog = ref(false);
const showMenu = ref({
  clipPosition: false,
  shadow: false,
  opacity: false,
  stroke: false,
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
