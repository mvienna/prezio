<template>
  <div class="row no-wrap items-center q-gutter-md justify-center q-pt-md">
    <div ref="slider" class="slider">
      <div ref="track" class="track"></div>
    </div>

    <q-input
      v-model.number="degrees"
      :min="0"
      :max="360"
      type="number"
      placeholder="0"
      suffix="deg"
      style="min-width: 100px; width: 100px"
      outlined
      dense
      @update:model-value="setTrackPosition()"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const slider = ref();
const track = ref();

const containerRadius = ref();
const trackRadius = ref();
const effectiveRadius = ref();

const isSliding = ref(false);
const degrees = ref(0);

const emit = defineEmits(["update"]);
watch(
  () => degrees.value,
  () => {
    emit("update", degrees.value);
  },
);

onMounted(() => {
  containerRadius.value = slider.value.offsetWidth / 2;
  trackRadius.value = track.value.offsetWidth / 2;
  effectiveRadius.value = containerRadius.value - trackRadius.value;

  document.addEventListener("mouseup", () => {
    isSliding.value = false;
    document.removeEventListener("mousemove", moveSlider);
  });

  slider.value.addEventListener("mousedown", (e) => {
    isSliding.value = true;
    document.addEventListener("mousemove", moveSlider);
    e.preventDefault();
  });

  setTrackPosition();
});

const moveSlider = (e) => {
  if (isSliding.value) {
    const rect = slider.value.getBoundingClientRect();
    const centerX = rect.left + containerRadius.value;
    const centerY = rect.top + containerRadius.value;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    degrees.value = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    degrees.value = Math.round((degrees.value + 360) % 360);

    setTrackPosition();
  }
};

const setTrackPosition = () => {
  const x = effectiveRadius.value * Math.cos((degrees.value * Math.PI) / 180);
  const y = effectiveRadius.value * Math.sin((degrees.value * Math.PI) / 180);

  track.value.style.left = `${containerRadius.value + x - trackRadius.value}px`;
  track.value.style.top = `${containerRadius.value + y - trackRadius.value}px`;
  track.value.style.transform = `rotate(${degrees.value}deg)`;
};
</script>

<style scoped lang="scss">
.slider {
  position: relative;
  width: 40px;
  height: 40px;
  box-sizing: content-box;
  background: $background;
  border: 1px solid #d6e0f7;
  border-radius: 50%;
}

.track {
  position: absolute;
  height: 20px;
  width: 20px;
  background: $secondary;
  border-radius: 50%;
  cursor: pointer;
}
</style>
