<template>
  <div class="presentation_toolbar__bottom">
    <b>x:</b> {{ Math.round(mouse.x) }} <b>y:</b>
    {{ Math.round(mouse.y) }}
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";

/*
 * stores
 */
const { mouse } = storeToRefs(useCanvasStore());
</script>

<style scoped lang="scss">
.presentation_toolbar__bottom {
  position: absolute;
  z-index: 2;
  bottom: 16px;
  left: 16px;
  font-size: 12px;
}
</style>
