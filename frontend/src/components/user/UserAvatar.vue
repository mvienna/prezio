<template>
  <q-avatar color="primary" text-color="white">
    {{ user?.name?.charAt(0).toUpperCase() }}
  </q-avatar>
</template>

<script setup>
defineProps({
  user: { type: Object, default: null },
});
</script>
