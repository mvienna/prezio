<template>
  <div class="container">
    <!-- folders -->
    <PresentationsBrowserFolders />

    <!-- presentations table -->
    <PresentationsBrowserPresentationsTable />
  </div>
</template>

<script setup>
import PresentationsBrowserPresentationsTable from "components/presentations/browser/presentations/PresentationsBrowserPresentationsTable.vue";
import PresentationsBrowserFolders from "components/presentations/browser/folders/PresentationsBrowserFolders.vue";
</script>
