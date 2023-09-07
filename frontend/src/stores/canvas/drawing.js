import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { generateUniqueId } from "src/helpers/generateUniqueId";
import { updateSelectedElement } from "stores/canvas/helpers/select";

const { ctx, elements, mouse, MODES_OPTIONS, selectedElement } = storeToRefs(
  useCanvasStore()
);
const canvasStore = useCanvasStore();

export const useCanvasDrawingStore = defineStore("canvasDrawing", {
  state: () => ({
    /*
     * lines
     */
    currentLine: null,

    last: {
      x: null,
      y: null,
    },

    /*
     * states
     */
    isDrawing: false,
    eraserMode: false,

    /*
     * customization
     */
    customization: {
      color: "#000000",
      brushSize: 10,
      selectedBrushType: "pen",
    },
  }),

  actions: {
    redrawCanvas() {
      canvasStore.redrawCanvas();
    },

    /*
     * drawing
     */
    startDrawing() {
      this.isDrawing = true;
      ctx.value.strokeStyle = this.customization.color;
    },

    stopDrawing() {
      this.isDrawing = false;
      this.last.x = null;
      this.last.y = null;

      ctx.value.beginPath();
      this.currentLine = null;
    },

    draw() {
      if (!this.isDrawing) return;

      if (this.last.x !== null && this.last.y !== null) {
        const deltaX = mouse.value.x - this.last.x;
        const deltaY = mouse.value.y - this.last.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const step = 1.5;

        if (distance > step) {
          const steps = Math.floor(distance / step);
          const stepX = deltaX / steps;
          const stepY = deltaY / steps;

          for (let i = 0; i < steps; i++) {
            const currentX = this.last.x + stepX * i;
            const currentY = this.last.y + stepY * i;
            this.drawPoint(currentX, currentY);
          }
        }
      } else {
        this.drawPoint(mouse.value.x, mouse.value.y);
      }

      this.last.x = mouse.value.x;
      this.last.y = mouse.value.y;
    },

    drawPoint(x, y) {
      ctx.value.lineWidth =
        this.currentLine?.brushSize || this.customization.brushSize;
      ctx.value.lineCap = "round";

      if (!this.currentLine) {
        this.currentLine = {
          id: generateUniqueId(undefined, elements.value),
          mode: MODES_OPTIONS.value.drawing,
          isVisible: true,
          color: this.eraserMode ? "white" : this.customization.color,
          brushSize: this.customization.brushSize,
          brushType: this.customization.selectedBrushType,
          points: [],
          rotationAngle: 0,
        };

        elements.value.push(this.currentLine);
      }

      this.currentLine.points.push({ x, y });

      ctx.value.globalCompositeOperation = "source-over";

      switch (this.currentLine.brushType) {
        case "pen":
          break;

        case "pencil":
          ctx.value.globalAlpha = 0.1;
          break;
      }

      ctx.value.lineTo(x, y);
      ctx.value.stroke();

      ctx.value.beginPath();
      ctx.value.moveTo(x, y);
      ctx.value.globalAlpha = 1;
    },

    erase() {
      elements.value.forEach((element, index) => {
        if (element.mode === MODES_OPTIONS.value.drawing) {
          element.points.forEach((point, pointIndex) => {
            if (
              Math.round(mouse.value.x) >=
                Math.round(point.x) - this.customization.brushSize &&
              Math.round(mouse.value.x) <=
                Math.round(point.x) + this.customization.brushSize &&
              Math.round(mouse.value.y) >=
                Math.round(point.y) - this.customization.brushSize &&
              Math.round(mouse.value.y) <=
                Math.round(point.y) + this.customization.brushSize
            ) {
              elements.value[index].points.splice(pointIndex, 1);
            }
          });

          if (!element.points.length) {
            elements.value.splice(index, 1);
          }
        }
      });

      this.redrawCanvas();
    },

    /*
     * customization
     */
    applyStyles() {
      if (
        selectedElement.value &&
        selectedElement.value.mode === MODES_OPTIONS.value.drawing
      ) {
        selectedElement.value.color = this.customization.color;
        selectedElement.value.brushSize = this.customization.brushSize;
        selectedElement.value.brushType = this.customization.selectedBrushType;

        updateSelectedElement();
        this.redrawCanvas();
      }
    },

    loadSelectedElementCustomization() {
      this.customization.color = selectedElement.value.color;
      this.customization.brushSize = selectedElement.value.brushSize;
      this.customization.selectedBrushType =
        selectedElement.value.selectedBrushType;
    },
  },
});
