import { defineStore, storeToRefs } from "pinia";
import {
  COLOR_PALETTE,
  DRAWING_MODES,
} from "src/constants/canvas/canvasVariables";
import Konva from "konva";
import { fetchAndConvertToBase64Image } from "src/helpers/imageUtils";
import { usePresentationsStore } from "stores/presentations";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";

import * as design from "./actions/design";
import * as update from "./actions/update";
import * as zoom from "./actions/zoom";

import * as snapping from "./actions/snapping";
import * as selection from "./actions/selection";

import * as nodes from "./actions/nodes";
import * as shortcuts from "./actions/shortcuts";

import * as customization from "./actions/modes/customization";
import * as image from "./actions/modes/image";
import * as drawing from "./actions/modes/drawing";
import * as shape from "./actions/modes/shape";

const presentationsStore = usePresentationsStore();
const { slide } = storeToRefs(presentationsStore);

export const useStudioStore = defineStore("studio", {
  state: () => ({
    scene: {
      width: 1920,
      height: 1080,
    },
    stages: {
      default: null,
      // preview: null,
    },

    /*
     * zoom
     */
    zoom: {
      coefficient: 1.2,
      min: null,
      max: 3,
    },

    /*
     * layers
     */
    layers: {
      default: null, // default stage
      base: null, // default stage
      // preview: null, // preview stage
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
    snapping: {
      GUIDELINE_OFFSET: 5,
    },
    copiedNodes: [],

    /*
     * modes
     */
    mode: null,
    MODE_OPTIONS: {
      drawing: "Drawing",
      image: "Image",
      shape: "Shape",
      text: "Text",
      emoji: "Emoji",
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
      cornerRadius: 6,
      stroke: COLOR_PALETTE.PRIMARY,
      strokeWidth: 0.1,
      shadowColor: COLOR_PALETTE.BLACK,
      shadowBlur: 0,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0,
      clipPosition: "centerMiddle",

      default: {
        opacity: 1,
        cornerRadius: 6,
        stroke: COLOR_PALETTE.PRIMARY,
        strokeWidth: 0.1,
        shadowColor: COLOR_PALETTE.BLACK,
        shadowBlur: 0,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0,
        clipPosition: "centerMiddle",
      },
    },

    /*
     * shapes
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
      cornerRadius: 6,
      pointerSize: 75,

      default: {
        fill: COLOR_PALETTE.PRIMARY,
        stroke: COLOR_PALETTE.PRIMARY,
        strokeWidth: 0,
        opacity: 1,
        shadowColor: COLOR_PALETTE.BLACK,
        shadowBlur: 0,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0,
        cornerRadius: 6,
        pointerSize: 75,
      },
    },
  }),

  actions: {
    ...design,
    ...update,
    ...zoom,

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

    loadStudio() {
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

        // load images
        this.stages.default.find("Image").forEach(async (node) => {
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
              this.processImageNode(node, url, node.getAttr("lastCropUsed"));
            } else {
              this.applyBaseBackgroundFilters(node);
            }
          };
        });

        this.layers.default.getChildren().forEach((node) => {
          node.on("transformend", this.handleSlideUpdate);
        });

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

        // TODO:
        // add default nodes for content-type slide
        if (slide.value.type === SLIDE_TYPES.CONTENT) {
        }

        // TODO:
        // add default nodes for leaderboard-type slide
        if (slide.value.type === SLIDE_TYPES.LEADERBOARD) {
        }

        // TODO:
        // add default nodes for quiz-type slide
        if (SLIDE_TYPES_OF_QUIZ.includes(slide.value.type)) {
        }
      }

      // fit canvas
      window.addEventListener("resize", this.fitStageIntoParentContainer);
      this.fitStageIntoParentContainer();

      // handlers
      this.stages.default.on("dragend", this.handleSlideUpdate);

      this.stages.default.on("wheel", this.handleZoom);

      document.removeEventListener("keydown", this.handleShortcuts);
      document.addEventListener("keydown", this.handleShortcuts);

      this.handleSelection();
      this.handleSnapping();

      this.handleDrawing();
    },
  },
});
