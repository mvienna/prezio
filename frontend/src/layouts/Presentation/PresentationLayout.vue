<template>
  <q-layout view="hHh lpR fFf">
    <!-- header -->
    <PresentationLayoutHeader />

    <!-- left drawer (slides) -->
    <PresentationLayoutDrawerLeft />

    <!-- right drawer (tabs) -->
    <PresentationLayoutDrawerRight />

    <!-- router view -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import PresentationLayoutHeader from "layouts/Presentation/PresentationLayoutHeader.vue";
import PresentationLayoutDrawerRight from "layouts/Presentation/PresentationLayoutDrawerRight.vue";
import PresentationLayoutDrawerLeft from "layouts/Presentation/PresentationLayoutDrawerLeft.vue";
</script>
