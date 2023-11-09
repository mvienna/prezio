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

    <q-btn
      unelevated
      color="black"
      no-caps
      :label="
        $t('presentationLayout.rightDrawer.tabs.settings.leaderboard.create')
      "
      disable
      icon-right="icon-sparkles"
    >
      <q-tooltip> В разработке </q-tooltip>
    </q-btn>
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
