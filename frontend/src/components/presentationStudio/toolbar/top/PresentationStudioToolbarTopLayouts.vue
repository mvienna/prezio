<template>
  <div class="q-pa-sm">
    <div class="text-grey q-mb-md">
      {{ $t("presentationStudio.toolbar.layouts.title") }}
    </div>

    <div class="layouts_wrapper">
      <q-card
        v-for="layout in Object.values(LAYOUT_OPTIONS)"
        :key="layout.name"
        class="layout"
        flat
        :class="
          layers.default
            .find(MODE_OPTIONS.TEXT)
            .filter((node) => node.getAttr('layout') === layout.name).length
            ? 'layout--active'
            : ''
        "
        v-close-popup
        @click="studioStore.setLayout(layout)"
      >
        <q-card-section class="q-pa-sm">
          <div class="row no-wrap justify-center">
            <q-img
              :src="`/assets/icons/slide/layouts/${layout.name}${
                layers.default
                  .find(MODE_OPTIONS.TEXT)
                  .filter((node) => node.getAttr('layout') === layout.name)
                  .length
                  ? '--active'
                  : ''
              }.svg`"
            />
          </div>

          <div class="text-center text-13 q-mt-sm">
            {{
              $t(`presentationStudio.toolbar.layouts.options.${layout.name}`)
            }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { LAYOUT_OPTIONS } from "src/constants/canvas/canvasVariables";
import { storeToRefs } from "pinia";
import { useStudioStore } from "stores/studio";

/*
 * stores
 */
const studioStore = useStudioStore();
const { layers, MODE_OPTIONS } = storeToRefs(studioStore);
</script>

<style scoped lang="scss">
.layouts_wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  .layout {
    cursor: pointer;
    border-radius: 6px;
    transition: 0.2s;
    outline: 1px solid transparent;

    .q-img {
      transition: 0.4s;
    }

    &:hover {
      background: $background;
      outline-color: $accent;
    }

    &.layout--active {
      color: $secondary;
      background: #f5f8fd;

      .text-caption {
        font-weight: 600;
      }

      .q-img {
        //filter: brightness(200%);
      }
    }
  }
}
</style>
