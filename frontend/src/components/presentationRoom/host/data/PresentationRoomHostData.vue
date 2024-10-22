<template>
  <div
    class="room_data text-14 row no-wrap"
    :class="`${
      isHost ? 'room_data__host' : 'room_data__participant q-mt-md'
    } text-${isHost ? 'white' : textColor}`"
  >
    <!-- reactions -->
    <div class="row no-wrap q-gutter-md">
      <!-- like -->
      <PresentationRoomDataLike
        v-if="!isHost || (isHost && room?.reactions?.like > 0)"
        :stage="stage.like"
        :value="room?.reactions?.like || 0"
        :disabled="isHost"
        @react="
          presentationsStore.sendPresentationRoomReaction('like');
          animate('like');
        "
      />

      <!-- love -->
      <PresentationRoomDataLove
        v-if="!isHost || (isHost && room?.reactions?.love > 0)"
        :stage="stage.love"
        :disabled="isHost"
        :value="room?.reactions?.love || 0"
        @react="
          presentationsStore.sendPresentationRoomReaction('love');
          animate('love');
        "
      />
    </div>

    <!-- answers count -->
    <PresentationRoomDataSubmissions
      v-if="
        [...SLIDE_TYPES_OF_QUIZ, SLIDE_TYPES.WORD_CLOUD].includes(
          slide?.type,
        ) && isHost
      "
      :stage="stage.pin"
      :answers-count="slide?.answers?.length || 0"
      :value="slide?.answers?.length"
      class="q-ml-md"
    />

    <!-- participants count -->
    <div
      v-if="isHost"
      class="room_data__participants_count row no-wrap items-center q-ml-md"
    >
      <div class="relative-position q-mr-xs">
        <q-icon name="r_person" color="grey" size="24px" />
        <div
          class="room_data__participants_count__status absolute-bottom-right"
          :class="participants?.length || 0 ? 'bg-green' : 'bg-white'"
        ></div>
      </div>

      <div>
        <span>{{ participants?.length || 0 }}</span>
        <span class="room_data__participants_count__limit">/∞</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import PresentationRoomDataLike from "components/presentationRoom/host/data/PresentationRoomHostDataLike.vue";
import PresentationRoomDataLove from "components/presentationRoom/host/data/PresentationRoomHostDataLove.vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import PresentationRoomDataSubmissions from "components/presentationRoom/host/data/PresentationRoomHostDataSubmissions.vue";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import { COLOR_SCHEME_OPTIONS } from "src/constants/canvas/canvasVariables";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, slide, isHost, participants } = storeToRefs(presentationsStore);

/*
 * text color
 */
const textColor = computed(() => {
  return !isHost.value && slide?.type !== SLIDE_TYPES.CONTENT
    ? slide.value?.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
      ? "black"
      : "white"
    : "white";
});

/*
 * animation
 */
const stage = ref({
  like: -1,
  love: -1,
  pin: -1,
});
const timeouts = ref({
  like: [],
  love: [],
  pin: [],
});

const animate = (key) => {
  timeouts.value[key].map((timeout) => {
    clearTimeout(timeout);
  });
  stage.value[key] = 0;

  timeouts.value[key][0] = setTimeout(() => {
    stage.value[key] = 1;

    timeouts.value[key][1] = setTimeout(() => {
      stage.value[key] = 2;

      timeouts.value[key][2] = setTimeout(() => {
        stage.value[key] = -1;
      }, 500);
    }, 250);
  }, 250);
};

watch(
  () => room.value?.reactions?.like,
  () => {
    animate("like");
  },
);

watch(
  () => room.value?.reactions?.love,
  () => {
    animate("love");
  },
);

watch(
  () => slide.value?.answers?.length,
  () => {
    animate("pin");
  },
);
</script>

<style scoped lang="scss">
.room_data {
  color: $white;
  border-radius: 24px;
  padding: 16px;
  z-index: 2;
  height: 62px;
  transition: 0.2s;

  &.room_data__host {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    position: absolute;
    right: calc(24px);
    bottom: 24px;
    transition: 0.2s;
  }

  &.room_data__participant {
    justify-content: center;
  }

  .room_data__participants_count {
    .room_data__participants_count__status {
      border-radius: 100%;
      width: 8px;
      height: 8px;
      margin-bottom: 1px;
      margin-right: 1px;
    }

    .room_data__participants_count__limit {
      opacity: 0.7;
    }
  }
}

@media screen and (max-width: 1023px) {
  .room_data {
    height: 50px;

    &.room_data__host {
      right: 8px;
      bottom: 8px;
    }
  }
}
</style>
