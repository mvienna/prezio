<template>
  <div class="row no-wrap items-center justify-between text-semibold">
    <span>
      {{ $t("presentationLayout.rightDrawer.tabs.settings.leaderboard.title") }}

      <q-icon name="r_info" class="q-ml-xs" color="grey-8">
        <q-tooltip class="text-center" max-width="200px" :offset="[0, 8]">
          {{
            $t(
              "presentationLayout.rightDrawer.tabs.settings.leaderboard.description"
            )
          }}
        </q-tooltip>
      </q-icon>
    </span>

    <q-toggle
      v-model="slideSettings.showLeaderboard"
      color="primary"
      @update:model-value="$emit('updateSlideSettings')"
    />
  </div>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

/*
 * emits
 */
defineEmits(["updateSlideSettings"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings } = storeToRefs(presentationsStore);
</script>
