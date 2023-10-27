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
        @click="$emit('toggleInvitationPanel')"
      />
    </div>

    <!-- title -->
    <div class="room_invitation_panel__title q-mb-sm">
      {{ $t("presentationRoom.invitationPanel.title") }}
    </div>

    <!-- qr code -->
    <div class="row justify-center" v-html="qrCode?._svg?.outerHTML"></div>

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
    <div class="text-center text-semibold text-grey-6" style="font-size: 22px">
      <!-- url -->
      <div>
        {{ $t("presentationRoom.invitationPanel.otherOption.url") }}
        <a :href="url" target="_blank" class="text-white text-semibold">
          {{ url }}
        </a>
      </div>

      <q-icon
        name="r_keyboard_double_arrow_down"
        size="sm"
        class="q-my-sm"
        color="white"
      />

      <!-- token -->
      <div>
        {{ $t("presentationRoom.invitationPanel.otherOption.id") }}:
        <span class="text-white text-semibold cursor-pointer text-uppercase">
          {{ room?.token }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";

/*
 * props
 */
defineProps({
  qrCode: { type: Object, default: null },
});

/*
 * emits
 */
defineEmits(["toggleInvitationPanel"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room } = storeToRefs(presentationsStore);

/*
 * url
 */
const url = window.location.host;
</script>

<style scoped lang="scss">
.room_invitation_panel {
  height: 100%;
  border: 1.5px solid $grey-9;
  background: $black;
  border-radius: 12px;
  min-width: 260px;
  width: 260px;

  .room_invitation_panel__title {
    font-weight: 800;
    font-size: 24px;
    text-align: center;
    color: $white;
  }
}
</style>
