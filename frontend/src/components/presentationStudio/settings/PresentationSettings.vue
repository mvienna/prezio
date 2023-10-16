<template>
  <q-card flat class="scroll--hidden" style="height: 100%; width: 400px">
    <q-toolbar
      class="items-center justify-between bg-white q-py-md q-px-lg"
      style="position: sticky; top: 0; z-index: 1"
    >
      <div class="text-h7 text-semibold">
        {{ $t("presentationStudio.settings.title") }}
      </div>

      <q-btn
        icon="r_close"
        size="12px"
        round
        flat
        color="grey"
        @click="$emit('cancel')"
      />
    </q-toolbar>

    <q-card-section class="q-pt-none">
      <div class="column no-wrap q-gutter-sm">
        <q-expansion-item
          v-for="(tab, tabIndex) in Object.values(tabs)"
          :key="tab.name"
          v-model="isExpandedTabs[tabIndex]"
          :icon="tab.icon"
          :disable="tab.disable"
          :label="tab.label"
          expand-icon="r_keyboard_arrow_down"
          :class="isExpandedTabs[tabIndex] ? 'q-expansion-item--active' : ''"
        >
          <div class="q-mt-lg">
            <!-- general info -->
            <PresentationSettingsGeneralInfo
              v-if="tab.name === tabs.generalInformation.name"
            />

            <!-- collect participants info -->
            <PresentationSettingsCollectParticipantsInfo
              v-if="tab.name === tabs.collectParticipantsInfo.name"
            />

            <!-- language -->
            <PresentationSettingsLanguage
              v-if="tab.name === tabs.language.name"
            />
          </div>
        </q-expansion-item>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import PresentationSettingsGeneralInfo from "components/presentationStudio/settings/PresentationSettingsGeneralInfo.vue";
import PresentationSettingsLanguage from "components/presentationStudio/settings/PresentationSettingsLanguage.vue";
import PresentationSettingsCollectParticipantsInfo from "components/presentationStudio/settings/PresentationSettingsCollectParticipantsInfo.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

defineEmits(["cancel"]);

/*
 * tabs
 */
const tabs = {
  generalInformation: {
    name: "generalInformation",
    icon: "r_settings",
    label: t("presentationStudio.settings.generalInformation.title"),
  },
  collectParticipantsInfo: {
    name: "collectParticipantsInfo",
    icon: "r_contacts",
    label: t("presentationStudio.settings.collectParticipantsInfo.title"),
  },
  audienceAuthentication: {
    name: "audienceAuthentication",
    icon: "r_security",
    disable: true,
    label: t("presentationStudio.settings.audienceAuthentication.title"),
  },
  qnaFromAudience: {
    name: "qnaFromAudience",
    icon: "r_flaky",
    disable: true,
    label: t(
      "presentationStudio.settings.questionsAndAnswersFromAudience.title"
    ),
  },
  quizSetup: {
    name: "quizSetup",
    icon: "r_quiz",
    disable: true,
    label: t("presentationStudio.settings.quizSetup.title"),
  },
  language: {
    name: "language",
    icon: "r_translate",
    label: t("presentationStudio.settings.language.title"),
  },
  leader: {
    name: "leader",
    icon: "r_settings_accessibility",
    disable: true,
    label: t("presentationStudio.settings.leader.title"),
  },
  other: {
    name: "other",
    icon: "r_more_horiz",
    disable: true,
    label: t("presentationStudio.settings.other.title"),
  },
};

const isExpandedTabs = ref([]);
</script>

<style scoped lang="scss">
::v-deep(.q-expansion-item) {
  .q-expansion-item__container {
    .q-item {
      transition: 0.2s;
      border-radius: 8px;
      outline: 3px solid transparent;

      &:hover {
        background: $grey-2;
      }

      .q-item__label {
        font-weight: 600;
      }

      .q-focus-helper {
        display: none;
      }
    }
  }
}

::v-deep(.q-expansion-item--active) {
  .q-expansion-item__container {
    .q-item {
      background: $grey-1;
      color: $primary;
      outline: 3px solid $blue-2;
    }
  }
}
</style>
