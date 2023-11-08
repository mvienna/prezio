<template>
  <div class="room_actions row no-wrap q-gutter-md">
    <div class="room_actions__card row no-wrap">
      <!-- menu -->
      <PresentationRoomHostActionsMenu />

      <!-- chat -->
      <PresentationRoomActionsChat
        v-if="
          SLIDE_TYPES_OF_QUIZ.includes(slide?.type) &&
          presentation?.settings &&
          (!presentation.settings.quiz_data ||
            (presentation?.settings?.quiz_data &&
              JSON.parse(presentation.settings.quiz_data)?.liveChat))
        "
        :offset="[0, 16]"
      />

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
          SLIDE_TYPES_OF_QUIZ.includes(slide?.type) && room?.is_quiz_started
        "
      />
    </div>

    <!-- countdown -->
    <div
      v-if="timeLeft !== -1 && !room.is_submission_locked && isHost"
      class="room_actions__card"
    >
      <PresentationRoomHostActionsCountdown />
    </div>
  </div>

  <!-- results hidden card -->
  <div id="results_hidden_card"></div>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import { timeLeft } from "src/helpers/countdown";
import PresentationRoomHostActionsMenu from "components/presentationRoom/host/actions/PresentationRoomHostActionsMenu.vue";
import PresentationRoomHostActionsEffects from "components/presentationRoom/host/actions/PresentationRoomHostActionsEffects.vue";
import PresentationRoomHostActionsHideResultsSettings from "components/presentationRoom/host/actions/PresentationRoomHostActionsHideResultsSetting.vue";
import PresentationRoomHostActionsSubmissionLockSetting from "components/presentationRoom/host/actions/PresentationRoomHostActionsSubmissionLockSetting.vue";
import PresentationRoomHostActionsFinishQuiz from "components/presentationRoom/host/actions/PresentationRoomHostActionsFinishQuiz.vue";
import PresentationRoomHostActionsCountdown from "components/presentationRoom/host/actions/PresentationRoomHostActionsCountdown.vue";
import PresentationRoomActionsChat from "components/presentationRoom/PresentationRoomActionsChat.vue";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, slide, slideSettings, presentation } =
  storeToRefs(presentationsStore);
</script>

<style scoped lang="scss">
.room_actions {
  position: absolute;
  left: 24px;
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
    left: 8px;
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
