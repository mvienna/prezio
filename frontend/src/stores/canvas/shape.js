import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { generateUniqueId } from "src/helpers/generationUtils";
import {
  selectElement,
  updateSelectedElement,
} from "stores/canvas/helpers/select";

const canvasStore = useCanvasStore();
const { canvas, MODES_OPTIONS, elements, selectedElement } =
  storeToRefs(canvasStore);

export const useCanvasShapeStore = defineStore("canvasShape", {
  state: () => ({
    /*
     * customization
     */
    customization: {
      strokeColor: "#4971FF",
      fillColor: "#4971FF",
      lineWidth: "4px",
    },
  }),

  actions: {
    /*
     * add shape
     */
    addShape(
      type,
      x = null,
      y = null,
      width = null,
      height = null,
      layer = "top",
      mode = MODES_OPTIONS.value.shape,
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
      };

      if (layer === "top") {
        elements.value.unshift(shape);
      } else {
        elements.value.push(shape);
      }

      if (isForceSelectCreatedElement) {
        selectElement(shape);
      }

      canvasStore.redrawCanvas(true, true);
    },

    /*
     * customization
     */
    applyStyles() {
      if (
        selectedElement.value &&
        selectedElement.value.mode === MODES_OPTIONS.value.shape
      ) {
        selectedElement.value.strokeColor = this.customization.strokeColor;
        selectedElement.value.fillColor = this.customization.fillColor;
        selectedElement.value.lineWidth = this.customization.lineWidth;

        updateSelectedElement();
        canvasStore.redrawCanvas();
      }
    },

    loadSelectedElementCustomization() {
      this.customization.strokeColor = selectedElement.value.strokeColor;
      this.customization.fillColor = selectedElement.value.fillColor;
      this.customization.lineWidth = selectedElement.value.lineWidth;
    },
  },
});
