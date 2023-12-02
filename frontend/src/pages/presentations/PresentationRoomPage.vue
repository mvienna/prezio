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
      v-if="isLoading.sendingRoomUpdatedEvent"
      class="fixed-top-right q-pt-lg q-pr-lg"
      style="z-index: 9999"
    >
      <q-spinner-ios color="white" size="sm" />
    </div>

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

        <!-- ALL - content -->
        <div
          v-show="isAuthenticated && isLoaded"
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
              :qr="qr"
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
            @mousemove="handleCanvasMouseMoveEvent"
          >
            <!-- HOST - header -->
            <PresentationRoomHostHeader
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
            ></canvas>

            <!-- HOST - addons (word cloud, charts) -->
            <PresentationStudioAddons
              v-if="isHost && isLoaded && slide?.type !== SLIDE_TYPES.CONTENT"
            />

            <!-- HOST - quiz -->
            <template
              v-if="
                isHost &&
                isLoaded &&
                SLIDE_TYPES_OF_QUIZ.includes(slide?.type) &&
                room
              "
            >
              <!-- HOST - waiting for participants (word cloud) -->
              <PresentationRoomHostQuizWaitingForParticipants
                v-if="!room.is_quiz_started"
                :key="'word_cloud__participants__' + slide.id"
              />

              <!-- HOST - quiz countdown  -->
              <PresentationRoomHostQuizCountdown
                v-if="room.is_quiz_started"
                :key="'quiz_countdown__' + slide?.id"
              />
            </template>

            <template
              v-if="
                !isHost &&
                ![SLIDE_TYPES.CONTENT, SLIDE_TYPES.LEADERBOARD].includes(
                  slide?.type
                )
              "
            >
              <!-- PARTICIPANT - base info form (avatar & name, for quiz) -->
              <PresentationRoomParticipantFormsBaseInfo
                v-if="
                  participant?.user_data
                    ? !JSON.parse(participant.user_data).avatar
                    : false
                "
              />

              <template v-else>
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

                <!-- PARTICIPANT - submission form - type answer -->
                <PresentationRoomParticipantFormsSubmissionsTypeAnswer
                  v-if="!isHost && SLIDE_TYPES.TYPE_ANSWER === slide?.type"
                />
              </template>
            </template>

            <!-- PARTICIPANT - leaderboard -->
            <PresentationRoomParticipantLeaderboard
              v-if="!isHost && slide?.type === SLIDE_TYPES.LEADERBOARD"
              :key="'leaderboard__' + slide?.id"
            />

            <!-- HOST - actions -->
            <PresentationRoomHostActions v-if="isHost" />

            <!-- PARTICIPANT - actions -->
            <PresentationRoomParticipantActions v-else />

            <!-- ALL - room data (participants count, reactions, answers count) -->
            <PresentationRoomHostData />

            <!-- HOST - controls (← / →) -->
            <PresentationRoomHostSlideControls
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
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
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
import { randomUsernames } from "src/constants/mock";
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
import PresentationRoomParticipantActions from "components/presentationRoom/participant/actions/PresentationRoomParticipantActions.vue";
import PresentationRoomParticipantLeaderboard from "components/presentationRoom/participant/PresentationRoomParticipantLeaderboard.vue";
import { generateQrCode } from "src/helpers/qrUtils";
import { computeAverageBrightness } from "src/helpers/colorUtils";
import PresentationRoomParticipantFormsSubmissionsTypeAnswer from "components/presentationRoom/participant/forms/submissions/PresentationRoomParticipantFormsSubmissionsTypeAnswer.vue";

/*
 * variables
 */
const router = useRouter();
const $q = useQuasar();

const { t, locale } = useI18n({ useScope: "global" });

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
  isHost,
  showRoomInvitationPanel,
  averageBackgroundBrightness,
  showRoomChat,
  beforeQuizTimeout,
  isLoading,
} = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { canvas, ctx, scale, elements, MODE_OPTIONS } = storeToRefs(canvasStore);

const { user } = storeToRefs(useAuthStore());

/*
 * statuses
 */
isHost.value = computed(() => {
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
  const newSlide =
    presentation.value.slides.find((item) => item.id === room.value.slide_id) ||
    presentation.value.slides[0];

  await presentationsStore.setSlide(newSlide);
  presentationsStore.updateLocalSlide();

  await canvasStore.setElementsFromSlide();
  return true;
};

const resizeCanvas = () => {
  canvas.value.width = 2560;
  canvas.value.height = 1440;

  ctx.value.scale(scale.value, scale.value);

  canvasStore.redrawCanvas(false, undefined, false);
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

const fetchRoomData = async (isOnLoad = true) => {
  return await api
    .get(`/room/${router.currentRoute.value.params.token}`)
    .then(async (response) => {
      room.value = response.data.room;
      if (isOnLoad) {
        presentation.value = response.data.presentation;
      }
    })
    .catch((error) => {
      $q.notify({
        message: error.response.data.message,
        color: "red",
        icon: "r_crisis_alert",
      });

      window.location = ROUTE_PATHS.DASHBOARD;
    });
};

onMounted(async () => {
  /*
   * fetch room data
   */
  await fetchRoomData();

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
      await presentationsStore.updateRoom();
    }

    // show room invitation panel if it's turned on in settings
    if (
      presentation.value.settings.show_room_invitation_panel &&
      isHost.value
    ) {
      showRoomInvitationPanel.value = true;
    }

    if (SLIDE_TYPES_OF_QUIZ.includes(slide.value.type)) {
      // leave only background & base fill
      filterElements();

      // auto-show invitations panel
      if (isHost.value) {
        showRoomInvitationPanel.value = true;
      }

      // auto-show chat
      if (
        (!presentation.value.settings.quiz_data ||
          JSON.parse(presentation.value.settings.quiz_data).liveChat) &&
        isAuthenticated.value &&
        (isHost.value ||
          (participant.value?.user_data &&
            JSON.parse(participant.value.user_data)?.avatar))
      ) {
        setTimeout(() => {
          showRoomChat.value = true;
        }, 600);
      }
    }

    /*
     * resize canvas
     */
    resizeCanvas();
    setTimeout(() => {
      canvasStore.redrawCanvas(false, undefined, false);
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
      isGuest.value = true;
      const adjective =
        randomUsernames.adjectives[locale.value === "ru-RU" ? "ru" : "en"][
          Math.floor(
            Math.random() *
              randomUsernames.adjectives[locale.value === "ru-RU" ? "ru" : "en"]
                .length
          )
        ];
      const noun =
        randomUsernames.nouns[locale.value === "ru-RU" ? "ru" : "en"][
          Math.floor(
            Math.random() *
              randomUsernames.nouns[locale.value === "ru-RU" ? "ru" : "en"]
                .length
          )
        ];
      await presentationsStore.loginRoom([
        {
          name: `${adjective} ${noun}`,
        },
      ]);
    }
  }

  /*
   * establish connection to room channels
   */
  connectToRoomChannels();

  /*
   * countdown
   */
  if (isHost.value) {
    await handleRoomUpdateOnSlideChange(true);
  } else if (room.value.countdown > 0) {
    startCountdown(room.value.countdown);
  }

  /*
   * hide loader
   */
  $q.loading.hide();
  isLoaded.value = true;
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
  document.removeEventListener("keydown", handleKeyDownEvent);
});

/*
 * webhooks
 */
const connectToRoomChannels = () => {
  const channel = window.Echo.channel(`public.room.${room.value.id}`);

  if (participant.value || (user.value && isHost.value)) {
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

        if (isHost.value) {
          api
            .post(
              `/presentation/${presentation.value.id}/room/${room.value.id}/message`,
              {
                participant_id: userJoined.id,
                message: "joined",
                type: "system",
              }
            )
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .leaving((userLeft) => {
        participants.value = participants.value.filter(
          (item) => item.id !== userLeft?.id && item.room_id
        );

        if (isHost.value) {
          api
            .post(
              `/presentation/${presentation.value.id}/room/${room.value.id}/message`,
              {
                participant_id: userLeft.id,
                message: "left",
                type: "system",
              }
            )
            .catch((error) => {
              console.log(error);
            });
        }
      });
  }

  /*
   * listen for updates
   */
  channel.listen("PresentationRoomUpdatedEvent", async (event) => {
    // fetch updated room data
    await fetchRoomData(false);

    // on room token updated
    if (router.currentRoute.value.params.token !== room.value.token) {
      return await router.push(
        clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_ROOM) +
          room.value.token
      );
    }

    // presentation is private (lock for participants)
    if (!isHost.value && presentation.value?.is_private) return;

    // init slide data
    await initSlide();

    if (SLIDE_TYPES_OF_QUIZ.includes(slide.value.type)) {
      // leave only background & base fill
      filterElements();

      // countdown before quiz - set timer to reveal
      if (
        room.value.is_quiz_started &&
        room.value.is_submission_locked &&
        timeLeft.value > 5
      ) {
        if (
          !presentation.value.settings.quiz_data ||
          (presentation.value.settings.quiz_data &&
            JSON.parse(presentation.value.settings.quiz_data).countdown)
        ) {
          setTimeout(async () => {
            await canvasStore.setElementsFromSlide();
            canvasStore.redrawCanvas(false, undefined, false);
          }, (timeLeft.value - 5) * 1000);
        }
      }
    }

    // redraw canvas
    canvasStore.redrawCanvas(false, undefined, false);

    // handle room countdown
    if (room.value.countdown > 0) {
      if (
        SLIDE_TYPES_OF_QUIZ.includes(slide.value.type) &&
        room.value.is_submission_locked
      ) {
        // before quiz timeout
        const timeout = presentationsStore.computeBeforeQuizTimeout();
        startCountdown(timeout / 1000);
        beforeQuizTimeout.value = setTimeout(() => {
          presentationsStore.updateRoom(
            undefined,
            undefined,
            undefined,
            undefined,
            {
              countdown: room.value.countdown - timeout / 1000,
              is_submission_locked: false,
            }
          );
        }, timeout);
      } else {
        startCountdown(room.value.countdown);
      }
    } else {
      stopCountdown();
    }

    // hide loading state
    isLoading.value.sendingRoomUpdatedEvent = false;
  });

  /*
   * listen for new reactions
   */
  channel.listen("PresentationRoomNewReactionEvent", (event) => {
    if (room.value) {
      room.value.reactions = event.reactions;
    }
  });

  /*
   * listen for new chat messages
   */
  channel.listen("PresentationRoomNewChatMessageEvent", (event) => {
    if (room.value.messages) {
      room.value.messages = [...room.value.messages, event.message];
    } else {
      room.value.messages = [event.message];
    }
  });

  /*
   * listen for new submitted answers
   */
  channel.listen("PresentationRoomAnswersFormSubmittedEvent", (event) => {
    // add new answers
    slide.value.answers = [...slide.value.answers, ...event.answers];
    presentationsStore.updateLocalSlide();

    // finish the quiz if all participants have answered
    if (isHost.value && SLIDE_TYPES_OF_QUIZ.includes(slide.value.type)) {
      const participantsIds = participants.value.map((item) => item.id);
      const participantsAnswers = slide.value.answers.filter(
        (answer) =>
          slide.value.type === answer.slide_type &&
          participantsIds.includes(answer.participant_id)
      );

      if (participantsAnswers.length === participantsIds.length) {
        room.value.is_submission_locked = true;
        room.value.countdown = 0;
        stopCountdown();

        // actually reveal answers after 2 seconds
        setTimeout(() => {
          // set "is answers revealed" prop to true if setting is turned on (default setting showAnswersManually: false)
          room.value.is_answers_revealed =
            !presentation.value?.settings?.quiz_data ||
            (presentation.value?.settings?.quiz_data &&
              JSON.parse(presentation.value.settings.quiz_data)
                ?.showAnswersManually === false);

          api
            .post(
              `/presentation/${presentation.value.id}/room/${room.value.id}/message`,
              {
                message: "allParticipantsSubmittedAnswers",
                type: "system",
              }
            )
            .catch((error) => {
              console.log(error);
            });

          presentationsStore.updateRoom(
            undefined,
            undefined,
            undefined,
            undefined,
            {
              countdown: room.value.countdown,
              is_submission_locked: room.value.is_submission_locked,
              is_answers_revealed: room.value.is_answers_revealed,
            }
          );
        }, 2000);
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
            canvasStore.redrawCanvas(false, undefined, false);
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

const handleKeyDownEvent = (event) => {
  if (isHost.value) {
    // ← left arrow
    if (event.keyCode === 37) {
      handleSlideChange("backward");
    }

    // → right arrow
    if (event.keyCode === 39) {
      if (
        SLIDE_TYPES_OF_QUIZ.includes(slide.value?.type) &&
        !room.value.is_quiz_started
      ) {
        presentationsStore.handleQuizStart(slide.value.id);
      } else {
        handleSlideChange("forward");
      }
    }

    // ⏎ enter
    if (event.keyCode === 13) {
      if (
        SLIDE_TYPES_OF_QUIZ.includes(slide.value?.type) &&
        !room.value.is_quiz_started
      ) {
        presentationsStore.handleQuizStart(slide.value.id);
      }
    }
  }
};

const handleSlideChange = async (direction) => {
  // find new slide
  const slideIndex = presentation.value?.slides?.findIndex(
    (item) => item.id === slide.value?.id
  );
  const newSlide =
    presentation.value.slides?.[
      slideIndex + (direction === "forward" ? 1 : -1)
    ];
  if (!newSlide) return;

  // check if quiz is in progress & warn about it
  stopQuizInProgressWarningAuthClose();
  const quizInProgressWarning = warnAboutQuizInProgress(direction);
  if (!quizInProgressWarning) return;

  // load new slide
  await handleRoomUpdateOnSlideChange(undefined, direction, newSlide);
};

const handleRoomUpdateOnSlideChange = async (
  isOnLoad = false,
  direction,
  newSlide = slide.value
) => {
  /*
   * slide type of word cloud
   */
  if (newSlide?.type === SLIDE_TYPES.WORD_CLOUD && slideSettings.value) {
    clearTimeout(beforeQuizTimeout.value);

    if (
      !slideSettings.value.isInitialSubmissionLocked &&
      !newSlide.answers.filter((answer) => answer.slide_type === newSlide?.type)
        .length
    ) {
      return await presentationsStore.updateRoom(
        undefined,
        undefined,
        newSlide.id,
        undefined,
        {
          countdown: slideSettings.value.isLimitedTime
            ? slideSettings.value.timeLimit
            : 0,
          is_submission_locked: false,
          is_quiz_started: false,
        }
      );
    } else {
      return await presentationsStore.updateRoom(
        undefined,
        undefined,
        newSlide.id,
        undefined,
        {
          countdown: 0,
          is_submission_locked: true,
          is_quiz_started: false,
        }
      );
    }
  }

  /*
   * slide type of quiz
   */
  if (SLIDE_TYPES_OF_QUIZ.includes(newSlide?.type)) {
    if (isOnLoad || direction === "backward") {
      return await presentationsStore.handleQuizStop(newSlide.id);
    } else {
      // continue quiz
      if (room.value.is_quiz_started) {
        return await presentationsStore.handleQuizStart(newSlide.id);
      } else {
        return await presentationsStore.handleQuizStop(newSlide.id);
      }
    }
  }

  /*
   * other slide types
   */
  return await presentationsStore.handleQuizStop(newSlide.id);
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

watch(
  () => elements.value,
  async () => {
    averageBackgroundBrightness.value = await computeAverageBrightness(
      elements.value
    );
  }
);

/*
 * leave only background & base fill
 */
const filterElements = () => {
  elements.value = elements.value.filter((element) =>
    [MODE_OPTIONS.value.background, MODE_OPTIONS.value.baseFill].includes(
      element.mode
    )
  );
};

/*
 * qr
 */
const qr = generateQrCode();
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
