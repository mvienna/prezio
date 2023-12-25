<template>
  <div>
    <!-- show room invitation panel setting -->
    <q-checkbox
      v-model="presentation.settings.show_joining_instructions_bar"
      size="32px"
      @update:model-value="presentationsStore.updatePresentation()"
    >
      <div class="q-ml-sm">
        {{
          $t(
            "presentationStudio.settings.other.showJoiningInstructionsBar.title"
          )
        }}
      </div>
    </q-checkbox>

    <q-separator class="q-my-md" />

    <!-- other -->
    <div class="text-caption text-grey q-mb-sm">
      {{ $t("presentationStudio.settings.other.reactions.title") }}
    </div>

    <div class="row no-wrap q-gutter-md">
      <!-- like -->
      <div>
        <PresentationRoomDataLike :stage="0" />
        <div class="row justify-center q-mt-xs">
          <q-checkbox v-model="availableReactions.like" disable size="24px" />
        </div>
      </div>

      <!-- love -->
      <div>
        <PresentationRoomDataLove :stage="0" />
        <div class="row justify-center q-mt-xs">
          <q-checkbox v-model="availableReactions.love" disable size="24px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import PresentationRoomDataLove from "components/presentationRoom/host/data/PresentationRoomHostDataLove.vue";
import PresentationRoomDataLike from "components/presentationRoom/host/data/PresentationRoomHostDataLike.vue";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation } = storeToRefs(presentationsStore);

/*
 * on load
 */
onBeforeMount(() => {
  presentation.value.settings.show_joining_instructions_bar = Boolean(
    presentation.value.settings.show_joining_instructions_bar
  );
});

/*
 * reactions
 */
const availableReactions = ref({
  like: true,
  love: true,
});
</script>
