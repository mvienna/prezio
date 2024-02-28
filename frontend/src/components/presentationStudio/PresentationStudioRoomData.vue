<template>
  <div class="row justify-end q-pr-sm">
    <div
      class="room_data row no-wrap items-center justify-center"
      :class="`text-${
        slide?.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT ? 'black' : 'white'
      }`"
    >
      <!-- reactions -->
      <div class="row no-wrap q-gutter-md">
        <!-- like -->
        <PresentationRoomDataLike
          v-if="presentation?.room?.reactions?.like > 0"
          :stage="stage.like"
          :value="presentation?.room?.reactions?.like || 0"
          size="24"
        />

        <!-- love -->
        <PresentationRoomDataLove
          v-if="presentation?.room?.reactions?.love > 0"
          :stage="stage.love"
          :value="presentation?.room?.reactions?.love || 0"
          size="24"
        />
      </div>

      <!-- answers count -->
      <PresentationRoomDataSubmissions
        v-if="
          [...SLIDE_TYPES_OF_QUIZ, SLIDE_TYPES.WORD_CLOUD].includes(slide?.type)
        "
        :stage="stage.pin"
        :answers-count="slide?.answers?.length || 0"
        :value="slide?.answers?.length"
        size="24"
        class="q-ml-md"
      />

      <!-- participants count -->
      <div
        class="room_data__participants_count row no-wrap items-center q-ml-md"
      >
        <div class="relative-position q-mr-xs">
          <q-icon name="r_person" color="grey" size="24px" />
          <div
            v-if="participants?.length || 0"
            class="room_data__participants_count__status absolute-bottom-right bg-green"
          ></div>
        </div>

        <div>
          <span>{{ participants?.length || 0 }}</span>
          <span class="room_data__participants_count__limit">/∞</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
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
const { slide, presentation, participants } = storeToRefs(presentationsStore);

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
  () => presentation.value?.room?.reactions?.like,
  () => {
    animate("like");
  },
);

watch(
  () => presentation.value?.room?.reactions?.love,
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
  z-index: 2;
  height: 24px;
  margin-top: calc(-24px - 24px);
  margin-right: 24px;
  transition: 0.2s;

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
</style>
