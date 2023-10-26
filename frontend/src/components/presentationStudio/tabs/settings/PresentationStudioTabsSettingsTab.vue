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

          <q-icon name="r_info" class="q-ml-xs">
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

    <div class="row no-wrap items-center justify-between text-semibold">
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

    <!-- entries per participant -->
    <div
      class="row no-wrap items-center justify-between text-semibold q-mt-sm q-pb-xs"
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
      :rules="entriesPerParticipantRules"
      @update:model-value="handleSlideSettingsUpdate()"
    >
      <template #prepend>
        <q-icon name="r_keyboard_return" color="dark" class="q-mr-xs" />
      </template>
    </q-input>

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
          placeholder="1"
          hide-bottom-space
          :rules="timeLimitRules"
          class="q-pb-sm"
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

    <!-- lock submission -->
    <div class="row no-wrap items-center justify-between text-semibold">
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
        v-model="slideSettings.isSubmissionLocked"
        color="primary"
        @update:model-value="handleSlideSettingsUpdate()"
      />
    </div>

    <!-- hide results -->
    <div class="row no-wrap items-center justify-between text-semibold">
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

      <div class="row no-wrap">
        <div class="column justify-center">
          <q-btn
            outline
            color="grey"
            icon="r_call_missed_outgoing"
            round
            disable
            size="sm"
          >
            <q-tooltip class="text-center" :offset="[0, 8]">
              {{
                $t(
                  "presentationLayout.rightDrawer.tabs.settings.hideResults.applyToAllQuestions"
                )
              }}
            </q-tooltip>
          </q-btn>
        </div>

        <q-toggle
          v-model="slideSettings.isResultsHidden"
          color="primary"
          @update:model-value="handleSlideSettingsUpdate()"
        />
      </div>
    </div>
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

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { elements, MODE_OPTIONS } = storeToRefs(canvasStore);

const textStore = useCanvasTextStore();
const { customization } = storeToRefs(textStore);

const presentationsStore = usePresentationsStore();
const { slide, slideSettings } = storeToRefs(presentationsStore);

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

  isMultipleEntries: false,
  entriesPerParticipant: 3,

  isLimitedTime: true,
  timeLimit: 40,

  isSubmissionLocked: true,
  isResultsHidden: false,
};

const handleSlideSettingsUpdate = () => {
  if (
    !isEntriesPerParticipantValid(
      Number(slideSettings.value.entriesPerParticipant)
    ) ||
    !isTimeLimitValid(Number(slideSettings.value.timeLimit))
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
  return val >= 5;
};

const timeLimitRules = [
  (val) =>
    isTimeLimitValid(val) ||
    t("presentationLayout.rightDrawer.tabs.settings.timeLimit.invalid"),
];
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
