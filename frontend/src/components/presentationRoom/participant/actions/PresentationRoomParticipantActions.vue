<template>
  <div class="room_actions row no-wrap q-gutter-md">
    <div class="room_actions__card row no-wrap">
      <!-- chat -->
      <PresentationRoomActionsChat
        v-if="
          SLIDE_TYPES_OF_QUIZ.includes(slide?.type) &&
          presentation?.settings &&
          (!presentation.settings.quiz_data ||
            (presentation?.settings?.quiz_data &&
              JSON.parse(presentation.settings.quiz_data)?.liveChat))
        "
      />
    </div>
  </div>
</template>

<script setup>
import { SLIDE_TYPES_OF_QUIZ } from "src/constants/presentationStudio";
import PresentationRoomActionsChat from "components/presentationRoom/PresentationRoomActionsChat.vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

/*
 * stores
 */
const presentationsStores = usePresentationsStore();
const { presentation, slide } = storeToRefs(presentationsStores);
</script>

<style scoped lang="scss">
.room_actions {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1;

  .room_actions__card {
    height: 62px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.5);
    color: $white;
    backdrop-filter: blur(4px);
    border-radius: 24px;

    .q-btn {
      border-radius: 16px;
      font-size: 1em;
      transition: 0.2s;
      height: 46px;
    }
  }
}

@media screen and (max-width: 960px) {
  .room_actions {
    right: 8px;
    bottom: 8px;

    .room_actions__card {
      height: 50px;

      .q-btn {
        font-size: 0.8em;
        height: 36px;
      }
    }
  }
}
</style>
