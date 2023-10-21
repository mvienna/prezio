<template>
  <q-page
    :style="
      !isHost
        ? slide?.preview
          ? `background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${slide?.preview});`
          : 'background: white;'
        : 'background: black;'
    "
  >
    <!-- no access -->
    <div v-if="presentation?.is_private && !isHost">
      <!-- logo -->
      <div class="row justify-center q-pa-lg">
        <div style="width: 96px">
          <q-img
            src="/logo_with_title_black.png"
            style="height: 48px"
            fit="contain"
          />
        </div>
      </div>

      <div class="row no-wrap justify-center text-center">
        <div style="max-width: 500px">
          <div class="text-bold text-h7">
            {{ $t("presentationRoom.isPrivate.title") }}
          </div>

          <div class="q-mt-md text-grey">
            {{ $t("presentationRoom.isPrivate.description") }}
          </div>

          <div class="row justify-center q-mt-xl">
            <q-img src="/assets/images/bird_singing.svg" width="300px" />
          </div>
        </div>
      </div>
    </div>

    <!-- has access -->
    <div
      v-else
      class="container relative-position column no-wrap"
      :class="isHost ? 'justify-center' : ''"
    >
      <!-- auth form - collecting participants info -->
      <PresentationRoomAuthForm v-if="!isAuthenticated && isLoaded" />

      <!-- presentation content -->
      <div
        v-show="isAuthenticated && isLoaded"
        class="row no-wrap justify-center items-center"
        style="transition: 0.5s"
        :class="showRoomInvitationPanel || !isHost ? 'q-px-md' : ''"
      >
        <!-- room invitation panel -->
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <PresentationRoomInvitationPanel
            v-if="showRoomInvitationPanel"
            :qr-code="qrCode"
            @toggle-invitation-panel="
              showRoomInvitationPanel = !showRoomInvitationPanel
            "
          />
        </transition>

        <!-- slide -->
        <div
          class="relative-position column no-wrap justify-center"
          :class="showRoomInvitationPanel ? 'q-ml-md' : ''"
          style="transition: 0.5s"
          :style="
            showRoomInvitationPanel || !isHost
              ? 'border-radius: 12px; overflow: hidden;'
              : ''
          "
        >
          <!-- header - information panel -->
          <PresentationRoomHeader
            :is-host="isHost"
            :is-mouse-active="isMouseActive"
            :show-room-information-panel="showRoomInformationPanel"
            @mouseover="clearIsMouseActiveTimeout()"
            @toggle-invitation-panel="
              showRoomInvitationPanel = !showRoomInvitationPanel
            "
          />

          <!-- canvas slide -->
          <canvas
            ref="canvasRef"
            id="canvas"
            :style="
              showRoomInvitationPanel || !isHost
                ? 'border-radius: 12px; overflow: hidden;'
                : ''
            "
            @mousemove="handleCanvasMouseMoveEvent"
          ></canvas>

          <!-- menu panel -->
          <PresentationRoomMenu
            v-if="isHost"
            :is-fullscreen="isFullscreen"
            :show-room-information-panel="showRoomInformationPanel"
            :show-room-invitation-panel="showRoomInvitationPanel"
            @terminate-room="terminateRoom()"
            @toggle-fullscreen="toggleFullscreen()"
            @toggle-invitation-panel="
              showRoomInvitationPanel = !showRoomInvitationPanel
            "
            @toggle-information-panel="
              showRoomInformationPanel = !showRoomInformationPanel
            "
          />

          <!-- room data - participants count, reactions -->
          <PresentationRoomData
            :participants-count="participantsCount || 0"
            :is-host="isHost"
          />

          <!-- controls (← / →) -->
          <PresentationRoomSlideControls
            :is-host="isHost"
            :is-mouse-active="isMouseActive"
            @change-slide="handleSlideChange($event)"
            @hover="clearIsMouseActiveTimeout()"
          />
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
import QRCodeStyling from "qr-code-styling";
import PresentationRoomAuthForm from "components/presentationRoom/PresentationRoomAuthForm.vue";
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import PresentationRoomHeader from "components/presentationRoom/PresentationRoomHeader.vue";
import PresentationRoomMenu from "components/presentationRoom/PresentationRoomMenu.vue";
import PresentationRoomData from "components/presentationRoom/data/PresentationRoomData.vue";
import PresentationRoomInvitationPanel from "components/presentationRoom/PresentationRoomInvitationPanel.vue";
import PresentationRoomSlideControls from "components/presentationRoom/PresentationRoomSlideControls.vue";
import Echo from "laravel-echo";
import { randomNames } from "src/constants/mock";
import { useI18n } from "vue-i18n";

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
  room,
  participant,
  isGuest,
  showRoomInvitationPanel,
} = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { canvas, ctx, scale, elements } = storeToRefs(canvasStore);

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

// header - information panel
const showRoomInformationPanel = ref(true);

// room data
const participantsCount = ref(0);

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

  await canvasStore.setElementsFromSlide();
  return true;
};

const resizeCanvas = () => {
  canvas.value.width = 1920;
  canvas.value.height = 1080;

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

      if (isHost.value || !presentation.value?.is_private) {
        /*
         * init canvas slide
         */
        initCanvas();
        await initSlide();

        /*
         * update slide
         * case: host started presenting in already exisiting room from the new slide he's chosen
         */
        if (isHost.value && slide.value.id !== room.value.slide_id) {
          await presentationsStore.sendPresentationRoomUpdateEvent();
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
    })
    .catch((error) => {
      $q.notify({
        message: error.response.data.message,
        color: "red",
        icon: "r_crisis_alert",
      });

      router.push(ROUTE_PATHS.DASHBOARD);
    });

  /*
   * auth
   */
  if (!isHost.value) {
    // auth
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
    if (!participant.value) {
      isGuest.value = true;
      await presentationsStore.loginRoom([
        {
          name: "name",
          value:
            t("presentationRoom.auth.guest") +
            " " +
            randomNames[Math.floor(Math.random() * randomNames.length)],
        },
      ]);
    }
  }

  /*
   * establish connection to room channels
   */
  connectToRoomChannels();

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

    window.Echo.join(`public.room.${room.value.id}`)
      .here((users) => {
        participantsCount.value = users.length;
      })
      .joining(() => {
        participantsCount.value++;
      })
      .leaving(() => {
        participantsCount.value--;
      });
  }

  /*
   * listen for updates
   */
  channel.listen("PresentationRoomUpdatedEvent", async (event) => {
    if (!isHost.value && presentation.value?.is_private) return;

    if (event.slide_id !== slide.value.id) {
      const newSlide = presentation.value.slides.find(
        (item) => item.id === event.slide_id
      );

      await presentationsStore.setSlide(newSlide);
      await canvasStore.setElementsFromSlide();
      canvasStore.redrawCanvas(false, false, undefined, false);
    }
  });

  /*
   * listen for new reactions
   */
  channel.listen("PresentationRoomNewReactionEvent", (event) => {
    room.value.reactions = event.reactions;
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
    if (event.keyCode === 37) {
      handleSlideChange("backward");
    }

    if (event.keyCode === 39) {
      handleSlideChange("forward");
    }
  }
};

const handleSlideChange = async (direction) => {
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

  presentationsStore.sendPresentationRoomUpdateEvent();
};

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
 * qr
 */
const qrCode = new QRCodeStyling({
  width: 236,
  height: 236,
  type: "svg",
  data: window.location.href,
  image: window.location.origin + "/logo_white.png",
  dotsOptions: {
    type: "rounded",
    // gradient: {
    //   type: "linear",
    //   rotation: Math.PI / 4,
    //   colorStops: [
    //     { offset: 0, color: "#4971FF" },
    //     { offset: 1, color: "#4647DA" },
    //   ],
    // },
    color: "#FFFFFF",
  },
  backgroundOptions: {
    color: "#1F1F29",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 2,
  },
});

/*
 * fullscreen
 */
const isFullscreen = ref(!!document.fullscreenElement);

const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
};

onBeforeMount(() => {
  document.addEventListener("fullscreenchange", (event) => {
    handleFullscreenChangeEvent();
  });
});

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleKeyDownEvent);
});

const handleFullscreenChangeEvent = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

/*
 * terminate room
 */
const terminateRoom = () => {
  api
    .delete(`/presentation/${presentation.value.id}/room/${room.value.id}`)
    .catch((error) => {
      console.log(error);
    });
};
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
