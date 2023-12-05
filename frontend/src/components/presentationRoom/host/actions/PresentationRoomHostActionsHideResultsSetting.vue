<template>
  <!-- hide results -->
  <q-btn
    flat
    round
    icon="r_leaderboard"
    class="q-ml-sm"
    style="width: 46px"
    :style="slideSettings.isResultsHidden ? 'opacity: 0.5;' : ''"
    @click="toggleResultsHiddenSetting()"
  >
    <q-tooltip
      anchor="top middle"
      self="bottom middle"
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      {{
        $t(
          `presentationRoom.footer.hideResults.tooltip.${
            slideSettings.isResultsHidden ? "off" : "on"
          }`
        )
      }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings } = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

/*
 * toggle results hidden settings
 */
const toggleResultsHiddenSetting = async () => {
  slideSettings.value.isResultsHidden = !slideSettings.value.isResultsHidden;
  await presentationsStore.updateLocalSlide();
  await presentationsStore.saveSlide(undefined, elements.value);
};
</script>
