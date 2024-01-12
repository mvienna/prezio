<template>
  <div class="q-pa-sm">
    <div class="text-grey q-mb-md">
      {{ $t("presentationStudio.toolbar.layouts.title") }}
    </div>

    <div class="layouts_wrapper">
      <q-card
        v-for="layout in layouts"
        :key="layout.name"
        class="layout"
        flat
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
        <q-card-section class="q-pa-sm">
          <div class="row no-wrap justify-center">
            <q-img
              :src="`/assets/icons/slide/layouts/${layout.name}${
                layout.name !== 'blank' &&
                layout.elements.every((item1) => {
                  return elements.some((item2) => item1.id === item2.id);
                })
                  ? '--active'
                  : ''
              }.svg`"
            />
          </div>

          <div class="text-center text-13 q-mt-sm">
            {{ layout.label }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ALIGNMENT } from "src/constants/canvas/canvasVariables";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";
import { useCanvasTextStore } from "stores/canvas/text";
import { useI18n } from "vue-i18n";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { elements, canvas, MODE_OPTIONS } = storeToRefs(canvasStore);

const textStore = useCanvasTextStore();
const { customization } = storeToRefs(textStore);

/*
 * layout default element props
 */
const layoutDefaultElementProps = {
  mode: MODE_OPTIONS.value.text,
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
};

/*
 * layout elements
 */
const layoutElements = {
  /*
   * title top
   */
  titleTop: {
    ...layoutDefaultElementProps,

    id: "layout-title-top",
    text: t("presentationStudio.layouts.defaultTexts.title"),

    color: "#313232",
    fontSize: "68px",
    fontWeight: "bold",
    textAlign: ALIGNMENT.horizontal.left,

    y: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 5) / 100
    ),
  },

  /*
   * title center
   */
  titleCenter: {
    ...layoutDefaultElementProps,

    id: "layout-title-center",
    text: t("presentationStudio.layouts.defaultTexts.title"),

    color: "#313232",
    fontSize: "68px",
    fontWeight: "bold",
    textAlign: ALIGNMENT.horizontal.center,

    y:
      canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().height * 50) / 100
      ) -
      ((48 / 2 + 48 / 8) * canvas.value.width) / canvasStore.canvasRect().width,
  },

  /*
   * title center above
   */
  titleCenterAbove: {
    ...layoutDefaultElementProps,

    id: "layout-title-center-above",
    text: t("presentationStudio.layouts.defaultTexts.title"),

    color: "#313232",
    fontSize: "68px",
    fontWeight: "bold",
    textAlign: ALIGNMENT.horizontal.center,
    verticalAlign: ALIGNMENT.vertical.bottom,

    y:
      canvasStore.computeAdjustedSize(
        (canvasStore.canvasRect().height * 50) / 100
      ) -
      (48 * canvas.value.width) / canvasStore.canvasRect().width,
  },

  /*
   * subtitle center below
   */
  subtitleCenterBelow: {
    ...layoutDefaultElementProps,

    id: "layout-subtitle-center-below",
    text: t("presentationStudio.layouts.defaultTexts.subtitle"),

    color: "#808080",
    fontSize: "38px",
    textAlign: ALIGNMENT.horizontal.center,

    y: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().height * 50) / 100
    ),
  },

  /*
   * body
   */
  body: {
    ...layoutDefaultElementProps,

    id: "layout-body",
    text: t("presentationStudio.layouts.defaultTexts.body"),

    fontSize: "38px",
    color: "#808080",
    textAlign: ALIGNMENT.horizontal.left,

    y: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 5) / 100 + 48
    ),
  },

  /*
   * body left
   */
  bodyLeft: {
    ...layoutDefaultElementProps,

    id: "layout-body-left",
    text: t("presentationStudio.layouts.defaultTexts.body"),

    fontSize: "38px",
    color: "#808080",
    textAlign: ALIGNMENT.horizontal.left,

    y: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 5) / 100 + 48
    ),
    width: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 45) / 100
    ),
  },

  /*
   * body right
   */
  bodyRight: {
    ...layoutDefaultElementProps,

    id: "layout-body-right",
    text: t("presentationStudio.layouts.defaultTexts.body"),

    fontSize: "38px",
    color: "#808080",
    textAlign: ALIGNMENT.horizontal.left,

    x: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * (45 + 5)) / 100
    ),
    y: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 5) / 100 + 48
    ),

    width: canvasStore.computeAdjustedSize(
      (canvasStore.canvasRect().width * 45) / 100
    ),
  },
};

/*
 * layouts
 */
const layouts = [
  {
    name: "blank",
    label: t("presentationStudio.toolbar.layouts.options.blank"),
    elements: [],
  },
  {
    name: "titleSlide",
    label: t("presentationStudio.toolbar.layouts.options.titleSlide"),
    elements: [
      layoutElements.titleCenterAbove,
      layoutElements.subtitleCenterBelow,
    ],
  },
  {
    name: "title",
    label: t("presentationStudio.toolbar.layouts.options.title"),
    elements: [
      {
        ...layoutElements.titleTop,
        id: layoutElements.titleTop.id + "-title",
      },
    ],
  },
  {
    name: "titleAndBody",
    label: t("presentationStudio.toolbar.layouts.options.titleAndBody"),
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
    label: t("presentationStudio.toolbar.layouts.options.titleAndTwoColumns"),
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
    label: t("presentationStudio.toolbar.layouts.options.titleOnly"),
    elements: [layoutElements.titleCenter],
  },
];

/*
 * apply layout
 */
const handleLayoutSelection = (layout) => {
  const previousLayoutElements = elements.value.filter((element) =>
    element.id.includes("layout-")
  );
  const previousLayoutTitle = previousLayoutElements.find((element) =>
    element.id.includes("-title-")
  );

  layout.elements = layout.elements.map((element) => {
    if (element.id.includes("-title-") && previousLayoutTitle) {
      element.text = previousLayoutTitle.text;
    }
    return element;
  });

  elements.value = elements.value.filter(
    (element) => !element.id.includes("layout-")
  );

  elements.value = [...elements.value, ...layout.elements];

  canvasStore.redrawCanvas();
  canvasStore.saveSlidePreview();
};
</script>

<style scoped lang="scss">
.layouts_wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  .layout {
    cursor: pointer;
    border-radius: 6px;
    transition: 0.2s;
    outline: 1px solid transparent;

    .q-img {
      transition: 0.4s;
    }

    &:hover {
      background: $background;
      outline-color: $accent;
    }

    &.layout--active {
      color: $secondary;
      background: #f5f8fd;

      .text-caption {
        font-weight: 600;
      }

      .q-img {
        //filter: brightness(200%);
      }
    }
  }
}
</style>
