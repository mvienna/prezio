<template>
  <div>
    <!-- title -->
    <div class="row no-wrap items-center justify-between">
      <div class="text-semibold">
        {{ $t("presentationLayout.rightDrawer.tabs.settings.question.title") }}
      </div>
    </div>

    <!-- question -->
    <q-input
      v-model="question"
      :placeholder="
        $t('presentationLayout.rightDrawer.tabs.settings.question.placeholder')
      "
      outlined
      dense
      class="q-mt-sm"
      @update:model-value="handleQuestionInput()"
    >
      <!-- alignment -->
      <template #append>
        <q-btn
          flat
          round
          size="10px"
          color="dark"
          :icon="
            layoutTitle?.textAlign === 'left'
              ? 'r_format_align_left'
              : layoutTitle?.textAlign === 'center'
              ? 'r_format_align_center'
              : layoutTitle?.textAlign === 'right'
              ? 'r_format_align_right'
              : 'r_format_align_left'
          "
        >
          <q-menu
            anchor="bottom middle"
            self="top middle"
            transition-show="jump-down"
            transition-hide="jump-up"
            style="border: 1px solid #13123a4c"
          >
            <q-btn-group outline>
              <!-- align left -->
              <q-btn
                unelevated
                :text-color="
                  layoutTitle?.textAlign === 'left' ? 'dark' : 'grey'
                "
                :color="layoutTitle?.textAlign === 'left' ? 'grey-4' : 'grey-1'"
                icon="r_format_align_left"
                size="10px"
                round
                @click="handleQuestionInput('left')"
              />

              <!-- align center -->
              <q-btn
                unelevated
                :text-color="
                  layoutTitle?.textAlign === 'center' ? 'dark' : 'grey'
                "
                :color="
                  layoutTitle?.textAlign === 'center' ? 'grey-4' : 'grey-1'
                "
                icon="r_format_align_center"
                size="10px"
                round
                @click="handleQuestionInput('center')"
              />

              <!-- align right -->
              <q-btn
                unelevated
                :text-color="
                  layoutTitle?.textAlign === 'right' ? 'dark' : 'grey'
                "
                :color="
                  layoutTitle?.textAlign === 'right' ? 'grey-4' : 'grey-1'
                "
                icon="r_format_align_right"
                size="10px"
                round
                @click="handleQuestionInput('right')"
              />
            </q-btn-group>
          </q-menu>
        </q-btn>
      </template>

      <!-- add image -->
      <template #after>
        <q-btn icon="r_image" round outline disable />
      </template>
    </q-input>

    <!-- description -->
    <q-expansion-item class="q-mt-sm text-grey-10">
      <template #header>
        <div class="row no-wrap items-center">
          <div class="q-item__label">
            {{
              $t(
                "presentationLayout.rightDrawer.tabs.settings.question.description.title"
              )
            }}
          </div>

          <q-icon name="r_info" class="q-ml-xs" color="grey-8">
            <q-tooltip max-width="300px" class="text-center">
              {{
                $t(
                  "presentationLayout.rightDrawer.tabs.settings.question.description.caption"
                )
              }}
            </q-tooltip>
          </q-icon>
        </div>

        <q-space />
      </template>

      <q-input
        v-model="slideSettings.description"
        :placeholder="
          $t(
            'presentationLayout.rightDrawer.tabs.settings.question.description.placeholder'
          )
        "
        outlined
        dense
        autogrow
        class="q-mt-sm"
        @update:model-value="handleSlideSettingsUpdate()"
      />
    </q-expansion-item>

    <q-separator class="q-my-md" />

    <!-- entries per participant -->
    <div v-if="slide?.type === SLIDE_TYPES.WORD_CLOUD">
      <div
        class="row no-wrap items-center justify-between text-semibold q-pb-xs"
      >
        <span>
          {{
            $t(
              "presentationLayout.rightDrawer.tabs.settings.entriesPerParticipant.title"
            )
          }}

          <q-icon name="r_info" class="q-ml-xs" color="grey-8">
            <q-tooltip class="text-center" max-width="200px" :offset="[0, 8]">
              {{
                $t(
                  "presentationLayout.rightDrawer.tabs.settings.entriesPerParticipant.description"
                )
              }}
            </q-tooltip>
          </q-icon>
        </span>
      </div>

      <q-input
        v-model="slideSettings.entriesPerParticipant"
        type="number"
        class="q-mt-sm"
        outlined
        dense
        :min="1"
        :max="10"
        placeholder="1"
        style="width: 160px"
        hide-bottom-space
        :rules="entriesPerParticipantRules"
        @update:model-value="handleSlideSettingsUpdate()"
      >
        <template #prepend>
          <q-icon name="r_keyboard_return" color="dark" class="q-mr-xs" />
        </template>
      </q-input>
    </div>

    <!-- multiple entries -->
    <div
      class="row no-wrap items-center justify-between text-semibold q-mt-sm"
      v-if="slide?.type === SLIDE_TYPES.WORD_CLOUD"
    >
      <span>
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.settings.multipleEntries.title"
          )
        }}

        <q-icon name="r_info" class="q-ml-xs" color="grey-8">
          <q-tooltip class="text-center" max-width="200px" :offset="[0, 8]">
            {{
              $t(
                `presentationLayout.rightDrawer.tabs.settings.multipleEntries.${
                  slideSettings.isMultipleEntries ? "on" : "off"
                }`
              )
            }}
          </q-tooltip>
        </q-icon>
      </span>

      <q-toggle
        v-model="slideSettings.isMultipleEntries"
        color="primary"
        checked-icon="r_all_inclusive"
        @update:model-value="handleSlideSettingsUpdate()"
      />
    </div>

    <!-- quiz -->
    <template
      v-if="
        [SLIDE_TYPES.PICK_ANSWER, SLIDE_TYPES.PICK_IMAGE].includes(slide?.type)
      "
    >
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
                unchecked-icon="r_cancel"
                :color="element.isCorrect ? 'positive' : 'red'"
                keep-color
                style="font-size: 20px"
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
      <div
        class="row no-wrap items-center justify-between text-semibold q-mt-sm"
      >
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
          @update:model-value="handleSlideSettingsUpdate()"
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
                <q-tooltip
                  class="text-center"
                  max-width="200px"
                  :offset="[0, 8]"
                >
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
              @update:model-value="handleSlideSettingsUpdate()"
            />
          </div>
        </div>
      </q-slide-transition>

      <q-separator class="q-mt-md q-mb-md" />
    </template>

    <!-- time limit -->
    <div class="row no-wrap items-center justify-between text-semibold">
      <span>
        {{ $t("presentationLayout.rightDrawer.tabs.settings.timeLimit.title") }}

        <q-icon name="r_info" class="q-ml-xs" color="grey-8">
          <q-tooltip class="text-center" max-width="200px" :offset="[0, 8]">
            {{
              $t(
                "presentationLayout.rightDrawer.tabs.settings.timeLimit.description"
              )
            }}
          </q-tooltip>
        </q-icon>
      </span>

      <q-toggle
        v-if="[SLIDE_TYPES.WORD_CLOUD].includes(slide?.type)"
        v-model="slideSettings.isLimitedTime"
        color="primary"
        @update:model-value="handleSlideSettingsUpdate()"
      />
    </div>

    <q-slide-transition>
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
          style="width: 160px"
          no-error-icon
          class="q-pb-sm"
          :class="
            ![SLIDE_TYPES.WORD_CLOUD].includes(slide?.type) ? 'q-mt-md' : ''
          "
          @update:model-value="handleSlideSettingsUpdate()"
        >
          <template #prepend>
            <q-icon name="r_timer" color="dark" class="q-mr-xs" />
          </template>

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
    </q-slide-transition>

    <!-- leaderboard -->
    <div
      class="row no-wrap items-center justify-between text-semibold q-mt-sm"
      v-if="
        [SLIDE_TYPES.PICK_ANSWER, SLIDE_TYPES.PICK_IMAGE].includes(slide?.type)
      "
    >
      <span>
        {{
          $t("presentationLayout.rightDrawer.tabs.settings.leaderboard.title")
        }}

        <q-icon name="r_info" class="q-ml-xs" color="grey-8">
          <q-tooltip class="text-center" max-width="200px" :offset="[0, 8]">
            {{
              $t(
                "presentationLayout.rightDrawer.tabs.settings.leaderboard.description"
              )
            }}
          </q-tooltip>
        </q-icon>
      </span>

      <q-toggle
        v-model="slideSettings.showLeaderboard"
        color="primary"
        @update:model-value="handleSlideSettingsUpdate()"
      />
    </div>

    <!-- lock submission -->
    <div
      v-if="slide?.type === SLIDE_TYPES.WORD_CLOUD"
      class="row no-wrap items-center justify-between text-semibold"
    >
      <span>
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.settings.lockSubmission.title"
          )
        }}

        <q-icon name="r_info" class="q-ml-xs" color="grey-8">
          <q-tooltip class="text-center" max-width="330px" :offset="[0, 8]">
            {{
              $t(
                "presentationLayout.rightDrawer.tabs.settings.lockSubmission.description"
              )
            }}
          </q-tooltip>
        </q-icon>
      </span>

      <q-toggle
        v-model="slideSettings.isInitialSubmissionLocked"
        color="primary"
        @update:model-value="handleSlideSettingsUpdate()"
      />
    </div>

    <!-- hide results -->
    <div
      v-if="slide?.type === SLIDE_TYPES.WORD_CLOUD"
      class="row no-wrap items-center justify-between text-semibold"
    >
      <span>
        {{
          $t("presentationLayout.rightDrawer.tabs.settings.hideResults.title")
        }}

        <q-icon name="r_info" class="q-ml-xs" color="grey-8">
          <q-tooltip class="text-center" max-width="320px" :offset="[0, 8]">
            {{
              $t(
                "presentationLayout.rightDrawer.tabs.settings.hideResults.description"
              )
            }}
          </q-tooltip>
        </q-icon>
      </span>

      <q-toggle
        v-model="slideSettings.isResultsHidden"
        color="primary"
        @update:model-value="handleSlideSettingsUpdate()"
      />
    </div>

    <div class="q-pb-sm">
      <q-separator class="q-mb-lg q-mt-md" />
    </div>

    <!-- open general quiz settings -->
    <q-btn
      v-if="
        [
          SLIDE_TYPES.TYPE_ANSWER,
          SLIDE_TYPES.PICK_IMAGE,
          SLIDE_TYPES.PICK_ANSWER,
        ].includes(slide?.type)
      "
      outline
      color="primary"
      icon-right="r_quiz"
      :label="
        $t(
          'presentationLayout.rightDrawer.tabs.settings.openGeneralQuizSettings.title'
        )
      "
      no-caps
      class="full-width q-py-sm q-mb-md"
      @click="
        showSettingsDialog = true;
        presentationSettingsTabsExpanded = [false, false, false, false, true];
      "
    />

    <!-- apply to all questions -->
    <q-btn
      unelevated
      color="primary"
      icon-right="r_move_down"
      :label="
        $t(
          'presentationLayout.rightDrawer.tabs.settings.applyToAllQuestions.title'
        )
      "
      no-caps
      class="full-width q-py-sm"
      @click="showApplySettingsToAllQuestionsDialog = true"
    />

    <q-dialog v-model="showApplySettingsToAllQuestionsDialog">
      <ConfirmationDialog
        icon="r_move_down"
        icon-color="primary"
        :title="
          $t(
            'presentationLayout.rightDrawer.tabs.settings.applyToAllQuestions.confirmation.title'
          )
        "
        :message="
          $t(
            'presentationLayout.rightDrawer.tabs.settings.applyToAllQuestions.confirmation.message'
          )
        "
        confirm-btn-color="primary"
        @cancel="showApplySettingsToAllQuestionsDialog = false"
        @confirm="
          applySettingsToAllQuestions();
          showApplySettingsToAllQuestionsDialog = false;
        "
      >
        <template #default>
          <div class="column no-wrap q-pb-lg">
            <!-- limit time -->
            <q-toggle
              v-model="settingsToApplyToAllQuestions.isLimitedTime"
              :label="
                $t(
                  'presentationLayout.rightDrawer.tabs.settings.timeLimit.title'
                )
              "
              color="primary"
              left-label
              class="full-width justify-between"
            />

            <!-- word cloud -->
            <template v-if="slide?.type === SLIDE_TYPES.WORD_CLOUD">
              <!-- multiple entries -->
              <q-toggle
                v-model="settingsToApplyToAllQuestions.isMultipleEntries"
                :label="
                  $t(
                    'presentationLayout.rightDrawer.tabs.settings.multipleEntries.title'
                  )
                "
                color="primary"
                left-label
                class="full-width justify-between"
              />

              <!-- entries per participant -->
              <q-toggle
                v-model="settingsToApplyToAllQuestions.entriesPerParticipant"
                :label="
                  $t(
                    'presentationLayout.rightDrawer.tabs.settings.entriesPerParticipant.title'
                  )
                "
                color="primary"
                left-label
                class="full-width justify-between"
              />

              <!-- lock submissions -->
              <q-toggle
                v-model="
                  settingsToApplyToAllQuestions.isInitialSubmissionLocked
                "
                :label="
                  $t(
                    'presentationLayout.rightDrawer.tabs.settings.lockSubmission.title'
                  )
                "
                color="primary"
                left-label
                class="full-width justify-between"
              />

              <!-- hide results -->
              <q-toggle
                v-model="settingsToApplyToAllQuestions.isResultsHidden"
                :label="
                  $t(
                    'presentationLayout.rightDrawer.tabs.settings.hideResults.title'
                  )
                "
                color="primary"
                left-label
                class="full-width justify-between"
              />
            </template>
          </div>
        </template>
      </ConfirmationDialog>
    </q-dialog>
  </div>
</template>

<script setup>
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref, watch } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { useI18n } from "vue-i18n";
import { ALIGNMENT } from "src/constants/canvas/canvasVariables";
import { useCanvasTextStore } from "stores/canvas/text";
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { api } from "boot/axios";
import draggable from "vuedraggable/src/vuedraggable";
import { useQuasar } from "quasar";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const $q = useQuasar();

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { elements, MODE_OPTIONS } = storeToRefs(canvasStore);

const textStore = useCanvasTextStore();
const { customization } = storeToRefs(textStore);

const presentationsStore = usePresentationsStore();
const {
  presentation,
  slide,
  slideSettings,
  showSettingsDialog,
  presentationSettingsTabsExpanded,
} = storeToRefs(presentationsStore);

/*
 * load
 */
onBeforeMount(() => {
  question.value = layoutTitle.value?.text;

  checkSlideSettings();

  handleSlideSettingsUpdate();
});

watch(
  () => slide.value,
  () => {
    checkSlideSettings();
  }
);

const checkSlideSettings = () => {
  if (!slideSettings.value) {
    slideSettings.value = settingsDefaultState;
  }

  for (const prop in settingsDefaultState) {
    if (!slideSettings.value.hasOwnProperty(prop)) {
      slideSettings.value[prop] = settingsDefaultState[prop];
    }
  }
};

/*
 * layout title (question)
 */
const question = ref();

const layoutTitle = computed(() => {
  return elements.value.find((element) => element.id.includes("-title-top-"));
});

watch(
  () => layoutTitle.value,
  () => {
    question.value = layoutTitle.value?.text;
  }
);

const handleQuestionInput = (textAlign = null) => {
  const index = elements.value.findIndex(
    (element) => element.id === layoutTitle.value?.id
  );

  if (index === -1) {
    const layoutDefaultElementProps = {
      mode: MODE_OPTIONS.value.text,
      isVisible: true,
      isLocked: false,
      fontFamily: customization.value.font,
      lineHeight: customization.value.lineHeight,
      fontWeight: "normal",
      textDecoration: "none",
      fontStyle: "normal",
      textAlign: ALIGNMENT.horizontal.left,
      verticalAlign: ALIGNMENT.vertical.top,
      rotationAngle: 0,

      /*
       * editable
       */
      id: "layout-",
      text: "",

      fontSize: "48px",
      color: customization.value.color,

      x: canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().width * 5) / 100
      ),
      y: canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().width * 5) / 100
      ),

      width: canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().width * 90) / 100
      ),
      height: canvasStore.computeAdjustedSize(30),
    };

    const titleElement = {
      ...layoutDefaultElementProps,

      id: "layout-title-top-titleAndBody",
      text: question.value.length
        ? question.value
        : t("presentationStudio.layouts.defaultTexts.question"),
      textAlign: "center",

      color: "#313232",
      fontSize: "48px",
      fontWeight: "bold",
    };

    elements.value.unshift(titleElement);
  } else {
    elements.value[index].text = question.value;
  }

  if (textAlign) {
    elements.value[index].textAlign = textAlign;
  }

  canvasStore.redrawCanvas();
};

/*
 * slide settings
 */
const settingsDefaultState = {
  description: "",

  isLimitedTime: true,
  timeLimit: 40,

  // word cloud
  isMultipleEntries: false,
  entriesPerParticipant: 3,
  isInitialSubmissionLocked: false,
  isResultsHidden: false,

  // quiz
  answerOptions: [
    { value: "", isCorrect: true, isSelected: false },
    { value: "", isCorrect: false, isSelected: false },
  ],
  points: {
    min: 0,
    max: 100,
  },
  scoreDependsOnTime: true,
  partialScoring: false,
  showLeaderboard: true,
};

const handleSlideSettingsUpdate = () => {
  if (slideSettings.value.timeLimit > 1800) {
    slideSettings.value.timeLimit = 1800;
  }

  if (
    !isEntriesPerParticipantValid(
      Number(slideSettings.value.entriesPerParticipant)
    )
  )
    return;

  if (!isTimeLimitValid(Number(slideSettings.value.timeLimit))) return;

  if (
    !isScorePointsValid(Number(slideSettings.value.points.min)) ||
    !isScorePointsValid(Number(slideSettings.value.points.max)) ||
    isMinScorePointsValid(Number(slideSettings.value.points.min)) ||
    isMaxScorePointsValid(Number(slideSettings.value.points.max))
  )
    return;

  presentationsStore.updateLocalSlide();
};

const isEntriesPerParticipantValid = (val) => {
  return val >= 0 && val <= 10;
};

const entriesPerParticipantRules = [
  (val) =>
    isEntriesPerParticipantValid(val) ||
    t(
      "presentationLayout.rightDrawer.tabs.settings.entriesPerParticipant.invalid"
    ),
];

const isTimeLimitValid = (val) => {
  return val >= 5 && val <= 1800;
};

const timeLimitRules = [
  (val) =>
    isTimeLimitValid(val) ||
    t("presentationLayout.rightDrawer.tabs.settings.timeLimit.invalid"),
];

// points validation
const isScorePointsValid = (val) => {
  return val >= 0 && val <= 1000;
};

const isMinScorePointsValid = (val) => {
  return val <= slideSettings.value.points.max;
};

const minScorePointsRules = [
  (val) =>
    isScorePointsValid(val) ||
    t("presentationLayout.rightDrawer.tabs.settings.points.errors.invalid"),
  (val) =>
    isMinScorePointsValid(val) ||
    t("presentationLayout.rightDrawer.tabs.settings.points.errors.invalidMin"),
];

const isMaxScorePointsValid = (val) => {
  return val >= slideSettings.value.points.min;
};

const maxScorePointsRules = [
  (val) =>
    isScorePointsValid(val) ||
    t("presentationLayout.rightDrawer.tabs.settings.points.errors.invalid"),
  (val) =>
    isMaxScorePointsValid(val) ||
    t("presentationLayout.rightDrawer.tabs.settings.points.errors.invalidMax"),
];

/*
 * apply to all questions
 */
const showApplySettingsToAllQuestionsDialog = ref(false);

const settingsToApplyToAllQuestions = ref({
  isLimitedTime: true,

  // word cloud
  isMultipleEntries: true,
  entriesPerParticipant: false,
  isInitialSubmissionLocked: true,
  isResultsHidden: true,
});

const applySettingsToAllQuestions = () => {
  let settingsToUpdate = {};

  if (settingsToApplyToAllQuestions.value.isLimitedTime) {
    settingsToUpdate.isLimitedTime = slideSettings.value.isLimitedTime;
    settingsToUpdate.timeLimit = slideSettings.value.timeLimit;
  }

  if (slide.value?.type === SLIDE_TYPES.WORD_CLOUD) {
    if (settingsToApplyToAllQuestions.value.isMultipleEntries) {
      settingsToUpdate.isMultipleEntries =
        slideSettings.value.isMultipleEntries;
    }

    if (settingsToApplyToAllQuestions.value.entriesPerParticipant) {
      settingsToUpdate.entriesPerParticipant =
        slideSettings.value.entriesPerParticipant;
    }

    if (settingsToApplyToAllQuestions.value.isInitialSubmissionLocked) {
      settingsToUpdate.isInitialSubmissionLocked =
        slideSettings.value.isInitialSubmissionLocked;
    }

    if (settingsToApplyToAllQuestions.value.isResultsHidden) {
      settingsToUpdate.isResultsHidden = slideSettings.value.isResultsHidden;
    }
  }

  let slidesToUpdate = [];
  presentation.value.slides.map((item, index) => {
    if (item.id === slide.value.id) return;

    if (item.type !== SLIDE_TYPES.CONTENT) {
      const settings_data = JSON.stringify({
        ...JSON.parse(item.settings_data),
        ...settingsToUpdate,
      });

      slidesToUpdate.push({
        id: item.id,
        settings_data: settings_data,
      });

      presentation.value.slides[index].settings_data = settings_data;
    }
  });

  api
    .patch(`/presentation/${presentation.value.id}/slides`, {
      slides: slidesToUpdate,
    })
    .then(() => {
      $q.notify({
        message: t(
          "presentationLayout.rightDrawer.tabs.settings.appliedToAllQuestionsSuccessfully"
        ),
        icon: "r_done",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

/*
 * answer options
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

<style scoped lang="scss">
::v-deep(.q-btn-group) {
  border: 1px solid $grey-5;
}

::v-deep(.q-expansion-item) {
  .q-item {
    padding: 0 0;
    min-height: 36px;

    &:hover {
      .q-item__label {
        text-decoration: underline;
      }
    }

    .q-focus-helper {
      display: none;
    }
  }
}
</style>
