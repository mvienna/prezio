<template>
  <div>
    <!-- title -->
    <div class="row no-wrap items-center justify-between">
      <div class="text-semibold">
        {{
          slide?.type === SLIDE_TYPES.LEADERBOARD
            ? $t("presentationLayout.rightDrawer.tabs.settings.slideTitle")
            : $t("presentationLayout.rightDrawer.tabs.settings.question.title")
        }}
      </div>
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

    <template v-if="slide?.type !== SLIDE_TYPES.LEADERBOARD">
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
          debounce="1000"
          @update:model-value="$emit('updateSlideSettings')"
        />
      </q-expansion-item>

      <q-separator class="q-my-md" />
    </template>
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
