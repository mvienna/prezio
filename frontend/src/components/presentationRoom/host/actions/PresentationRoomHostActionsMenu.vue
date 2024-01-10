<template>
  <q-btn
    :label="$t('presentationRoom.footer.menu.title')"
    icon="r_menu"
    flat
    rounded
    no-caps
  >
    <q-menu
      anchor="top left"
      self="bottom left"
      transition-show="jump-up"
      transition-hide="jump-down"
      :offset="[8, 16]"
      style="
        background: rgba(0, 0, 0, 0.5);
        color: white;
        backdrop-filter: blur(4px);
        border-radius: 24px;
      "
      class="q-pa-sm"
    >
      <div class="column no-wrap q-gutter-sm">
        <!-- terminate room -->
        <q-btn
          :label="$t('presentationRoom.footer.menu.terminateRoom')"
          icon="r_sports_score"
          align="left"
          no-caps
          flat
          :size="$q.screen.lt.md ? '0.8em' : '1em'"
          style="border-radius: 16px 16px 8px 8px"
          @click="terminateRoom()"
        />

        <q-separator class="bg-white" style="opacity: 0.5" />

        <!-- open backstage -->
        <q-btn
          :label="$t('presentationRoom.footer.menu.openBackstage')"
          icon="r_movie"
          no-caps
          align="left"
          flat
          disable
          :size="$q.screen.lt.md ? '0.8em' : '1em'"
          v-close-popup
          style="border-radius: 8px"
        />

        <!-- fullscreen toggle -->
        <q-btn
          :label="
            $t(
              `presentationRoom.footer.menu.fullscreen.${
                isFullscreen ? 'off' : 'on'
              }`
            )
          "
          :icon="isFullscreen ? 'r_fullscreen_exit' : 'r_fullscreen'"
          no-caps
          align="left"
          flat
          :size="$q.screen.lt.md ? '0.8em' : '1em'"
          v-close-popup
          style="border-radius: 8px"
          @click="toggleFullscreen()"
        />

        <!-- invitation panel toggle -->
        <q-btn
          :label="
            $t(
              `presentationRoom.footer.menu.invitationPanel.${
                showRoomInvitationPanel ? 'hide' : 'show'
              }`
            )
          "
          icon="r_qr_code"
          no-caps
          align="left"
          flat
          style="border-radius: 8px"
          :size="$q.screen.lt.md ? '0.8em' : '1em'"
          v-close-popup
          @click="showRoomInvitationPanel = !showRoomInvitationPanel"
        />

        <!-- header toggle -->
        <q-btn
          :label="
            $t(
              `presentationRoom.footer.menu.informationPanel.${
                presentation?.settings?.show_joining_instructions_bar
                  ? 'hide'
                  : 'show'
              }`
            )
          "
          icon="r_help"
          no-caps
          align="left"
          flat
          style="border-radius: 8px"
          :size="$q.screen.lt.md ? '0.8em' : '1em'"
          v-close-popup
          @click="
            presentation.settings.show_joining_instructions_bar =
              !presentation.settings.show_joining_instructions_bar
          "
        />

        <!-- privacy toggle -->
        <q-btn
          :label="
            $t(
              `presentationRoom.footer.menu.privacy.${
                presentation.is_private ? 'public' : 'private'
              }`
            )
          "
          :icon="presentation.is_private ? 'r_visibility_off' : 'r_visibility'"
          no-caps
          align="left"
          flat
          :size="$q.screen.lt.md ? '0.8em' : '1em'"
          style="border-radius: 8px 8px 16px 16px"
          v-close-popup
          @click="
            presentation.is_private = !presentation.is_private;
            presentationsStore.updatePresentation();
          "
        />
      </div>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { api } from "boot/axios";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { onBeforeMount, onUnmounted, ref } from "vue";
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import { ROUTE_PATHS } from "src/constants/routes";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, showRoomInvitationPanel, room } =
  storeToRefs(presentationsStore);

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
  document.addEventListener("fullscreenchange", handleFullscreenChangeEvent);
});

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChangeEvent);
});

const handleFullscreenChangeEvent = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

/*
 * terminate room
 */
const terminateRoom = () => {
  window.location =
    clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_STUDIO) +
    presentation.value?.id;
  // api
  //   .delete(`/presentation/${presentation.value.id}/room/${room.value.id}`)
  //   .catch((error) => {
  //     console.log(error);
  //   });
};
</script>
