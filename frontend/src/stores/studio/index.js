import { defineStore, storeToRefs } from "pinia";
import {
  COLOR_PALETTE,
  DRAWING_MODES,
  LAYOUT_OPTIONS,
} from "src/constants/canvas/canvasVariables";
import Konva from "konva";
import { fetchAndConvertToBase64Image } from "src/helpers/imageUtils";
import { usePresentationsStore } from "stores/presentations";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import { i18n } from "src/boot/i18n";

import * as design from "./actions/design";
import * as update from "./actions/update";
import * as scale from "./actions/scale";

import * as snapping from "./actions/snapping";
import * as selection from "./actions/selection";

import * as nodes from "./actions/nodes";
import * as shortcuts from "./actions/shortcuts";

import * as customization from "./actions/modes/customization";
import * as image from "./actions/modes/image";
import * as drawing from "./actions/modes/drawing";
import * as shape from "./actions/modes/shape";
import * as text from "./actions/modes/text";

const presentationsStore = usePresentationsStore();
const { slide, slideSettings } = storeToRefs(presentationsStore);

export const useStudioStore = defineStore("studio", {
  state: () => ({
    scene: {
      width: 1920,
      height: 1080,
    },
    stages: {
      default: null,
    },

    isLoaded: false,
    isListening: true,

    /*
     * zoom
     */
    zoom: {
      coefficient: 1.2,
      min: null,
      max: 3,
      OPTIONS: [1, 1.25, 1.5, 2, 2.5, 3],
    },

    /*
     * layers
     */
    layers: {
      default: null, // default stage
      base: null, // default stage
    },

    /*
     * transformer
     */
    transformer: {
      default: null,
      custom: {
        shape: {
          node: null,
          anchor1: null,
          anchor2: null,
        },
      },
    },

    /*
     * history
     */
    history: {
      STACK_LIMIT: 20,
      undo: [],
      redo: [],
    },

    /*
     * selection
     * snapping
     * copies
     */
    selection: {
      isSelecting: false,

      rect: null,
      x1: null,
      y1: null,
      x2: null,
      y2: null,
    },
    isTransforming: false,
    snapping: {
      GUIDELINE_OFFSET: 5,
    },
    copiedNodes: [],

    /*
     * modes
     */
    mode: null,
    MODE_OPTIONS: {
      DRAWING: "Drawing",
      IMAGE: "Image",
      SHAPE: "Shape",
      TEXT: "Text",
      TEXT_EDITING: "Text-Editing",
      EMOJI: "Emoji",
    },

    /*
     * drawing
     */
    drawing: {
      isPainting: false,
      lastLine: null,

      mode: DRAWING_MODES.BRUSH,
      stroke: COLOR_PALETTE.PRIMARY,
      strokeWidth: 16,

      default: {
        mode: DRAWING_MODES.BRUSH,
        stroke: COLOR_PALETTE.PRIMARY,
        strokeWidth: 16,
      },
    },

    /*
     * image
     */
    image: {
      opacity: 1,
      cornerRadius: 0,
      stroke: COLOR_PALETTE.PRIMARY,
      strokeWidth: 0.1,
      shadowColor: COLOR_PALETTE.BLACK,
      shadowBlur: 0,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0,
      clipPosition: "centerMiddle",
      dash: [10, 0],

      default: {
        opacity: 1,
        cornerRadius: 0,
        stroke: COLOR_PALETTE.PRIMARY,
        strokeWidth: 0.1,
        shadowColor: COLOR_PALETTE.BLACK,
        shadowBlur: 0,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0,
        clipPosition: "centerMiddle",
        dash: [10, 0],
      },
    },

    /*
     * shape
     */
    shape: {
      fill: COLOR_PALETTE.PRIMARY,
      stroke: COLOR_PALETTE.PRIMARY,
      strokeWidth: 0,
      opacity: 1,
      shadowColor: COLOR_PALETTE.BLACK,
      shadowBlur: 0,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0,
      cornerRadius: 0,
      pointerSize: 12,
      fillLinearGradientColorStops: [
        0,
        COLOR_PALETTE.PRIMARY,
        1,
        COLOR_PALETTE.SECONDARY,
      ],
      dash: [10, 0],

      default: {
        fill: COLOR_PALETTE.PRIMARY,
        stroke: COLOR_PALETTE.PRIMARY,
        strokeWidth: 0,
        opacity: 1,
        shadowColor: COLOR_PALETTE.BLACK,
        shadowBlur: 0,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0,
        cornerRadius: 0,
        pointerSize: 12,
        fillLinearGradientColorStops: [
          0,
          COLOR_PALETTE.PRIMARY,
          1,
          COLOR_PALETTE.SECONDARY,
        ],
        dash: [10, 0],
      },
    },

    /*
     * text
     */
    text: {
      fontFamily: "Arial",
      fontSize: 38,
      fontStyle: "normal", // normal, italic, bold (can be combined by ' ')
      textDecoration: "", // line-through, underline
      align: "left", // left, center, right
      verticalAlign: "", // top, middle, bottom
      fill: COLOR_PALETTE.BLACK,

      // todo: add customization to toolbar
      padding: 16,
      lineHeight: 1,
      wrap: "word", // word, char, none
      ellipsis: false,
      stroke: COLOR_PALETTE.BLACK,
      strokeWidth: 0,
      shadowColor: COLOR_PALETTE.BLACK,
      shadowBlur: 0,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0,
      opacity: 1,

      default: {
        fontFamily: "Arial",
        fontSize: 38,
        fontStyle: "normal", // normal, italic, bold (can be combined by ' ')
        textDecoration: "", // line-through, underline
        align: "left", // left, center, right
        verticalAlign: "", // top, middle, bottom
        padding: 16,
        lineHeight: 1,
        wrap: "word", // word, char, none
        ellipsis: false,
        fill: COLOR_PALETTE.BLACK,
        stroke: COLOR_PALETTE.BLACK,
        strokeWidth: 0,
        shadowColor: COLOR_PALETTE.BLACK,
        shadowBlur: 0,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0,
        opacity: 1,
      },
    },
    showTitleTooltip: false,
  }),

  actions: {
    ...design,
    ...update,
    ...scale,

    ...snapping,
    ...selection,

    ...shortcuts,
    ...nodes,

    /*
     * modes
     */
    ...customization,
    ...image,
    ...drawing,
    ...shape,
    ...text,

    async loadStudio() {
      return await new Promise((resolve) => {
        this.isLoaded = false;

        /*
         * load slide
         */
        if (slide.value?.canvas_data) {
          // load stage
          this.stages.default = Konva.Node.create(
            slide.value.canvas_data,
            "container",
          );

          // load layers
          this.layers.default = this.stages.default.findOne(".defaultLayer");
          this.layers.base = this.stages.default.findOne(".baseLayer");

          // load & process images
          this.stages.default
            .find(this.MODE_OPTIONS.IMAGE)
            .forEach(async (node) => {
              const imageObj = new Image();
              const url = node.getAttr("source");

              let base64;

              if (url.includes("http")) {
                base64 = await fetchAndConvertToBase64Image(url);
                imageObj.src = base64;
              } else {
                imageObj.src = url;
              }

              imageObj.onload = () => {
                node.image(imageObj);

                if (node.getLayer().attrs.name === "defaultLayer") {
                  this.processImageNode(
                    node,
                    url,
                    node.getAttr("lastCropUsed"),
                  );
                } else {
                  this.applyBaseBackgroundFilters(node);
                }
              };
            });

          // process text
          this.stages.default
            .find(this.MODE_OPTIONS.TEXT)
            .forEach(async (node) => {
              this.processText(node);
            });

          this.layers.default
            .getChildren()
            .filter((node) =>
              Object.values(this.MODE_OPTIONS).includes(node.getAttr("name")),
            )
            .forEach((node) => {
              node.on("transformend", this.handleSlideUpdate);
            });

          // set default text customization
          if (slideSettings.value.defaultTextCustomization) {
            this.text.default = slideSettings.value.defaultTextCustomization;
          }

          /*
           * new slide
           */
        } else {
          // create stage
          this.stages.default = new Konva.Stage({
            container: "container",
            width: this.scene.width,
            height: this.scene.height,
          });

          // create base layer
          this.layers.base = new Konva.Layer({
            name: "baseLayer",
          });
          this.stages.default.add(this.layers.base);

          // create base fill rect
          const baseFill = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.scene.width,
            height: this.scene.height,
            fill: COLOR_PALETTE.WHITE,
            listening: false,
            name: "baseFill",
          });
          this.layers.base.add(baseFill);

          // create default layer
          this.layers.default = new Konva.Layer({
            name: "defaultLayer",
          });
          this.stages.default.add(this.layers.default);

          // create default nodes for slide
          this.createDefaultNodesForSlide();
        }

        this.stages.default.listening(this.isListening);

        // fit canvas
        window.addEventListener("resize", this.fitStageIntoParentContainer);
        this.fitStageIntoParentContainer();

        if (this.isListening) {
          // handlers
          this.stages.default.on("dragend", this.handleSlideUpdate);

          this.stages.default.on("wheel", this.handleZoom);

          document.removeEventListener("keydown", this.handleShortcuts);
          document.addEventListener("keydown", this.handleShortcuts);

          if (slide.value.type === SLIDE_TYPES.CONTENT) {
            this.handleSelection();
            this.handleSnapping();

            this.handleDrawing();
          }
        }

        this.isLoaded = true;
        resolve();
      });
    },

    createDefaultNodesForSlide() {
      // add default nodes for content-type slide
      if (slide.value.type === SLIDE_TYPES.CONTENT) {
        this.setLayout(LAYOUT_OPTIONS.title);
      }

      // add default nodes for leaderboard or quiz type slide
      if (
        [
          ...SLIDE_TYPES_OF_QUIZ,
          SLIDE_TYPES.WORD_CLOUD,
          SLIDE_TYPES.LEADERBOARD,
        ].includes(slide.value.type)
      ) {
        this.addText(
          {
            text: i18n.global.t(
              `presentationStudio.layouts.defaultTexts.${slide.value.type === SLIDE_TYPES.LEADERBOARD ? "leaderboard" : "question"}`,
            ),
            x: 64,
            y: 100,
            fontSize: 70,
            align: "center",
            width: this.scene.width - 64 * 2,
            fontStyle: "bold",
            draggable: false,
          },
          false,
        );
      }
    },
  },
});
