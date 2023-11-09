<template>
  <div>
    <!-- warning -->
    <q-banner class="bg-blue-1 q-mb-md">
      <div class="row no-wrap items-center text-primary">
        <q-icon name="o_info" size="24px" />
        <div class="text-caption q-ml-md text-semibold">
          {{ $t("presentationStudio.settings.quiz.info.title") }}
        </div>
      </div>
    </q-banner>

    <!-- dismiss warning -->
    <div class="row no-wrap items-center q-pl-md text-semibold">
      <q-icon
        name="r_notification_important"
        class="q-mr-md"
        color="primary"
        size="24px"
      />

      <div>
        {{ $t("presentationStudio.settings.quiz.warning.dismiss") }}
      </div>

      <q-space />

      <q-toggle
        v-model="presentation.settings.quiz_warning_dismissed"
        color="primary"
        @update:model-value="presentationsStore.updatePresentation()"
      />
    </div>

    <q-separator class="q-my-md" />

    <!-- live chat -->
    <div class="row no-wrap items-center q-pl-md text-semibold">
      <q-icon name="r_forum" class="q-mr-md" color="primary" size="24px" />

      <div>
        {{ $t("presentationStudio.settings.quiz.options.liveChat") }}
      </div>

      <q-space />

      <q-toggle v-model="quizSettings.liveChat" color="primary" />
    </div>

    <!-- lobby music -->
    <div class="row no-wrap items-center q-pl-md text-semibold">
      <q-icon
        name="r_music_note"
        class="q-mr-md"
        color="primary"
        size="24px"
        style="opacity: 0.5"
      />

      <div style="opacity: 0.5">
        {{ $t("presentationStudio.settings.quiz.options.lobbyMusic") }}
      </div>

      <q-space />

      <q-toggle v-model="quizSettings.lobbyMusic" color="primary" disable />
    </div>

    <!-- countdown -->
    <div class="row no-wrap items-center q-pl-md text-semibold">
      <q-icon name="r_av_timer" class="q-mr-md" color="primary" size="24px" />

      <div>
        {{ $t("presentationStudio.settings.quiz.options.countdown") }}
      </div>

      <q-space />

      <q-toggle v-model="quizSettings.countdown" color="primary" />
    </div>

    <!-- play as team -->
    <div class="row no-wrap items-center q-pl-md text-semibold">
      <q-icon
        name="r_diversity_1"
        class="q-mr-md"
        color="primary"
        size="24px"
        style="opacity: 0.5"
      />

      <div style="opacity: 0.5">
        {{ $t("presentationStudio.settings.quiz.options.playAsTeam") }}
      </div>

      <q-space />

      <q-toggle v-model="quizSettings.playAsTeam" color="primary" disable />
    </div>

    <!-- shuffle answer options -->
    <div class="row no-wrap items-center q-pl-md text-semibold">
      <q-icon name="r_shuffle" class="q-mr-md" color="primary" size="24px" />

      <div>
        {{
          $t("presentationStudio.settings.quiz.options.shuffleAnswerOptions")
        }}
      </div>

      <q-space />

      <q-toggle v-model="quizSettings.shuffleAnswerOptions" color="primary" />
    </div>
  </div>
</template>

<script setup>
/*
 * stores
 */
import { onBeforeMount, ref, watch } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

const presentationsStore = usePresentationsStore();
const { presentation } = storeToRefs(presentationsStore);

/*
 * quiz settings
 */
const defaultQuizSettings = {
  liveChat: true,
  lobbyMusic: false,
  countdown: true,
  playAsTeam: false,
  shuffleAnswerOptions: false,
};

const quizSettings = ref(
  presentation.value?.settings?.quiz_data
    ? JSON.parse(presentation.value?.settings?.quiz_data)
    : defaultQuizSettings
);

const checkPresentationQuizSettings = () => {
  for (const prop in defaultQuizSettings) {
    if (!quizSettings.value.hasOwnProperty(prop)) {
      quizSettings.value[prop] = defaultQuizSettings[prop];
    }
  }
};

onBeforeMount(() => {
  checkPresentationQuizSettings();

  presentation.value.settings.quiz_warning_dismissed = Boolean(
    presentation.value.settings.quiz_warning_dismissed
  );
});

// TODO quiz settings for presentation on create
watch(
  () => quizSettings.value,
  () => {
    presentation.value.settings.quiz_data = JSON.stringify(quizSettings.value);
    presentationsStore.updatePresentation();
  },
  { deep: true }
);
</script>
