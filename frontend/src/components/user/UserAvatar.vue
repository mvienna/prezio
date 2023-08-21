<template>
  <q-avatar color="primary" text-color="white">
    <!-- uploaded avatar -->
    <q-img
      v-if="user.avatar"
      :src="user.avatar.original_url"
      :alt="user.name"
      fit="cover"
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
