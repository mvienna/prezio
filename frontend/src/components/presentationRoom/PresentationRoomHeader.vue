<template>
  <q-toolbar
    v-if="isHost"
    class="cursor-pointer"
    :class="$q.screen.lt.lg ? 'q-pa-md' : 'q-pa-lg'"
    :style="
      showRoomInformationPanel
        ? 'background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);'
        : ''
    "
    @click="
      (event) => {
        if (['DIV', 'IMG'].includes(event.target.nodeName)) {
          $emit('toggleInvitationPanel');
        }
      }
    "
  >
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div
        class="row no-wrap q-gutter-sm"
        v-if="showRoomInformationPanel"
        style="transition: 0.2s"
        :style="!isMouseActive && !$q.screen.lt.sm ? 'opacity: 0' : ''"
      >
        <!-- back to studio -->
        <q-btn
          :flat="showRoomInformationPanel"
          :unelevated="!showRoomInformationPanel"
          :color="showRoomInformationPanel ? 'grey' : 'black'"
          :text-color="showRoomInformationPanel ? 'white' : 'white'"
          :style="!showRoomInformationPanel ? 'opacity: 0.7' : ''"
          icon="r_keyboard_return"
          round
          size="14px"
          :disable="!presentation?.id"
          :href="
            clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_STUDIO) +
            presentation?.id
          "
          style="border-radius: 50%"
        >
          <q-tooltip>
            {{ $t("presentationRoom.header.backToStudio") }}
          </q-tooltip>
        </q-btn>
      </div>
    </transition>

    <q-space />

    <!-- invitation link -->
    <div
      v-if="showRoomInformationPanel"
      class="row no-wrap items-center justify-center ellipsis"
      style="max-width: 70%"
    >
      <!-- link -->
      <div
        class="ellipsis room_link"
        style="max-width: 550px; font-size: 1.25em"
        @click="copyRoomLinkToClipboard()"
      >
        <span v-if="!$q.screen.lt.sm" class="text-grey q-mr-xs">
          {{ $t("presentationRoom.header.roomLink.title") }}
        </span>

        <span class="text-semibold">
          {{ roomLink }}
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
        :color="showRoomInvitationPanel ? 'white' : 'grey'"
        round
        size="12px"
        class="q-ml-sm"
        @click="$emit('toggleInvitationPanel')"
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

    <q-space />

    <!-- logo -->
    <div :style="$q.screen.lt.sm ? 'min-width: 64px' : 'min-width: 96px'">
      <q-img
        src="/logo_white_with_title_white.png"
        style="height: 48px"
        fit="contain"
      />
    </div>
  </q-toolbar>

  <div v-else class="row justify-center q-pa-lg">
    <div style="width: 96px">
      <q-img
        src="/logo_white_with_title_white.png"
        style="height: 48px"
        fit="contain"
      />
    </div>
  </div>
</template>

<script setup>
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import { ROUTE_PATHS } from "src/constants/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { api } from "boot/axios";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";

/*
 * variables
 */
const router = useRouter();
const $q = useQuasar();

/*
 * props
 */
defineProps({
  isHost: { type: Boolean },
  isMouseActive: { type: Boolean },
  showRoomInformationPanel: { type: Boolean },
});

/*
 * emits
 */
defineEmits(["toggleInvitationPanel"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, presentation, showRoomInvitationPanel } =
  storeToRefs(presentationsStore);

/*
 * room link
 */
const roomLink = computed(() => {
  return `${window.location.hostname}/room/${router.currentRoute.value.params.token}`;
});

const isCopied = ref(false);
const copiedTimeout = ref();

const copyRoomLinkToClipboard = () => {
  clearTimeout(copiedTimeout.value);

  navigator.clipboard
    .writeText(window.location)
    .then(() => {
      isCopied.value = true;

      copiedTimeout.value = setTimeout(() => {
        isCopied.value = false;
      }, 3000);
    })
    .catch((error) => {
      console.error(error);
    });
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

@media screen and (max-width: 960px) {
  .q-toolbar {
    height: 40px;
  }
}

.room_link {
  cursor: pointer;
  line-height: 32px;
}
</style>
