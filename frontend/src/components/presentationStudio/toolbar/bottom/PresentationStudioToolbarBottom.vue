<template>
  <div class="presentation_toolbar__bottom text-12 row no-wrap items-center">
    <q-input
      v-model="note"
      type="textarea"
      borderless
      disable
      placeholder="Внесите свои заметки к слайду"
    />

    <div class="text-caption text-grey absolute-bottom-right q-mr-sm q-mb-sm">
      Заметки будут показаны в режиме
      <span class="text-primary link"
        >бекстейджа
        <q-icon name="r_open_in_new" />
      </span>
    </div>
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
  width: 100%;
  background: $white;
  border-top: 1px solid $grey-2;

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
