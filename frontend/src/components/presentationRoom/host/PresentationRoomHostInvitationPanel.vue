<template>
  <div
    class="room_invitation_panel relative-position column no-wrap justify-center q-py-md"
  >
    <div class="absolute-right q-mr-md q-mt-md">
      <q-btn
        icon="r_close"
        color="grey"
        round
        size="10px"
        flat
        @click="showRoomInvitationPanel = !showRoomInvitationPanel"
      />
    </div>

    <!-- title -->
    <div class="room_invitation_panel__title text-24 q-mb-sm">
      {{ $t("presentationRoom.invitationPanel.title") }}
    </div>

    <!-- qr code -->
    <div class="row justify-center" v-html="qr?._svg?.outerHTML"></div>

    <div class="q-px-md">
      <div class="row no-wrap items-center justify-between q-mt-md q-mb-lg">
        <q-separator class="bg-grey-9" style="width: 40%" />
        <div class="text-grey-4">
          {{ $t("presentationRoom.invitationPanel.otherOption.or") }}
        </div>
        <q-separator class="bg-grey-9" style="width: 40%" />
      </div>
    </div>

    <!-- other option -->
    <div class="text-center text-semibold text-grey-6 text-20">
      <!-- host -->
      <div>
        {{ $t("presentationRoom.invitationPanel.otherOption.url") }}
      </div>
      <a :href="host" target="_blank" class="text-white text-semibold">
        {{ host }}
      </a>

      <div class="q-my-sm">
        <q-icon name="r_keyboard_double_arrow_down" size="sm" color="white" />
      </div>

      <!-- token -->
      <div>{{ $t("presentationRoom.invitationPanel.otherOption.id") }}</div>
      <div class="text-white text-semibold cursor-pointer text-uppercase">
        {{ room?.token }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { SUBDOMAINS } from "src/constants/routes";

/*
 * props
 */
defineProps({
  qr: { type: Object, default: null },
});

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, showRoomInvitationPanel } = storeToRefs(presentationsStore);

/*
 * url
 */
const host = window.location.hostname.replace(SUBDOMAINS.app + ".", "");
</script>

<style scoped lang="scss">
.room_invitation_panel {
  height: 100%;
  border: 1.5px solid $grey-9;
  background: $black;
  border-radius: 12px;
  min-width: 291px;
  width: 291px;

  .room_invitation_panel__title {
    font-weight: 800;
    text-align: center;
    color: $white;
  }
}
</style>
