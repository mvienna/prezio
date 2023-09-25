<template>
  <q-card flat class="scroll--hidden" style="height: 100%; width: 400px">
    <q-card-section>
      <q-toolbar
        class="items-center justify-between q-mb-md bg-white"
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
          @click="$emit('close')"
        />
      </q-toolbar>

      <div class="column no-wrap q-gutter-sm">
        <q-expansion-item
          v-for="(tab, tabIndex) in tabs"
          :key="tab.name"
          v-model="isExpandedTabs[tabIndex]"
          :icon="tab.icon"
          :disable="tab.disable"
          :label="tab.label"
          expand-icon="r_keyboard_arrow_down"
          :class="isExpandedTabs[tabIndex] ? 'q-expansion-item--active' : ''"
        >
          <div class="q-mt-lg q-mb-md">
            <!-- general info -->
            <PresentationSettingsGeneralInfo
              v-if="tab.name === 'generalInformation'"
            />

            <!-- language -->
            <PresentationSettingsLanguage v-if="tab.name === 'language'" />

            <q-separator class="q-mt-lg" />
          </div>
        </q-expansion-item>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import PresentationSettingsGeneralInfo from "components/presentation/settings/PresentationSettingsGeneralInfo.vue";
import PresentationSettingsLanguage from "components/presentation/settings/PresentationSettingsLanguage.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

defineEmits(["close"]);

/*
 * tabs
 */
const tabs = [
  {
    name: "generalInformation",
    icon: "r_settings",
    label: t("presentationStudio.settings.generalInformation.title"),
  },
  {
    name: "audienceAuthentication",
    icon: "r_security",
    disable: true,
    label: t("presentationStudio.settings.audienceAuthentication.title"),
  },
  {
    name: "questionsAndAnswersFromAudience",
    icon: "r_flaky",
    disable: true,
    label: t(
      "presentationStudio.settings.questionsAndAnswersFromAudience.title"
    ),
  },
  {
    name: "quizSetup",
    icon: "r_quiz",
    disable: true,
    label: t("presentationStudio.settings.quizSetup.title"),
  },
  {
    name: "language",
    icon: "r_translate",
    label: t("presentationStudio.settings.language.title"),
  },
  {
    name: "leader",
    icon: "r_settings_accessibility",
    disable: true,
    label: t("presentationStudio.settings.leader.title"),
  },
  {
    name: "other",
    icon: "r_more_horiz",
    disable: true,
    label: t("presentationStudio.settings.other.title"),
  },
];

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
        background: $grey-1;
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
      outline: 3px solid $grey-2;
    }
  }
}
</style>
