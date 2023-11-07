<template>
  <q-page
    :style="
      !isHost
        ? roomBackground && !presentation?.is_private
          ? `background: linear-gradient(rgba(0, 0, 0, ${
              isHost || (!isHost && slide?.type === SLIDE_TYPES.CONTENT)
                ? '0.4'
                : '0'
            }), rgba(0, 0, 0, ${
              isHost || (!isHost && slide?.type === SLIDE_TYPES.CONTENT)
                ? '0.4'
                : '0'
            })), url(${roomBackground.imageSrc})`
          : 'background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));'
        : 'background: black;'
    "
  >
    <div
      :style="
        !isHost && roomBackground && !presentation.is_private
          ? `backdrop-filter: blur(${roomBackground.blur || 0}px) contrast(${
              roomBackground.contrast >= 0 ? roomBackground.contrast : 100
            }%) brightness(${
              roomBackground.brightness >= 0 ? roomBackground.brightness : 100
            }%) invert(${roomBackground.invert || 0}%) grayscale(${
              roomBackground.grayscale || 0
            }%) opacity(${roomBackground.opacity || 100}%)`
          : ''
      "
    >
      <!-- PARTICIPANT - no access -->
      <PresentationRoomParticipantNoAccess
        v-if="presentation?.is_private && !isHost"
      />

      <div
        v-else
        class="container relative-position column no-wrap"
        :class="isHost ? 'justify-center' : ''"
      >
        <!-- PARTICIPANT - auth form (collecting participants info) -->
        <PresentationRoomParticipantFormsAuth
          v-if="!isAuthenticated && isLoaded"
        />

        <!-- PARTICIPANT - base info form (avatar & name, for quiz) -->
        <PresentationRoomParticipantFormsBaseInfo
          v-if="
            isAuthenticated &&
            !isHost &&
            slide?.type !== SLIDE_TYPES.CONTENT &&
            (participant?.user_data
              ? !JSON.parse(participant.user_data).avatar
              : false)
          "
        />

        <!-- ALL - content -->
        <div
          v-show="
            isAuthenticated &&
            isLoaded &&
            (isHost ||
              (!isHost && slide?.type === SLIDE_TYPES.CONTENT) ||
              (!isHost &&
                slide?.type !== SLIDE_TYPES.CONTENT &&
                (participant?.user_data
                  ? JSON.parse(participant.user_data).avatar
                  : false)))
          "
          class="row no-wrap justify-center items-center"
          style="transition: 0.5s"
          :class="showRoomInvitationPanel || !isHost ? 'q-px-md' : ''"
        >
          <!-- HOST - invitation panel -->
          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <PresentationRoomHostInvitationPanel
              v-if="showRoomInvitationPanel"
            />
          </transition>

          <!-- ALL - slide -->
          <div
            class="relative-position column no-wrap justify-center"
            :class="showRoomInvitationPanel ? 'q-ml-md' : ''"
            style="transition: 0.5s"
            :style="`${!isHost ? 'max-width: 100vh; width: 100%;' : ''} ${
              showRoomInvitationPanel || !isHost
                ? 'border-radius: 12px; overflow: hidden;'
                : ''
            }`"
          >
            <!-- HOST - header (information panel) -->
            <PresentationRoomHostHeader
              :is-host="isHost"
              :is-mouse-active="isMouseActive"
              @mouseover="clearIsMouseActiveTimeout()"
            />

            <!-- ALL - canvas slide -->
            <canvas
              v-show="
                isHost || (!isHost && slide?.type === SLIDE_TYPES.CONTENT)
              "
              ref="canvasRef"
              id="canvas"
              :style="
                showRoomInvitationPanel || !isHost
                  ? 'border-radius: 12px; overflow: hidden;'
                  : ''
              "
              @mousemove="handleCanvasMouseMoveEvent"
            ></canvas>

            <!-- HOST - addons (word cloud, charts) -->
            <PresentationStudioAddons
              v-if="
                isHost &&
                isLoaded &&
                canvasStore.canvasRect()?.width > 0 &&
                slide?.type !== SLIDE_TYPES.CONTENT
              "
            />

            <!-- HOST - quiz -->
            <template
              v-if="
                isHost &&
                isLoaded &&
                canvasStore.canvasRect()?.width > 0 &&
                [
                  SLIDE_TYPES.PICK_ANSWER,
                  SLIDE_TYPES.PICK_IMAGE,
                  SLIDE_TYPES.TYPE_ANSWER,
                ].includes(slide?.type) &&
                room
              "
            >
              <!-- HOST - waiting for participants (word cloud) -->
              <PresentationRoomHostQuizWaitingForParticipants
                v-if="!room.is_quiz_started"
              />

              <!-- HOST - quiz countdown  -->
              <PresentationRoomHostQuizCountdown
                v-if="
                  room.is_quiz_started &&
                  room.is_submission_locked &&
                  timeLeft !== -1
                "
              />
            </template>

            <!-- PARTICIPANT - submission form - word cloud -->
            <PresentationRoomParticipantFormsSubmissionsWordCloud
              v-if="!isHost && slide?.type === SLIDE_TYPES.WORD_CLOUD"
            />

            <!-- PARTICIPANT - submission form - pick answer -->
            <PresentationRoomParticipantFormsSubmissionsPickAnswer
              v-if="
                !isHost &&
                [SLIDE_TYPES.PICK_ANSWER, SLIDE_TYPES.PICK_IMAGE].includes(
                  slide?.type
                )
              "
            />

            <!-- HOST - menu -->
            <PresentationRoomHostActions v-if="isHost" />

            <!-- HOST - room data (participants count, reactions, answers count) -->
            <PresentationRoomHostData
              :participants-count="participants?.length || 0"
              :is-host="isHost"
            />

            <!-- HOST - controls (← / →) -->
            <PresentationRoomHostSlideControls
              :is-host="isHost"
              :is-mouse-active="isMouseActive"
              @change-slide="handleSlideChange($event)"
              @hover="clearIsMouseActiveTimeout()"
            />

            <!-- HOST - quiz in progress warning  -->
            <q-dialog v-model="showQuizInProgressWarning">
              <ConfirmationDialog
                icon="r_pending"
                icon-color="primary"
                :title="
                  $t('presentationRoom.quizCountdown.inProgressWarning.title')
                "
                :message="
                  $t('presentationRoom.quizCountdown.inProgressWarning.message')
                "
                :cancel-btn-text="
                  $t('presentationRoom.quizCountdown.inProgressWarning.stay') +
                  ` (${quizInProgressWarningAutoCloseCountdown} ${$t(
                    'presentationRoom.quizCountdown.inProgressWarning.sec'
                  )})`
                "
                :confirm-btn-text="
                  $t('presentationRoom.quizCountdown.inProgressWarning.leave')
                "
                confirm-btn-color="primary"
                @cancel="showQuizInProgressWarning = false"
                @confirm="handleSlideChange(slideChangeDirection)"
              />
            </q-dialog>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { QSpinnerIos, useQuasar } from "quasar";
import { ROUTE_PATHS } from "src/constants/routes";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";
import { useAuthStore } from "stores/auth";
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import Echo from "laravel-echo";
import { randomNames } from "src/constants/mock";
import { useI18n } from "vue-i18n";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import PresentationStudioAddons from "components/presentation/addons/PresentationAddons.vue";
import { startCountdown, stopCountdown, timeLeft } from "src/helpers/countdown";
import PresentationRoomParticipantFormsAuth from "components/presentationRoom/participant/forms/auth/PresentationRoomParticipantFormsAuth.vue";
import PresentationRoomParticipantFormsBaseInfo from "components/presentationRoom/participant/forms/auth/PresentationRoomParticipantFormsBaseInfo.vue";
import PresentationRoomHostInvitationPanel from "components/presentationRoom/host/PresentationRoomHostInvitationPanel.vue";
import PresentationRoomHostHeader from "components/presentationRoom/host/PresentationRoomHostHeader.vue";
import PresentationRoomHostQuizWaitingForParticipants from "components/presentationRoom/host/quiz/PresentationRoomHostQuizWaitingForParticipants.vue";
import PresentationRoomHostQuizCountdown from "components/presentationRoom/host/quiz/PresentationRoomHostQuizCountdown.vue";
import PresentationRoomParticipantFormsSubmissionsWordCloud from "components/presentationRoom/participant/forms/submissions/PresentationRoomParticipantFormsSubmissionsWordCloud.vue";
import PresentationRoomParticipantFormsSubmissionsPickAnswer from "components/presentationRoom/participant/forms/submissions/PresentationRoomParticipantFormsSubmissionsPickAnswer.vue";
import PresentationRoomHostActions from "components/presentationRoom/host/actions/PresentationRoomHostActions.vue";
import PresentationRoomHostData from "components/presentationRoom/host/data/PresentationRoomHostData.vue";
import PresentationRoomHostSlideControls from "components/presentationRoom/host/PresentationRoomHostSlideControls.vue";
import PresentationRoomParticipantNoAccess from "components/presentationRoom/participant/PresentationRoomParticipantNoAccess.vue";
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";

/*
 * variables
 */
const router = useRouter();
const $q = useQuasar();

const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const {
  presentation,
  slide,
  slideSettings,
  room,
  participants,
  participant,
  isGuest,
  showRoomInvitationPanel,
  averageRoomBackgroundBrightness,
} = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { canvas, ctx, scale, elements, MODE_OPTIONS } = storeToRefs(canvasStore);

const { user } = storeToRefs(useAuthStore());

/*
 * statuses
 */
const isHost = computed(() => {
  if (user.value && presentation.value) {
    return user.value.id === presentation.value.user_id;
  }

  return false;
});

const isAuthenticated = computed(() => {
  return (
    isHost.value ||
    !presentation.value?.settings?.require_participants_info ||
    (presentation.value?.settings?.require_participants_info &&
      participant.value &&
      !isGuest.value)
  );
});

/*
 * canvas slide
 */
const canvasRef = ref();

const initCanvas = () => {
  canvas.value = canvasRef.value;
  ctx.value = canvas.value.getContext("2d");
  ctx.value.imageSmoothingEnabled = true;
};

const initSlide = async () => {
  slide.value =
    presentation.value.slides.find((item) => item.id === room.value.slide_id) ||
    presentation.value.slides[0];

  slideSettings.value = JSON.parse(slide.value.settings_data);

  await canvasStore.setElementsFromSlide();
  return true;
};

const resizeCanvas = () => {
  canvas.value.width = 2560;
  canvas.value.height = 1440;

  ctx.value.scale(scale.value, scale.value);

  canvasStore.redrawCanvas(false, false, undefined, false);
};

/*
 * authenticate
 * fetch data
 * load slide
 * establish connection to room channels
 */
const isLoaded = ref(false);

onBeforeMount(() => {
  $q.loading.show({
    spinner: QSpinnerIos,
    message: t("loading.fetchingData"),
  });
});

onMounted(async () => {
  /*
   * fetch room data
   */
  await api
    .get(`/room/${router.currentRoute.value.params.token}`)
    .then(async (response) => {
      room.value = response.data.room;
      presentation.value = response.data.presentation;
    })
    .catch((error) => {
      $q.notify({
        message: error.response.data.message,
        color: "red",
        icon: "r_crisis_alert",
      });

      window.location = ROUTE_PATHS.DASHBOARD;
    });

  /*
   * render slide
   */
  if (isHost.value || !presentation.value?.is_private) {
    /*
     * init canvas slide
     */
    initCanvas();
    await initSlide();

    /*
     * update slide
     * case: host started presenting in already existing room from the new slide he's chosen
     */
    if (isHost.value && slide.value.id !== room.value.slide_id) {
      await presentationsStore.sendPresentationRoomUpdateEvent();
    }

    if (
      [
        SLIDE_TYPES.PICK_ANSWER,
        SLIDE_TYPES.PICK_IMAGE,
        SLIDE_TYPES.TYPE_ANSWER,
      ].includes(slide.value.type) &&
      !room.value.is_quiz_started
    ) {
      elements.value = elements.value.filter((element) =>
        [MODE_OPTIONS.value.background, MODE_OPTIONS.value.baseFill].includes(
          element.mode
        )
      );

      if (isHost.value) {
        showRoomInvitationPanel.value = true;
      }
    }

    /*
     * resize canvas
     */
    resizeCanvas();
    setTimeout(() => {
      canvasStore.redrawCanvas(false, false, undefined, false);
    }, 100);
    window.addEventListener("resize", resizeCanvas);
  }

  /*
   * auth
   */
  if (!isHost.value) {
    // auth participant by saved token
    const token = localStorage.getItem("participantToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await api
        .get("/user/room")
        .then((response) => {
          // don't authenticate participant that has token from another room
          if (response.data.room_id === room.value.id) {
            participant.value = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // login as guest
    if (
      !participant.value &&
      !presentation.value?.settings?.require_participants_info
    ) {
      /*
       * add is_guest to participants table
       */
      isGuest.value = true;
      await presentationsStore.loginRoom({
        name:
          t("presentationRoom.auth.guest") +
          " " +
          randomNames[Math.floor(Math.random() * randomNames.length)],
      });
    }
  }

  /*
   * establish connection to room channels
   */
  connectToRoomChannels();

  /*
   * countdown
   */
  if (room.value.countdown > 0) {
    stopCountdown();
    startCountdown(room.value.countdown);
  } else {
    handleCountdownOnSlideChange(true);
  }

  /*
   * hide loader
   */
  $q.loading.hide();
  isLoaded.value = true;
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
});

/*
 * webhooks
 */
const connectToRoomChannels = () => {
  const channel = window.Echo.channel(`public.room.${room.value.id}`);

  if (participant.value || user.value) {
    window.Echo = new Echo({
      ...window.Echo.options,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            isHost.value ? "token" : "participantToken"
          )}`,
          "X-CSRF-Token": "CSRF_TOKEN",
        },
      },
    });

    window.Echo.join(`presence.room.${room.value.id}`)
      .here((users) => {
        participants.value = users.filter(
          (item) => item.id !== user.value?.id && item.room_id
        );
      })
      .joining((userJoined) => {
        participants.value.push(userJoined);
      })
      .leaving((userLeft) => {
        participants.value = participants.value.filter(
          (item) => item.id !== userLeft?.id && item.room_id
        );
      });
  }

  /*
   * listen for updates
   */
  channel.listen("PresentationRoomUpdatedEvent", async (event) => {
    if (event.room.token !== room.value.token) {
      return await router.push(
        clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_ROOM) +
          event.room.token
      );
    }

    if (!isHost.value && presentation.value?.is_private) return;

    room.value = event.room;
    stopCountdown();
    if (room.value.countdown > 0) {
      startCountdown(room.value.countdown);
    }

    const newSlide = await presentationsStore.fetchSlideData(
      room.value.slide_id
    );
    slide.value = newSlide.data;
    slideSettings.value = slide.value.settings_data
      ? JSON.parse(slide.value.settings_data)
      : {};
    presentationsStore.updateLocalSlide();

    await canvasStore.setElementsFromSlide();

    if (
      [
        SLIDE_TYPES.PICK_ANSWER,
        SLIDE_TYPES.PICK_IMAGE,
        SLIDE_TYPES.TYPE_ANSWER,
      ].includes(slide.value.type) &&
      !room.value.is_quiz_started
    ) {
      elements.value = elements.value.filter((element) =>
        [MODE_OPTIONS.value.background, MODE_OPTIONS.value.baseFill].includes(
          element.mode
        )
      );
    }

    canvasStore.redrawCanvas(false, false, undefined, false);
  });

  /*
   * listen for new reactions
   */
  channel.listen("PresentationRoomNewReactionEvent", (event) => {
    room.value.reactions = event.reactions;
  });

  /*
   * listen for new submitted answers
   */
  channel.listen("PresentationRoomAnswersFormSubmittedEvent", (event) => {
    slide.value.answers = [...slide.value.answers, ...event.answers];
    presentationsStore.updateLocalSlide();

    if (SLIDE_TYPES_OF_QUIZ.includes(slide.value.type) && isHost.value) {
      const participantIds = participants.value.map((item) => item.id);

      if (
        slide.value.answers.filter(
          (answer) =>
            slide.value.type === answer.slide_type &&
            participantIds.includes(answer.participant_id)
        ).length === participantIds.length
      ) {
        stopCountdown();
        room.value.is_submission_locked = true;
        room.value.countdown = 0;

        presentationsStore.sendPresentationRoomUpdateEvent(
          undefined,
          undefined,
          undefined,
          undefined,
          {
            countdown: room.value.countdown,
            is_submission_locked: room.value.is_submission_locked,
          }
        );
      }
    }
  });

  /*
   * listen for presentation privacy setting change
   */
  channel.listen("PresentationRoomPrivacyUpdatedEvent", async (event) => {
    if (!isHost.value) {
      presentation.value.is_private = event.is_private;

      if (!presentation.value.is_private) {
        setTimeout(async () => {
          isLoaded.value = false;

          initCanvas();
          await initSlide();

          resizeCanvas();
          setTimeout(() => {
            canvasStore.redrawCanvas(false, false, undefined, false);
            isLoaded.value = true;
          }, 100);
          window.addEventListener("resize", resizeCanvas);
        });
      } else {
        window.removeEventListener("resize", resizeCanvas);
      }
    }
  });

  /*
   * listen for room termination
   */
  channel.listen("PresentationRoomTerminatedEvent", () => {
    if (isHost.value) {
      window.location =
        clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_STUDIO) +
        presentation.value.id;
    } else {
      window.location = ROUTE_PATHS.DASHBOARD;
    }
  });
};

/*
 * handle slides change
 */
onBeforeMount(() => {
  document.addEventListener("keydown", handleKeyDownEvent);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDownEvent);
});

const handleKeyDownEvent = (event) => {
  if (isHost.value) {
    // ← left arrow
    if (event.keyCode === 37) {
      handleSlideChange("backward");
    }

    // → right arrow
    if (event.keyCode === 39) {
      if (
        [
          SLIDE_TYPES.PICK_IMAGE,
          SLIDE_TYPES.PICK_ANSWER,
          SLIDE_TYPES.TYPE_ANSWER,
        ].includes(slide.value?.type) &&
        !room.value.is_quiz_started
      ) {
        presentationsStore.handleQuizStart();
      } else {
        handleSlideChange("forward");
      }
    }

    // ⏎ enter
    if (event.keyCode === 13) {
      if (
        [
          SLIDE_TYPES.PICK_IMAGE,
          SLIDE_TYPES.PICK_ANSWER,
          SLIDE_TYPES.TYPE_ANSWER,
        ].includes(slide.value?.type) &&
        !room.value.is_quiz_started
      ) {
        presentationsStore.handleQuizStart();
      }
    }
  }
};

const handleSlideChange = async (direction) => {
  stopQuizInProgressWarningAuthClose();
  const quizInProgressWarning = warnAboutQuizInProgress(direction);
  if (!quizInProgressWarning) return;

  const slideIndex = presentation.value?.slides?.findIndex(
    (item) => item.id === slide.value?.id
  );

  const newSlide =
    presentation.value.slides?.[
      slideIndex + (direction === "forward" ? 1 : -1)
    ];
  if (!newSlide) return;

  await presentationsStore.setSlide(newSlide);
  await canvasStore.setElementsFromSlide();
  canvasStore.redrawCanvas(false, false, undefined, false);

  handleCountdownOnSlideChange();
};

const handleCountdownOnSlideChange = (isOnLoad = false) => {
  if (
    slide.value?.type === SLIDE_TYPES.WORD_CLOUD &&
    slideSettings.value &&
    !slideSettings.value.isInitialSubmissionLocked
  ) {
    room.value.is_submission_locked = false;
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
  } else if (
    [
      SLIDE_TYPES.PICK_IMAGE,
      SLIDE_TYPES.PICK_ANSWER,
      SLIDE_TYPES.TYPE_ANSWER,
    ].includes(slide.value?.type) &&
    room.value.is_quiz_started &&
    room.value.is_submission_locked &&
    !isOnLoad
  ) {
    presentationsStore.handleQuizStart();
  } else {
    if (!isOnLoad) {
      room.value.is_submission_locked = true;
      stopCountdown();
      presentationsStore.sendPresentationRoomUpdateEvent(
        undefined,
        undefined,
        undefined,
        undefined,
        {
          countdown: 0,
          is_submission_locked: room.value.is_submission_locked,
        }
      );
    }
  }
};

/*
 * quiz in progress warning
 */
const showQuizInProgressWarning = ref(false);
const slideChangeDirection = ref();
const quizInProgressWarningAutoCloseCountdown = ref();
const quizInProgressWarningAutoCloseInterval = ref();

const warnAboutQuizInProgress = (direction) => {
  if (
    !room.value.is_submission_locked &&
    timeLeft.value !== -1 &&
    !showQuizInProgressWarning.value
  ) {
    showQuizInProgressWarning.value = true;
    slideChangeDirection.value = direction;

    quizInProgressWarningAutoCloseInterval.value = setInterval(() => {
      quizInProgressWarningAutoCloseCountdown.value--;

      if (quizInProgressWarningAutoCloseCountdown.value === 0) {
        showQuizInProgressWarning.value = false;
        stop();
      }
    }, 1000);

    return false;
  }

  showQuizInProgressWarning.value = false;
  stopQuizInProgressWarningAuthClose();

  return true;
};

function stopQuizInProgressWarningAuthClose() {
  quizInProgressWarningAutoCloseCountdown.value = 10;
  clearInterval(quizInProgressWarningAutoCloseInterval.value);
}

/*
 * mouse activity
 */
const isMouseActive = ref(false);
const isMouseActiveTimeout = ref();

const handleCanvasMouseMoveEvent = () => {
  clearIsMouseActiveTimeout();
  isMouseActive.value = true;

  isMouseActiveTimeout.value = setTimeout(() => {
    isMouseActive.value = false;
  }, 2000);
};

const clearIsMouseActiveTimeout = () => {
  clearTimeout(isMouseActiveTimeout.value);
};

/*
 * room background
 */
const roomBackground = computed(() => {
  return elements.value?.find(
    (element) => element.mode === MODE_OPTIONS.value.background
  );
});

averageRoomBackgroundBrightness.value = computed(() => {
  const element = roomBackground.value;
  if (!element?.image?.nodeType) return 0;

  // define canvas
  const roomBackgroundCanvas = document.createElement("canvas");
  const roomBackgroundCtx = roomBackgroundCanvas.getContext("2d");
  roomBackgroundCanvas.width = element.width;
  roomBackgroundCanvas.height = element.height;

  // filters
  roomBackgroundCtx.filter = `blur(${element.blur || 0}px) contrast(${
    element.contrast >= 0 ? element.contrast : 100
  }%) brightness(${
    element.brightness >= 0 ? element.brightness : 100
  }%) invert(${element.invert || 0}%) grayscale(${element.grayscale || 0}%)`;

  if (element.opacity >= 0) {
    roomBackgroundCtx.globalAlpha = element.opacity / 100;
  }

  // draw background
  roomBackgroundCtx.drawImage(
    element.image,
    0,
    0,
    element.width,
    element.height
  );

  // compute average brightness
  let sumBrightness = 0;
  const imageData = roomBackgroundCtx.getImageData(
    0,
    0,
    element.width,
    element.height
  ).data;

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const brightness = (r + g + b) / 3;
    sumBrightness += brightness;
  }

  roomBackgroundCanvas.remove();
  return sumBrightness / (element.width * element.height);
});
</script>

<style scoped lang="scss">
.q-page {
  overflow: hidden;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-position-x: 50% !important;
  height: 100vh;
}

/*
 * content
 */
.container {
  padding: 0;
  height: 100vh;
  aspect-ratio: 16/9;
  max-width: 100%;
  z-index: 1;
}

canvas {
  background-color: $white;
  z-index: 1;
  width: 100%;
}

/*
 * toggle invitation panel smooth transition
 */
.animated.fadeIn {
  animation-name: fadeIn;
  animation-duration: 0.5s;
}

@keyframes fadeIn {
  0% {
    min-width: 0;
    width: 0;
    opacity: 0;
    transform: scale(0);
  }
  40% {
    opacity: 0;
  }
  100% {
    min-width: 260px;
    width: 260px;
    opacity: 1;
    transform: scale(1);
  }
}

.animated.fadeOut {
  animation-name: fadeOut;
  animation-duration: 0.5s;
}

@keyframes fadeOut {
  0% {
    min-width: 260px;
    width: 260px;
    opacity: 1;
    transform: scale(1);
  }
  40% {
    opacity: 0;
  }
  100% {
    min-width: 0;
    width: 0;
    opacity: 0;
    transform: scale(0);
  }
}
</style>
