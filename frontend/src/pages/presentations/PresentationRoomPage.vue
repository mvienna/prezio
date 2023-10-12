<template>
  <q-page>
    <!-- canvas -->
    <div class="canvas__wrapper relative-position q-pa-lg">
      <canvas ref="canvasRef" id="canvas"> </canvas>

      <template v-if="isHost">
        <!-- previous slide -->
        <div
          class="absolute-left column no-wrap justify-center q-ml-lg q-pl-md"
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
          class="absolute-right column no-wrap justify-center q-mr-lg q-pr-md"
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
const { presentation, slide, room } = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { canvas, ctx, scale } = storeToRefs(canvasStore);

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
   * listen for updates
   */
  if (!isHost.value) {
    window.Echo.channel(`public.room.${room.value.id}`).listen(
      "PresentationRoomUpdatedEvent",
      async (event) => {
        if (event.slide.id === slide.value.id) return;

        await presentationsStore.setSlide(event.slide);
        await canvasStore.setElementsFromSlide();
        canvasStore.redrawCanvas(false, false, undefined, false);
      }
    );
  }

  /*
   * listen for termination
   */
  window.Echo.channel(`public.room.${room.value.id}`).listen(
    "PresentationRoomTerminatedEvent",
    () => {
      if (isHost.value) {
        window.location =
          clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_STUDIO) +
          presentation.value.id;
      } else {
        router.push(ROUTE_PATHS.DASHBOARD);
      }
    }
  );

  /*
   * resize canvas
   */
  resizeCanvas();
  setTimeout(() => {
    canvasStore.redrawCanvas(false, false, undefined, false);
  }, 100);
  window.addEventListener("resize", resizeCanvas);
});

const resizeCanvas = () => {
  canvas.value.width = 1920;
  canvas.value.height = 1080;

  ctx.value.scale(scale.value, scale.value);

  canvasStore.redrawCanvas(false, false, undefined, false);
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

  api
    .patch(`/presentation/${presentation.value.id}/room/${room.value.id}`, {
      slide_id: slide.value.id,
    })
    .catch((error) => {
      console.log(error);
    });
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
</script>

<style scoped lang="scss">
.q-page {
  height: calc(100vh - 64px);
}

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
}
</style>
