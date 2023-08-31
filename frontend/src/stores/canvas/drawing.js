import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";

const { ctx, lines, mouse } = storeToRefs(useCanvasStore());
const canvasStore = useCanvasStore();

export const useCanvasDrawingStore = defineStore("canvasDrawing", {
  state: () => ({
    drawingState: {
      /*
       * lines
       */
      currentLine: null,
      currentIndex: -1,
      selectedLineIndex: -1,

      last: {
        x: null,
        y: null,
      },

      /*
       * states
       */
      isPainting: false,
      eraserMode: false,

      /*
       * undo, redo
       */
      undoStack: [],
      redoStack: [],

      /*
       * dragging
       */
      isDraggingLine: null,
      dragStart: {
        x: 0,
        y: 0,
      },

      /*
       * customization
       */
      customization: {
        strokeColor: "#000000",
        brushSize: 10,
        brushSizeOptions: [
          { value: 1, label: "1px" },
          { value: 2, label: "2px" },
          { value: 3, label: "3px" },
          { value: 4, label: "4px" },
          { value: 8, label: "8px" },
          { value: 12, label: "12px" },
          { value: 16, label: "16px" },
          { value: 24, label: "24px" },
        ],
        brushTypes: [
          { label: "presentationEditor.drawing.brushTypes.pen", value: "pen" },
          {
            label: "presentationEditor.drawing.brushTypes.pencil",
            value: "pencil",
          },
          {
            label: "presentationEditor.drawing.brushTypes.marker",
            value: "marker",
          },
        ],
        selectedBrushType: "pen",
      },
    },
  }),

  actions: {
    redrawCanvas() {
      canvasStore.redrawCanvas();
    },

    /*
     * drawing
     */
    startPainting(e) {
      this.drawingState.redoStack = [];
      this.drawingState.isPainting = true;
      this.drawingState.currentIndex = -1;
      ctx.value.strokeStyle = this.drawingState.customization.strokeColor;
      this.redrawCanvas();
      this.draw(e);
    },

    finishedPainting() {
      this.drawingState.isPainting = false;
      this.drawingState.last.x = null;
      this.drawingState.last.y = null;
      ctx.value.beginPath();
      if (this.drawingState.currentLine) {
        this.drawingState.undoStack.push(this.drawingState.currentLine);
      }
      this.drawingState.currentLine = null;
    },

    draw() {
      if (!this.drawingState.isPainting) return;

      if (
        this.drawingState.last.x !== null &&
        this.drawingState.last.y !== null
      ) {
        const deltaX = mouse.value.x - this.drawingState.last.x;
        const deltaY = mouse.value.y - this.drawingState.last.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const step = 1.5;

        if (distance > step) {
          const steps = Math.floor(distance / step);
          const stepX = deltaX / steps;
          const stepY = deltaY / steps;

          for (let i = 0; i < steps; i++) {
            const currentX = this.drawingState.last.x + stepX * i;
            const currentY = this.drawingState.last.y + stepY * i;
            this.drawPoint(currentX, currentY);
          }
        }
      } else {
        this.drawPoint(mouse.value.x, mouse.value.y);
      }

      this.drawingState.last.x = mouse.value.x;
      this.drawingState.last.y = mouse.value.y;
    },

    drawPoint(x, y) {
      ctx.value.lineWidth =
        this.drawingState.currentLine?.brushSize ||
        this.drawingState.customization.brushSize;
      ctx.value.lineCap = "round";

      if (!this.drawingState.currentLine) {
        this.drawingState.currentLine = {
          color: this.drawingState.eraserMode
            ? "white"
            : this.drawingState.customization.strokeColor,
          brushSize: this.drawingState.customization.brushSize,
          brushType: this.drawingState.customization.selectedBrushType,
          points: [],
        };

        lines.value.push(this.drawingState.currentLine);
        this.drawingState.currentIndex++;
      }

      this.drawingState.currentLine.points.push({ x, y });

      if (this.drawingState.eraserMode) {
        ctx.value.globalCompositeOperation = "destination-out";
        ctx.value.arc(
          x,
          y,
          this.drawingState.customization.brushSize / 2,
          0,
          Math.PI * 2
        );
        ctx.value.fill();
        ctx.value.globalCompositeOperation = "source-over";
      } else {
        ctx.value.globalCompositeOperation = "source-over";

        // reset default styles
        ctx.value.globalAlpha = 1;
        ctx.value.shadowBlur = null;
        ctx.value.shadowColor = null;

        switch (this.drawingState.currentLine.brushType) {
          case "pen":
            break;

          case "pencil":
            ctx.value.globalAlpha = 0.1;
            break;

          case "marker":
            ctx.value.globalAlpha = 1;
            ctx.value.shadowBlur = 4;
            ctx.value.shadowColor = this.drawingState.customization.strokeColor;
            break;
        }

        ctx.value.lineTo(x, y);
        ctx.value.stroke();
      }

      ctx.value.beginPath();
      ctx.value.moveTo(x, y);
    },

    toggleEraser() {
      this.drawingState.eraserMode = !this.drawingState.eraserMode;
      this.drawingState.last.x = null;
      this.drawingState.last.y = null;
    },

    /*
     * selection
     */
    selectLine() {
      if (this.drawingState.isPainting) {
        return;
      }

      let foundLine = false;

      for (let i = 0; i < lines.value.length; i++) {
        const line = lines.value[i];
        const minX = Math.min(...line.points.map((point) => point.x));
        const maxX = Math.max(...line.points.map((point) => point.x));
        const minY = Math.min(...line.points.map((point) => point.y));
        const maxY = Math.max(...line.points.map((point) => point.y));

        if (
          mouse.value.x >= minX &&
          mouse.value.x <= maxX &&
          mouse.value.y >= minY &&
          mouse.value.y <= maxY
        ) {
          this.drawingState.currentIndex = i;
          this.drawingState.selectedLineIndex = i;
          this.redrawCanvas();
          this.drawBorder(minX, minY, maxX - minX, maxY - minY);
          foundLine = true;
          break;
        }
      }

      if (!foundLine) {
        this.deselectLine();
      }
    },

    deselectLine() {
      this.drawingState.currentIndex = -1;
      this.drawingState.selectedLineIndex = -1;
      this.redrawCanvas();
    },

    drawBorder(x, y, width, height) {
      ctx.value.lineWidth = 3;
      ctx.value.strokeStyle = "#4971FF";
      const outlineColor = "#D7E0FF";
      const padding = 10;
      const borderRadius = 8;

      const paddedX = x - padding;
      const paddedY = y - padding;
      const paddedWidth = width + 2 * padding;
      const paddedHeight = height + 2 * padding;

      ctx.value.strokeStyle = outlineColor;
      ctx.value.strokeRect(
        paddedX - 3,
        paddedY - 3,
        paddedWidth + 6,
        paddedHeight + 6
      );

      ctx.value.strokeStyle = "#4971FF";
      ctx.value.lineJoin = "round";
      ctx.value.strokeRect(
        paddedX,
        paddedY,
        paddedWidth,
        paddedHeight,
        borderRadius
      );
    },

    deleteSelectedLine() {
      if (this.drawingState.selectedLineIndex !== -1) {
        const deletedLine = lines.value.splice(
          this.drawingState.selectedLineIndex,
          1
        )[0];
        this.drawingState.undoStack.push(deletedLine);
        this.drawingState.selectedLineIndex = -1;
        this.redrawCanvas();
      }
    },

    /*
     * dragging
     */
    startDrag(event) {
      this.drawingState.isDraggingLine = true;
      const line = lines.value[this.drawingState.selectedLineIndex];
      const bounds = this.getLineBoundingBox(line);
      this.drawingState.dragStart.x =
        event.clientX - canvasStore.canvasRect().left - bounds.x;
      this.drawingState.dragStart.y =
        event.clientY - canvasStore.canvasRect().top - bounds.y;
    },

    endDrag() {
      this.drawingState.isDraggingLine = false;
    },

    dragLine() {
      if (this.drawingState.isDraggingLine) {
        this.moveLine(mouse.value.x, mouse.value.y);
      }
    },

    getLineBoundingBox(line) {
      const minX = Math.min(...line.points.map((point) => point.x));
      const maxX = Math.max(...line.points.map((point) => point.x));
      const minY = Math.min(...line.points.map((point) => point.y));
      const maxY = Math.max(...line.points.map((point) => point.y));
      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    },

    moveLine(newX, newY) {
      const line = lines.value[this.drawingState.selectedLineIndex];
      const deltaX = newX - line.points[0].x;
      const deltaY = newY - line.points[0].y;

      line.points.forEach((point) => {
        point.x += deltaX;
        point.y += deltaY;
      });

      this.redrawCanvas();
    },

    /*
     * undo & redo
     */
    undo() {
      if (this.drawingState.undoStack.length > 0) {
        const line = this.drawingState.undoStack.pop();
        lines.value.pop();
        this.drawingState.redoStack.push(line);
        this.redrawCanvas();
        this.drawingState.customization.brushSize = line.brushSize;
      }
    },

    redo() {
      if (this.drawingState.redoStack.length > 0) {
        const line = this.drawingState.redoStack.pop();
        lines.value.push(line);
        this.drawingState.undoStack.push(line);
        this.redrawCanvas();
        this.drawingState.customization.brushSize = line.brushSize;
      }
    },

    /*
     * shortcuts
     */
    shortcuts(event) {
      // delete selected line
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        this.deleteSelectedLine();
      }

      // undo & redo
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          this.redo();
        } else {
          this.undo();
        }
      }

      // deselect
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        this.deselectLine();
      }
    },
  },
});
