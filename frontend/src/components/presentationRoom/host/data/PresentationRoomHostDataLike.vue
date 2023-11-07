<template>
  <div class="row no-wrap items-center">
    <div
      style="width: 30px; height: 30px"
      @click="!disabled ? $emit('react') : ''"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :style="
          stage === 1
            ? 'transform: scale(0.75) rotate(-45deg);'
            : stage === 2
            ? 'transform: scale(1.25) rotate(35deg);'
            : 'transform: scale(1)'
        "
      >
        <circle cx="128" cy="128" r="128" fill="url(#paint0_linear_129_5)" />

        <!-- like -->
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M149.25 78.75C149.25 67.5 138.135 60 129.45 60C123.405 60 122.933 64.59 122.003 73.65C121.59 77.625 121.095 82.455 120 88.125C117.105 103.14 107.1 122.325 97.53 128.062V172.5C97.5 189.375 103.125 195 127.5 195H155.798C172.118 195 176.07 184.252 177.54 180.27L177.637 180C178.493 177.705 180.323 175.898 182.423 173.85C184.747 171.555 187.402 168.952 189.375 165C191.708 160.327 191.4 156.173 191.122 152.475C190.95 150.232 190.792 148.162 191.25 146.25C191.73 144.225 192.345 142.688 192.938 141.218C194.01 138.548 195 136.073 195 131.25C195 120 189.39 112.515 177.637 112.515H146.25C146.25 112.515 149.25 90 149.25 78.75ZM71.25 120C68.2663 120 65.4048 121.185 63.295 123.295C61.1853 125.405 60 128.266 60 131.25V183.75C60 186.734 61.1853 189.595 63.295 191.705C65.4048 193.815 68.2663 195 71.25 195C74.2337 195 77.0952 193.815 79.205 191.705C81.3147 189.595 82.5 186.734 82.5 183.75V131.25C82.5 128.266 81.3147 125.405 79.205 123.295C77.0952 121.185 74.2337 120 71.25 120Z"
          fill="white"
          :style="
            stage === 1
              ? 'transform: scale(0.9)'
              : stage === 2
              ? 'transform: scale(1.1);'
              : ''
          "
        />

        <!-- background -->
        <defs>
          <linearGradient
            id="paint0_linear_129_5"
            x1="128"
            y1="0"
            x2="128"
            y2="256"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#17AEFF" />
            <stop offset="1" stop-color="#0264DF" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div class="q-ml-sm"><slot name="value" /></div>
  </div>
</template>

<script setup>
defineProps({
  stage: { type: Number },
  disabled: { type: Boolean },
});

defineEmits(["react"]);
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
