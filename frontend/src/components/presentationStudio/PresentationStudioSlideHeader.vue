<template>
  <transition
    appear
    enter-active-class="animated flipInX"
    leave-active-class="animated flipOutX"
  >
    <div
      v-show="
        presentation?.settings?.show_joining_instructions_bar || isHovered
      "
      class="fixed row no-wrap items-center justify-between q-px-md q-mt-sm row no-wrap items-center justify-center ellipsis q-px-sm rounded-md text-14"
      :style="`width: ${presentation?.settings?.show_joining_instructions_bar || isHovered ? width : 0}px; left: ${
        stages.default?.attrs?.container?.getBoundingClientRect()?.left +
        stages.default?.width() / 2 -
        width / 2
      }px; top: ${
        stages.default?.attrs?.container?.getBoundingClientRect()?.top
      }px;`"
      :class="
        slide?.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
          ? 'text-black bg-grey-2'
          : 'text-white bg-grey-9'
      "
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <!-- link -->
      <div class="ellipsis cursor-pointer" @click="copyRoomLinkToClipboard()">
        <span
          v-if="width !== WIDTH_OPTIONS.shorten"
          class="q-mr-xs"
          style="opacity: 0.5"
        >
          {{ $t("presentationRoom.header.roomLink.title") }}
        </span>

        <span class="text-semibold">
          {{ host }}/<b class="text-uppercase">
            {{ presentation?.room?.token }}
          </b>
        </span>

        <q-tooltip :offset="[0, 8]">
          {{
            $t(
              `presentationRoom.header.roomLink.${
                isCopied ? "copied" : "copyToClipboard"
              }`,
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
    class="fixed row items-center q-mt-sm"
    style="width: 64px; height: 20px"
    :style="`left: ${stages.default?.attrs?.container?.getBoundingClientRect()?.left + stages.default?.width() - 64 - 16}px; top: ${stages.default?.attrs?.container?.getBoundingClientRect()?.top}px;`"
  >
    <q-img
      :src="
        slide?.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
          ? '/prezio.svg'
          : '/prezio--white.svg'
      "
      fit="contain"
    />
  </div>
</template>

<script setup>
import { copyToClipboard } from "quasar";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { SUBDOMAINS } from "src/constants/routes";
import { useStudioStore } from "stores/studio";
import { COLOR_SCHEME_OPTIONS } from "src/constants/canvas/canvasVariables";

/*
 * variables
 */
const isHovered = ref(false);

/*
 * stores
 */
const studioStore = useStudioStore();
const { stages } = storeToRefs(studioStore);

const presentationsStore = usePresentationsStore();
const { slide, showShareDialog, presentation } =
  storeToRefs(presentationsStore);

/*
 * room link
 */
const host = window.location.hostname.replace(SUBDOMAINS.app + ".", "");
const roomLink = computed(() => {
  return `${host}/${presentation.value.room.token}`;
});

/*
 * bar width
 */
const WIDTH_OPTIONS = {
  full: 450,
  shorten: host.includes("testing") ? 220 : 170,
};
const width = computed(() => {
  return stages.value.default?.width() > 600
    ? WIDTH_OPTIONS.full
    : WIDTH_OPTIONS.shorten;
});

/*
 * copying
 */
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
