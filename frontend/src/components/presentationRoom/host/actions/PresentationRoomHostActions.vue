<template>
  <div class="room_actions row no-wrap q-gutter-md">
    <div class="room_actions__card row no-wrap">
      <!-- menu -->
      <PresentationRoomHostActionsMenu />

      <!-- chat -->
      <PresentationRoomActionsChat
        v-if="
          SLIDE_TYPES_OF_QUIZ.includes(slide?.type) &&
          room?.is_submission_locked &&
          presentation?.settings &&
          (!presentation.settings.quiz_data ||
            (presentation?.settings?.quiz_data &&
              JSON.parse(presentation.settings.quiz_data)?.liveChat))
        "
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
          SLIDE_TYPES_OF_QUIZ.includes(slide?.type) &&
          room?.is_quiz_started &&
          !room?.is_submission_locked &&
          timeLeft > 3.0
        "
      />
    </div>

    <!-- countdown -->
    <div
      v-if="
        timeLeft !== -1 &&
        !room.is_submission_locked &&
        !SLIDE_TYPES_OF_QUIZ.includes(slide?.type)
      "
      class="room_actions__card"
    >
      <PresentationRoomHostActionsCountdown />
    </div>
  </div>

  <!-- results hidden card -->
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <PresentationRoomHostActionsResultsHiddenCard
      v-if="slideSettings?.isResultsHidden"
    />
  </transition>

  <!-- quiz countdown -->
  <transition
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
    <div
      v-if="
        timeLeft > 3 &&
        !room.is_submission_locked &&
        SLIDE_TYPES_OF_QUIZ.includes(slide?.type) &&
        room?.is_quiz_started
      "
      class="room_actions room_actions--quiz_countdown"
    >
      <div class="room_actions__card">
        <PresentationRoomHostActionsCountdown />
      </div>
    </div>
  </transition>
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
import PresentationRoomHostActionsResultsHiddenCard from "components/presentationRoom/host/actions/PresentationRoomHostActionsResultsHiddenCard.vue";

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
  z-index: 2;

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

.room_actions--quiz_countdown {
  position: absolute;
  left: 50% !important;
  top: 50% !important;
  bottom: auto !important;
  z-index: 99;
  transform: translate(-50%, -50%) scale(2);
}

@media screen and (max-width: 1256px) {
  .room_actions--quiz_countdown {
    transform: translate(-50%, -50%) scale(1.5);
  }
}

@media screen and (max-width: 1023px) {
  .room_actions--quiz_countdown {
    transform: translate(-50%, -50%) scale(1);
  }

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
