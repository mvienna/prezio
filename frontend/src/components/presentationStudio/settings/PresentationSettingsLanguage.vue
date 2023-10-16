<template>
  <q-select
    v-model="lang"
    :options="Object.values(LANGUAGES)"
    emit-value
    map-options
    outlined
    option-value="value"
    hide-dropdown-icon
    class="q-mb-md"
  >
    <template #append>
      <q-btn
        round
        flat
        size="10px"
        icon="r_done"
        color="primary"
        :disable="lang === presentation.settings.lang"
        @click="
          () => {
            presentation.settings.lang = lang;
            presentationsStore.updatePresentation();
          }
        "
      />
    </template>
  </q-select>
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

/*
 * lang
 */
const lang = ref(presentation.value.settings.lang);
</script>
