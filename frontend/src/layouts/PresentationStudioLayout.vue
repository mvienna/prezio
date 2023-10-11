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
import PresentationLayoutHeader from "components/layouts/presentation/studio/PresentationStudioLayoutHeader.vue";
import PresentationLayoutDrawerRight from "components/layouts/presentation/studio/PresentationStudioLayoutDrawerRight.vue";
import PresentationLayoutDrawerLeft from "components/layouts/presentation/studio/PresentationStudioLayoutDrawerLeft.vue";
</script>
