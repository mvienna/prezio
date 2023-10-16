<template>
  <q-page>
    <!-- collect participant's info -->
    <PresentationRoomAuthForm v-if="!isAuthenticated" />

    <!-- content -->
    <div
      v-show="isAuthenticated"
      class="canvas__wrapper relative-position q-pa-lg"
    >
      <div class="row no-wrap">
        <!-- room invitation panel -->
        <q-intersection
          v-show="showRoomInvitationPanel"
          transition="scale"
          class="room_invitation_panel q-mr-md q-pa-md"
        >
          <!-- title -->
          <div class="room_invitation_panel__title q-mb-md">
            {{ $t("presentationRoom.invitation.title") }}
          </div>

          <!-- qr code -->
          <div
            class="row justify-center"
            v-html="qrCode?._svg?.outerHTML"
          ></div>

          <div class="row no-wrap items-center justify-between q-mt-md q-mb-lg">
            <q-separator style="width: 40%" />
            <div class="text-grey">
              {{ $t("presentationRoom.invitation.otherOption.or") }}
            </div>
            <q-separator style="width: 40%" />
          </div>

          <!-- other option -->
          <div class="room_invitation_panel__other_options">
            <!-- url -->
            <div>
              {{ $t("presentationRoom.invitation.otherOption.url") }}
              <a :href="url" target="_blank" class="text-primary text-semibold">
                {{ url }}
              </a>
            </div>

            <q-icon
              name="r_keyboard_double_arrow_down"
              size="sm"
              class="q-my-sm"
              color="primary"
            />

            <!-- id -->
            <div>
              {{ $t("presentationRoom.invitation.otherOption.id") }}:
              <span class="text-primary text-semibold cursor-pointer">
                {{ room?.id }}
              </span>
            </div>
          </div>
        </q-intersection>

        <div class="relative-position column no-wrap justify-center">
          <!-- canvas -->
          <canvas ref="canvasRef" id="canvas"> </canvas>

          <!-- controls -->
          <template v-if="isHost">
            <!-- previous slide -->
            <div
              class="absolute-left column no-wrap justify-center q-ml-md"
              style="z-index: 2"
            >
              <q-btn
                flat
                round
                icon="r_arrow_back_ios_new"
                no-caps
                no-wrap
                size="12px"
                class="q-px-sm q-py-xl"
                style="
                  background: rgba(255, 255, 255, 0.5);
                  backdrop-filter: blur(4px);
                "
                :disable="slideIndex === 0"
                @click="handleSlideChange('backward')"
              >
                <q-tooltip
                  anchor="center right"
                  self="center left"
                  transition-show="jump-right"
                  transition-hide="jump-left"
                  :offset="[8, 0]"
                >
                  <div class="text-bold text-center">
                    {{ $t("presentationStudio.preview.controls.previous") }}
                  </div>

                  <div
                    v-if="showShortcuts"
                    class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm"
                  >
                    <div v-if="isMac">⌘</div>
                    <div v-else>Ctrl</div>
                    <div>←</div>
                  </div>
                </q-tooltip>
              </q-btn>
            </div>

            <!-- next slide -->
            <div
              class="absolute-right column no-wrap justify-center q-mr-md"
              style="z-index: 2"
            >
              <q-btn
                flat
                round
                icon="r_arrow_forward_ios"
                no-caps
                no-wrap
                size="12px"
                class="q-px-sm q-py-xl"
                style="
                  background: rgba(255, 255, 255, 0.5);
                  backdrop-filter: blur(4px);
                "
                :disable="slideIndex === presentation?.slides?.length - 1"
                @click="handleSlideChange('forward')"
              >
                <q-tooltip
                  anchor="center left"
                  self="center right"
                  transition-show="jump-left"
                  transition-hide="jump-right"
                  :offset="[8, 0]"
                >
                  <div class="text-bold text-center">
                    {{ $t("presentationStudio.preview.controls.next") }}
                  </div>

                  <div
                    v-if="showShortcuts"
                    class="shortcut row no-wrap q-gutter-xs justify-center q-pt-sm"
                  >
                    <div v-if="isMac">⌘</div>
                    <div v-else>Ctrl</div>
                    <div>→</div>
                  </div>
                </q-tooltip>
              </q-btn>
            </div>
          </template>
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

/*
 * variables
 */
const router = useRouter();
const $q = useQuasar();

const { user } = storeToRefs(useAuthStore());

/*
 * role
 */
const isHost = computed(() => {
  if (user.value && presentation.value) {
    return user.value.id === presentation.value.user_id;
  }

  return false;
});

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, slide, room, participant, showRoomInvitationPanel } =
  storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { canvas, ctx, scale } = storeToRefs(canvasStore);

const isAuthenticated = computed(() => {
  return (
    isHost.value ||
    !presentation.value?.settings?.require_participants_info ||
    (presentation.value?.settings?.require_participants_info &&
      participant.value)
  );
});

/*
 * authenticate
 * fetch data
 * load slide
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

      presentationsStore.setSlide(response.data.slide);
      canvasStore.setElementsFromSlide();
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

  /*
   * resize canvas
   */
  resizeCanvas();
  setTimeout(() => {
    canvasStore.redrawCanvas(false, false, undefined, false);
  }, 100);
  window.addEventListener("resize", resizeCanvas);

  /*
   * connect to web sockets
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
  /*
   * connecting to room channels
   */
  const channel = window.Echo.channel(`public.room.${room.value.id}`);

  if (participant.value || user.value) {
    window.Echo.join(`public.room.${room.value.id}`)
      .here((users) => {
        console.log(users.length);
      })
      .joining(() => {
        console.log("joining");
      })
      .leaving(() => {
        console.log("leaving");
      });
  }

  /*
   * listen for updates
   */
  if (!isHost.value) {
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
  }

  /*
   * listen for termination
   */
  channel.listen("PresentationRoomTerminatedEvent", () => {
    if (isHost.value) {
      window.location =
        clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_STUDIO) +
        presentation.value.id;
    } else {
      router.push(ROUTE_PATHS.DASHBOARD);
    }
  });
};

/*
 * slide index
 */
const slideIndex = computed(() => {
  return presentation.value?.slides?.findIndex(
    (item) => item.id === slide.value.id
  );
});

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
  const newSlide =
    presentation.value.slides?.[
      slideIndex.value + (direction === "forward" ? 1 : -1)
    ];
  if (!newSlide) return;

  await presentationsStore.setSlide(newSlide);
  await canvasStore.setElementsFromSlide();
  canvasStore.redrawCanvas(false, false, undefined, false);

  presentationsStore.sendPresentationRoomUpdateEvent();
};

/*
 * shortcuts
 */
const showShortcuts = computed(() => {
  return $q.platform.is.desktop;
});

const isMac = computed(() => {
  return $q.platform.is.platform === "mac";
});

/*
 * qr
 */
const qrCode = new QRCodeStyling({
  width: 196,
  height: 196,
  type: "svg",
  data: window.location.href,
  image: window.location.origin + "/favicon.ico",
  dotsOptions: {
    type: "rounded",
    gradient: {
      type: "linear",
      rotation: Math.PI / 4,
      colorStops: [
        { offset: 0, color: "#4971FF" },
        { offset: 1, color: "#4647DA" },
      ],
    },
  },
  backgroundOptions: {
    color: "#FFFFFF",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 2,
  },
});

const url = window.location.host;
</script>

<style scoped lang="scss">
.q-page {
  height: calc(100vh - 64px);
}

/*
 * content
 */
.canvas__wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
  z-index: 1;

  canvas {
    background-color: $white;
    border-radius: 12px;
    aspect-ratio: 16/9;
    max-width: 100%;
    max-height: 90vh;
    z-index: 1;
  }

  .canvas__toolbar {
    width: 100%;
    border-radius: 10px;
    background: $white;
    z-index: 11;
    box-shadow: rgba(73, 112, 255, 0.1) 0 8px 24px;
  }

  .room_invitation_panel {
    height: 100%;
    border: 1.5px solid $blue-2;
    background: $white;
    border-radius: 12px;

    .room_invitation_panel__title {
      font-weight: 800;
      font-size: 24px;
      text-align: center;
      color: $primary;
      background: linear-gradient(to right, #4971ff, #4647da);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .room_invitation_panel__other_options {
      text-align: center;
      font-weight: 500;
    }
  }
}
</style>
