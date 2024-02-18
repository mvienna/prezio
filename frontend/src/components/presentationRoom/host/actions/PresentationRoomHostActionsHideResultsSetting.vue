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
          }`,
        )
      }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings } = storeToRefs(presentationsStore);

/*
 * toggle results hidden settings
 */
const toggleResultsHiddenSetting = async () => {
  slideSettings.value.isResultsHidden = !slideSettings.value.isResultsHidden;
  await presentationsStore.syncCurrentSlideWithPresentationSlides();
  await presentationsStore.saveSlide();
};
</script>
