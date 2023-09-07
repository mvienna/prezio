import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { generateUniqueId } from "src/helpers/generateUniqueId";
import { updateSelectedElement } from "stores/canvas/helpers/select";

const canvasStore = useCanvasStore();
const { canvas, MODES_OPTIONS, elements, selectedElement } =
  storeToRefs(canvasStore);

export const useCanvasShapeStore = defineStore("canvasShape", {
  state: () => ({
    /*
     * customization
     */
    customization: {
      color: "#000000",
      fill: null,
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
        type: type,
        x,
        y,
        width: newImageWidth,
        height: newImageHeight,
        rotationAngle: 0,
        color: this.customization.color,
        fill: this.customization.fill,
        lineWidth: this.customization.lineWidth,
      };

      elements.value.push(shape);
      canvasStore.redrawCanvas();
    },

    /*
     * customization
     */
    applyStyles() {
      if (
        selectedElement.value &&
        selectedElement.value.mode === MODES_OPTIONS.value.shape
      ) {
        selectedElement.value.color = this.customization.color;
        selectedElement.value.fill = this.customization.fill;
        selectedElement.value.lineWidth = this.customization.lineWidth;

        updateSelectedElement();
        canvasStore.redrawCanvas();
      }
    },

    loadSelectedElementCustomization() {
      this.customization.color = selectedElement.value.color;
      this.customization.fill = selectedElement.value.fill;
      this.customization.lineWidth = selectedElement.value.lineWidth;
    },
  },
});
