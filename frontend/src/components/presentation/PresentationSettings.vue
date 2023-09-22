<template>
  <q-card flat class="scroll--hidden">
    <q-card-section>
      <q-toolbar
        class="items-center justify-between q-mb-md bg-white"
        style="position: sticky; top: 0; z-index: 1"
      >
        <div class="text-h7 text-semibold">
          {{ $t("presentation.settings.title") }}
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
          <div class="q-my-md">
            <template v-if="tab.name === 'generalInformation'">
              <!-- description -->
              <div class="text-caption text-grey q-mb-xs">
                {{
                  $t(
                    "presentation.settings.generalInformation.description.title"
                  )
                }}
              </div>
              <q-input
                v-model="form.description"
                :placeholder="
                  $t(
                    'presentation.settings.generalInformation.description.placeholder'
                  )
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
                    :disable="form.description === presentation.description"
                    @click="
                      () => {
                        presentation.description = form.description;
                        presentationsStore.updatePresentation();
                      }
                    "
                  />
                </template>
              </q-input>

              <!-- preview -->
              <div class="text-caption text-grey q-mb-xs q-mt-md">
                {{
                  $t("presentation.settings.generalInformation.preview.title")
                }}
              </div>
              <q-img
                :src="presentation.slides[0].preview"
                class="presentation_preview relative-position"
              />
              <q-btn
                :label="
                  $t('presentation.settings.generalInformation.preview.upload')
                "
                icon-right="r_upload"
                unelevated
                disable
                text-color="primary"
                no-caps
                class="q-py-sm q-mt-md full-width bg-blue-1 presentation_preview__upload_btn"
              />
            </template>
          </div>
        </q-expansion-item>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { ref } from "vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

defineEmits(["close"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation } = storeToRefs(presentationsStore);

/*
 * tabs
 */
const tabs = [
  {
    name: "generalInformation",
    icon: "r_settings",
    label: t("presentation.settings.generalInformation.title"),
  },
  {
    name: "audienceAuthentication",
    icon: "r_security",
    disable: true,
    label: t("presentation.settings.audienceAuthentication.title"),
  },
  {
    name: "questionsAndAnswersFromAudience",
    icon: "r_flaky",
    disable: true,
    label: t("presentation.settings.questionsAndAnswersFromAudience.title"),
  },
  {
    name: "quizSetup",
    icon: "r_quiz",
    disable: true,
    label: t("presentation.settings.quizSetup.title"),
  },
  {
    name: "language",
    icon: "r_translate",
    disable: true,
    label: t("presentation.settings.language.title"),
  },
  {
    name: "leader",
    icon: "r_settings_accessibility",
    disable: true,
    label: t("presentation.settings.leader.title"),
  },
  {
    name: "other",
    icon: "r_more_horiz",
    disable: true,
    label: t("presentation.settings.other.title"),
  },
];

const isExpandedTabs = ref([]);

/*
 *
 */
const form = ref({
  description: presentation.value.description,
});
</script>

<style scoped lang="scss">
.q-card {
  height: 100%;
  width: 400px;
}

::v-deep(.q-expansion-item) {
  .q-focus-helper {
    display: none;
  }
  .q-item__label {
    font-weight: 600;
  }
  .q-item {
    transition: 0.2s;
    border-radius: 8px;
    outline: 3px solid transparent;

    &:hover {
      background: $grey-1;
    }
  }
}

::v-deep(.q-expansion-item--active) {
  .q-item {
    background: $grey-1;
    outline: 3px solid $grey-2;
  }
}

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
}

.presentation_preview__upload_btn {
  border: 1.5px dashed $primary;
  background: $blue-1;
}
</style>
