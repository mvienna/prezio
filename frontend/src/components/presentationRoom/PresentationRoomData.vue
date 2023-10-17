<template>
  <div class="room_data">
    <!-- reactions -->
    <div></div>

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
/*
 * props
 */
defineProps({
  participantsCount: { type: Number },
});
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
