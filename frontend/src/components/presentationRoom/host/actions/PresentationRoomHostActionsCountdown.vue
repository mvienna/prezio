<template>
  <q-btn flat class="q-px-sm">
    <q-circular-progress
      :value="timeLeftPercentage"
      size="28px"
      :thickness="1"
      :color="
        timeLeftPercentage < 25
          ? 'positive'
          : timeLeftPercentage < 50
          ? 'yellow-10'
          : timeLeftPercentage < 75
          ? 'orange'
          : 'red'
      "
      track-color="white"
    />

    <div class="q-mx-sm" style="width: 24px">
      {{ countdown }}
    </div>

    <q-icon name="r_chevron_right" />

    <q-menu
      anchor="bottom right"
      self="bottom left"
      transition-show="jump-right"
      transition-hide="jump-left"
      :offset="[16, 8]"
      class="q-pa-sm"
      style="
        background: rgba(0, 0, 0, 0.5);
        color: white;
        backdrop-filter: blur(4px);
        border-radius: 24px;
      "
    >
      <template v-for="n in 4" :key="n">
        <q-separator v-if="n !== 1" class="q-my-xs" />

        <q-item
          clickable
          dense
          @click="setNewCountdownTime(n)"
          class="column justify-center"
          :style="
            n === 1
              ? 'border-radius: 16px 16px 8px 8px;'
              : n === 4
              ? 'border-radius: 8px 8px 16px 16px;'
              : ''
          "
        >
          <q-item-label>
            <span class="text-semibold">{{ n * multiplier }}</span>
            {{ $t("presentationRoom.footer.submissionLock.resetTime.sec") }}
          </q-item-label>
        </q-item>
      </template>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { countdown, timeLeftPercentage } from "src/helpers/countdown";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { useCanvasStore } from "stores/canvas";

/*
 * variables
 */
const multiplier = 10;

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, slideSettings } = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

/*
 * set new countdown time
 */
const setNewCountdownTime = async (n) => {
  await presentationsStore.updateRoom(undefined, undefined, {
    countdown: n * multiplier,
    is_submission_locked: false,
  });
};
</script>
