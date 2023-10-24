<template>
  <div class="row no-wrap items-center">
    <div style="width: 30px; height: 30px">
      <svg
        width="30"
        height="30"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :style="
          stage === 0
            ? 'transform: scale(1);'
            : stage === 1
            ? 'transform: scale(1.25);'
            : 'transform: scale(1)'
        "
      >
        <path
          d="M34.1572 32.1599V63.3428C34.1572 63.6342 34.9629 63.8571 35.9744 63.8571C36.9687 63.8571 37.7915 63.6171 37.7915 63.3428V32.1599H34.1572Z"
          fill="#939FA1"
        />
        <path
          d="M35.9745 39.5486C44.4102 39.5486 51.2488 32.71 51.2488 24.2743C51.2488 15.8385 44.4102 9 35.9745 9C27.5387 9 20.7002 15.8385 20.7002 24.2743C20.7002 32.71 27.5387 39.5486 35.9745 39.5486Z"
          fill="url(#paint0_radial_147_2)"
        />
        <path
          d="M35.9745 39.5486C44.4102 39.5486 51.2488 32.71 51.2488 24.2743C51.2488 15.8385 44.4102 9 35.9745 9C27.5387 9 20.7002 15.8385 20.7002 24.2743C20.7002 32.71 27.5387 39.5486 35.9745 39.5486Z"
          fill="url(#paint1_radial_147_2)"
        />
        <path
          opacity="0.24"
          d="M38.8888 12.7886C40.466 15.2057 38.546 19.2514 34.6031 21.84C30.6602 24.4286 26.186 24.5486 24.6088 22.1486C23.0317 19.7486 24.9517 15.6857 28.8945 13.0972C32.8374 10.5086 37.3117 10.3714 38.8888 12.7886Z"
          fill="url(#paint2_radial_147_2)"
        />
        <defs>
          <radialGradient
            id="paint0_radial_147_2"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(34.2987 23.9307) scale(16.6978 16.6978)"
          >
            <stop stop-color="#FC5B54" />
            <stop offset="0.2984" stop-color="#FC554E" />
            <stop offset="0.7134" stop-color="#FA433F" />
            <stop offset="1" stop-color="#F93230" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_147_2"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(36.0634 18.1031) scale(23.8883 23.8883)"
          >
            <stop stop-color="#FF3838" stop-opacity="0" />
            <stop offset="0.2302" stop-color="#F93232" stop-opacity="0.1727" />
            <stop offset="0.5512" stop-color="#E62121" stop-opacity="0.4134" />
            <stop offset="0.9239" stop-color="#C90606" stop-opacity="0.6929" />
            <stop offset="1" stop-color="#C20000" stop-opacity="0.75" />
          </radialGradient>
          <radialGradient
            id="paint2_radial_147_2"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(31.6904 17.4716) rotate(-32.7373) scale(8.43608 4.77994)"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>

    <div><slot name="value" /></div>
  </div>
</template>

<script setup>
defineProps({
  stage: { type: Number },
});
</script>

<style scoped lang="scss">
path,
g {
  transition: 0.5s;
}

svg {
  cursor: pointer;
  transition: 0.5s;
}
</style>
