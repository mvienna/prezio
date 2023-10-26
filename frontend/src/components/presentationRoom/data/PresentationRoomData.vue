<template>
  <div
    class="room_data row no-wrap"
    :class="`${
      isHost ? 'room_data__host' : 'room_data__participant q-mt-md'
    } text-${textColor}`"
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
      >
        <template #value>
          {{ room?.reactions?.like || 0 }}
        </template>
      </PresentationRoomDataLike>

      <!-- love -->
      <PresentationRoomDataLove
        v-if="!isHost || (isHost && room?.reactions?.love > 0)"
        :stage="stage.love"
        :disabled="isHost"
        @react="
          presentationsStore.sendPresentationRoomReaction('love');
          animate('love');
        "
      >
        <template #value>
          {{ room?.reactions?.love || 0 }}
        </template>
      </PresentationRoomDataLove>
    </div>

    <!-- answers count -->
    <PresentationRoomDataSubmissions
      v-if="isHost && slide?.type !== SLIDE_TYPES.CONTENT"
      :stage="stage.pin"
      :answers-count="slide?.answers?.length || 0"
      class="q-ml-md"
    >
      <template #value>
        {{ slide?.answers?.length }}
      </template>
    </PresentationRoomDataSubmissions>

    <!-- participants count -->
    <div
      v-if="isHost"
      class="room_data__participants_count row no-wrap items-center q-ml-md"
    >
      <div class="relative-position q-mr-xs">
        <q-icon name="r_person" color="grey" size="24px" />
        <div
          class="room_data__participants_count__status absolute-bottom-right"
          :class="participantsCount ? 'bg-green' : 'bg-white'"
        ></div>
      </div>

      <div>
        <span>{{ participantsCount }}</span>
        <span class="room_data__participants_count__limit">/∞</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import PresentationRoomDataLike from "components/presentationRoom/data/PresentationRoomDataLike.vue";
import PresentationRoomDataLove from "components/presentationRoom/data/PresentationRoomDataLove.vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import PresentationRoomDataSubmissions from "components/presentationRoom/data/PresentationRoomDataSubmissions.vue";
import { SLIDE_TYPES } from "src/constants/presentationStudio";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, slide } = storeToRefs(presentationsStore);

/*
 * props
 */
defineProps({
  participantsCount: { type: Number },
  isHost: { type: Boolean },
  textColor: { type: String, default: "white" },
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
  }
);

watch(
  () => room.value?.reactions?.love,
  () => {
    animate("love");
  }
);

watch(
  () => slide.value?.answers?.length,
  () => {
    animate("pin");
  }
);
</script>

<style scoped lang="scss">
.room_data {
  color: $white;
  border-radius: 24px;
  padding: 16px;
  z-index: 2;
  font-size: 1em;
  transition: 0.2s;

  &.room_data__host {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    position: absolute;
    right: 24px;
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
      font-size: 0.85em;
      opacity: 0.7;
    }
  }
}

@media screen and (max-width: 960px) {
  .room_data {
    height: 50px;
    font-size: 0.8em;

    &.room_data__host {
      right: 8px;
      bottom: 8px;
    }
  }
}
</style>
