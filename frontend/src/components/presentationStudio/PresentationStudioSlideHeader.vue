<template>
  <div
    style="
      height: 40px;
      position: fixed;
      border-radius: 8px 8px 0 0;
      z-index: 2;
    "
    :style="`width: ${stages.default?.width()}px; left: ${
      stages.default?.attrs?.container?.getBoundingClientRect()?.left
    }px; top: ${
      stages.default?.attrs?.container?.getBoundingClientRect()?.top
    }px;`"
    :class="`text-${
      slide?.color_scheme === COLOR_SCHEME_OPTIONS.light ? 'black' : 'white'
    }`"
    class="row no-wrap items-center justify-center q-px-sm text-black"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <transition
      appear
      enter-active-class="animated flipInX"
      leave-active-class="animated flipOutX"
    >
      <div
        v-if="
          presentation?.settings?.show_joining_instructions_bar || isHovered
        "
        class="row no-wrap items-center justify-center ellipsis q-px-sm presentation_studio_slide_header__banner text-14"
        style="max-width: 70%"
        :style="
          presentation?.settings?.show_joining_instructions_bar || isHovered
            ? slide?.color_scheme === COLOR_SCHEME_OPTIONS.light
              ? 'background: rgba(0, 0, 0, 0.1); color: black;'
              : 'background: rgba(255, 255, 255, 0.1); color: white;'
            : 'background: transparent'
        "
      >
        <!-- link -->
        <div class="ellipsis cursor-pointer" @click="copyRoomLinkToClipboard()">
          <span v-if="!$q.screen.lt.sm" class="q-mr-xs" style="opacity: 0.5">
            {{ $t("presentationRoom.header.roomLink.title") }}
          </span>

          <span class="text-semibold">
            {{ host }}/<b class="text-uppercase">
              {{ presentation.room.token }}
            </b>
          </span>

          <q-tooltip :offset="[0, 8]">
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
        <q-icon
          name="r_edit"
          class="q-ml-sm cursor-pointer q-pa-xs"
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
          slide?.color_scheme === COLOR_SCHEME_OPTIONS.light
            ? '/prezio.svg'
            : '/prezio--white.svg'
        "
        fit="contain"
      />
    </div>
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
.presentation_studio_slide_header__banner {
  border-radius: 12px;
  height: 24px;
}
</style>
