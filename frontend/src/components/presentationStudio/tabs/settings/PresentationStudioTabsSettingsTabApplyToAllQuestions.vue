<template>
  <div>
    <q-btn
      unelevated
      color="primary"
      icon-right="r_move_down"
      :label="
        $t(
          'presentationLayout.rightDrawer.tabs.settings.applyToAllQuestions.title'
        )
      "
      no-caps
      class="full-width q-py-sm"
      @click="showApplySettingsToAllQuestionsDialog = true"
    />

    <q-dialog v-model="showApplySettingsToAllQuestionsDialog">
      <ConfirmationDialog
        icon="r_move_down"
        icon-color="primary"
        :title="
          $t(
            'presentationLayout.rightDrawer.tabs.settings.applyToAllQuestions.confirmation.title'
          )
        "
        :message="
          $t(
            'presentationLayout.rightDrawer.tabs.settings.applyToAllQuestions.confirmation.message'
          )
        "
        confirm-btn-color="primary"
        @cancel="showApplySettingsToAllQuestionsDialog = false"
        @confirm="
          applySettingsToAllQuestions();
          showApplySettingsToAllQuestionsDialog = false;
        "
      >
        <template #default>
          <div class="column no-wrap q-pb-lg">
            <!-- limit time -->
            <q-toggle
              v-model="settingsToApplyToAllQuestions.isLimitedTime"
              :label="
                $t(
                  'presentationLayout.rightDrawer.tabs.settings.timeLimit.title'
                )
              "
              color="primary"
              left-label
              class="full-width justify-between"
            />

            <!-- word cloud -->
            <template v-if="slide?.type === SLIDE_TYPES.WORD_CLOUD">
              <!-- multiple entries -->
              <q-toggle
                v-model="settingsToApplyToAllQuestions.isMultipleEntries"
                :label="
                  $t(
                    'presentationLayout.rightDrawer.tabs.settings.multipleEntries.title'
                  )
                "
                color="primary"
                left-label
                class="full-width justify-between"
              />

              <!-- entries per participant -->
              <q-toggle
                v-model="settingsToApplyToAllQuestions.entriesPerParticipant"
                :label="
                  $t(
                    'presentationLayout.rightDrawer.tabs.settings.entriesPerParticipant.title'
                  )
                "
                color="primary"
                left-label
                class="full-width justify-between"
              />

              <!-- lock submissions -->
              <q-toggle
                v-model="
                  settingsToApplyToAllQuestions.isInitialSubmissionLocked
                "
                :label="
                  $t(
                    'presentationLayout.rightDrawer.tabs.settings.lockSubmission.title'
                  )
                "
                color="primary"
                left-label
                class="full-width justify-between"
              />

              <!-- hide results -->
              <q-toggle
                v-model="settingsToApplyToAllQuestions.isResultsHidden"
                :label="
                  $t(
                    'presentationLayout.rightDrawer.tabs.settings.hideResults.title'
                  )
                "
                color="primary"
                left-label
                class="full-width justify-between"
              />
            </template>
          </div>
        </template>
      </ConfirmationDialog>
    </q-dialog>
  </div>
</template>

<script setup>
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";
import { api } from "boot/axios";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { ref } from "vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings, presentation, slide } = storeToRefs(presentationsStore);

/*
 * apply to all questions
 */
const showApplySettingsToAllQuestionsDialog = ref(false);

const settingsToApplyToAllQuestions = ref({
  isLimitedTime: true,

  // word cloud
  isMultipleEntries: true,
  entriesPerParticipant: false,
  isInitialSubmissionLocked: true,
  isResultsHidden: true,
});

const applySettingsToAllQuestions = () => {
  let settingsToUpdate = {};

  if (settingsToApplyToAllQuestions.value.isLimitedTime) {
    settingsToUpdate.isLimitedTime = slideSettings.value.isLimitedTime;
    settingsToUpdate.timeLimit = slideSettings.value.timeLimit;
  }

  if (slide.value?.type === SLIDE_TYPES.WORD_CLOUD) {
    if (settingsToApplyToAllQuestions.value.isMultipleEntries) {
      settingsToUpdate.isMultipleEntries =
        slideSettings.value.isMultipleEntries;
    }

    if (settingsToApplyToAllQuestions.value.entriesPerParticipant) {
      settingsToUpdate.entriesPerParticipant =
        slideSettings.value.entriesPerParticipant;
    }

    if (settingsToApplyToAllQuestions.value.isInitialSubmissionLocked) {
      settingsToUpdate.isInitialSubmissionLocked =
        slideSettings.value.isInitialSubmissionLocked;
    }

    if (settingsToApplyToAllQuestions.value.isResultsHidden) {
      settingsToUpdate.isResultsHidden = slideSettings.value.isResultsHidden;
    }
  }

  let slidesToUpdate = [];
  presentation.value.slides.map((item, index) => {
    if (item.id === slide.value.id) return;

    if (item.type !== SLIDE_TYPES.CONTENT) {
      const settings_data = JSON.stringify({
        ...JSON.parse(item.settings_data),
        ...settingsToUpdate,
      });

      slidesToUpdate.push({
        id: item.id,
        settings_data: settings_data,
      });

      presentation.value.slides[index].settings_data = settings_data;
    }
  });

  api
    .patch(`/presentation/${presentation.value.id}/slides`, {
      slides: slidesToUpdate,
    })
    .then(() => {
      $q.notify({
        message: t(
          "presentationLayout.rightDrawer.tabs.settings.appliedToAllQuestionsSuccessfully"
        ),
        icon: "r_done",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>
