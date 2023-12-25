<template>
  <div class="text-semibold">
    <q-separator class="q-mt-md" />

    <div class="row no-wrap items-center justify-between q-mt-sm">
      <div>
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.settings.filterProfanity.title"
          )
        }}

        <q-icon name="r_info" class="q-ml-xs" color="grey-8">
          <q-tooltip class="text-center" max-width="250px" :offset="[0, 8]">
            {{
              $t(
                "presentationLayout.rightDrawer.tabs.settings.filterProfanity.description"
              )
            }}
          </q-tooltip>
        </q-icon>
      </div>

      <q-toggle
        v-model="slideSettings.filterProfanity"
        color="primary"
        class="q-mt-xs"
        @update:model-value="$emit('updateSlideSettings')"
      />
    </div>
  </div>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { SLIDE_TYPES } from "src/constants/presentationStudio";

/*
 * emits
 */
defineEmits(["updateSlideSettings"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings, slide } = storeToRefs(presentationsStore);
</script>
