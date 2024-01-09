<template>
  <q-page></q-page>
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useAuthStore } from "stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();

const router = useRouter();

onBeforeMount(async () => {
  await authStore.logout();
});
</script>

<style lang="scss">
.chaport-container {
  display: none;
}
</style>
