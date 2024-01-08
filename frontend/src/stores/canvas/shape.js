import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { generateUniqueId } from "src/helpers/generationUtils";
import {
  selectElement,
  syncSelectedElementWithStoredElements,
} from "stores/canvas/helpers/select";
import { computeAverageBrightness } from "src/helpers/colorUtils";
import { usePresentationsStore } from "stores/presentations";

const canvasStore = useCanvasStore();
const { canvas, MODE_OPTIONS, elements, selectedElement } =
  storeToRefs(canvasStore);

const presentationsStore = usePresentationsStore();
const { averageBackgroundBrightness, slide } = storeToRefs(presentationsStore);

export const useCanvasShapeStore = defineStore("canvasShape", {
  state: () => ({
    /*
     * customization
     */
    customization: {
      strokeColor: "#1751D0",
      fillColor: "#1751D0",
      fillColor2: "#bc49ff",
      fillStyle: "solid",
      lineWidth: "16px",

      shadowColor: "#000000",
      shadowOpacity: 0,
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 0,

      opacity: 100,

      default: {
        strokeColor: "#1751D0",
        fillColor: "#1751D0",
        fillColor2: "#bc49ff",
        fillStyle: "solid",
        lineWidth: "16px",

        shadowColor: "#000000",
        shadowOpacity: 0,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,

        opacity: 100,
      },
    },
  }),

  actions: {
    /*
     * add shape
     */
    async addShape(
      type,
      x = null,
      y = null,
      width = null,
      height = null,
      layer = "top",
      mode = MODE_OPTIONS.value.shape,
      isLocked = false,
      strokeColor = this.customization.default.strokeColor,
      fillColor = this.customization.default.fillColor,
      lineWidth = this.customization.default.lineWidth,
      isForceSelectCreatedElement = true
    ) {
      width =
        typeof width === "number"
          ? width
          : canvasStore.computeAdjustedSize(100);
      height =
        typeof height === "number"
          ? height
          : canvasStore.computeAdjustedSize(100);

      x = typeof x === "number" ? x : (canvas.value.width - width) / 2;
      y = typeof y === "number" ? y : (canvas.value.height - height) / 2;

      console.log(lineWidth);
      let shape = {
        id: generateUniqueId(undefined, elements.value),
        mode,
        isVisible: true,
        isLocked,
        type,
        x,
        y,
        width,
        height,
        rotationAngle: 0,
        strokeColor,
        fillColor,
        fillColor2: this.customization.default.fillColor2,
        fillStyle: this.customization.default.fillStyle,
        lineWidth,
        shadowColor: this.customization.default.shadowColor,
        shadowOpacity: this.customization.default.shadowOpacity,
        shadowBlur: this.customization.default.shadowBlur,
        shadowOffsetX: this.customization.default.shadowOffsetX,
        shadowOffsetY: this.customization.default.shadowOffsetY,
        opacity: this.customization.default.opacity,
      };

      if (layer === "top") {
        elements.value.unshift(shape);
      } else {
        elements.value.push(shape);
      }

      if (mode === MODE_OPTIONS.value.baseFill) {
        averageBackgroundBrightness.value = await computeAverageBrightness(
          elements.value
        );
        slide.value.previewAverageBrightness =
          averageBackgroundBrightness.value;
        presentationsStore.syncCurrentSlideWithPresentationSlides();
      }

      if (isForceSelectCreatedElement) {
        selectElement(shape);
      }

      canvasStore.redrawCanvas();
    },

    /*
     * customization
     */
    applyStyles() {
      if (
        selectedElement.value &&
        selectedElement.value.mode === MODE_OPTIONS.value.shape
      ) {
        selectedElement.value.strokeColor = this.customization.strokeColor;
        selectedElement.value.fillColor = this.customization.fillColor;
        selectedElement.value.fillColor2 = this.customization.fillColor2;
        selectedElement.value.fillStyle = this.customization.fillStyle;
        selectedElement.value.lineWidth = this.customization.lineWidth;

        selectedElement.value.shadowColor = this.customization.shadowColor;
        selectedElement.value.shadowOpacity = this.customization.shadowOpacity;
        selectedElement.value.shadowBlur = this.customization.shadowBlur;
        selectedElement.value.shadowOffsetX = this.customization.shadowOffsetX;
        selectedElement.value.shadowOffsetY = this.customization.shadowOffsetY;

        selectedElement.value.opacity = this.customization.opacity;

        syncSelectedElementWithStoredElements();
        canvasStore.redrawCanvas();
      }
    },

    loadSelectedElementCustomization() {
      this.customization.strokeColor =
        selectedElement.value.strokeColor ||
        this.customization.default.strokeColor;
      this.customization.fillColor =
        selectedElement.value.fillColor || this.customization.default.fillColor;
      this.customization.fillColor2 =
        selectedElement.value.fillColor2 ||
        this.customization.default.fillColor2;
      this.customization.fillStyle =
        selectedElement.value.fillStyle || this.customization.default.fillStyle;
      this.customization.lineWidth =
        selectedElement.value.lineWidth || this.customization.default.lineWidth;

      this.customization.shadowColor =
        selectedElement.value.shadowColor ||
        this.customization.default.shadowColor;
      this.customization.shadowOpacity =
        selectedElement.value.shadowOpacity ||
        this.customization.default.shadowOpacity;
      this.customization.shadowBlur =
        selectedElement.value.shadowBlur ||
        this.customization.default.shadowBlur;
      this.customization.shadowOffsetX =
        selectedElement.value.shadowOffsetX ||
        this.customization.default.shadowOffsetX;
      this.customization.shadowOffsetY =
        selectedElement.value.shadowOffsetY ||
        this.customization.default.shadowOffsetY;

      this.customization.opacity =
        selectedElement.value.opacity || this.customization.default.opacity;
    },
  },
});
