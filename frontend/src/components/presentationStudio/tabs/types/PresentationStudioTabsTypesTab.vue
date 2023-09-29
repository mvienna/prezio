<template>
  <div>
    <div
      v-for="(typesGroup, index) in Object.values(types)"
      :key="index"
      class="q-mb-lg"
    >
      <div class="text-grey">
        {{
          $t(
            `presentationLayout.rightDrawer.tabs.types.options.${
              Object.keys(types)[index]
            }.title`
          )
        }}
      </div>

      <div class="types_grid q-mt-sm">
        <q-item
          v-for="type in typesGroup"
          :key="type.name"
          class="type q-pa-sm"
          :disable="type.disable"
        >
          <div class="row justify-center">
            <q-img :src="`/assets/icons/temp/slideTypes/${type.name}.svg`" />
          </div>

          <div class="text-center text-caption q-mt-sm ellipsis">
            {{ type.label }}
          </div>

          <!-- layouts -->
          <q-menu
            v-if="type.name === 'free'"
            anchor="top left"
            self="bottom left"
            transition-show="jump-up"
            transition-hide="jump-down"
            :offset="[0, 16]"
            class="q-pa-sm"
            style="
              width: 368px;
              backdrop-filter: blur(8px);
              background: rgba(255, 255, 255, 0.5);
            "
          >
            <div class="layouts_grid q-pt-sm">
              <div
                v-for="layout in type.layouts"
                :key="layout.name"
                class="layout q-px-sm"
                :class="
                  layout.name !== 'blank' &&
                  layout.elements.every((item1) => {
                    return elements.some((item2) => item1.id === item2.id);
                  })
                    ? 'layout--active'
                    : ''
                "
                v-close-popup
                @click="handleLayoutSelection(layout)"
              >
                <div class="row justify-center">
                  <q-img
                    :src="`/assets/icons/temp/slideLayouts/${layout.name}.svg`"
                  />
                </div>

                <div
                  class="text-center text-caption q-mt-sm"
                  v-html="layout.label"
                ></div>
              </div>
            </div>
          </q-menu>
        </q-item>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
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
const { elements, canvas, MODES_OPTIONS } = storeToRefs(canvasStore);

const textStore = useCanvasTextStore();
const { customization } = storeToRefs(textStore);

/*
 * layouts
 */
const layoutDefaultElementProps = {
  mode: MODES_OPTIONS.value.text,
  isVisible: true,
  isLocked: false,
  fontFamily: customization.value.font,
  lineHeight: customization.value.lineHeight,
  fontWeight: "normal",
  textDecoration: "none",
  fontStyle: "normal",
  textAlign: ALIGNMENT.horizontal.center,
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

  width: (canvasStore.canvasRect().width * 90) / 100,
  height: 96,
};

const layoutElements = {
  /*
   * title top
   */
  titleTop: {
    ...layoutDefaultElementProps,

    id: "layout-title-top",
    text: "Click to add title",

    color: "#313232",
    fontSize: "48px",
    fontWeight: "bold",
    textAlign: ALIGNMENT.horizontal.left,

    y: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 5) / 100
    ),

    height:
      ((48 / 2 + 48 / 8) * canvas.value.width) / canvasStore.canvasRect().width,
  },

  /*
   * title center
   */
  titleCenter: {
    ...layoutDefaultElementProps,

    id: "layout-title-center",
    text: "Click to add title",

    color: "#313232",
    fontSize: "48px",
    fontWeight: "bold",
    textAlign: ALIGNMENT.horizontal.center,

    y:
      canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().height * 50) / 100
      ) -
      ((48 / 2 + 48 / 8) * canvas.value.width) / canvasStore.canvasRect().width,

    height:
      ((48 / 2 + 48 / 8) * canvas.value.width) / canvasStore.canvasRect().width,
  },

  /*
   * title center above
   */
  titleCenterAbove: {
    ...layoutDefaultElementProps,

    id: "layout-title-center-above",
    text: "Click to add title",

    color: "#313232",
    fontSize: "48px",
    fontWeight: "bold",
    textAlign: ALIGNMENT.horizontal.center,
    verticalAlign: ALIGNMENT.vertical.bottom,

    y:
      canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().height * 50) / 100
      ) -
      ((48 * 2 * canvas.value.width) / canvasStore.canvasRect().width) * 2,

    height: (48 * 2 * canvas.value.width) / canvasStore.canvasRect().width,
  },

  /*
   * subtitle center below
   */
  subtitleCenterBelow: {
    ...layoutDefaultElementProps,

    id: "layout-subtitle-center-below",
    text: "Click to add subtitle",

    color: "#808080",
    fontSize: "36px",
    textAlign: ALIGNMENT.horizontal.center,

    y:
      canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().height * 50) / 100
      ) +
      (48 * canvas.value.width) / canvasStore.canvasRect().width / 2,

    height: (48 * canvas.value.width) / canvasStore.canvasRect().width,
  },

  /*
   * body
   */
  body: {
    ...layoutDefaultElementProps,

    id: "layout-body",
    text: "Click to add body",

    fontSize: "16px",
    color: "#808080",
    textAlign: ALIGNMENT.horizontal.left,

    y: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 5) / 100 + 96
    ),

    height:
      canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().width * 5) / 100
      ) +
      canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().height * 25) / 100
      ),
  },

  /*
   * body left
   */
  bodyLeft: {
    ...layoutDefaultElementProps,

    id: "layout-body-left",
    text: "Click to add body",

    fontSize: "16px",
    color: "#808080",
    textAlign: ALIGNMENT.horizontal.left,

    y: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 5) / 100 + 96
    ),
    height:
      canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().width * 5) / 100
      ) +
      canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().height * 25) / 100
      ),
    width: (canvasStore.canvasRect().width * 45) / 100,
  },

  /*
   * body right
   */
  bodyRight: {
    ...layoutDefaultElementProps,

    id: "layout-body-right",
    text: "Click to add body",

    fontSize: "16px",
    color: "#808080",
    textAlign: ALIGNMENT.horizontal.left,

    x: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * (5 + 45 + 5)) / 100
    ),
    y: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 5) / 100 + 96
    ),

    height:
      canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().width * 5) / 100
      ) +
      canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().height * 25) / 100
      ),
    width: (canvasStore.canvasRect().width * 40) / 100,
  },
};

/*
 * types
 */
const types = {
  /*
   * content
   */
  content: [
    {
      name: "free",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.content.free"
      ),
      layouts: [
        {
          name: "blank",
          label: t(
            "presentationLayout.rightDrawer.tabs.types.options.content.layouts.blank"
          ),
          elements: [],
        },
        {
          name: "titleSlide",
          label: t(
            "presentationLayout.rightDrawer.tabs.types.options.content.layouts.titleSlide"
          ),
          elements: [
            layoutElements.titleCenterAbove,
            layoutElements.subtitleCenterBelow,
          ],
        },
        {
          name: "title",
          label: t(
            "presentationLayout.rightDrawer.tabs.types.options.content.layouts.title"
          ),
          elements: [
            {
              ...layoutElements.titleTop,
              id: layoutElements.titleTop.id + "-title",
            },
          ],
        },
        {
          name: "titleAndBody",
          label: t(
            "presentationLayout.rightDrawer.tabs.types.options.content.layouts.titleAndBody"
          ),
          elements: [
            {
              ...layoutElements.titleTop,
              id: layoutElements.titleTop.id + "-titleAndBody",
            },
            layoutElements.body,
          ],
        },
        {
          name: "titleAndTwoColumns",
          label: t(
            "presentationLayout.rightDrawer.tabs.types.options.content.layouts.titleAndTwoColumns"
          ),
          elements: [
            {
              ...layoutElements.titleTop,
              id: layoutElements.titleTop.id + "-titleAndTwoColumns",
            },
            layoutElements.bodyLeft,
            layoutElements.bodyRight,
          ],
        },
        {
          name: "titleOnly",
          label: t(
            "presentationLayout.rightDrawer.tabs.types.options.content.layouts.titleOnly"
          ),
          elements: [layoutElements.titleCenter],
        },
      ],
    },
    {
      name: "qr",
      label: t("presentationLayout.rightDrawer.tabs.types.options.content.qr"),
      disable: true,
    },
    {
      name: "video",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.content.video"
      ),
      disable: true,
    },
  ],

  /*
   * quizzes & games
   */
  quizzesAndGames: [
    {
      name: "pickAnswer",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.quizzesAndGames.pickAnswer"
      ),
      disable: true,
    },
    {
      name: "pickImage",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.quizzesAndGames.pickImage"
      ),
      disable: true,
    },
    {
      name: "typeAnswer",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.quizzesAndGames.typeAnswer"
      ),
      disable: true,
    },
    {
      name: "spinnerWheel",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.quizzesAndGames.spinnerWheel"
      ),
      disable: true,
    },
    {
      name: "matchPairs",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.quizzesAndGames.matchPairs"
      ),
      disable: true,
    },
    {
      name: "correctOrder",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.quizzesAndGames.correctOrder"
      ),
      disable: true,
    },
  ],

  /*
   * user answers
   */
  userAnswer: [
    {
      name: "poll",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.userAnswer.poll"
      ),
      disable: true,
    },
    {
      name: "openEnded",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.userAnswer.openEnded"
      ),
      disable: true,
    },
    {
      name: "wordCloud",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.userAnswer.wordCloud"
      ),
      disable: true,
    },
    {
      name: "scales",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.userAnswer.scales"
      ),
      disable: true,
    },
    {
      name: "questionsAndAnswers",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.userAnswer.questionsAndAnswers"
      ),
      disable: true,
    },
    {
      name: "brainStorm",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.userAnswer.brainStorm"
      ),
      disable: true,
    },
  ],
};

/*
 * apply layout
 */
const handleLayoutSelection = (layout) => {
  elements.value = elements.value.filter(
    (element) => !element.id.includes("layout-")
  );

  elements.value = [...elements.value, ...layout.elements];

  canvasStore.redrawCanvas();
  canvasStore.saveSlidePreview();
};
</script>

<style scoped lang="scss">
.types_grid {
  display: flex;
  flex-wrap: wrap;
  columns: 3;
  gap: 8px;

  .item:nth-last-child(-n + 2) {
    margin-bottom: 0;
  }
}

.type {
  max-width: 117px;
  width: 100%;
  display: inline-block;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 8px;
  border: 1.5px solid $grey-2;
  outline: 3px solid transparent;

  &:hover {
    outline: 3px solid $blue-2;
  }

  .q-img {
    width: 36px;
    height: 36px;
  }

  &.type--active {
    color: $black;

    .q-img {
      border: 1.5px solid $primary;
      outline: 3px solid $blue-2;
    }
  }
}

/*
 * layouts
 */
.layouts_grid {
  display: flex;
  flex-wrap: wrap;
  columns: 3;
  gap: 8px;

  .item:nth-last-child(-n + 2) {
    margin-bottom: 0;
  }
}

.layout {
  max-width: 112px;
  min-height: 104.68px;
  width: 100%;
  display: inline-block;
  cursor: pointer;
  border-radius: 16px;
  transition: 0.2s;

  .q-img {
    transition: 0.4s;
  }

  &:hover {
    .q-img {
      filter: brightness(200%) invert(100%);
    }
  }

  &.layout--active {
    color: $black;
    .text-caption {
      font-weight: 600;
    }

    .q-img {
      filter: brightness(200%) invert(100%);
    }
  }
}
</style>
