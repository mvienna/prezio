<template>
  <div
    style="
      height: 40px;
      background: rgba(255, 255, 255, 0.4);
      position: fixed;
      border-radius: 8px 8px 0 0;
    "
    :style="`width: ${canvasRect?.width}px; left: ${canvasRect?.left}px; top: ${canvasRect?.top}px;`"
    class="row no-wrap items-center justify-center q-px-sm"
    :class="`text-${
      averageBackgroundBrightness >= backgroundBrightnessThreshold
        ? 'black'
        : 'white'
    }`"
  >
    <transition
      appear
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <div
        class="row no-wrap items-center justify-center ellipsis"
        style="max-width: 70%"
      >
        <!-- link -->
        <div class="ellipsis cursor-pointer" @click="copyRoomLinkToClipboard()">
          <span v-if="!$q.screen.lt.sm" class="q-mr-xs" style="opacity: 0.5">
            {{ $t("presentationRoom.header.roomLink.title") }}
          </span>

          <span class="text-semibold">
            {{ host }}/room/<b class="text-uppercase">
              {{ router.currentRoute.value.params.token }}
            </b>
          </span>

          <q-tooltip :offset="[0, 0]">
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
        <q-btn
          flat
          icon="r_edit"
          :size="10 * scale + 'px'"
          style="border-radius: 50%"
          round
          class="q-ml-sm"
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
            ? '/logo_with_title_black.png'
            : '/logo_white_with_title_white.png'
        "
        fit="contain"
      />
    </div>
  </div>
</template>

<script setup>
import { copyToClipboard } from "quasar";
import { computed, onBeforeMount, onUnmounted, ref, watch } from "vue";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { useRouter } from "vue-router";

/*
 * variables
 */
const router = useRouter();

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
} = storeToRefs(presentationsStore);

/*
 * slide canvas element
 */
const canvasRect = ref(canvasStore.canvasRect());

watch(
  () => scale.value,
  () => {
    canvasRect.value = canvasStore.canvasRect();
  }
);

/*
 * on resize
 */
onBeforeMount(() => {
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const onResize = () => {
  canvasRect.value = canvasStore.canvasRect();
};

/*
 * room link
 */
const host = window.location.hostname;
const roomLink = computed(() => {
  return `${window.location.hostname}/room/${router.currentRoute.value.params.token}`;
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
