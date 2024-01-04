<template>
  <PresentationStudioTabsSettingsTabOptionLayout
    icon="r_timelapse"
    :label="$t('presentationLayout.rightDrawer.tabs.settings.timeLimit.title')"
    :tooltip="
      $t('presentationLayout.rightDrawer.tabs.settings.timeLimit.description')
    "
  >
    <div v-if="slideSettings.isLimitedTime">
      <q-input
        v-model="slideSettings.timeLimit"
        type="number"
        outlined
        dense
        :min="5"
        :max="1800"
        placeholder="1"
        hide-bottom-space
        :rules="timeLimitRules"
        style="width: 87px"
        no-error-icon
        @update:model-value="
          () => {
            if (isTimeLimitValid(Number(slideSettings.timeLimit))) {
              $emit('updateSlideSettings');
            }
          }
        "
      >
        <template #append>
          <div class="text-caption">
            {{
              $t(
                "presentationLayout.rightDrawer.tabs.settings.timeLimit.seconds"
              )
            }}
          </div>
        </template>
      </q-input>
    </div>

    <q-toggle
      v-if="[SLIDE_TYPES.WORD_CLOUD].includes(slide?.type)"
      v-model="slideSettings.isLimitedTime"
      color="primary"
      @update:model-value="
        () => {
          if (isTimeLimitValid(Number(slideSettings.timeLimit))) {
            $emit('updateSlideSettings');
          }
        }
      "
    />
  </PresentationStudioTabsSettingsTabOptionLayout>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { useI18n } from "vue-i18n";
import PresentationStudioTabsSettingsTabOptionLayout from "components/presentationStudio/tabs/settings/options/PresentationStudioTabsSettingsTabOptionLayout.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * emits
 */
defineEmits(["updateSlideSettings"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings, slide } = storeToRefs(presentationsStore);

/*
 * rules
 */
const timeLimitRules = [
  (val) =>
    isTimeLimitValid(val) ||
    t("presentationLayout.rightDrawer.tabs.settings.timeLimit.invalid"),
];

const isTimeLimitValid = (val) => {
  return val >= 5 && val <= 1800;
};
</script>
