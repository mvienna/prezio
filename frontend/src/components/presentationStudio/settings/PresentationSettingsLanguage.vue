<template>
  <div>
    <!-- language -->
    <div class="text-caption text-grey q-mb-xs">
      {{ $t("presentationStudio.settings.language.title") }}
    </div>

    <q-select
      v-model="presentation.settings.lang"
      :options="Object.values(LANGUAGES)"
      emit-value
      map-options
      outlined
      dense
      option-value="value"
      hide-dropdown-icon
      class="q-mb-md"
      @update:model-value="presentationsStore.updatePresentation()"
    />
  </div>
</template>

<script setup>
import { LANGUAGES } from "src/constants/languages";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation } = storeToRefs(presentationsStore);
</script>

<style scoped lang="scss">
::v-deep(.q-field__control) {
  border-radius: 8px;
}
</style>
