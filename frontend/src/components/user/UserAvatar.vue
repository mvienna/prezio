<template>
  <q-avatar text-color="primary">
    <!-- uploaded avatar -->
    <q-img
      v-if="user.avatar"
      :src="user.avatar.preview_url || user.avatar.original_url"
      :alt="user.name"
      style="width: 100%; height: 100%"
    />

    <!-- default avatar -->
    <q-icon v-else name="r_account_circle" size="30px" />
  </q-avatar>
</template>

<script setup>
defineProps({
  user: { type: Object, default: null },
});
</script>

<style scoped lang="scss">
.q-avatar {
  background: transparent !important;
}
</style>
