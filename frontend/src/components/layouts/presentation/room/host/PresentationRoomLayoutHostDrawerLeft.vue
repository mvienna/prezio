<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    bordered
    side="left"
    class="bg-white q-px-md q-py-md"
    :width="270"
  >
    <div class="column no-wrap q-gutter-md">
      <div
        v-for="(item, index) in presentation.slides"
        :key="item.id"
        class="row no-wrap"
      >
        <div class="column no-wrap justify-between q-pr-md">
          <!-- index -->
          <div
            class="text-center"
            :class="item.id === slide?.id ? 'text-semibold' : ''"
          >
            {{ index + 1 }}
          </div>
        </div>

        <q-space />

        <!-- preview -->
        <q-card
          flat
          v-ripple
          class="slide slide_handle relative-position cursor-pointer q-hoverable"
          :class="item.id === slide?.id ? 'slide--active' : ''"
          @click="handleSlideChange(item)"
        >
          <!-- saved preview -->
          <q-img :src="item.preview" fit="cover" />

          <!-- slide type -->
          <div v-if="item.type !== SLIDE_TYPES.CONTENT" class="absolute-center">
            <div class="row justify-center">
              <q-img
                :src="`/assets/icons/temp/slideTypes/${item.type}.svg`"
                style="width: 48px; height: 48px; background: transparent"
              />
            </div>

            <div class="text-semibold text-primary">
              {{
                $t(
                  `presentationLayout.rightDrawer.tabs.types.options.${item.type}`
                )
              }}
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { ref } from "vue";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { api } from "boot/axios";
import { useCanvasStore } from "stores/canvas";

/*
 * variables
 */
const leftDrawerOpen = ref(true);

/*
 * stores
 */
const canvasStore = useCanvasStore();

const presentationsStore = usePresentationsStore();
const { presentation, slide, room } = storeToRefs(presentationsStore);

/*
 * handle slides change
 */
const handleSlideChange = async (newSlide) => {
  if (slide.value.id === newSlide.id) return;

  await presentationsStore.setSlide(newSlide);
  await canvasStore.setElementsFromSlide();
  canvasStore.redrawCanvas(false, false, undefined, false);

  presentationsStore.sendPresentationRoomUpdateEvent();
};
</script>

<style scoped lang="scss">
.slide {
  outline: 3px solid transparent;
  transition: 0.2s;
  border: 1.5px solid $grey-2;
  width: 220px;
  height: calc(220px * 9 / 16);
  border-radius: 8px;

  .q-img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: $white;
  }

  &:hover {
    outline: 3px solid $blue-3;
  }

  &:active {
    transform: scale(0.975);
  }

  &.slide--active {
    border: 1.5px solid $primary;
    outline: 3px solid $blue-3;
  }
}

.slide_handle {
  cursor: grab;
}
</style>
