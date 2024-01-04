<template>
  <div>
    <!-- title -->
    <div class="row no-wrap items-center">
      <div>
        {{
          slide?.type === SLIDE_TYPES.LEADERBOARD
            ? $t("presentationLayout.rightDrawer.tabs.settings.info.title")
            : $t("presentationLayout.rightDrawer.tabs.settings.info.question")
        }}
      </div>
      <q-icon name="r_help" color="grey" class="q-ml-sm" />
    </div>

    <!-- question -->
    <q-input
      v-model="question"
      outlined
      dense
      class="q-mt-sm"
      debounce="500"
      @update:model-value="handleQuestionInput()"
    >
      <template #append>
        <!-- length -->
        <div class="text-sm q-mr-xs">{{ 250 - question?.length }}</div>

        <!-- alignment -->
        <q-btn
          flat
          round
          size="10px"
          color="black"
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
    </q-input>

    <!-- description -->
    <q-expansion-item
      v-if="slide?.type !== SLIDE_TYPES.LEADERBOARD"
      class="q-mt-md q-mb-lg text-primary"
    >
      <template #header>
        <div class="row no-wrap items-center">
          <div class="q-item__label link">
            {{
              $t(
                "presentationLayout.rightDrawer.tabs.settings.info.description.label"
              )
            }}
          </div>
        </div>

        <q-space />
      </template>

      <div class="text-black q-mt-sm">
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.settings.info.description.title"
          )
        }}
      </div>
      <div class="text-grey text-caption q-mt-xs">
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.settings.info.description.caption"
          )
        }}
      </div>

      <q-input
        v-model="slideSettings.description"
        :placeholder="
          $t(
            'presentationLayout.rightDrawer.tabs.settings.info.description.placeholder'
          )
        "
        outlined
        dense
        autogrow
        :rows="4"
        class="q-mt-md"
        debounce="1000"
        @update:model-value="$emit('updateSlideSettings')"
      />
    </q-expansion-item>
  </div>
</template>

<script setup>
import { ALIGNMENT } from "src/constants/canvas/canvasVariables";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useCanvasTextStore } from "stores/canvas/text";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";
import { usePresentationsStore } from "stores/presentations";
import { useI18n } from "vue-i18n";
import { SLIDE_TYPES } from "src/constants/presentationStudio";

/*
 * emits
 */
defineEmits(["updateSlideSettings"]);

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

onBeforeMount(() => {
  question.value = layoutTitle.value?.text;
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

      fontSize: "68px",
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
      fontSize: "68px",
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
</script>

<style scoped lang="scss">
::v-deep(.q-btn-group) {
  border: 1px solid $grey;
}

::v-deep(.q-expansion-item) {
  .q-item {
    padding: 0 0;
    min-height: 24px;

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

::v-deep(.q-textarea .q-field__control),
::v-deep(.q-textarea .q-field__native) {
  min-height: 100px !important;
}
</style>
