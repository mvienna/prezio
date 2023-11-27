<template>
  <div class="full-width row no-wrap justify-center q-py-md fixed-bottom">
    <q-card
      flat
      style="background: rgba(0, 0, 0, 0.5); border-radius: 24px !important"
    >
      <q-card-section
        class="row no-wrap items-center q-gutter-md q-px-md q-py-sm"
      >
        <slot name="icon" />

        <div class="text-h7 text-semibold text-white">
          <slot name="message" />
        </div>

        <div
          style="background: rgba(255, 255, 255, 0.2); border-radius: 24px"
          class="q-px-md q-py-xs row items-center text-white"
        >
          <span class="text-h7 text-semibold">
            <slot name="score" />

            <q-tooltip
              v-if="scoreTooltip"
              anchor="center end"
              self="center start"
              transition-show="jump-right"
              transition-hide="jump-left"
              :offset="[40, 0]"
            >
              <slot name="score-tooltip" />
            </q-tooltip>
          </span>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
defineProps({
  scoreTooltip: { type: Boolean },
});
</script>
