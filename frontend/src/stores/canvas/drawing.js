import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { generateUniqueId } from "src/helpers/generationUtils";
import { updateSelectedElement } from "stores/canvas/helpers/select";
import {
  BRUSH_SIZE_OPTIONS,
  BRUSH_TYPES,
} from "src/constants/canvas/canvasVariables";

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
      color: "#313232",
      brushSize: 16,
      selectedBrushType: "pen",
    },
  }),

  actions: {
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

      canvasStore.redrawCanvas(true, true);
    },

    draw() {
      if (!this.isDrawing) return;

      const currentX = mouse.value.x;
      const currentY = mouse.value.y;

      if (this.last.x !== null && this.last.y !== null) {
        const deltaX = currentX - this.last.x;
        const deltaY = currentY - this.last.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const step = 1.5;

        if (distance > step) {
          const simplifiedPoints = this.simplifyPath(
            this.last.x,
            this.last.y,
            currentX,
            currentY,
            step
          );
          for (const point of simplifiedPoints) {
            this.drawPoint(point.x, point.y);
          }
        }
      } else {
        this.drawPoint(currentX, currentY);
      }

      this.last.x = currentX;
      this.last.y = currentY;
    },

    simplifyPath(startX, startY, endX, endY, step) {
      const points = [
        { x: startX, y: startY },
        { x: endX, y: endY },
      ];
      return this.ramerDouglasPeucker(points, step);
    },

    ramerDouglasPeucker(points, epsilon) {
      if (points.length < 3) {
        return points;
      }

      const dMax = 0;
      let index = 0;

      for (let i = 1; i < points.length - 1; i++) {
        const d = this.perpendicularDistance(
          points[i],
          points[0],
          points[points.length - 1]
        );
        if (d > dMax) {
          index = i;
          dMax = d;
        }
      }

      if (dMax > epsilon) {
        const firstPart = this.ramerDouglasPeucker(
          points.slice(0, index + 1),
          epsilon
        );
        const secondPart = this.ramerDouglasPeucker(
          points.slice(index),
          epsilon
        );
        return firstPart.slice(0, -1).concat(secondPart);
      } else {
        return [points[0], points[points.length - 1]];
      }
    },

    perpendicularDistance(point, start, end) {
      const { x: pX, y: pY } = point;
      const { x: startX, y: startY } = start;
      const { x: endX, y: endY } = end;

      const n = Math.abs(
        (endX - startX) * (startY - pY) - (startX - pX) * (endY - startY)
      );
      const d = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

      return n / d;
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
          isLocked: false,
          color: this.eraserMode ? "white" : this.customization.color,
          brushSize: this.customization.brushSize,
          brushType: this.customization.selectedBrushType,
          points: [],
          rotationAngle: 0,
        };

        elements.value.unshift(this.currentLine);
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

      canvasStore.redrawCanvas(false);
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
        canvasStore.redrawCanvas();
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
