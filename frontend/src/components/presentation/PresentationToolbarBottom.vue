<template>
  <div
    class="presentation_toolbar__bottom bg-white q-pb-md q-pr-md row no-wrap q-gutter-md items-center"
  >
    <div>
      <div>
        <b>x:</b> {{ Math.round(mouse.x) }} <b>y:</b>
        {{ Math.round(mouse.y) }}
      </div>
    </div>

    <q-space />

    <div class="row no-wrap">
      <q-btn
        icon="zoom_out"
        round
        size="12px"
        unelevated
        @click="$emit('zoomOut')"
      />

      <q-btn :label="`${Math.round(scale * 100)}%`" unelevated>
        <q-menu
          anchor="top middle"
          self="bottom middle"
          transition-show="jump-down"
          transition-hide="jump-up"
          :offset="[0, 8]"
          class="q-pa-sm"
        >
          <q-item
            v-for="zoomOption in zoomOptions"
            :key="zoomOption"
            clickable
            class="items-center justify-center"
            @click="$emit('zoom', zoomOption)"
          >
            {{ zoomOption * 100 }}%
          </q-item>
        </q-menu>
      </q-btn>

      <q-btn
        icon="zoom_in"
        round
        size="12px"
        unelevated
        @click="$emit('zoomIn')"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";

/*
 * stores
 */
const { mouse, scale } = storeToRefs(useCanvasStore());

/*
 * emits
 */
defineEmits(["zoomIn", "zoomOut", "zoom"]);

/*
 * props
 */

const zoomOptions = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3];
</script>

<style scoped lang="scss">
.presentation_toolbar__bottom {
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 16px;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.05) 0 6px 24px 0;
}

.q-item {
  border-radius: 4px;
}
</style>
