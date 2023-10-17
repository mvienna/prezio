<template>
  <q-toolbar
    v-if="isHost"
    class="q-pa-lg"
    :style="
      showRoomInformationPanel
        ? 'background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px);'
        : ''
    "
  >
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div
        class="row no-wrap q-gutter-sm"
        v-if="showRoomInformationPanel || isMouseActive"
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

        <!-- volume controls -->
        <q-btn
          :flat="showRoomInformationPanel"
          :unelevated="!showRoomInformationPanel"
          :color="showRoomInformationPanel ? 'grey' : 'black'"
          :text-color="showRoomInformationPanel ? 'white' : 'white'"
          :style="!showRoomInformationPanel ? 'opacity: 0.7' : ''"
          icon="r_library_music"
          disable
          round
          size="14px"
          style="border-radius: 50%"
        />
      </div>
    </transition>

    <q-space />

    <!-- invitation link -->
    <div
      v-if="showRoomInformationPanel"
      class="row no-wrap items-center justify-center"
    >
      <!-- link -->
      <div
        class="ellipsis room_link"
        style="max-width: 600px; font-size: 18px"
        @click="copyRoomLinkToClipboard()"
      >
        <span class="text-grey q-mr-xs">
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
    <div style="min-width: 96px">
      <q-img
        src="/logo_white_with_title_white.png"
        style="height: 48px"
        fit="contain"
      />
    </div>
  </q-toolbar>

  <q-toolbar v-else class="row justify-center">
    <div style="width: 96px">
      <q-img
        src="/logo_white_with_title_white.png"
        style="height: 48px"
        fit="contain"
      />
    </div>
  </q-toolbar>
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

defineProps({
  isHost: { type: Boolean },
  isMouseActive: { type: Boolean },
  showRoomInformationPanel: { type: Boolean },
});

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

/*
 *- --
 */
function getColorAtPixel(imageData, x, y) {
  const offset = (y * imageData.width + x) * 4;
  const red = imageData.data[offset];
  const green = imageData.data[offset + 1];
  const blue = imageData.data[offset + 2];
  return `rgb(${red},${green},${blue})`;
}

function updateButtonColor(x, y, width, height) {
  const imageData = ctx.value.getImageData(x, y, width, height);

  const averageColor = getColorAtPixel(imageData, 0, 0);

  console.log(averageColor);
}
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

.room_link {
  cursor: pointer;
  line-height: 32px;
}
</style>
