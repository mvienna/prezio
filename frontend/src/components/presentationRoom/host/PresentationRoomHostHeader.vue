<template>
  <q-toolbar
    v-if="isHost"
    class="cursor-pointer"
    :class="`${$q.screen.lt.lg ? 'q-pa-md' : 'q-pa-lg'} ${
      showRoomInformationPanel || isHovered ? 'q-toolbar--appear' : ''
    }`"
    @click="
      (event) => {
        if (
          ['DIV', 'IMG'].includes(event.target.nodeName) &&
          (showRoomInformationPanel || isHovered)
        ) {
          showRoomInvitationPanel = !showRoomInvitationPanel;
        }
      }
    "
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- back to studio -->
    <div
      class="row no-wrap q-gutter-sm"
      style="transition: 0.2s"
      :style="
        !showRoomInformationPanel && !isHovered && !isMouseActive
          ? 'opacity: 0;'
          : ''
      "
    >
      <q-intersection
        transition="fade"
        v-if="showRoomInformationPanel || isHovered"
      >
        <q-btn
          flat
          icon="r_keyboard_return"
          text-color="white"
          color="grey"
          round
          size="14px"
          :disable="!presentation?.id"
          :href="
            clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_STUDIO) +
            presentation?.id
          "
          style="border-radius: 50%; transition: 0.2s; min-width: 42px"
        >
          <q-tooltip>
            {{ $t("presentationRoom.header.backToStudio") }}
          </q-tooltip>
        </q-btn>
      </q-intersection>

      <q-intersection v-else transition="fade">
        <q-btn
          unelevated
          text-color="white"
          style="
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
          "
          icon="r_keyboard_return"
          round
          size="14px"
          :disable="!presentation?.id"
          :href="
            clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_STUDIO) +
            presentation?.id
          "
        >
          <q-tooltip>
            {{ $t("presentationRoom.header.backToStudio") }}
          </q-tooltip>
        </q-btn>
      </q-intersection>
    </div>

    <q-space />

    <!-- invitation link -->
    <transition
      appear
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <div
        v-if="showRoomInformationPanel || isHovered"
        class="row no-wrap items-center justify-center ellipsis"
        style="max-width: 70%"
      >
        <!-- link -->
        <div
          class="ellipsis room_link"
          style="font-size: 1.25em"
          @click="copyRoomLinkToClipboard()"
        >
          <span v-if="!$q.screen.lt.sm" class="text-grey-4 q-mr-xs">
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

        <!-- toggle invitation panel -->
        <q-btn
          flat
          icon="r_qr_code"
          :color="showRoomInvitationPanel ? 'white' : 'grey-4'"
          round
          size="12px"
          class="q-ml-sm"
          @click="showRoomInvitationPanel = !showRoomInvitationPanel"
        >
          <q-tooltip>
            {{
              $t(
                `presentationRoom.header.invitationPanel.${
                  showRoomInvitationPanel ? "hide" : "show"
                }`
              )
            }}
          </q-tooltip>
        </q-btn>
      </div>
    </transition>

    <q-space />

    <!-- logo -->
    <div :style="$q.screen.lt.sm ? 'min-width: 64px' : 'min-width: 96px'">
      <q-img
        :src="
          showRoomInformationPanel || isHovered
            ? '/logo_white_with_title_white.png'
            : logo
        "
        style="height: 48px"
        fit="contain"
      />
    </div>
  </q-toolbar>

  <div v-else class="row justify-center q-pa-lg">
    <div style="width: 96px">
      <q-img :src="logo" style="height: 48px" fit="contain" />
    </div>
  </div>
</template>

<script setup>
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import { ROUTE_PATHS } from "src/constants/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { copyToClipboard, useQuasar } from "quasar";

/*
 * variables
 */
const router = useRouter();
const $q = useQuasar();

const isHovered = ref(false);

/*
 * props
 */
defineProps({
  isMouseActive: { type: Boolean },
});

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const {
  room,
  presentation,
  showRoomInvitationPanel,
  showRoomInformationPanel,
  averageBackgroundBrightness,
  backgroundBrightnessThreshold,
  isHost,
} = storeToRefs(presentationsStore);

/*
 * logo
 */
const logo = computed(() => {
  return averageBackgroundBrightness.value >=
    backgroundBrightnessThreshold.value
    ? "/logo_with_title_black.png"
    : "/logo_white_with_title_white.png";
});

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

<style scoped lang="scss">
.q-toolbar {
  height: 60px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  color: $white;
}

@media screen and (max-width: 1023px) {
  .q-toolbar {
    height: 40px;
  }
}

.q-toolbar--appear {
  animation: toolbarAppearAnimation 0.4s ease-in-out;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

@keyframes toolbarAppearAnimation {
  0% {
    background: transparent;
  }

  50% {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: none;
  }

  100% {
    backdrop-filter: blur(4px);
  }
}

.room_link {
  cursor: pointer;
  line-height: 32px;
}
</style>
