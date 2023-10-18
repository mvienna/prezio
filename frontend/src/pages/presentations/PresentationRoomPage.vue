<template>
  <q-page>
    <div class="container relative-position column no-wrap justify-center">
      <!-- auth form -->
      <PresentationRoomAuthForm v-if="!isAuthenticated" />

      <!-- content -->
      <div
        v-show="isAuthenticated"
        class="row no-wrap items-center"
        :class="showRoomInvitationPanel ? 'q-px-md' : ''"
      >
        <!-- room invitation panel -->
        <transition
          appear
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut"
        >
          <PresentationRoomInvitationPanel
            v-if="showRoomInvitationPanel"
            :qr-code="qrCode"
            @toggle-invitation-panel="toggleInvitationPanel()"
          />
        </transition>

        <!-- slide  -->
        <div
          class="relative-position column no-wrap justify-center"
          style="background: pink"
          :style="
            showRoomInvitationPanel
              ? 'border-radius: 12px; overflow: hidden;'
              : ''
          "
        >
          <!-- header -->
          <PresentationRoomHeader
            :is-host="isHost"
            :is-mouse-active="isMouseActive"
            :show-room-information-panel="showRoomInformationPanel"
            @mouseover="clearIsMouseActiveTimeout()"
            @toggle-invitation-panel="toggleInvitationPanel()"
          />

          <!-- canvas -->
          <canvas
            ref="canvasRef"
            id="canvas"
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
            @toggle-invitation-panel="toggleInvitationPanel()"
            @toggle-information-panel="
              showRoomInformationPanel = !showRoomInformationPanel
            "
          />

          <!-- stats panel -->
          <PresentationRoomData :participants-count="participantsCount || 0" />

          <!-- controls -->
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
import { useQuasar } from "quasar";
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

const { user } = storeToRefs(useAuthStore());

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, slide, room, participant, showRoomInvitationPanel } =
  storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { canvas, ctx, scale } = storeToRefs(canvasStore);

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
      participant.value)
  );
});

const participantsCount = ref(0);

const showRoomInformationPanel = ref(true);

/*
 * authenticate
 * fetch data
 * load slide
 * establish connection to room channels
 */
const canvasRef = ref();

onMounted(async () => {
  canvas.value = canvasRef.value;
  ctx.value = canvas.value.getContext("2d");
  ctx.value.imageSmoothingEnabled = true;

  /*
   * fetch room data
   */
  await api
    .get(`/room/${router.currentRoute.value.params.token}`)
    .then((response) => {
      room.value = response.data.room;
      presentation.value = response.data.presentation;

      /*
       * update slide
       */
      presentationsStore.setSlide(
        slide.value ||
          presentation.value.slides.find(
            (item) => item.id === room.value.slide_id
          ) ||
          presentation.value.slides[0]
      );
      canvasStore.setElementsFromSlide();

      if (isHost.value && slide.value.id !== room.value.slide_id) {
        presentationsStore.sendPresentationRoomUpdateEvent();
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
    const token = localStorage.getItem("participantToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await api
        .get("/user/room")
        .then((response) => {
          participant.value = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // login as guest
    if (!participant.value) {
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
   * resize canvas
   */
  resizeCanvas();
  setTimeout(() => {
    canvasStore.redrawCanvas(false, false, undefined, false);
  }, 100);
  window.addEventListener("resize", resizeCanvas);

  /*
   * establish connection to room channels
   */
  connectToRoomChannels();
});

const resizeCanvas = () => {
  canvas.value.width = 1920;
  canvas.value.height = 1080;

  ctx.value.scale(scale.value, scale.value);

  canvasStore.redrawCanvas(false, false, undefined, false);
};

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
    showRoomInvitationPanel.value = event.showRoomInvitationPanel;

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
   * listen for termination
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
    if (event.ctrlKey || event.metaKey) {
      if (event.keyCode === 37) {
        event.preventDefault();
        handleSlideChange("backward");
      }

      if (event.keyCode === 39) {
        event.preventDefault();
        handleSlideChange("forward");
      }
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
 * toggle invitation panel
 */
const toggleInvitationPanel = () => {
  showRoomInvitationPanel.value = !showRoomInvitationPanel.value;
  presentationsStore.sendPresentationRoomUpdateEvent();
};

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
  background: black;
}

/*
 * content
 */
.container {
  max-width: 100%;
  padding: 0;
  height: 100vh;
  aspect-ratio: 16/9;
}

canvas {
  background-color: $white;
  margin: 0;
  z-index: 1;
  width: 100%;
  aspect-ratio: 16/9;
}
</style>
