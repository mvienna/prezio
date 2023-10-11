<template>
  <q-header class="bg-white q-pa-md" elevated>
    <q-toolbar>
      <div class="row no-wrap q-gutter-sm">
        <!-- back to studio -->
        <q-btn
          outline
          color="grey"
          icon="r_arrow_back"
          round
          size="10px"
          :disable="!presentation?.id"
          :href="
            clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_STUDIO) +
            presentation?.id
          "
        />

        <!-- menu -->
        <q-btn outline color="grey" icon="r_menu" disable round size="10px" />

        <!-- spice things up with animation -->
        <q-btn
          outline
          color="grey"
          icon="r_celebration"
          disable
          round
          size="10px"
        />

        <!-- volume controls-->
        <q-btn
          outline
          color="grey"
          icon="r_volume_up"
          disable
          round
          size="10px"
        />
      </div>

      <q-space />

      <!-- invitation link -->
      <div class="row no-wrap items-center justify-center">
        <!-- link -->
        <div
          class="ellipsis text-dark text-semibold room_link"
          style="max-width: 30%"
          @click="copyRoomLinkToClipboard()"
        >
          {{ roomLink }}

          <q-tooltip>
            {{
              $t(
                `presentationRoom.header.roomLink.${
                  isCopied ? "copied" : "copyToClipboard"
                }`
              )
            }}
          </q-tooltip>
        </div>

        <!-- toggle qr code -->
        <q-btn flat icon="r_qr_code" color="grey" disable round size="10px" />
      </div>

      <q-space />

      <!-- logo -->
      <div style="width: 64px" class="q-mr-md">
        <q-img src="/logo_black.png" style="height: 32px" fit="contain" />
      </div>

      <!-- stop presenting -->
      <q-btn
        outline
        color="red"
        icon="r_stop"
        round
        size="10px"
        class="q-mr-sm"
        @click="handleRoomTermination()"
      />

      <!-- fullscreen mode -->
      <q-btn
        outline
        color="grey"
        icon="r_fullscreen"
        disable
        round
        size="10px"
      />
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import { ROUTE_PATHS } from "src/constants/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { api } from "boot/axios";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

/*
 * variables
 */
const router = useRouter();

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, presentation } = storeToRefs(presentationsStore);

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

/*
 * terminate room
 */
const handleRoomTermination = () => {
  api
    .delete(`/presentation/${presentation.value.id}/room/${room.value.id}`)
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style scoped lang="scss">
.q-toolbar {
  padding: 0;
  min-height: auto;
}

.room_link {
  cursor: pointer;
  line-height: 32px;
}
</style>
