<template>
  <div class="layouts_grid q-pt-sm">
    <div
      v-for="layout in layouts"
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
      @click="$emit('select', layout)"
    >
      <div class="row justify-center">
        <q-img :src="`/assets/icons/temp/slideLayouts/${layout.name}.svg`" />
      </div>

      <div class="text-center text-caption q-mt-sm" v-html="layout.label"></div>
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
 * emits
 */
defineEmits(["select"]);

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { elements, canvas, MODES_OPTIONS } = storeToRefs(canvasStore);

const textStore = useCanvasTextStore();
const { customization } = storeToRefs(textStore);

/*
 * layout default element props
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
 * layouts
 */
const layouts = [
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
];
</script>

<style scoped lang="scss">
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
