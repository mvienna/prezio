<template>
  <div class="room_menu row no-wrap q-gutter-md">
    <div class="room_menu__card row no-wrap">
      <!-- menu -->
      <q-btn
        :label="$t('presentationRoom.footer.menu.title')"
        icon="r_menu"
        flat
        rounded
        no-caps
      >
        <q-menu
          anchor="top left"
          self="bottom left"
          transition-show="jump-up"
          transition-hide="jump-down"
          :offset="[8, 16]"
          style="
            background: rgba(0, 0, 0, 0.5);
            color: white;
            backdrop-filter: blur(4px);
            border-radius: 24px;
          "
          class="q-pa-sm"
        >
          <div class="column no-wrap q-gutter-sm">
            <!-- terminate room -->
            <q-btn
              :label="$t('presentationRoom.footer.menu.terminateRoom')"
              icon="r_sports_score"
              align="left"
              no-caps
              flat
              :size="$q.screen.lt.md ? '0.8em' : '1em'"
              style="border-radius: 16px 16px 8px 8px"
              @click="$emit('terminateRoom')"
            />

            <q-separator class="bg-white" style="opacity: 0.5" />

            <!-- open backstage -->
            <q-btn
              :label="$t('presentationRoom.footer.menu.openBackstage')"
              icon="r_movie"
              no-caps
              align="left"
              flat
              disable
              :size="$q.screen.lt.md ? '0.8em' : '1em'"
              v-close-popup
              style="border-radius: 8px"
            />

            <!-- fullscreen toggle -->
            <q-btn
              :label="
                $t(
                  `presentationRoom.footer.menu.fullscreen.${
                    isFullscreen ? 'off' : 'on'
                  }`
                )
              "
              :icon="isFullscreen ? 'r_fullscreen_exit' : 'r_fullscreen'"
              no-caps
              align="left"
              flat
              :size="$q.screen.lt.md ? '0.8em' : '1em'"
              v-close-popup
              style="border-radius: 8px"
              @click="$emit('toggleFullscreen')"
            />

            <!-- invitation panel toggle -->
            <q-btn
              :label="
                $t(
                  `presentationRoom.footer.menu.invitationPanel.${
                    showRoomInvitationPanel ? 'hide' : 'show'
                  }`
                )
              "
              icon="r_qr_code"
              no-caps
              align="left"
              flat
              style="border-radius: 8px"
              :size="$q.screen.lt.md ? '0.8em' : '1em'"
              v-close-popup
              @click="$emit('toggleInvitationPanel')"
            />

            <!-- header toggle -->
            <q-btn
              :label="
                $t(
                  `presentationRoom.footer.menu.informationPanel.${
                    showRoomInformationPanel ? 'hide' : 'show'
                  }`
                )
              "
              icon="r_info"
              no-caps
              align="left"
              flat
              style="border-radius: 8px"
              :size="$q.screen.lt.md ? '0.8em' : '1em'"
              v-close-popup
              @click="$emit('toggleInformationPanel')"
            />

            <!-- privacy toggle -->
            <q-btn
              :label="
                $t(
                  `presentationRoom.footer.menu.privacy.${
                    presentation.is_private ? 'public' : 'private'
                  }`
                )
              "
              :icon="
                presentation.is_private ? 'r_visibility_off' : 'r_visibility'
              "
              no-caps
              align="left"
              flat
              :size="$q.screen.lt.md ? '0.8em' : '1em'"
              style="border-radius: 8px 8px 16px 16px"
              v-close-popup
              @click="
                presentation.is_private = !presentation.is_private;
                presentationsStore.updatePresentation();
              "
            />
          </div>
        </q-menu>
      </q-btn>

      <!-- spice things up with effect -->
      <q-btn
        flat
        round
        icon="r_celebration"
        class="q-ml-sm"
        style="width: 46px"
      />

      <template v-if="slide?.type === SLIDE_TYPES.WORD_CLOUD && slideSettings">
        <!-- hide results -->
        <q-btn
          flat
          round
          icon="r_leaderboard"
          class="q-ml-sm"
          style="width: 46px"
          :style="slideSettings.isResultsHidden ? 'opacity: 0.5;' : ''"
          @click="toggleResultsHiddenSetting()"
        >
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down"
          >
            {{
              $t(
                `presentationRoom.footer.hideResults.tooltip.${
                  slideSettings.isResultsHidden ? "off" : "on"
                }`
              )
            }}
          </q-tooltip>
        </q-btn>

        <!-- submission is locked -->
        <q-btn
          flat
          :icon="room?.is_submission_locked ? 'r_lock' : 'r_lock_open'"
          no-caps
          :label="
            room?.is_submission_locked
              ? $t(
                  `presentationRoom.footer.submissionLock.${
                    room?.is_submission_locked ? 'off' : 'on'
                  }`
                )
              : ''
          "
          class="q-ml-sm"
          :style="!room?.is_submission_locked ? 'width: 46px' : ''"
          @click="toggleSubmissionLockSetting()"
        >
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            transition-show="jump-up"
            transition-hide="jump-down"
          >
            {{
              $t(
                `presentationRoom.footer.submissionLock.toggle.${
                  room?.is_submission_locked ? "on" : "off"
                }`
              )
            }}
          </q-tooltip>
        </q-btn>
      </template>

      <template
        v-if="
          [
            SLIDE_TYPES.PICK_ANSWER,
            SLIDE_TYPES.PICK_IMAGE,
            SLIDE_TYPES.TYPE_ANSWER,
          ].includes(slide?.type) && room?.is_quiz_started
        "
      >
        <!-- submission is locked -->
        <q-btn
          flat
          icon="r_sports_score"
          no-caps
          label="
            Завершить викторину
          "
          class="q-ml-sm"
          @click="
            () => {
              room.is_quiz_started = false;
              room.is_submission_locked = true;
              presentationsStore.sendPresentationRoomUpdateEvent(
                undefined,
                undefined,
                undefined,
                undefined,
                {
                  is_quiz_started: room.is_quiz_started,
                  is_submission_locked: room.is_submission_locked,
                  countdown: 0,
                }
              );
            }
          "
        >
        </q-btn>
      </template>
    </div>

    <!-- countdown -->
    <div
      v-if="!!timeLeft && !room.is_submission_locked"
      class="room_menu__card"
    >
      <q-btn flat class="q-px-sm">
        <q-circular-progress
          :value="timeLeftPercentage"
          size="28px"
          :thickness="1"
          :color="
            timeLeftPercentage < 25
              ? 'positive'
              : timeLeftPercentage < 50
              ? 'yellow-10'
              : timeLeftPercentage < 75
              ? 'orange'
              : 'red'
          "
          track-color="white"
        />

        <div class="q-mx-sm" style="width: 24px">
          {{ countdown }}
        </div>

        <q-icon name="r_chevron_right" />

        <q-menu
          anchor="bottom right"
          self="bottom left"
          transition-show="jump-right"
          transition-hide="jump-left"
          :offset="[16, 8]"
          class="q-pa-sm"
          style="
            background: rgba(0, 0, 0, 0.5);
            color: white;
            backdrop-filter: blur(4px);
            border-radius: 24px;
          "
        >
          <template v-for="n in 4" :key="n">
            <q-separator v-if="n !== 1" class="q-my-xs" />

            <q-item
              clickable
              dense
              @click="
                async () => {
                  slideSettings.timeLimit = n * 10;
                  startCountdown(slideSettings.timeLimit);
                  await updateSlideSettings();
                  presentationsStore.sendPresentationRoomUpdateEvent(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    {
                      countdown: slideSettings.timeLimit,
                      is_submission_locked: room.is_submission_locked,
                    }
                  );
                }
              "
              class="column justify-center"
              :style="
                n === 1
                  ? 'border-radius: 16px 16px 8px 8px;'
                  : n === 4
                  ? 'border-radius: 8px 8px 16px 16px;'
                  : ''
              "
            >
              <q-item-label>
                <span class="text-semibold">{{ n * 10 }}</span>
                {{ $t("presentationRoom.footer.submissionLock.resetTime.sec") }}
              </q-item-label>
            </q-item>
          </template>
        </q-menu>
      </q-btn>
    </div>
  </div>

  <!-- results hidden card -->
  <q-card
    v-if="slideSettings?.isResultsHidden"
    bordered
    flat
    class="absolute-center shadow"
    style="
      z-index: 1;
      border-radius: 24px !important;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      color: white;
    "
  >
    <q-card-section :class="$q.screen.lt.lg ? 'q-pa-lg' : 'q-pa-xl'">
      <div
        class="text-center text-bold"
        :class="$q.screen.lt.lg ? 'text-h6' : 'text-h4'"
      >
        {{ $t("presentationRoom.footer.hideResults.dialog.title") }}
      </div>

      <div
        class="text-center text-grey-4 q-mt-md"
        :class="$q.screen.lt.lg ? '' : 'text-h7'"
      >
        {{ $t("presentationRoom.footer.hideResults.dialog.description") }}
        <span
          class="q-px-sm q-py-xs text-white bg-grey-5 q-mx-xs"
          style="border-radius: 8px"
        >
          {{ slide?.answers?.length || 0 }}
        </span>
      </div>

      <q-btn
        unelevated
        color="white"
        text-color="black"
        no-caps
        class="full-width text-semibold"
        :class="$q.screen.lt.lg ? 'q-mt-lg q-py-sm' : 'q-mt-xl q-py-md'"
        :label="$t('presentationRoom.footer.hideResults.dialog.toggle')"
        @click="toggleResultsHiddenSetting()"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { useCanvasStore } from "stores/canvas";
import {
  countdown,
  startCountdown,
  stopCountdown,
  timeLeft,
  timeLeftPercentage,
} from "src/helpers/countdown";

/*
 * props
 */
defineProps({
  showRoomInvitationPanel: { type: Boolean },
  showRoomInformationPanel: { type: Boolean },
  isFullscreen: { type: Boolean },
});

/*
 * emits
 */
defineEmits([
  "terminateRoom",
  "toggleInformationPanel",
  "toggleInvitationPanel",
  "toggleFullscreen",
]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, presentation, slide, slideSettings } =
  storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

/*
 * slide settings
 */
const updateSlideSettings = async () => {
  await presentationsStore.updateLocalSlide();
  await presentationsStore.saveSlide(undefined, elements.value);
};

const toggleResultsHiddenSetting = () => {
  slideSettings.value.isResultsHidden = !slideSettings.value.isResultsHidden;
  updateSlideSettings();
};

const toggleSubmissionLockSetting = async () => {
  room.value.is_submission_locked = !room.value.is_submission_locked;

  if (!room.value.is_submission_locked && slideSettings.value.isLimitedTime) {
    startCountdown(slideSettings.value.timeLimit);
  } else {
    stopCountdown();
  }

  presentationsStore.sendPresentationRoomUpdateEvent(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      countdown: !room.value.is_submission_locked
        ? slideSettings.value.timeLimit
        : 0,
      is_submission_locked: room.value.is_submission_locked,
    }
  );
};
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
