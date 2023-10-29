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

      <template v-if="slide?.type !== SLIDE_TYPES.CONTENT && slideSettings">
        <!-- hide results -->
        <q-btn
          flat
          round
          icon="r_leaderboard"
          class="q-ml-sm"
          style="width: 46px"
          :style="slideSettings.isResultsHidden ? 'opacity: 0.5;' : ''"
          @click="handleResultsHiddenSettingToggle()"
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
          :icon="slideSettings.isSubmissionLocked ? 'r_lock' : 'r_lock_open'"
          no-caps
          :label="
            slideSettings.isSubmissionLocked
              ? $t(
                  `presentationRoom.footer.submissionLock.${
                    slideSettings.isSubmissionLocked ? 'off' : 'on'
                  }`
                )
              : ''
          "
          class="q-ml-sm"
          :class="slideSettings.isSubmissionLocked ? '' : ''"
          :style="!slideSettings.isSubmissionLocked ? 'width: 46px' : ''"
          @click="handleSubmissionLockSettingToggle()"
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
                  slideSettings.isSubmissionLocked ? "on" : "off"
                }`
              )
            }}
          </q-tooltip>
        </q-btn>
      </template>
    </div>

    <!-- countdown -->
    <div v-if="timeLeft" class="room_menu__card">
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
                  handleStartingSubmissionLockCountdown();
                  await updateSlideSettings();
                  presentationsStore.sendPresentationRoomUpdateEvent();
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
    class="absolute-center shadow"
    style="
      z-index: 1;
      border-radius: 24px !important;
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.05);
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
        class="text-center text-grey q-mt-md"
        :class="$q.screen.lt.lg ? '' : 'text-h7'"
        v-html="
          $t('presentationRoom.footer.hideResults.dialog.description', {
            answersCount: `<span class='q-px-sm q-py-xs text-primary bg-blue-1 q-mx-xs' style='border-radius: 8px'>${
              slide?.answers?.length || 0
            }</span>`,
          })
        "
      ></div>

      <q-btn
        unelevated
        color="primary"
        no-caps
        class="full-width text-semibold"
        :class="$q.screen.lt.lg ? 'q-mt-lg q-py-sm' : 'q-mt-xl q-py-md'"
        :label="$t('presentationRoom.footer.hideResults.dialog.toggle')"
        @click="handleResultsHiddenSettingToggle()"
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
import { ref, watch } from "vue";

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
const { presentation, slide, slideSettings } = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

/*
 * slide settings
 */
const updateSlideSettings = async () => {
  await presentationsStore.updateLocalSlide();
  await presentationsStore.saveSlide(undefined, elements.value);
};

const handleResultsHiddenSettingToggle = () => {
  slideSettings.value.isResultsHidden = !slideSettings.value.isResultsHidden;
  updateSlideSettings();
};

const handleSubmissionLockSettingToggle = async () => {
  slideSettings.value.isSubmissionLocked =
    !slideSettings.value.isSubmissionLocked;

  checkSubmissionLockForCountdown();

  await updateSlideSettings();
  presentationsStore.sendPresentationRoomUpdateEvent();
};

const checkSubmissionLockForCountdown = () => {
  if (
    !slideSettings.value.isSubmissionLocked &&
    slideSettings.value.isLimitedTime
  ) {
    handleStartingSubmissionLockCountdown();
  } else {
    handleStoppingSubmissionLockCountdown();
  }
};

watch(
  () => slide.value,
  () => {
    if (slideSettings.value) {
      checkSubmissionLockForCountdown();
    } else {
      handleStoppingSubmissionLockCountdown();
    }
  }
);

/*
 * countdown
 */
const submissionLockCountdownEndTimeout = ref();

const handleStartingSubmissionLockCountdown = () => {
  handleStoppingSubmissionLockCountdown();
  startCountdown(slideSettings.value.timeLimit);

  submissionLockCountdownEndTimeout.value = setTimeout(() => {
    handleSubmissionLockSettingToggle();
  }, Number(slideSettings.value.timeLimit) * 1000);
};

const handleStoppingSubmissionLockCountdown = () => {
  clearTimeout(submissionLockCountdownEndTimeout.value);
  stopCountdown();
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
