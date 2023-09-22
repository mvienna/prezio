<template>
  <div>
    <!-- description -->
    <div class="text-caption text-grey q-mb-xs">
      {{ $t("presentation.settings.generalInformation.description.title") }}
    </div>

    <q-input
      v-model="description"
      :placeholder="
        $t('presentation.settings.generalInformation.description.placeholder')
      "
      outlined
      autogrow
    >
      <template #append>
        <q-btn
          round
          unelevated
          size="10px"
          icon="r_save"
          color="primary"
          :disable="description === presentation.description"
          @click="
            () => {
              presentation.description = description;
              presentationsStore.updatePresentation();
            }
          "
        />
      </template>
    </q-input>

    <!-- preview -->
    <div class="text-caption text-grey q-mb-xs q-mt-md">
      {{ $t("presentation.settings.generalInformation.preview.title") }}
    </div>

    <q-img
      :src="
        presentation?.preview?.original_url || presentation.slides[0].preview
      "
      class="presentation_preview relative-position"
    />

    <div class="row no-wrap q-pt-md">
      <!-- open preview selection -->
      <q-btn
        :label="$t('presentation.settings.generalInformation.preview.select')"
        icon-right="r_upload"
        unelevated
        text-color="primary"
        no-caps
        class="q-py-sm full-width presentation_preview__upload_btn"
        @click="showSelectPreviewDialog = true"
      />

      <!-- delete preview -->
      <q-btn
        v-if="presentation.preview"
        icon="r_delete"
        flat
        round
        color="red"
        class="q-py-sm q-ml-md"
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
        @close="showSelectPreviewDialog = false"
        @select="
          presentation.preview = $event;
          presentation.preview_id = $event.id;
          presentationsStore.updatePresentation();
          showSelectPreviewDialog = false;
        "
      />
    </q-dialog>
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
 * description
 */
const description = ref(presentation.value.description);

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
