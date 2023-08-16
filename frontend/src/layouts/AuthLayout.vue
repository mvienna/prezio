<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup></script>

<style scoped lang="scss">
.q-page-container {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: $grey-2;
}

@media screen and (max-width: 600px) {
  .q-page-container {
    background: $white;
  }
}
</style>
