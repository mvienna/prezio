<template>
  <div class="row no-wrap items-center">
    <!-- icon -->
    <q-icon v-if="icon" :name="icon" color="grey" size="24px">
      <q-tooltip
        v-if="tooltip"
        class="text-center"
        max-width="200px"
        :offset="[0, 8]"
      >
        {{ tooltip }}
      </q-tooltip>
    </q-icon>

    <!-- label -->
    <div class="text-black q-mx-3xs">
      {{ label }}
    </div>

    <q-space />

    <!-- slot -->
    <slot />
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: null },
  label: { type: String, default: null },
  tooltip: { type: String, default: null },
});
</script>
