<template>
  <div class="container">
    <!-- folders -->
    <PresentationsBrowserFolders />

    <!-- presentations table -->
    <PresentationsBrowserPresentationsTable />
  </div>
</template>

<script setup>
import PresentationsBrowserPresentationsTable from "components/presentationsBrowser/presentations/PresentationsBrowserPresentationsTable.vue";
import PresentationsBrowserFolders from "components/presentationsBrowser/folders/PresentationsBrowserFolders.vue";
</script>
