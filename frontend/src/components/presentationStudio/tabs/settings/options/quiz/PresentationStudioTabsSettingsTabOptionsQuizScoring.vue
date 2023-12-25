<template>
  <div>
    <!-- points -->
    <div class="row no-wrap items-center q-mt-lg text-semibold q-mb-sm">
      {{ $t("presentationLayout.rightDrawer.tabs.settings.points.title") }}

      <q-icon name="r_info" class="q-ml-xs" color="grey-8">
        <q-tooltip class="text-center" max-width="250px" :offset="[0, 8]">
          {{
            $t(
              "presentationLayout.rightDrawer.tabs.settings.points.description"
            )
          }}
        </q-tooltip>
      </q-icon>
    </div>

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
        :label="$t('presentationLayout.rightDrawer.tabs.settings.points.min')"
      />

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
        :label="$t('presentationLayout.rightDrawer.tabs.settings.points.max')"
      />
    </div>

    <!-- score depends on time -->
    <div class="row no-wrap items-center text-semibold justify-between">
      <span>
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.settings.points.scoreDependsOnTime.title"
          )
        }}

        <q-icon name="r_info" class="q-ml-xs" color="grey-8">
          <q-tooltip class="text-center" max-width="220px" :offset="[0, 8]">
            {{
              $t(
                `presentationLayout.rightDrawer.tabs.settings.points.scoreDependsOnTime.description.${
                  slideSettings.scoreDependsOnTime ? "on" : "off"
                }`
              )
            }}
          </q-tooltip>
        </q-icon>
      </span>

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
    </div>

    <!-- partial scoring -->
    <q-slide-transition>
      <div
        v-if="
          [SLIDE_TYPES.PICK_ANSWER, SLIDE_TYPES.PICK_IMAGE].includes(
            slide?.type
          ) &&
          slideSettings.answerOptions?.filter((option) => option.isCorrect)
            ?.length > 1
        "
      >
        <div class="row no-wrap items-center justify-between text-semibold">
          <span>
            {{
              $t(
                "presentationLayout.rightDrawer.tabs.settings.points.partialScoring.title"
              )
            }}

            <q-icon name="r_info" class="q-ml-xs" color="grey-8">
              <q-tooltip class="text-center" max-width="320px" :offset="[0, 8]">
                {{
                  $t(
                    `presentationLayout.rightDrawer.tabs.settings.points.partialScoring.description.${
                      slideSettings.partialScoring ? "on" : "off"
                    }`
                  )
                }}
              </q-tooltip>
            </q-icon>
          </span>

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
        </div>
      </div>
    </q-slide-transition>

    <q-separator class="q-mt-sm q-mb-md" />
  </div>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { SLIDE_TYPES } from "src/constants/presentationStudio";

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
