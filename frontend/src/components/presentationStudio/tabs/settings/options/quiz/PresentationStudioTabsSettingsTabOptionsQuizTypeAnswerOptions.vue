<template>
  <div>
    <div class="q-mb-sm text-semibold">
      {{
        $t(
          "presentationLayout.rightDrawer.tabs.settings.typeAnswer.correctAnswer.title"
        )
      }}

      <q-icon name="r_help" class="q-ml-xs" color="grey-8">
        <q-tooltip class="text-center" max-width="350px" :offset="[0, 8]">
          {{
            $t(
              "presentationLayout.rightDrawer.tabs.settings.typeAnswer.correctAnswer.description"
            )
          }}
        </q-tooltip>
      </q-icon>
    </div>

    <!-- correct answer -->
    <div>
      <q-input
        v-model="slideSettings.correctAnswer.value"
        outlined
        dense
        style="width: 100%"
        :placeholder="
          $t(
            'presentationLayout.rightDrawer.tabs.settings.typeAnswer.correctAnswer.placeholder'
          )
        "
        :maxlength="150"
        :rules="[
          (val) =>
            val.length <= 150 ||
            $t(
              'presentationLayout.rightDrawer.tabs.settings.typeAnswer.maxLengthErrorMessage'
            ),
        ]"
        hide-bottom-space
        no-error-icon
        debounce="1000"
        @update:model-value="$emit('updateSlideSettings')"
      >
        <template #append>
          <div class="text-caption q-mr-xs">
            {{ 150 - slideSettings.correctAnswer.value?.length }}
          </div>
        </template>
      </q-input>
    </div>

    <!-- answer options -->
    <div class="row no-wrap items-center text-semibold q-mb-sm q-mt-lg">
      {{
        $t(
          "presentationLayout.rightDrawer.tabs.settings.typeAnswer.otherAcceptedAnswers.title"
        )
      }}

      <q-icon name="r_help" class="q-ml-xs" color="grey-8">
        <q-tooltip class="text-center" max-width="350px" :offset="[0, 8]">
          {{
            $t(
              "presentationLayout.rightDrawer.tabs.settings.typeAnswer.otherAcceptedAnswers.description"
            )
          }}
        </q-tooltip>
      </q-icon>
    </div>

    <draggable
      v-if="slideSettings.otherAcceptedAnswers.length"
      v-model="slideSettings.otherAcceptedAnswers"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        class: 'column no-wrap q-gutter-sm',
      }"
      v-bind="otherAcceptedAnswersDraggingOptions"
      item-key="id"
      handle=".layer_handle"
      @start="handleStartDraggingOtherAcceptedAnswers"
      @end="handleLayersReorderOtherAcceptedAnswers"
      @reordered="handleLayersReorderOtherAcceptedAnswers"
    >
      <template #item="{ element, index }">
        <div class="row no-wrap items-center">
          <q-icon
            name="r_drag_indicator"
            color="grey"
            size="sm"
            class="layer_handle cursor-pointer"
          />

          <q-input
            v-model="element.value"
            outlined
            dense
            style="width: 100%"
            class="q-mx-sm"
            debounce="1000"
            @update:model-value="$emit('updateSlideSettings')"
            :placeholder="
              $t(
                'presentationLayout.rightDrawer.tabs.settings.typeAnswer.answerOption'
              ) +
              (index + 1)
            "
            :maxlength="150"
            :rules="[
              (val) =>
                val.length <= 150 ||
                $t(
                  'presentationLayout.rightDrawer.tabs.settings.typeAnswer.maxLengthErrorMessage'
                ),
            ]"
            hide-bottom-space
            no-error-icon
          >
            <template #append>
              <div class="text-caption q-mr-xs">
                {{ 150 - element.value?.length }}
              </div>
            </template>
          </q-input>

          <q-btn
            flat
            color="grey"
            icon="r_delete_sweep"
            size="12px"
            style="border-radius: 50%; width: 32px"
            @click="handleRemovingAnswerOption(index)"
          />
        </div>
      </template>
    </draggable>

    <!-- add answer option -->
    <div
      :class="
        slideSettings.otherAcceptedAnswers?.length ? 'q-mt-md' : 'q-mt-sm'
      "
      style="margin-left: 32px"
    >
      <q-btn
        v-if="slideSettings.otherAcceptedAnswers?.length < 8"
        unelevated
        :label="
          $t(
            'presentationLayout.rightDrawer.tabs.settings.typeAnswer.addAnswerOption'
          )
        "
        icon="r_add"
        no-caps
        color="grey-2"
        text-color="black"
        @click="handleAddingNewAnswerOption()"
      />
    </div>
  </div>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import draggable from "vuedraggable/src/vuedraggable";

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

/*
 * answer options (add / remove)
 */
const handleAddingNewAnswerOption = () => {
  slideSettings.value.otherAcceptedAnswers.push({
    value: "",
    isCorrect: true,
  });
};

const handleRemovingAnswerOption = (answerOptionIndex) => {
  slideSettings.value.otherAcceptedAnswers =
    slideSettings.value.otherAcceptedAnswers.filter(
      (option, index) => index !== answerOptionIndex
    );
};

/*
 * drag
 */
const isAnswerOptionDragging = ref(false);
const otherAcceptedAnswersDraggingOptions = ref({
  animation: 200,
  group: "attributes",
  direction: "vertical",
  disabled: false,
  ghostClass: "ghost",
});

const handleStartDraggingOtherAcceptedAnswers = () => {
  isAnswerOptionDragging.value = true;
};

const handleEndDraggingOtherAcceptedAnswers = () => {
  isAnswerOptionDragging.value = false;
};

const handleLayersReorderOtherAcceptedAnswers = async () => {
  handleEndDraggingOtherAcceptedAnswers();
};
</script>
