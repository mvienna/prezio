<template>
  <div>
    <div class="row no-wrap items-center justify-between text-semibold q-pb-xs">
      <span>
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.settings.entriesPerParticipant.title"
          )
        }}

        <q-icon name="r_info" class="q-ml-xs" color="grey-8">
          <q-tooltip class="text-center" max-width="200px" :offset="[0, 8]">
            {{
              $t(
                "presentationLayout.rightDrawer.tabs.settings.entriesPerParticipant.description"
              )
            }}
          </q-tooltip>
        </q-icon>
      </span>
    </div>

    <q-input
      v-model="slideSettings.entriesPerParticipant"
      type="number"
      class="q-mt-sm"
      outlined
      dense
      :min="1"
      :max="10"
      placeholder="1"
      style="width: 160px"
      hide-bottom-space
      :rules="entriesPerParticipantRules"
      @update:model-value="
        () => {
          if (
            isEntriesPerParticipantValid(
              Number(slideSettings.entriesPerParticipant)
            )
          ) {
            $emit('updateSlideSettings');
          }
        }
      "
    >
      <template #prepend>
        <q-icon name="r_keyboard_return" color="black" class="q-mr-xs" />
      </template>
    </q-input>
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

/*
 * rules
 */
const entriesPerParticipantRules = [
  (val) =>
    isEntriesPerParticipantValid(val) ||
    t(
      "presentationLayout.rightDrawer.tabs.settings.entriesPerParticipant.invalid"
    ),
];

const isEntriesPerParticipantValid = (val) => {
  return val >= 0 && val <= 10;
};
</script>
