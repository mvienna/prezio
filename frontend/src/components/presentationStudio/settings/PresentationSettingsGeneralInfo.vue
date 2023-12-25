<template>
  <div>
    <!-- description -->
    <div class="text-caption text-grey q-mb-xs">
      {{
        $t("presentationStudio.settings.generalInformation.description.title")
      }}
    </div>

    <q-input
      v-model="presentation.description"
      :placeholder="
        $t(
          'presentationStudio.settings.generalInformation.description.placeholder'
        )
      "
      outlined
      autogrow
      debounce="1000"
      @update:model-value="presentationsStore.updatePresentation()"
    />

    <!-- preview -->
    <div class="text-caption text-grey q-mb-xs q-mt-md">
      {{ $t("presentationStudio.settings.generalInformation.preview.title") }}
    </div>

    <q-img
      :src="
        presentation?.preview?.preview_url ||
        presentation?.preview?.original_url ||
        presentation.slides[0].preview
      "
      class="presentation_preview relative-position"
    />

    <div class="row no-wrap q-pt-md q-mb-md">
      <!-- open preview selection -->
      <q-btn
        :label="
          $t('presentationStudio.settings.generalInformation.preview.select')
        "
        icon="icon-image_add"
        unelevated
        color="primary"
        no-caps
        class="full-width presentation_preview__upload_btn"
        @click="showSelectPreviewDialog = true"
      />

      <!-- delete preview -->
      <q-btn
        v-if="presentation.preview"
        icon="r_delete_sweep"
        outline
        size="12px"
        color="red"
        class="q-ml-md"
        style="width: 36px"
        @click="
          presentation.preview = null;
          presentation.preview_id = null;
          presentationsStore.updatePresentation();
        "
      />
    </div>

    <!-- select preview -->
    <q-dialog v-model="showSelectPreviewDialog">
      <SelectMedia
        @cancel="showSelectPreviewDialog = false"
        @select="
          presentation.preview = $event;
          presentation.preview_id = $event.id;
          presentationsStore.updatePresentation();
          showSelectPreviewDialog = false;
        "
      />
    </q-dialog>

    <q-separator class="q-mt-lg q-mb-md" />
  </div>
</template>

<script setup>
import SelectMedia from "components/media/SelectMedia.vue";
import { ref } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation } = storeToRefs(presentationsStore);

/*
 * preview
 */
const showSelectPreviewDialog = ref(false);
</script>

<style scoped lang="scss">
/*
 * description
 */
::v-deep(.q-textarea .q-field__native) {
  padding-top: 8px;
}

/*
 * preview
 */
.presentation_preview {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  border: 1.5px solid $grey-2;
}

.presentation_preview__upload_btn {
  border: 1.5px dashed $primary;
}
</style>
