<template>
  <div class="fullscreen text-center text-secondary q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh; line-height: 1.2">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>

      <q-btn
        class="q-mt-xl"
        color="secondary"
        unelevated
        :to="ROUTE_PATHS.INDEX"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
import { ROUTE_PATHS } from "src/constants/routes";
</script>

<style lang="scss">
.chaport-container {
  display: none;
}
</style>
