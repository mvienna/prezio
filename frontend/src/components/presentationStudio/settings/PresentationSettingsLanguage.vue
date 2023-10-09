<template>
  <div>
    <q-select
      v-model="lang"
      :options="Object.values(LANGUAGES)"
      emit-value
      map-options
      outlined
      option-value="value"
      hide-dropdown-icon
    >
      <template #append>
        <q-btn
          round
          unelevated
          size="10px"
          icon="r_save"
          color="primary"
          :disable="lang === presentation.lang"
          @click="
            () => {
              presentation.lang = lang;
              presentationsStore.updatePresentation();
            }
          "
        />
      </template>
    </q-select>
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

/*
 * lang
 */
const lang = ref(presentation.value.lang);
</script>
