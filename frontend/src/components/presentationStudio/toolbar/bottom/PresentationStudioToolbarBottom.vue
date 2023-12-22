<template>
  <div class="presentation_toolbar__bottom row no-wrap items-center">
    <q-input
      v-model="note"
      type="textarea"
      borderless
      disable
      placeholder="Внесите свои заметки к слайду"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const note = ref();
</script>

<style scoped lang="scss">
.presentation_toolbar__bottom {
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 0;
  font-size: 12px;
  width: 100%;
  background: $white;
  border-top: 1px solid $grey-secondary;

  ::v-deep(.q-textarea) {
    min-height: auto;
    width: 100%;

    textarea {
      padding: 16px 24px 0 24px !important;
      min-height: 0 !important;
      height: 60px !important;
    }
  }

  ::v-deep(.q-field__control-container) {
    padding: 0 !important;
  }
}
</style>
