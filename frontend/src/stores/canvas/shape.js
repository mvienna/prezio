import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { generateUniqueId } from "src/helpers/generateUniqueId";
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
    addShape(type) {
      const width = 100;
      const height = 100;

      const newImageHeight = canvas.value.height * 0.5;
      const aspectRatio = width / height;
      const newImageWidth = newImageHeight * aspectRatio;

      const x = (canvas.value.width - newImageWidth) / 2;
      const y = (canvas.value.height - newImageHeight) / 2;

      let shape = {
        id: generateUniqueId(undefined, elements.value),
        mode: MODES_OPTIONS.value.shape,
        isVisible: true,
        isLocked: false,
        type: type,
        x,
        y,
        width: newImageWidth,
        height: newImageHeight,
        rotationAngle: 0,
        strokeColor: this.customization.strokeColor,
        fillColor: this.customization.fillColor,
        lineWidth: this.customization.lineWidth,
      };

      elements.value.unshift(shape);
      selectElement(shape);
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
