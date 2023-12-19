import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { generateUniqueId } from "src/helpers/generationUtils";
import {
  selectElement,
  updateSelectedElement,
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
      strokeColor: "#4971FF",
      fillColor: "#4971FF",
      lineWidth: "4px",

      shadowColor: "#000000",
      shadowOpacity: 50,
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 0,

      opacity: 100,
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
      strokeColor = this.customization.strokeColor,
      fillColor = this.customization.fillColor,
      lineWidth = this.customization.lineWidth,
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

      let shape = {
        id: generateUniqueId(undefined, elements.value),
        mode: mode,
        isVisible: true,
        isLocked: isLocked,
        type: type,
        x,
        y,
        width: width,
        height: height,
        rotationAngle: 0,
        strokeColor: strokeColor,
        fillColor: fillColor,
        lineWidth: lineWidth,
        shadowColor: this.customization.shadowColor,
        shadowOpacity: this.customization.shadowOpacity,
        shadowBlur: this.customization.shadowBlur,
        shadowOffsetX: this.customization.shadowOffsetX,
        shadowOffsetY: this.customization.shadowOffsetY,
        opacity: this.customization.opacity,
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
        selectedElement.value.lineWidth = this.customization.lineWidth;

        selectedElement.value.shadowColor = this.customization.shadowColor;
        selectedElement.value.shadowOpacity = this.customization.shadowOpacity;
        selectedElement.value.shadowBlur = this.customization.shadowBlur;
        selectedElement.value.shadowOffsetX = this.customization.shadowOffsetX;
        selectedElement.value.shadowOffsetY = this.customization.shadowOffsetY;

        selectedElement.value.opacity = this.customization.opacity;

        updateSelectedElement();
        canvasStore.redrawCanvas();
      }
    },

    loadSelectedElementCustomization() {
      this.customization.strokeColor = selectedElement.value.strokeColor;
      this.customization.fillColor = selectedElement.value.fillColor;
      this.customization.lineWidth = selectedElement.value.lineWidth;

      this.customization.shadowColor = selectedElement.value.shadowColor;
      this.customization.shadowOpacity = selectedElement.value.shadowOpacity;
      this.customization.shadowBlur = selectedElement.value.shadowBlur;
      this.customization.shadowOffsetX = selectedElement.value.shadowOffsetX;
      this.customization.shadowOffsetY = selectedElement.value.shadowOffsetY;

      this.customization.opacity = selectedElement.value.opacity;
    },
  },
});
