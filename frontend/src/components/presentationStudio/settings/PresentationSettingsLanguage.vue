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

    <q-checkbox v-model="temp" disable size="32px">
      <div class="q-ml-sm">
        {{ $t("presentationStudio.settings.language.profanityFilter") }}
      </div>
    </q-checkbox>

    <div
      class="text-grey text-caption q-mt-md q-ml-lg q-pl-md"
      style="line-height: 1.4"
      v-html="$t('presentationStudio.settings.language.info')"
    ></div>

    <q-separator class="q-mt-lg q-mb-md" />
  </div>
</template>

<script setup>
import { LANGUAGES } from "src/constants/languages";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { ref } from "vue";

const temp = ref(true);

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
