import { defineStore } from "pinia";

export const useCanvasStore = defineStore("canvas", {
  state: () => ({
    canvas: null,
    ctx: null,

    /*
     * position & zoom
     */
    mouse: {
      x: null,
      y: null,
    },

    scale: 1,
    minZoom: 0.5,
    maxZoom: 4,
    sensitivity: 0.05,

    /*
     * elements & modes
     */
    mode: "text",
    modes: {
      drawing: "drawing",
      text: "text",
      textEditing: "text-editing",
      media: "media",
      mediaEmojis: "media-emojis",
      shapes: "media-shapes",
    },
    elements: [],

    /*
     * selection
     */
    selectedElement: null,
    selectedElementIndex: -1,

    selectedElementBorder: {
      borderWidth: 2,
      borderColor: "#4971FF",
      padding: 4,
    },

    selectedElementRotationHandle: {
      height: 50,
      radius: 16,
    },

    /*
     * dragging
     */
    isDragging: false,
    dragStart: {
      x: null,
      y: null,
    },

    /*
     * resize
     */
    isResizing: false,
    resizeHandle: null,
    resizeStart: {
      x: null,
      y: null,
      width: null,
      height: null,
      clientX: null,
      clientY: null,
    },
    resizeHandles: {
      topLeft: "top-left",
      topRight: "top-right",
      bottomLeft: "bottom-left",
      bottomRight: "bottom-right",
      centerTop: "center-top",
      centerBottom: "center-bottom",
      centerLeft: "center-left",
      centerRight: "center-right",
    },

    /*
     * rotation
     */
    isRotating: false,
    rotationHandle: null,
  }),

  actions: {
    canvasRect() {
      return this.canvas.getBoundingClientRect();
    },

    switchMode(mode) {
      this.mode = mode;
    },

    computePosition(event) {
      const canvasRect = this.canvasRect();
      this.mouse = {
        x:
          ((event.clientX - canvasRect.left) / canvasRect.width) *
          this.canvas.width,
        y:
          ((event.clientY - canvasRect.top) / canvasRect.height) *
          this.canvas.height,
      };
    },

    /*
     * zoom
     */
    handleZoom(delta, mouseX, mouseY, newScale = null) {
      if (!newScale) {
        newScale = Math.max(
          this.minZoom,
          Math.min(this.maxZoom, this.scale + delta * this.sensitivity)
        );

        const canvasRect = this.canvas.getBoundingClientRect();
        const cursorX = (mouseX - canvasRect.left) / this.scale;
        const cursorY = (mouseY - canvasRect.top) / this.scale;

        this.canvas.style.transformOrigin = `${cursorX}px ${cursorY}px`;
      }

      this.canvas.style.transform = `scale(${newScale})`;
      this.scale = newScale;

      setTimeout(() => {
        this.ctx.imageSmoothingEnabled = true;
      }, 200);
    },

    /*
     * hover & select
     */
    getHoveredElement() {
      let hoveredElement = null;
      let hoveredElementIndex = -1;

      this.elements.map((element, index) => {
        switch (element.mode) {
          /*
           * drawing
           */
          case this.modes.drawing:
            const minX = Math.min(...element.points.map((point) => point.x));
            const maxX = Math.max(...element.points.map((point) => point.x));
            const minY = Math.min(...element.points.map((point) => point.y));
            const maxY = Math.max(...element.points.map((point) => point.y));

            if (
              this.mouse.x >= minX &&
              this.mouse.x <= maxX &&
              this.mouse.y >= minY &&
              this.mouse.y <= maxY
            ) {
              hoveredElement = element;
              hoveredElementIndex = index;
            }
            break;

          /*
           * text
           */
          case this.modes.text:
            if (
              Math.round(this.mouse.x) >= Math.round(element.x) &&
              Math.round(this.mouse.x) <=
                Math.round(
                  element.x + this.computeAdjustedSize(element.width)
                ) &&
              Math.round(this.mouse.y) >= Math.round(element.y) &&
              Math.round(this.mouse.y) <=
                Math.round(element.y + this.computeAdjustedSize(element.height))
            ) {
              hoveredElement = element;
              hoveredElementIndex = index;
            }
            break;

          /*
           * media
           */
          case this.modes.media:
            if (
              Math.round(this.mouse.x) >= Math.round(element.x) &&
              Math.round(this.mouse.x) <=
                Math.round(element.x + element.width) &&
              Math.round(this.mouse.y) >= Math.round(element.y) &&
              Math.round(this.mouse.y) <= Math.round(element.y + element.height)
            ) {
              hoveredElement = element;
              hoveredElementIndex = index;
            }
            break;
        }
      });

      return { hoveredElement, hoveredElementIndex };
    },

    selectElement() {
      this.selectedElement = null;
      this.selectedElementIndex = -1;

      const { hoveredElement, hoveredElementIndex } = this.getHoveredElement();

      if (hoveredElement) {
        this.selectedElement = hoveredElement;
        this.selectedElementIndex = hoveredElementIndex;
      }

      this.redrawCanvas();
    },

    doubleSelectElement() {
      const previousSelectedElementIndex = this.selectedElementIndex;

      this.selectedElement = null;
      this.selectedElementIndex = -1;

      const { hoveredElement, hoveredElementIndex } = this.getHoveredElement();

      if (hoveredElement) {
        this.selectedElement = hoveredElement;
        this.selectedElementIndex = hoveredElementIndex;

        if (previousSelectedElementIndex === this.selectedElementIndex)
          switch (this.mode) {
            case this.modes.text:
              this.switchMode(this.modes.textEditing);
              break;
          }
      }
    },

    deselectElement() {
      if (this.selectedElement) {
        this.selectedElement = null;
        this.selectedElementIndex = -1;
        this.redrawCanvas();
      }
    },

    deleteSelectedElement() {
      if (this.selectedElement) {
        this.elements = this.elements.filter(
          (element, index) => index !== this.selectedElementIndex
        );
        this.selectedElement = null;
        this.selectedElementIndex = -1;
        this.redrawCanvas();
      }
    },

    updateSelectedElement() {
      this.elements[this.selectedElementIndex] = this.selectedElement;
    },

    /*
     * dragging
     */
    startDragging() {
      this.isDragging = true;
      this.dragStart.x = this.mouse.x;
      this.dragStart.y = this.mouse.y;
    },

    stopDragging() {
      this.isDragging = false;
    },

    dragElement() {
      this.moveElement(this.mouse.x, this.mouse.y);
    },

    moveElement(newX, newY) {
      let deltaX, deltaY;

      switch (this.selectedElement.mode) {
        case this.modes.drawing:
          deltaX = newX - this.dragStart.x;
          deltaY = newY - this.dragStart.y;
          this.selectedElement.points.forEach((point) => {
            point.x += deltaX;
            point.y += deltaY;
          });
          break;

        default:
          this.selectedElement.x += newX - this.dragStart.x;
          this.selectedElement.y += newY - this.dragStart.y;
          break;
      }

      this.dragStart.x = newX;
      this.dragStart.y = newY;

      this.updateSelectedElement();
      this.redrawCanvas();
    },

    /*
     * resizing
     */
    getResizeHandle() {
      if (this.selectedElement.mode === this.modes.drawing) return null;

      /*
       * compute props
       */
      const borderWidth = this.computeAdjustedSize(
        this.selectedElementBorder.borderWidth
      );
      const handleSize = borderWidth * 3;
      const padding = this.computeAdjustedSize(
        this.selectedElementBorder.padding
      );

      let width, height;
      switch (this.selectedElement.mode) {
        case this.modes.media:
        case this.modes.mediaEmojis:
          width = this.selectedElement.width;
          height = this.selectedElement.height;
          break;

        default:
          width = this.computeAdjustedSize(this.selectedElement.width);
          height = this.computeAdjustedSize(this.selectedElement.height);
          break;
      }

      /*
       * find active handle
       */
      let activeHandle = null;

      Object.values(this.resizeHandles).forEach((handle) => {
        // compute position
        const { minX, minY, maxX, maxY } = this.computeResizeHandlePosition(
          handle,
          this.selectedElement.x,
          this.selectedElement.y,
          width,
          height,
          handleSize,
          padding
        );

        if (
          this.mouse.x >= minX - padding &&
          this.mouse.x <= maxX + padding &&
          this.mouse.y >= minY - padding &&
          this.mouse.y <= maxY + padding
        ) {
          activeHandle = handle;
        }
      });

      return activeHandle;
    },

    startResizing() {
      this.isResizing = true;
      this.resizeStart = {
        x: this.selectedElement.x,
        y: this.selectedElement.y,
        width: this.selectedElement.width,
        height: this.selectedElement.height,
        clientX: this.mouse.x,
        clientY: this.mouse.y,
      };
    },

    stopResizing() {
      this.isResizing = false;
      this.resizeHandle = null;
    },

    resizeElement() {
      if (!this.isResizing) return;

      const deltaX = this.mouse.x - this.resizeStart.clientX;
      const deltaY = this.mouse.y - this.resizeStart.clientY;

      const aspectRatio =
        this.selectedElement.width / this.selectedElement.height;

      switch (this.selectedElement.mode) {
        case this.modes.media:
        case this.modes.mediaEmojis:
          switch (this.resizeHandle) {
            /*
             * top left
             */
            case this.resizeHandles.topLeft:
              const newTopLeftWidth = Math.max(
                0,
                this.resizeStart.width - deltaX
              );
              const newTopLeftHeight = Math.max(
                0,
                newTopLeftWidth / aspectRatio
              );

              this.selectedElement.width = newTopLeftWidth;
              this.selectedElement.height = newTopLeftHeight;

              this.selectedElement.x =
                this.resizeStart.x + (this.resizeStart.width - newTopLeftWidth);
              this.selectedElement.y =
                this.resizeStart.y +
                (this.resizeStart.height - newTopLeftHeight);

              break;

            /*
             * top right
             */
            case this.resizeHandles.topRight:
              const newTopRightWidth = Math.max(
                0,
                this.resizeStart.width + deltaX
              );
              const newTopRightHeight = Math.max(
                0,
                newTopRightWidth / aspectRatio
              );

              this.selectedElement.width = newTopRightWidth;
              this.selectedElement.height = newTopRightHeight;

              this.selectedElement.y =
                this.resizeStart.y +
                (this.resizeStart.height - newTopRightHeight);

              break;

            /*
             * bottom left
             */
            case this.resizeHandles.bottomLeft:
              const newBottomLeftWidth = Math.max(
                0,
                this.resizeStart.width - deltaX
              );
              const newBottomLeftHeight = Math.max(
                0,
                newBottomLeftWidth / aspectRatio
              );

              this.selectedElement.width = newBottomLeftWidth;
              this.selectedElement.height = newBottomLeftHeight;

              this.selectedElement.x =
                this.resizeStart.x +
                (this.resizeStart.width - newBottomLeftWidth);

              break;

            /*
             * bottom right
             */
            case this.resizeHandles.bottomRight:
              const newBottomRightWidth = Math.max(
                0,
                this.resizeStart.width + deltaX
              );
              const newBottomRightHeight = Math.max(
                0,
                newBottomRightWidth / aspectRatio
              );

              this.selectedElement.width = newBottomRightWidth;
              this.selectedElement.height = newBottomRightHeight;

              break;

            /*
             * center top
             */
            case this.resizeHandles.centerTop:
              const newCenterTopHeight = Math.max(
                0,
                this.resizeStart.height - deltaY
              );
              this.selectedElement.height = newCenterTopHeight;
              this.selectedElement.y =
                this.resizeStart.y +
                (this.resizeStart.height - newCenterTopHeight);

              break;

            /*
             * center bottom
             */
            case this.resizeHandles.centerBottom:
              const newCenterBottomHeight = Math.max(
                0,
                this.resizeStart.height + deltaY
              );
              this.selectedElement.height = newCenterBottomHeight;

              break;

            /*
             * center left
             */
            case this.resizeHandles.centerLeft:
              const newCenterLeftWidth = Math.max(
                0,
                this.resizeStart.width - deltaX
              );

              this.selectedElement.width = newCenterLeftWidth;
              this.selectedElement.x =
                this.resizeStart.x +
                (this.resizeStart.width - newCenterLeftWidth);

              break;

            /*
             * center right
             */
            case this.resizeHandles.centerRight:
              this.selectedElement.width = Math.max(
                0,
                this.resizeStart.width + deltaX
              );

              break;
          }

          break;

        case this.modes.text:
          switch (this.resizeHandle) {
            /*
             * top left
             */
            case this.resizeHandles.topLeft:
              break;

            /*
             * top right
             */
            case this.resizeHandles.topRight:
              break;

            /*
             * bottom left
             */
            case this.resizeHandles.bottomLeft:
              break;

            /*
             * bottom right
             */
            case this.resizeHandles.bottomRight:
              break;

            /*
             * center top
             */
            case this.resizeHandles.centerTop:
              break;

            /*
             * center bottom
             */
            case this.resizeHandles.centerBottom:
              break;

            /*
             * center left
             */
            case this.resizeHandles.centerLeft:
              break;

            /*
             * center right
             */
            case this.resizeHandles.centerRight:
              break;
          }

          break;
      }

      this.updateSelectedElement();
      this.redrawCanvas();
    },

    /*
     * rotating
     */
    getRotationHandle() {
      /*
       * compute props
       */
      const borderWidth = this.computeAdjustedSize(
        this.selectedElementBorder.borderWidth
      );
      const padding = this.computeAdjustedSize(
        this.selectedElementBorder.padding
      );

      let width, height;
      switch (this.selectedElement.mode) {
        case this.modes.media:
        case this.modes.mediaEmojis:
          width = this.selectedElement.width;
          height = this.selectedElement.height;
          break;

        default:
          width = this.computeAdjustedSize(this.selectedElement.width);
          height = this.computeAdjustedSize(this.selectedElement.height);
          break;
      }

      const rotationHandleWidth = borderWidth / 2;

      /*
       * compute position
       */
      const minX =
        this.selectedElement.x +
        width / 2 -
        borderWidth -
        rotationHandleWidth / 2;
      const minY =
        this.selectedElement.y - this.selectedElementRotationHandle.height;
      const maxX = minX + this.selectedElementRotationHandle.radius;
      const maxY = minY + this.selectedElementRotationHandle.radius;

      /*
       * check if hovered
       */
      return (
        this.mouse.x >= minX - padding &&
        this.mouse.x <= maxX + padding &&
        this.mouse.y >= minY - padding &&
        this.mouse.y <= maxY + padding
      );
    },

    startRotating() {
      this.isRotating = true;
    },

    stopRotating() {
      this.isRotating = false;
      this.rotateHandle = null;
    },

    rotateElement() {},

    /*
     * canvas render
     */
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    redrawCanvas() {
      this.clearCanvas();

      this.elements.forEach((element) => {
        if (element.isVisible === false) return;

        switch (element.mode) {
          /*
           * drawing
           */
          case this.modes.drawing:
            this.ctx.strokeStyle = element.color;
            this.ctx.lineWidth = element.brushSize;

            switch (element.brushType) {
              case "pen":
                break;

              case "pencil":
                this.ctx.globalAlpha = 0.1;
                break;
            }

            this.ctx.beginPath();
            element.points.forEach((point, pointIndex) => {
              if (pointIndex === 0) {
                this.ctx.moveTo(point.x, point.y);
              } else {
                this.ctx.lineTo(point.x, point.y);
                this.ctx.stroke();
              }
            });

            this.ctx.globalAlpha = 1;

            this.ctx.beginPath();
            break;

          /*
           * text
           */
          case this.modes.text:
            // process text
            const wrapText = () => {
              // change context to element customization
              this.ctx.font = `${element.fontStyle} ${element.fontWeight} ${element.fontSize} ${element.fontFamily}`;

              // define variables
              const padding = 4;
              let line = "";
              let wrappedText = "";

              // exception: one-word string is always inline
              const words = element.text.split(" ");
              if (words.length === 1) {
                element.width =
                  this.ctx.measureText(element.text).width + padding;
                return element.text;
              }

              // wrap text
              for (const word of words) {
                const testLine = line.length === 0 ? word : line + " " + word;
                const testWidth = this.ctx.measureText(testLine).width;

                if (testWidth <= element.width + padding) {
                  line = testLine;
                } else {
                  wrappedText += line + "<br>";
                  line = word;
                }
              }

              if (wrappedText.length === 0) {
                wrappedText = line;
              } else {
                wrappedText += line;
              }

              return wrappedText;
            };

            const lines = wrapText().split("<br>");

            // adjust font size to canvas scale
            const adjustedFontSize =
              (parseFloat(element.fontSize) * this.canvas.width) /
              this.canvasRect().width;

            this.ctx.font = `${element.fontStyle} ${element.fontWeight} ${adjustedFontSize}px ${element.fontFamily}`;
            this.ctx.fillStyle = element.color;

            console.log(
              "x:",
              element.x,
              "y:",
              element.y,
              "w:",
              element.width,
              "h:",
              element.height
            );

            // draw text lines
            lines.map((line, index) => {
              // compute position
              const x = element.x;
              const y =
                element.y +
                adjustedFontSize * element.lineHeight +
                index * adjustedFontSize * element.lineHeight;

              // underline
              if (element.textDecoration.includes("underline")) {
                this.ctx.fillStyle = element.color;
                this.ctx.fillRect(
                  x,
                  y + 4,
                  this.ctx.measureText(line).width,
                  4
                );
              }

              // line through
              if (element.textDecoration.includes("line-through")) {
                this.ctx.fillStyle = element.color;
                this.ctx.fillRect(
                  x,
                  y - (adjustedFontSize * element.lineHeight) / 3 + 4,
                  this.ctx.measureText(line).width,
                  4
                );
              }

              // render text
              this.ctx.fillText(line, x, y);
            });

            break;

          /*
           * media
           */
          case this.modes.media:
          case this.modes.mediaEmojis:
            this.ctx.save();
            this.ctx.translate(
              element.x + element.width / 2,
              element.y + element.height / 2
            );
            this.ctx.rotate((element.rotation * Math.PI) / 180);
            this.ctx.drawImage(
              element.image,
              -element.width / 2,
              -element.height / 2,
              element.width,
              element.height
            );
            this.ctx.restore();
            break;
        }
      });

      if (this.selectedElement && this.selectedElement.isVisible) {
        switch (this.selectedElement.mode) {
          /*
           * drawing
           */
          case this.modes.drawing:
            const minX = Math.min(
              ...this.selectedElement.points.map((point) => point.x)
            );
            const maxX = Math.max(
              ...this.selectedElement.points.map((point) => point.x)
            );
            const minY = Math.min(
              ...this.selectedElement.points.map((point) => point.y)
            );
            const maxY = Math.max(
              ...this.selectedElement.points.map((point) => point.y)
            );

            this.drawBorder(minX, minY, maxX - minX, maxY - minY, []);
            break;

          /*
           * text
           */
          case this.modes.text:
            this.drawBorder(
              this.selectedElement.x,
              this.selectedElement.y,
              this.computeAdjustedSize(this.selectedElement.width),
              this.computeAdjustedSize(this.selectedElement.height)
            );
            break;

          /*
           * media
           */
          case this.modes.media:
          case this.modes.mediaEmojis:
            this.drawBorder(
              this.selectedElement.x,
              this.selectedElement.y,
              this.selectedElement.width,
              this.selectedElement.height
            );
            break;
        }
      }
    },

    computeAdjustedSize(size) {
      return (size * this.canvas.width) / this.canvasRect().width;
    },

    drawBorder(
      x,
      y,
      width,
      height,
      handles = Object.values(this.resizeHandles)
    ) {
      const padding = this.computeAdjustedSize(
        this.selectedElementBorder.padding
      );

      /*
       * border
       */
      const borderWidth = this.computeAdjustedSize(
        this.selectedElementBorder.borderWidth
      );

      this.ctx.strokeStyle = this.selectedElementBorder.borderColor;
      this.ctx.lineWidth = borderWidth;
      this.ctx.strokeRect(x - padding, y, width + padding, height);

      /*
       * resize handles
       */
      this.ctx.fillStyle = this.selectedElementBorder.borderColor;
      if (handles.length) {
        const handleSize = borderWidth * 3;

        handles.forEach((handle) => {
          const { minX, minY, maxX, maxY } = this.computeResizeHandlePosition(
            handle,
            x,
            y,
            width,
            height,
            handleSize,
            padding
          );
          this.ctx.fillRect(minX, minY, handleSize, handleSize);
        });
      }

      /*
       * rotation handle
       */
      const rotationHandleWidth = borderWidth / 2;

      const rotationHandleX =
        x + width / 2 - borderWidth - rotationHandleWidth / 2;
      const rotationHandleY = y - this.selectedElementRotationHandle.height;

      this.ctx.lineWidth = borderWidth / 2;
      this.ctx.strokeRect(
        rotationHandleX,
        rotationHandleY,
        rotationHandleWidth,
        this.selectedElementRotationHandle.height
      );

      this.ctx.beginPath();
      this.ctx.arc(
        rotationHandleX + rotationHandleWidth / 2,
        rotationHandleY,
        this.selectedElementRotationHandle.radius,
        0,
        2 * Math.PI
      );
      this.ctx.fill();
    },

    computeResizeHandlePosition(
      handle,
      x,
      y,
      width,
      height,
      handleSize,
      padding
    ) {
      let minX, minY, maxX, maxY;

      switch (handle) {
        /*
         * top left
         */
        case this.resizeHandles.topLeft:
          minX = x - padding - handleSize / 2;
          minY = y - handleSize / 2;
          break;

        /*
         * top right
         */
        case this.resizeHandles.topRight:
          minX = x + width - handleSize / 2;
          minY = y - handleSize / 2;
          break;

        /*
         * bottom left
         */
        case this.resizeHandles.bottomLeft:
          minX = x - padding - handleSize / 2;
          minY = y + height - handleSize / 2;
          break;

        /*
         * bottom right
         */
        case this.resizeHandles.bottomRight:
          minX = x + width - handleSize / 2;
          minY = y + height - handleSize / 2;
          break;

        /*
         * center top
         */
        case this.resizeHandles.centerTop:
          minX = x + width / 2 - handleSize / 2 - handleSize / 3;
          minY = y - handleSize / 2;
          break;

        /*
         * center bottom
         */
        case this.resizeHandles.centerBottom:
          minX = x + width / 2 - handleSize / 2 - handleSize / 3;
          minY = y + height - handleSize / 2;
          break;

        /*
         * center left
         */
        case this.resizeHandles.centerLeft:
          minX = x - padding - handleSize / 2;
          minY = y + height / 2 - handleSize / 2;
          break;

        /*
         * center right
         */
        case this.resizeHandles.centerRight:
          minX = x + width - handleSize / 2;
          minY = y + height / 2 - handleSize / 2;
          break;
      }

      maxX = minX + handleSize;
      maxY = minY + handleSize;

      return { minX, minY, maxX, maxY };
    },
  },
});
