<template>
  <div class="row no-wrap justify-between items-center q-gutter-md">
    <!-- min -->
    <q-input
      v-model="slideSettings.points.min"
      outlined
      type="number"
      :min="0"
      :mmax="0"
      dense
      placeholder="1"
      :rules="minScorePointsRules"
      lazy-rules
      style="width: 100%"
    >
      <template #append>
        <div class="text-14 text-black">
          {{ $t("presentationLayout.rightDrawer.tabs.settings.points.min") }}
        </div>
      </template>
    </q-input>

    <!-- max -->
    <q-input
      v-model="slideSettings.points.max"
      outlined
      type="number"
      :min="0"
      :mmax="0"
      dense
      placeholder="1000"
      :rules="maxScorePointsRules"
      lazy-rules
      style="width: 100%"
    >
      <template #append>
        <div class="text-14 text-black">
          {{ $t("presentationLayout.rightDrawer.tabs.settings.points.max") }}
        </div>
      </template>
    </q-input>
  </div>

  <!-- score depends on time -->
  <PresentationStudioTabsSettingsTabOptionLayout
    icon="r_speed"
    :label="
      $t(
        'presentationLayout.rightDrawer.tabs.settings.points.scoreDependsOnTime.title'
      )
    "
    :tooltip="
      $t(
        `presentationLayout.rightDrawer.tabs.settings.points.scoreDependsOnTime.description.${
          slideSettings.scoreDependsOnTime ? 'on' : 'off'
        }`
      )
    "
  >
    <q-toggle
      v-model="slideSettings.scoreDependsOnTime"
      color="primary"
      @update:model-value="
        () => {
          if (
            isScorePointsValid(Number(slideSettings.points.min)) &&
            isScorePointsValid(Number(slideSettings.points.max)) &&
            isMinScorePointsValid(Number(slideSettings.points.min)) &&
            isMaxScorePointsValid(Number(slideSettings.points.max))
          ) {
            $emit('updateSlideSettings');
          }
        }
      "
    />
  </PresentationStudioTabsSettingsTabOptionLayout>

  <!-- partial scoring -->
  <PresentationStudioTabsSettingsTabOptionLayout
    v-if="
      [SLIDE_TYPES.PICK_ANSWER, SLIDE_TYPES.PICK_IMAGE].includes(slide?.type) &&
      slideSettings.answerOptions?.filter((option) => option.isCorrect)
        ?.length > 1
    "
    icon="r_calculate"
    :label="
      $t(
        'presentationLayout.rightDrawer.tabs.settings.points.partialScoring.title'
      )
    "
    :tooltip="
      $t(
        `presentationLayout.rightDrawer.tabs.settings.points.partialScoring.description.${
          slideSettings.partialScoring ? 'on' : 'off'
        }`
      )
    "
  >
    <q-toggle
      v-model="slideSettings.partialScoring"
      color="primary"
      @update:model-value="
        () => {
          if (
            isScorePointsValid(Number(slideSettings.points.min)) &&
            isScorePointsValid(Number(slideSettings.points.max)) &&
            isMinScorePointsValid(Number(slideSettings.points.min)) &&
            isMaxScorePointsValid(Number(slideSettings.points.max))
          ) {
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
import PresentationStudioTabsSettingsTabOptionLayout from "components/presentationStudio/tabs/settings/options/PresentationStudioTabsSettingsTabOptionLayout.vue";

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
const isScorePointsValid = (val) => {
  return val >= 0 && val <= 1000;
};

const minScorePointsRules = [
  (val) =>
    isScorePointsValid(val) ||
    t("presentationLayout.rightDrawer.tabs.settings.points.errors.invalid"),
  (val) =>
    isMinScorePointsValid(val) ||
    t("presentationLayout.rightDrawer.tabs.settings.points.errors.invalidMin"),
];
const isMinScorePointsValid = (val) => {
  return val <= slideSettings.value.points.max;
};

const maxScorePointsRules = [
  (val) =>
    isScorePointsValid(val) ||
    t("presentationLayout.rightDrawer.tabs.settings.points.errors.invalid"),
  (val) =>
    isMaxScorePointsValid(val) ||
    t("presentationLayout.rightDrawer.tabs.settings.points.errors.invalidMax"),
];
const isMaxScorePointsValid = (val) => {
  return val >= slideSettings.value.points.min;
};
</script>
