<template>
  <div
    style="
      height: 40px;
      position: fixed;
      border-radius: 8px 8px 0 0;
      z-index: 2;
    "
    :style="`width: ${canvasRect?.width}px; left: ${canvasRect?.left}px; top: ${canvasRect?.top}px;`"
    class="row no-wrap items-center justify-center q-px-sm"
    :class="`text-${
      averageBackgroundBrightness >= backgroundBrightnessThreshold
        ? 'black'
        : 'white'
    }`"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <transition
      appear
      enter-active-class="animated flipInX"
      leave-active-class="animated flipOutX"
    >
      <div
        v-if="
          presentation?.settings?.show_joining_instructions_bar || isHovered
        "
        class="row no-wrap items-center justify-center ellipsis q-px-sm presentation_studio_slide_header__banner text-14"
        style="max-width: 70%"
        :style="`background: ${
          presentation?.settings?.show_joining_instructions_bar || isHovered
            ? averageBackgroundBrightness >= backgroundBrightnessThreshold
              ? 'rgba(0, 0, 0, 0.1)'
              : 'rgba(255, 255, 255, 0.1)'
            : 'transparent'
        };`"
      >
        <!-- link -->
        <div class="ellipsis cursor-pointer" @click="copyRoomLinkToClipboard()">
          <span v-if="!$q.screen.lt.sm" class="q-mr-xs" style="opacity: 0.5">
            {{ $t("presentationRoom.header.roomLink.title") }}
          </span>

          <span class="text-semibold">
            {{ host }}/room/<b class="text-uppercase">
              {{ presentation.room.token }}
            </b>
          </span>

          <q-tooltip :offset="[0, 8]">
            {{
              $t(
                `presentationRoom.header.roomLink.${
                  isCopied ? "copied" : "copyToClipboard"
                }`
              )
            }}
          </q-tooltip>
        </div>

        <!-- open share -->
        <q-icon
          name="r_edit"
          class="q-ml-sm cursor-pointer q-pa-xs"
          @click="showShareDialog = true"
        />
      </div>
    </transition>

    <!-- logo -->
    <div
      class="absolute-right q-mr-md q-mt-sm"
      style="width: 64px; height: 18px"
    >
      <q-img
        :src="
          averageBackgroundBrightness >= backgroundBrightnessThreshold
            ? '/prezio.svg'
            : '/prezio--white.svg'
        "
        fit="contain"
      />
    </div>
  </div>
</template>

<script setup>
import { copyToClipboard } from "quasar";
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";

/*
 * variables
 */
const isHovered = ref(false);

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { scale } = storeToRefs(canvasStore);

const presentationsStore = usePresentationsStore();
const {
  averageBackgroundBrightness,
  backgroundBrightnessThreshold,
  showShareDialog,
  presentation,
} = storeToRefs(presentationsStore);

/*
 * slide canvas element
 */
const canvasRect = ref(canvasStore.canvasRect());

const resizeObserverCanvas = ref();
const resizeObserverPage = ref();

onMounted(() => {
  const canvas = document.getElementById("canvas");
  resizeObserverCanvas.value = new ResizeObserver((entries) => {
    for (const entry of entries) {
      canvasRect.value = canvasStore.canvasRect();
    }
  });
  resizeObserverCanvas.value.observe(canvas);

  const page = document.getElementsByClassName("q-page-container")[0];
  resizeObserverPage.value = new ResizeObserver((entries) => {
    for (const entry of entries) {
      canvasRect.value = canvasStore.canvasRect();
    }
  });
  resizeObserverPage.value.observe(page);
});

onUnmounted(() => {
  resizeObserverCanvas.value.disconnect();
  resizeObserverPage.value.disconnect();
});

/*
 * on resize
 */
onBeforeMount(() => {
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.addEventListener("resize", onResize);
});

const onResize = () => {
  canvasRect.value = canvasStore.canvasRect();
};

/*
 * room link
 */
const host = window.location.hostname;
const roomLink = computed(() => {
  return `${window.location.hostname}/room/${presentation.value.room.token}`;
});

const isCopied = ref(false);
const copiedTimeout = ref();

const copyRoomLinkToClipboard = () => {
  clearTimeout(copiedTimeout.value);

  copyToClipboard(roomLink.value);
  isCopied.value = true;

  copiedTimeout.value = setTimeout(() => {
    isCopied.value = false;
  }, 3000);
};
</script>

<style scoped lang="scss">
.presentation_studio_slide_header__banner {
  border-radius: 12px;
  height: 24px;
}
</style>
