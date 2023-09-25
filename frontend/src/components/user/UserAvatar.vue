<template>
  <q-avatar color="primary" text-color="white">
    <!-- uploaded avatar -->
    <q-img
      v-if="user.avatar"
      :src="user.avatar.preview_url || user.avatar.original_url"
      :alt="user.name"
      style="width: 100%; height: 100%"
    />

    <!-- default avatar -->
    <q-icon v-else name="person" size="24px" />
  </q-avatar>
</template>

<script setup>
defineProps({
  user: { type: Object, default: null },
});
</script>
