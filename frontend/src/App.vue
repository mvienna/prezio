<template>
  <router-view />
</template>

<script setup>
import { Screen } from "quasar";
Screen.setSizes({ sm: 516, md: 700, lg: 1000, xl: 1200 });
</script>
