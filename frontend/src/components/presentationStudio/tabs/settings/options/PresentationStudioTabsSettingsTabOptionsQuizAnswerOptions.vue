<template>
  <div>
    <div class="row no-wrap items-center text-semibold q-mb-sm">
      {{
        $t("presentationLayout.rightDrawer.tabs.settings.answerOptions.title")
      }}

      <q-icon name="r_info" class="q-ml-xs" color="grey-8">
        <q-tooltip class="text-center" max-width="350px" :offset="[0, 8]">
          {{
            $t(
              `presentationLayout.rightDrawer.tabs.settings.answerOptions.description.${slide?.type}`
            )
          }}
        </q-tooltip>
      </q-icon>
    </div>

    <!-- answer options -->
    <draggable
      v-if="slideSettings.answerOptions.length"
      v-model="slideSettings.answerOptions"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        class: 'column no-wrap q-gutter-sm',
      }"
      v-bind="answerOptionsDraggingOptions"
      item-key="id"
      handle=".layer_handle"
      @start="handleStartDraggingAnswerOptions"
      @end="handleLayersReorderAnswerOptions"
      @reordered="handleLayersReorderAnswerOptions"
    >
      <template #item="{ element, index }">
        <div class="row no-wrap items-center q-gutter-sm">
          <q-icon
            name="r_drag_indicator"
            color="grey"
            size="sm"
            class="layer_handle cursor-pointer q-mr-sm"
          />

          <q-input
            v-model="element.value"
            outlined
            dense
            style="width: 100%"
            :placeholder="
              $t(
                'presentationLayout.rightDrawer.tabs.settings.answerOptions.answerOption'
              ) +
              (index + 1)
            "
            :maxlength="150"
            :rules="[
              (val) =>
                val.length <= 150 ||
                $t(
                  'presentationLayout.rightDrawer.tabs.settings.answerOptions.maxLengthErrorMessage'
                ),
            ]"
            hide-bottom-space
            no-error-icon
          >
            <template #append>
              <div class="text-caption">
                {{ 150 - element.value?.length }}
              </div>
            </template>
          </q-input>

          <div class="row no-wrap">
            <q-checkbox
              v-model="element.isCorrect"
              checked-icon="r_check_circle"
              :unchecked-icon="
                element.isHovered ? 'o_check_circle' : 'o_circle'
              "
              :color="element.isCorrect ? 'positive' : 'grey'"
              keep-color
              style="font-size: 20px"
              @mouseover="element.isHovered = true"
              @mouseleave="element.isHovered = false"
            />

            <q-btn
              flat
              round
              color="grey"
              style="border-radius: 50%"
              :disable="slideSettings.answerOptions.length <= 2"
              @click="handleRemovingAnswerOption(index)"
            >
              <q-icon name="r_delete" size="22px" />
            </q-btn>
          </div>
        </div>
      </template>
    </draggable>

    <!-- add answer option -->
    <q-btn
      v-if="slideSettings.answerOptions?.length < 8"
      unelevated
      :label="
        $t(
          'presentationLayout.rightDrawer.tabs.settings.answerOptions.addAnswerOption'
        )
      "
      icon-right="r_add"
      no-caps
      class="q-mt-md q-py-sm full-width"
      color="primary"
      @click="handleAddingNewAnswerOption()"
    />

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
    <div class="row no-wrap items-center justify-between text-semibold q-mt-sm">
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
              isScorePointsValid(Number(slideSettings.value.points.min)) &&
              isScorePointsValid(Number(slideSettings.value.points.max)) &&
              isMinScorePointsValid(Number(slideSettings.value.points.min)) &&
              isMaxScorePointsValid(Number(slideSettings.value.points.max))
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
              <q-tooltip class="text-center" max-width="200px" :offset="[0, 8]">
                {{
                  $t(
                    "presentationLayout.rightDrawer.tabs.settings.points.partialScoring.description"
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
                  isScorePointsValid(Number(slideSettings.value.points.min)) &&
                  isScorePointsValid(Number(slideSettings.value.points.max)) &&
                  isMinScorePointsValid(
                    Number(slideSettings.value.points.min)
                  ) &&
                  isMaxScorePointsValid(Number(slideSettings.value.points.max))
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
const { slideSettings } = storeToRefs(presentationsStore);

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
  slideSettings.value.answerOptions.push({
    value: "",
    isCorrect: false,
    isSelected: false,
  });
};

const handleRemovingAnswerOption = (answerOptionIndex) => {
  slideSettings.value.answerOptions = slideSettings.value.answerOptions.filter(
    (option, index) => index !== answerOptionIndex
  );
};

/*
 * drag
 */
const isAnswerOptionDragging = ref(false);
const answerOptionsDraggingOptions = ref({
  animation: 200,
  group: "attributes",
  direction: "vertical",
  disabled: false,
  ghostClass: "ghost",
});

const handleStartDraggingAnswerOptions = () => {
  isAnswerOptionDragging.value = true;
};

const handleEndDraggingAnswerOptions = () => {
  isAnswerOptionDragging.value = false;
};

const handleLayersReorderAnswerOptions = async () => {
  handleEndDraggingAnswerOptions();
};
</script>
