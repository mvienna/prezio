<template>
  <q-page
    :style="
      isHost
        ? 'background: black;'
        : baseFill
          ? `background: ${baseFill.fill()};`
          : 'background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));'
    "
  >
    <!-- websockets connection interrupted -->
    <WebSocketsConnectionInterrupted
      v-if="!isConnectedToWebSockets"
      @reconnect="connectToRoomChannels()"
    />

    <!-- background -->
    <div
      class="fixed-center full-height full-width"
      style="
        z-index: 0;
        overflow: hidden;
        background-repeat: no-repeat !important;
        background-size: cover !important;
        background-position-x: 50% !important;
      "
      :style="
        !isHost
          ? baseBackground
            ? `background-image: url(${baseBackground.getAttr('source')}); filter: blur(${baseBackground.getAttr('blurRadius')}px) contrast(${100 + baseBackground.getAttr('contrast')}%) brightness(${
                100 + baseBackground.getAttr('brightness') * 100
              }%); opacity: ${baseBackground.getAttr('opacity')};`
            : ''
          : ''
      "
    ></div>

    <div
      v-if="isLoading.sendingRoomUpdatedEvent"
      class="fixed-top-right q-pt-lg q-pr-lg"
      style="z-index: 9999"
    >
      <q-spinner-ios color="white" size="sm" />
    </div>

    <div>
      <!-- PARTICIPANT - no access -->
      <PresentationRoomParticipantNoAccess
        v-if="presentation?.is_private && !isHost"
      />

      <div
        v-else
        class="container relative-position column no-wrap"
        :class="isHost ? 'justify-center' : ''"
      >
        <template v-if="isLoaded && !isAuthenticated">
          <!-- PARTICIPANT - base info (avatar & name) -->
          <PresentationRoomParticipantFormsBaseInfo
            v-if="!isParticipantBaseInfoCollected"
          />

          <!-- PARTICIPANT - collect data -->
          <PresentationRoomParticipantFormsAuthCollectData
            v-else-if="!isParticipantRequiredInfoCollected"
          />
        </template>

        <!-- ALL - content -->
        <div
          v-show="isAuthenticated"
          class="justify-center items-center"
          style="display: grid"
          :style="
            showRoomInvitationPanel
              ? 'grid-template-columns: 291px 1fr;'
              : 'grid-template-columns: 1fr;'
          "
          :class="
            showRoomInvitationPanel ||
            (!isHost &&
              !(
                room &&
                !room.is_quiz_started &&
                room.is_submission_locked &&
                SLIDE_TYPES_OF_QUIZ.includes(slide?.type)
              ))
              ? 'q-px-md'
              : ''
          "
        >
          <!-- HOST - invitation panel -->
          <PresentationRoomHostInvitationPanel
            v-if="showRoomInvitationPanel"
            :qr="qr"
          />

          <!-- ALL - slide -->
          <div
            class="relative-position column no-wrap justify-center"
            :class="showRoomInvitationPanel ? 'q-px-md' : ''"
            style="width: 100%; height: 100%; margin: 0 auto"
            :style="`${!isHost ? 'max-width: 100vh;' : ''} ${
              showRoomInvitationPanel || !isHost
                ? 'border-radius: 12px; overflow: hidden;'
                : ''
            }`"
            @mousemove="handleCanvasMouseMoveEvent"
          >
            <!-- ALL - canvas slide -->
            <div
              v-show="
                isHost || (!isHost && slide?.type === SLIDE_TYPES.CONTENT)
              "
              class="slide relative-position"
              id="stage-parent"
              style="width: 100%"
              :style="
                showRoomInvitationPanel || !isHost
                  ? 'border-radius: 12px; overflow: hidden;'
                  : ''
              "
            >
              <!-- HOST - header -->
              <PresentationRoomHostHeader
                :is-mouse-active="isMouseActive"
                @mouseover="clearIsMouseActiveTimeout()"
              />

              <div id="container"></div>

              <!-- HOST - addons (word cloud, charts) -->
              <PresentationAddons
                v-if="isHost && isLoaded && slide?.type !== SLIDE_TYPES.CONTENT"
              />

              <!-- HOST - quiz -->
              <template
                v-if="
                  isHost &&
                  SLIDE_TYPES_OF_QUIZ.includes(slide?.type) &&
                  room &&
                  box
                "
              >
                <!-- HOST - waiting for participants (word cloud) -->
                <PresentationRoomHostQuizWaitingForParticipants
                  v-if="!room.is_quiz_started"
                  :box="box"
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
                    slide?.type,
                  )
                "
              >
                <!-- PARTICIPANT - submission form - word cloud -->
                <PresentationRoomParticipantFormsSubmissionsWordCloud
                  v-if="!isHost && slide?.type === SLIDE_TYPES.WORD_CLOUD"
                />

                <!-- PARTICIPANT - submission form - pick answer -->
                <PresentationRoomParticipantFormsSubmissionsPickAnswer
                  v-if="
                    !isHost &&
                    [SLIDE_TYPES.PICK_ANSWER, SLIDE_TYPES.PICK_IMAGE].includes(
                      slide?.type,
                    )
                  "
                />

                <!-- PARTICIPANT - submission form - type answer -->
                <PresentationRoomParticipantFormsSubmissionsTypeAnswer
                  v-if="!isHost && SLIDE_TYPES.TYPE_ANSWER === slide?.type"
                />
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
                    $t(
                      'presentationRoom.quizCountdown.inProgressWarning.message',
                    )
                  "
                  :cancel-btn-text="
                    $t(
                      'presentationRoom.quizCountdown.inProgressWarning.stay',
                    ) +
                    ` (${quizInProgressWarningAutoCloseCountdown} ${$t(
                      'presentationRoom.quizCountdown.inProgressWarning.sec',
                    )})`
                  "
                  :confirm-btn-text="
                    $t('presentationRoom.quizCountdown.inProgressWarning.leave')
                  "
                  confirm-btn-color="primary"
                  @cancel="showQuizInProgressWarning = false"
                  @confirm="
                    room.is_quiz_started = false;
                    handleSlideChange(slideChangeDirection);
                  "
                />
              </q-dialog>
            </div>
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
import { QSpinnerIos, useMeta, useQuasar } from "quasar";
import { ROUTE_PATHS, SUBDOMAINS } from "src/constants/routes";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/auth";
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import Echo from "laravel-echo";
import { useI18n } from "vue-i18n";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import PresentationAddons from "components/presentation/addons/PresentationAddons.vue";
import { startCountdown, stopCountdown, timeLeft } from "src/helpers/countdown";
import PresentationRoomParticipantFormsBaseInfo from "components/presentationRoom/participant/forms/auth/PresentationRoomParticipantFormsAuthBaseInfo.vue";
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
import PresentationRoomParticipantFormsSubmissionsTypeAnswer from "components/presentationRoom/participant/forms/submissions/PresentationRoomParticipantFormsSubmissionsTypeAnswer.vue";
import PresentationRoomParticipantFormsAuthCollectData from "components/presentationRoom/participant/forms/auth/PresentationRoomParticipantFormsAuthCollectData.vue";
import WebSocketsConnectionInterrupted from "components/WebSocketsConnectionInterrupted.vue";
import { useStudioStore } from "stores/studio";

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
  isHost,
  showRoomInvitationPanel,
  showRoomChat,
  beforeQuizTimeout,
  isLoading,
} = storeToRefs(presentationsStore);

const studioStore = useStudioStore();
const { MODE_OPTIONS, layers, stages, isListening } = storeToRefs(studioStore);

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
    (participant.value &&
      isParticipantRequiredInfoCollected.value &&
      isParticipantBaseInfoCollected.value)
  );
});

const isParticipantRequiredInfoCollected = computed(() => {
  // require to fill in the data
  if (presentation.value?.settings?.require_participants_info) {
    const participantData = Object.keys(
      JSON.parse(participant.value.user_data),
    );

    const fields = JSON.parse(
      presentation.value?.settings?.participants_info_form_fields_data,
    )
      .filter((field) => field.isMandatory)
      ?.map((field) => field.name);

    // check if participant data has all the required fields filled
    return fields.every((key) => participantData.includes(key));
  }

  return true;
});

const isParticipantBaseInfoCollected = computed(() => {
  // require base info on slide type of quiz
  // if participant hasn't done it yet (logged in as guest)
  const participantData = Object.keys(JSON.parse(participant.value.user_data));
  return !(
    SLIDE_TYPES_OF_QUIZ.includes(slide.value?.type) &&
    !["name", "avatar"].every((key) => participantData.includes(key))
  );
});

/*
 * canvas slide
 */
const initSlide = async () => {
  const newSlide =
    presentation.value.slides.find((item) => item.id === room.value.slide_id) ||
    presentation.value.slides[0];

  return await presentationsStore.setSlide(newSlide);
  // presentationsStore.syncCurrentSlideWithPresentationSlides();
};

/*
 * authenticate
 * fetch data
 * load slide
 * establish connection to room channels
 */
const isLoaded = ref(false);

const box = ref();
const resizeObserverCanvas = ref();

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

      window.location = ROUTE_PATHS.INDEX;
    });

  /*
   * render slide
   */
  isListening.value = false;

  if (isHost.value || !presentation.value?.is_private) {
    await initSlide();
    await studioStore.loadStudio();

    box.value = stages.value.default.container().getBoundingClientRect();
    resizeObserverCanvas.value = new ResizeObserver((entries) => {
      for (const entry of entries) {
        box.value = stages.value.default.container().getBoundingClientRect();

        setTimeout(() => {
          box.value = stages.value.default.container().getBoundingClientRect();
        }, 1000);
      }
    });
    resizeObserverCanvas.value.observe(stages.value.default.container());

    if (SLIDE_TYPES_OF_QUIZ.includes(slide.value.type)) {
      // hide layers other than base layers
      layers.value.default.visible(false);

      // auto-show invitations panel
      if (isHost.value) {
        showRoomInvitationPanel.value = true;
      }

      // auto-show chat
      if (
        (!presentation.value.settings.quiz_data ||
          JSON.parse(presentation.value.settings.quiz_data).liveChat) &&
        isAuthenticated.value
      ) {
        const invitationPanelAnimationDuration = 600;
        setTimeout(() => {
          showRoomChat.value = true;
        }, invitationPanelAnimationDuration);
      }
    }
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
        .get("/participant")
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
    if (!participant.value) {
      await presentationsStore.loginRoom({}, true);
    }
  }

  if (isAuthenticated.value) {
    /*
     * establish connection to room channels
     */
    await connectToRoomChannels();

    /*
     * countdown
     */
    if (isHost.value) {
      await handleRoomUpdateOnSlideChange(true);
    } else if (room.value.countdown > 0) {
      startCountdown(room.value.countdown);
    }
  }

  // todo:
  // for some reason on participant's side without loadStudio() here the canvas is blank
  // probably we need to reorder functions here, in onMounted()
  if (!isHost.value) {
    await studioStore.loadStudio();
  }

  /*
   * hide loader
   */
  $q.loading.hide();
  isLoaded.value = true;
});

/*
 * establish connection to room channels
 * when user authenticates
 */
watch(
  () => participant.value,
  () => {
    connectToRoomChannels();
  },
  { deep: true },
);

watch(
  () => presentation.value,
  (newValue, oldValue) => {
    if (!newValue || !oldValue) return;
    if (newValue.is_private === oldValue.is_private) return;

    if (!presentation.value.is_private) {
      // timeout is needed here because of v-if v-else condition in the template
      setTimeout(async () => {
        isLoaded.value = false;

        await initSlide();
        studioStore.loadStudio();
      });
    }
  },
);

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDownEvent);
  resizeObserverCanvas.value.disconnect();
});

// fix canvas into parent container on room invitation panel toggle
watch(
  () => showRoomInvitationPanel.value,
  () => {
    setTimeout(() => {
      studioStore.fitStageIntoParentContainer();
    });
  },
);

/*
 * webhooks
 */
const isConnectedToWebSockets = ref(true);

const connectToRoomChannels = async () => {
  const channel = await window.Echo.channel(`public.room.${room.value.id}`);

  if (participant.value || (user.value && isHost.value)) {
    window.Echo = await new Echo({
      ...window.Echo.options,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            isHost.value ? "token" : "participantToken",
          )}`,
          "X-CSRF-Token": "CSRF_TOKEN",
        },
      },
    });

    window.Echo.join(`presence.room.${room.value.id}`)
      .here((users) => {
        participants.value = users.filter(
          (item) => item.id !== user.value?.id && item.room_id,
        );
      })
      .joining((userJoined) => {
        participants.value.push(userJoined);

        if (isHost.value && !userJoined.is_guest) {
          api
            .post(
              `/presentation/${presentation.value.id}/room/${room.value.id}/message`,
              {
                participant_id: userJoined.id,
                message: "joined",
                type: "system",
              },
            )
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .leaving((userLeft) => {
        participants.value = participants.value.filter(
          (item) => item.id !== userLeft?.id && item.room_id,
        );

        if (isHost.value && !userLeft.is_guest) {
          api
            .post(
              `/presentation/${presentation.value.id}/room/${room.value.id}/message`,
              {
                participant_id: userLeft.id,
                message: "left",
                type: "system",
              },
            )
            .catch((error) => {
              console.log(error);
            });
        }
      });
  }

  window.Echo.connector.pusher.connection.bind("connected", () => {
    isConnectedToWebSockets.value = true;
  });

  window.Echo.connector.pusher.connection.bind("disconnected", () => {
    isConnectedToWebSockets.value = false;
  });

  /*
   * listen for room updates
   */
  channel.listen("PresentationRoomUpdatedEvent", async (event) => {
    // fetch updated room data
    room.value = { ...room.value, ...event.data };

    // on room token updated
    if (router.currentRoute.value.params.token !== room.value.token) {
      return await router.push(
        clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_ROOM.HOST) +
          room.value.token,
      );
    }

    // handle room countdown
    if (room.value.countdown > 0) {
      const startTime = new Date().toISOString();

      const serverTimeResponse = await api.get(`/server-time`);

      const endTime = new Date().toISOString();
      const roundTripTime = parseFloat(
        ((new Date(endTime) - new Date(startTime)) / 1000).toFixed(1),
      );

      // console.log("SERVER TIME REQUEST DELAY: ", roundTripTime);

      const countdownDifference =
        serverTimeResponse.data.time - room.value.countdown_started_at;

      // console.log("DIFFERENCE: ", countdownDifference);

      const updatedCountdown =
        room.value.countdown +
        (countdownDifference > 0 ? countdownDifference : 0);

      if (
        SLIDE_TYPES_OF_QUIZ.includes(event.slide?.type || slide.value.type) &&
        room.value.is_quiz_started &&
        room.value.is_submission_locked
      ) {
        // before quiz timeout
        const timeout = presentationsStore.computeBeforeQuizTimeout();
        startCountdown(timeout / 1000);

        if (isHost.value) {
          beforeQuizTimeout.value = setTimeout(() => {
            presentationsStore.updateRoom(undefined, undefined, {
              countdown: updatedCountdown + roundTripTime,
              sentAt: serverTimeResponse.data.time,
              is_submission_locked: false,
            });
          }, timeout);
        }

        if (
          (presentation.value.settings.quiz_data &&
            JSON.parse(presentation.value.settings.quiz_data).countdown) ||
          !presentation.value.settings.quiz_data
        ) {
          setTimeout(async () => {
            if (event.slide) {
              const response = await presentationsStore.fetchSlideData(
                event.slide.id,
              );
              slide.value = response.data;
            }

            layers.value.default.visible(true);
          }, timeout / 2);
        }
      } else {
        startCountdown(updatedCountdown);
        // console.log("TIMER: ", timeLeft.value);

        if (isHost.value) {
          presentationsStore.updateRoom(undefined, undefined, {
            countdown: timeLeft.value + roundTripTime,
            sentAt: serverTimeResponse.data.time,
            disableNotification: true,
          });
        }

        if (event.slide) {
          const response = await presentationsStore.fetchSlideData(
            event.slide.id,
          );
          slide.value = response.data;
        }

        layers.value.default.visible(true);
      }
    } else {
      stopCountdown();
    }

    // hide loading state
    isLoading.value.sendingRoomUpdatedEvent = false;
  });

  /*
   * listen for presentation updates
   */
  channel.listen("PresentationUpdatedEvent", (event) => {
    presentation.value = { ...presentation.value, ...event.data };
  });

  /*
   * listen for slides updates
   */
  channel.listen("PresentationSlideUpdatedEvent", async (event) => {
    const response = await presentationsStore.fetchSlideData(event.slide_id);

    slide.value = response.data;
    slideSettings.value = slide.value.settings_data
      ? JSON.parse(slide.value.settings_data)
      : {};

    presentationsStore.syncCurrentSlideWithPresentationSlides();

    await studioStore.loadStudio();

    if (SLIDE_TYPES_OF_QUIZ.includes(slide.value.type)) {
      // hide layers other than base
      layers.value.default.visible(false);
    }
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
      // add new message
      room.value.messages = [...room.value.messages, event.message];

      // remove duplicates
      const idMap = new Map();
      room.value.messages = room.value.messages.filter(
        (obj) => !idMap.has(obj.id) && idMap.set(obj.id, 1),
      );
    } else {
      room.value.messages = [event.message];
    }
  });

  /*
   * listen for new submitted answers
   */
  channel.listen("PresentationRoomAnswersSubmittedEvent", (event) => {
    // add new answers
    slide.value.answers = [...slide.value.answers, ...event.answers];

    // remove duplicates
    const idMap = new Map();
    slide.value.answers = slide.value.answers.filter(
      (obj) => !idMap.has(obj.id) && idMap.set(obj.id, 1),
    );
    presentationsStore.syncCurrentSlideWithPresentationSlides();

    // finish the quiz if all participants have answered
    if (isHost.value && SLIDE_TYPES_OF_QUIZ.includes(slide.value.type)) {
      const participantsIds = participants.value
        .filter((item) => !item.is_guest)
        .map((item) => item.id);

      const participantIdMap = new Map();
      const participantsAnswers = slide.value.answers
        .filter(
          (answer) =>
            slide.value.type === answer.slide_type &&
            participantsIds.includes(answer.participant_id),
        )
        .filter(
          (obj) =>
            !participantIdMap.has(obj.participant_id) &&
            participantIdMap.set(obj.participant_id, 1),
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
              },
            )
            .catch((error) => {
              console.log(error);
            });

          presentationsStore.updateRoom(undefined, undefined, {
            countdown: 0,
            is_submission_locked: room.value.is_submission_locked,
            is_answers_revealed: room.value.is_answers_revealed,
          });
        }, 2000);
      }
    }
  });

  channel.listen("PresentationRoomAnswerUpdatedEvent", (event) => {
    const answerIndex = slide.value.answers.findIndex(
      (answer) => answer.id === event.data.id,
    );
    slide.value.answers[answerIndex] = event.data;
  });

  channel.listen("PresentationRoomParticipantsErasedEvent", () => {
    if (participant.value) {
      localStorage.removeItem("participantToken");
      location.reload();
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
      window.location = ROUTE_PATHS.INDEX;
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
        // presentationsStore.handleQuizStart(slide.value.id);
        presentationsStore.handleQuizStart();
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
        // presentationsStore.handleQuizStart(slide.value.id);
        presentationsStore.handleQuizStart();
      }
    }
  }
};

const handleSlideChange = async (direction) => {
  // find new slide
  const slideIndex = presentation.value?.slides?.findIndex(
    (item) => item.id === slide.value?.id,
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

  // todo: instant slide change (local)
  // slide.value = newSlide;
  // slideSettings.value = slide.value.settings_data
  //   ? JSON.parse(slide.value.settings_data)
  //   : {};
  // presentationsStore.syncCurrentSlideWithPresentationSlides();
  // await canvasStore.setElementsFromSlide();
  // if (SLIDE_TYPES_OF_QUIZ.includes(slide.value.type)) {
  //   filterElements();
  // }
  // canvasStore.redrawCanvas(false, undefined, false);

  // process slide change (update room data)
  await handleRoomUpdateOnSlideChange(undefined, direction, newSlide);
};

const handleRoomUpdateOnSlideChange = async (
  isOnLoad = false,
  direction,
  newSlide = slide.value,
) => {
  const newSlideSettings = newSlide.settings_data
    ? JSON.parse(newSlide.settings_data)
    : {};

  /*
   * slide type of word cloud
   */
  if (newSlide?.type === SLIDE_TYPES.WORD_CLOUD && newSlideSettings) {
    clearTimeout(beforeQuizTimeout.value);

    if (
      !newSlideSettings.isInitialSubmissionLocked &&
      !newSlide.answers.filter((answer) => answer.slide_type === newSlide?.type)
        .length
    ) {
      return await presentationsStore.updateRoom(undefined, undefined, {
        slide_id: newSlide.id,
        countdown: newSlideSettings.isLimitedTime
          ? Number(newSlideSettings.timeLimit)
          : 0,
        is_submission_locked: false,
        is_quiz_started: isOnLoad ? false : room.value.is_quiz_started,
      });
    } else {
      return await presentationsStore.updateRoom(undefined, undefined, {
        slide_id: newSlide.id,
        countdown: 0,
        is_submission_locked: true,
        is_quiz_started: isOnLoad ? false : room.value.is_quiz_started,
      });
    }
  }

  /*
   * slide type of quiz
   */
  if (SLIDE_TYPES_OF_QUIZ.includes(newSlide?.type)) {
    if (isOnLoad || direction === "backward") {
      return await presentationsStore.handleQuizStop({ slide_id: newSlide.id });
    } else {
      // continue quiz
      if (room.value.is_quiz_started) {
        return await presentationsStore.handleQuizStart(
          newSlide.id,
          newSlideSettings,
        );
      } else {
        return await presentationsStore.handleQuizStop({
          slide_id: newSlide.id,
        });
      }
    }
  }

  /*
   * other slide types
   */
  return await presentationsStore.handleQuizStop({
    is_quiz_started: isOnLoad ? false : room.value.is_quiz_started,
    slide_id: newSlide.id,
  });
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
 * room base elements
 */
const baseBackground = computed(() => {
  return layers.value?.base?.findOne(".baseBackground");
});

const baseFill = computed(() => {
  return layers.value?.base?.findOne(".baseFill");
});

/*
 * lock submissions locally when time's up
 * while waiting for the actual event
 */
watch(
  () => timeLeft.value,
  () => {
    if (
      timeLeft.value === 0.0 &&
      [...SLIDE_TYPES_OF_QUIZ, SLIDE_TYPES.WORD_CLOUD].includes(
        slide.value?.type,
      )
    ) {
      room.value.is_submission_locked = true;
    }
  },
);

/*
 * qr
 */
const host = window.location.origin.replace(SUBDOMAINS.app + ".", "");
const roomLink = computed(() => {
  return `${host}/${router.currentRoute.value.params.token}`;
});

const qr = generateQrCode(undefined, undefined, roomLink.value);

/*
 * meta
 */
const metaOptions = {
  title: t("meta.presentation.room.title"),
  titleTemplate: (title) => `${title} - ${t("meta.app")}`,

  // meta tags
  meta: {
    description: {
      name: "description",
      content: t("meta.presentation.room.description"),
    },
    keywords: {
      name: "keywords",
      content: t("meta.presentation.room.keywords"),
    },
    equiv: {
      "http-equiv": "Content-Type",
      content: "text/html; charset=UTF-8",
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle: {
      property: "og:title",
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogTitle) {
        return `${ogTitle} - ${t("meta.app")}`;
      },
    },
  },
};

if (window.location.host === process.env.STAGING_HOST) {
  metaOptions.meta.robots = {
    name: "robots",
    content: "noindex, nofollow",
  };
}

useMeta(metaOptions);
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

.slide {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  overflow-x: hidden;
}

/*
 * toggle invitation panel smooth transition
 */
//.animated.fadeIn {
//  animation-name: fadeIn;
//  animation-duration: 0.5s;
//}
//
//@keyframes fadeIn {
//  0% {
//    min-width: 0;
//    width: 0;
//    opacity: 0;
//    transform: scale(0);
//  }
//  40% {
//    opacity: 0;
//  }
//  100% {
//    min-width: 291px;
//    width: 291px;
//    opacity: 1;
//    transform: scale(1);
//  }
//}
//
//.animated.fadeOut {
//  animation-name: fadeOut;
//  animation-duration: 0.5s;
//}
//
//@keyframes fadeOut {
//  0% {
//    min-width: 291px;
//    width: 291px;
//    opacity: 1;
//    transform: scale(1);
//  }
//  40% {
//    opacity: 0;
//  }
//  100% {
//    min-width: 0;
//    width: 0;
//    opacity: 0;
//    transform: scale(0);
//  }
//}
</style>

<style lang="scss">
.chaport-container {
  display: none;
}
</style>
