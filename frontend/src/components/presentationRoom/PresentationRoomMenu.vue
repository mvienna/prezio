<template>
  <div class="room_menu row no-wrap">
    <!-- menu -->
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
          background: rgba(0, 0, 0, 0.7);
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
            style="border-radius: 16px 16px 8px 8px"
            @click="$emit('terminateRoom')"
          />

          <q-separator class="bg-grey-8" />

          <!-- open backstage -->
          <q-btn
            :label="$t('presentationRoom.footer.menu.openBackstage')"
            icon="r_movie"
            no-caps
            align="left"
            flat
            disable
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
            v-close-popup
            style="border-radius: 8px"
            @click="$emit('toggleFullscreen')"
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
            v-close-popup
            @click="$emit('toggleInvitationPanel')"
          />

          <!-- header toggle -->
          <q-btn
            :label="
              $t(
                `presentationRoom.footer.menu.informationPanel.${
                  showRoomInformationPanel ? 'hide' : 'show'
                }`
              )
            "
            icon="r_info"
            no-caps
            align="left"
            flat
            style="border-radius: 8px"
            v-close-popup
            @click="$emit('toggleInformationPanel')"
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
            :icon="
              presentation.is_private ? 'r_visibility_off' : 'r_visibility'
            "
            no-caps
            align="left"
            flat
            disable
            style="border-radius: 8px 8px 16px 16px"
            v-close-popup
          />
        </div>
      </q-menu>
    </q-btn>

    <!-- spice things up with effect -->
    <q-btn flat round icon="r_celebration" disable />
  </div>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

/*
 * props
 */
defineProps({
  showRoomInvitationPanel: { type: Boolean },
  showRoomInformationPanel: { type: Boolean },
  isFullscreen: { type: Boolean },
});

/*
 * emits
 */
defineEmits([
  "terminateRoom",
  "toggleInformationPanel",
  "toggleInvitationPanel",
  "toggleFullscreen",
]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation } = storeToRefs(presentationsStore);
</script>

<style scoped lang="scss">
.room_menu {
  position: absolute;
  left: 24px;
  bottom: 24px;
  background: rgba(0, 0, 0, 0.7);
  color: $white;
  backdrop-filter: blur(4px);
  border-radius: 24px;
  padding: 8px;
  z-index: 1;

  .q-btn {
    border-radius: 16px;
  }
}
</style>
