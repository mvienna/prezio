<template>
  <div class="presentation_toolbar__bottom row no-wrap items-center">
    <q-space />

    <q-btn
      v-if="
        presentation?.slides?.filter((slide) => slide?.answers?.length).length
      "
      outline
      color="primary"
      :label="$t('presentationStudio.toolbar.resetResults.title')"
      icon="r_restart_alt"
      no-caps
      @click="showResetResultsConfirmationDialog = true"
    />

    <q-dialog v-model="showResetResultsConfirmationDialog">
      <ConfirmationDialog
        icon="r_restart_alt"
        icon-color="primary"
        :title="
          $t('presentationStudio.toolbar.resetResults.confirmation.title')
        "
        :message="
          $t('presentationStudio.toolbar.resetResults.confirmation.message')
        "
        confirm-btn-color="red"
        @cancel="showResetResultsConfirmationDialog = false"
        @confirm="
          showResetResultsConfirmationDialog = false;
          handleResettingResults();
        "
      >
        <template #default>
          <q-toggle
            v-model="isResetPresentation"
            :disable="slide?.type === SLIDE_TYPES.CONTENT"
            :label="
              isResetPresentation
                ? $t(
                    'presentationStudio.toolbar.resetResults.options.resetPresentation'
                  )
                : $t(
                    'presentationStudio.toolbar.resetResults.options.resetSlide'
                  )
            "
            color="primary"
            left-label
            class="q-mb-lg full-width justify-between"
          />
        </template>
      </ConfirmationDialog>
    </q-dialog>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";
import { api } from "boot/axios";
import { ref } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { useQuasar } from "quasar";
import { SLIDE_TYPES } from "src/constants/presentationStudio";

/*
 * variables
 */
const $q = useQuasar();

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, slide } = storeToRefs(presentationsStore);

/*
 * reset results
 */
const showResetResultsConfirmationDialog = ref(false);
const isResetPresentation = ref(true);

const handleResettingResults = () => {
  if (isResetPresentation.value) {
    api
      .delete(`/presentation/${presentation.value.id}/results`)
      .then(() => {
        presentation.value.slides = presentation.value.slides.map((item) => {
          item.answers = [];
          return item;
        });

        slide.value.answers = [];
      })
      .catch((error) => {
        console.log(error);

        if (error.response?.data?.message) {
          $q.notify({
            message: error.response.data.message,
            color: "red",
            icon: "r_crisis_alert",
          });
        }
      });
  } else {
    api
      .delete(`/presentation/slide/${slide.value.id}/results`)
      .then(() => {
        slide.value.answers = [];
        presentationsStore.syncCurrentSlideWithPresentationSlides();
      })
      .catch((error) => {
        console.log(error);

        if (error.response?.data?.message) {
          $q.notify({
            message: error.response.data.message,
            color: "red",
            icon: "r_crisis_alert",
          });
        }
      });
  }
};
</script>

<style scoped lang="scss">
.presentation_toolbar__bottom {
  position: absolute;
  z-index: 2;
  bottom: 16px;
  left: 16px;
  font-size: 12px;
  width: calc(100% - 32px);
}
</style>
