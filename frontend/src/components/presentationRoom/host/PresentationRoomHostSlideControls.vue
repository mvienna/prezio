<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <!-- previous slide -->
    <div
      v-if="isHost && isMouseActive"
      style="
        z-index: 1;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
      "
      class="q-ml-lg"
      @mouseover="$emit('hover')"
    >
      <q-btn
        flat
        round
        class="room_controls__btn"
        icon="r_arrow_back"
        no-caps
        no-wrap
        size="1.25em"
        :disable="slideIndex === 0"
        @click="$emit('changeSlide', 'backward')"
      >
        <q-tooltip
          anchor="center right"
          self="center left"
          transition-show="jump-right"
          transition-hide="jump-left"
          :offset="[8, 0]"
        >
          <div class="text-bold text-center">
            {{ $t("presentationStudio.preview.controls.previous") }}
          </div>
        </q-tooltip>
      </q-btn>
    </div>
  </transition>

  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <!-- next slide -->
    <div
      v-if="isHost && isMouseActive"
      style="
        z-index: 1;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
      "
      class="q-mr-lg"
      @mouseover="$emit('hover')"
    >
      <q-btn
        flat
        class="room_controls__btn"
        round
        icon="r_arrow_forward"
        no-caps
        no-wrap
        size="1.25em"
        :disable="slideIndex === presentation?.slides?.length - 1"
        @click="$emit('changeSlide', 'forward')"
      >
        <q-tooltip
          anchor="center left"
          self="center right"
          transition-show="jump-left"
          transition-hide="jump-right"
          :offset="[8, 0]"
        >
          <div class="text-bold text-center">
            {{ $t("presentationStudio.preview.controls.next") }}
          </div>
        </q-tooltip>
      </q-btn>
    </div>
  </transition>
</template>

<script setup>
import { computed } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

/*
 * props
 */
defineProps({
  isMouseActive: { type: Boolean },
});

/*
 * emits
 */
defineEmits(["changeSlide", "hover"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, slide, isHost } = storeToRefs(presentationsStore);

/*
 * slide index
 */
const slideIndex = computed(() => {
  return presentation.value?.slides?.findIndex(
    (item) => item.id === slide.value?.id
  );
});
</script>

<style scoped lang="scss">
.room_controls__btn {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  color: $white;
  border-radius: 50%;
}
</style>
