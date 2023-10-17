<template>
  <div class="room_data row no-wrap">
    <!-- reactions -->
    <div class="row no-wrap q-gutter-md q-mr-md">
      <!-- like -->
      <PresentationRoomDataLike
        :stage="stage.like"
        :value="room?.reactions?.like || 0"
        @react="
          presentationsStore.sendPresentationRoomReaction('like');
          animate('like');
        "
      />

      <!-- love -->
      <PresentationRoomDataLove
        :stage="stage.love"
        :value="room?.reactions?.love || 0"
        @react="
          presentationsStore.sendPresentationRoomReaction('love');
          animate('love');
        "
      />
    </div>

    <!-- participants count -->
    <div class="room_data__participants_count row no-wrap items-center">
      <div class="relative-position q-mr-xs">
        <q-icon name="r_person" color="grey" size="24px" />
        <div
          class="room_data__participants_count__status absolute-bottom-right"
          :class="participantsCount ? 'bg-green' : 'bg-white'"
        ></div>
      </div>

      <div>
        <span>{{ participantsCount }}</span>
        <span class="room_data__participants_count__limit">/200</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PresentationRoomDataLike from "components/presentationRoom/data/PresentationRoomDataLike.vue";
import PresentationRoomDataLove from "components/presentationRoom/data/PresentationRoomDataLove.vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

/*
 * props
 */
defineProps({
  participantsCount: { type: Number },
});

/*
 * animation
 */
const stage = ref({
  like: -1,
  love: -1,
});
const timeouts = ref({
  like: [],
  love: [],
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

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room } = storeToRefs(presentationsStore);
</script>

<style scoped lang="scss">
.room_data {
  position: absolute;
  right: 24px;
  bottom: 24px;
  background: rgba(0, 0, 0, 0.7);
  color: $white;
  backdrop-filter: blur(4px);
  border-radius: 24px;
  padding: 16px;
  z-index: 2;

  .room_data__participants_count {
    font-size: 18px;

    .room_data__participants_count__status {
      border-radius: 100%;
      width: 8px;
      height: 8px;
      margin-bottom: 1px;
      margin-right: 1px;
    }

    .room_data__participants_count__limit {
      font-size: 12px;
      opacity: 0.7;
    }
  }
}
</style>
