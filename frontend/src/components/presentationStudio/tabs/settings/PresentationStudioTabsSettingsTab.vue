<template>
  <div>
    <!-- question title, description -->
    <PresentationStudioTabsSettingsTabHeader
      @update-slide-settings="handleSlideSettingsUpdate()"
    />

    <!-- ANSWER OPTIONS (quiz) -->
    <PresentationStudioTabsSettingsTabOptionsQuizPickAnswerOptions
      v-if="
        [SLIDE_TYPES.PICK_ANSWER, SLIDE_TYPES.PICK_IMAGE].includes(slide?.type)
      "
      @update-slide-settings="handleSlideSettingsUpdate()"
    />

    <PresentationStudioTabsSettingsTabOptionsQuizTypeAnswerOptions
      v-else-if="slide?.type === SLIDE_TYPES.TYPE_ANSWER"
      @update-slide-settings="handleSlideSettingsUpdate()"
    />

    <!-- SCORING (quiz) -->
    <template v-if="SLIDE_TYPES_OF_QUIZ.includes(slide?.type)">
      <div class="q-mt-lg q-mb-sm text-semibold">
        {{ $t("presentationLayout.rightDrawer.tabs.settings.groups.scoring") }}
      </div>

      <PresentationStudioTabsSettingsTabOptionsQuizScoring
        @update-slide-settings="handleSlideSettingsUpdate()"
      />
    </template>

    <!-- SUBMISSION SETTINGS -->
    <template v-if="![SLIDE_TYPES.LEADERBOARD].includes(slide?.type)">
      <div class="q-mt-lg q-mb-sm text-semibold">
        {{
          $t("presentationLayout.rightDrawer.tabs.settings.groups.submission")
        }}
      </div>

      <div class="column no-wrap q-gutter-sm">
        <template v-if="slide?.type === SLIDE_TYPES.WORD_CLOUD">
          <!-- entries per participant -->
          <PresentationStudioTabsSettingsTabOptionsEntriesPerParticipant
            @update-slide-settings="handleSlideSettingsUpdate()"
          />

          <!-- multiple entries -->
          <PresentationStudioTabsSettingsTabOptionsMultipleEntries
            @update-slide-settings="handleSlideSettingsUpdate()"
          />

          <!-- lock submission -->
          <PresentationStudioTabsSettingsTabOptionsLockSubmission
            @update-slide-settings="handleSlideSettingsUpdate()"
          />

          <!-- hide results -->
          <PresentationStudioTabsSettingsTabOptionsHideResults
            @update-slide-settings="handleSlideSettingsUpdate()"
          />

          <!-- filter profanity -->
          <PresentationStudioTabsSettingsTabOptionsOther
            @update-slide-settings="handleSlideSettingsUpdate()"
          />
        </template>

        <!-- time limit -->
        <PresentationStudioTabsSettingsTabOptionsTimeLimit
          @update-slide-settings="handleSlideSettingsUpdate()"
        />
      </div>
    </template>

    <div v-if="SLIDE_TYPES_OF_QUIZ.includes(slide?.type)">
      <div class="q-mt-lg q-mb-md text-semibold">
        {{ $t("presentationLayout.rightDrawer.tabs.settings.groups.other") }}
      </div>

      <!-- leaderboard -->
      <PresentationStudioTabsSettingsTabOptionsLeaderboard class="q-mb-md" />

      <!-- open general quiz settings -->
      <PresentationStudioTabsSettingsTabOpenGeneralQuizSettings />
    </div>

    <!-- apply to all questions -->
    <PresentationStudioTabsSettingsTabApplyToAllQuestions
      v-if="![SLIDE_TYPES.LEADERBOARD].includes(slide?.type)"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onBeforeMount, watch } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { useI18n } from "vue-i18n";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import { useQuasar } from "quasar";
import PresentationStudioTabsSettingsTabHeader from "components/presentationStudio/tabs/settings/PresentationStudioTabsSettingsTabHeader.vue";
import PresentationStudioTabsSettingsTabApplyToAllQuestions from "components/presentationStudio/tabs/settings/PresentationStudioTabsSettingsTabApplyToAllQuestions.vue";
import PresentationStudioTabsSettingsTabOptionsEntriesPerParticipant from "components/presentationStudio/tabs/settings/options/PresentationStudioTabsSettingsTabOptionsEntriesPerParticipant.vue";
import PresentationStudioTabsSettingsTabOptionsMultipleEntries from "components/presentationStudio/tabs/settings/options/PresentationStudioTabsSettingsTabOptionsMultipleEntries.vue";
import PresentationStudioTabsSettingsTabOptionsQuizPickAnswerOptions from "components/presentationStudio/tabs/settings/options/quiz/PresentationStudioTabsSettingsTabOptionsQuizPickAnswerOptions.vue";
import PresentationStudioTabsSettingsTabOptionsTimeLimit from "components/presentationStudio/tabs/settings/options/PresentationStudioTabsSettingsTabOptionsTimeLimit.vue";
import PresentationStudioTabsSettingsTabOptionsLeaderboard from "components/presentationStudio/tabs/settings/options/PresentationStudioTabsSettingsTabOptionsLeaderboard.vue";
import PresentationStudioTabsSettingsTabOptionsLockSubmission from "components/presentationStudio/tabs/settings/options/PresentationStudioTabsSettingsTabOptionsLockSubmission.vue";
import PresentationStudioTabsSettingsTabOptionsHideResults from "components/presentationStudio/tabs/settings/options/PresentationStudioTabsSettingsTabOptionsHideResults.vue";
import PresentationStudioTabsSettingsTabOptionsOther from "components/presentationStudio/tabs/settings/options/PresentationStudioTabsSettingsTabOptionsOther.vue";
import PresentationStudioTabsSettingsTabOpenGeneralQuizSettings from "components/presentationStudio/tabs/settings/PresentationStudioTabsSettingsTabOpenGeneralQuizSettings.vue";
import PresentationStudioTabsSettingsTabOptionsQuizScoring from "components/presentationStudio/tabs/settings/options/quiz/PresentationStudioTabsSettingsTabOptionsQuizScoring.vue";
import PresentationStudioTabsSettingsTabOptionsQuizTypeAnswerOptions from "components/presentationStudio/tabs/settings/options/quiz/PresentationStudioTabsSettingsTabOptionsQuizTypeAnswerOptions.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });
const $q = useQuasar();

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, slide, slideSettings } = storeToRefs(presentationsStore);

/*
 * slide settings
 */
const slideSettingsDefault = {
  description: "",

  isLimitedTime: true,
  timeLimit: SLIDE_TYPES_OF_QUIZ.includes(slide.value?.type) ? 25 : 40,

  // word cloud
  isMultipleEntries: false,
  entriesPerParticipant: 3,
  isInitialSubmissionLocked: false,
  isResultsHidden: false,

  // quiz - pick answer
  answerOptions: [
    { value: "", isCorrect: false, isSelected: false },
    { value: "", isCorrect: false, isSelected: false },
  ],

  // quiz - type answer
  correctAnswer: { value: "" },
  otherAcceptedAnswers: [],

  // quiz - scoring
  points: {
    min: 0,
    max: 100,
  },
  scoreDependsOnTime: true,
  partialScoring: false,
  filterProfanity: true,
};

const checkSlideSettings = () => {
  if (!slideSettings.value) {
    slideSettings.value = slideSettingsDefault;
  }

  for (const prop in slideSettingsDefault) {
    if (!slideSettings.value.hasOwnProperty(prop)) {
      slideSettings.value[prop] = slideSettingsDefault[prop];
    }
  }
};

onBeforeMount(() => {
  checkSlideSettings();
  handleSlideSettingsUpdate();
});

watch(
  () => slide.value,
  () => {
    checkSlideSettings();
  },
);

/*
 * update slide settings
 */
const handleSlideSettingsUpdate = () => {
  if (Number(slideSettings.value.timeLimit) > 1800) {
    slideSettings.value.timeLimit = 1800;
  }

  presentationsStore.syncCurrentSlideWithPresentationSlides();
};
</script>
