<template>
  <div class="room_menu row no-wrap q-gutter-md">
    <div class="room_menu__card row no-wrap">
      <!-- menu -->
      <PresentationRoomHostActionsMenu />

      <!-- spice things up with effect -->
      <PresentationRoomHostActionsEffects />

      <!-- hide results -->
      <PresentationRoomHostActionsHideResultsSettings
        v-if="slide?.type === SLIDE_TYPES.WORD_CLOUD && slideSettings"
      />

      <!-- submission is locked -->
      <PresentationRoomHostActionsSubmissionLockSetting
        v-if="slide?.type === SLIDE_TYPES.WORD_CLOUD && slideSettings"
      />

      <!-- finish quiz -->
      <PresentationRoomHostActionsFinishQuiz
        v-if="
          [
            SLIDE_TYPES.PICK_ANSWER,
            SLIDE_TYPES.PICK_IMAGE,
            SLIDE_TYPES.TYPE_ANSWER,
          ].includes(slide?.type) && room?.is_quiz_started
        "
      />
    </div>

    <!-- countdown -->
    <div
      v-if="timeLeft !== -1 && !room.is_submission_locked"
      class="room_menu__card"
    >
      <PresentationRoomhostActionsCountdown />
    </div>
  </div>

  <!-- results hidden card -->
  <div id="results_hidden_card"></div>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { timeLeft } from "src/helpers/countdown";
import PresentationRoomHostActionsMenu from "components/presentationRoom/host/actions/PresentationRoomHostActionsMenu.vue";
import PresentationRoomHostActionsEffects from "components/presentationRoom/host/actions/PresentationRoomHostActionsEffects.vue";
import PresentationRoomHostActionsHideResultsSettings from "components/presentationRoom/host/actions/PresentationRoomHostActionsHideResultsSetting.vue";
import PresentationRoomHostActionsSubmissionLockSetting from "components/presentationRoom/host/actions/PresentationRoomHostActionsSubmissionLockSetting.vue";
import PresentationRoomHostActionsFinishQuiz from "components/presentationRoom/host/actions/PresentationRoomHostActionsFinishQuiz.vue";
import PresentationRoomhostActionsCountdown from "components/presentationRoom/host/actions/PresentationRoomhostActionsCountdown.vue";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, slide, slideSettings } = storeToRefs(presentationsStore);
</script>

<style scoped lang="scss">
.room_menu {
  position: absolute;
  left: 24px;
  bottom: 24px;
  z-index: 1;

  .room_menu__card {
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
  .room_menu {
    left: 8px;
    bottom: 8px;

    .room_menu__card {
      height: 50px;

      .q-btn {
        font-size: 0.8em;
        height: 36px;
      }
    }
  }
}
</style>
