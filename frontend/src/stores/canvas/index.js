import { defineStore } from "pinia";
import { ALIGNMENT } from "src/constants/canvas/canvasVariables";

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
     * modes
     */
    mode: "text",
    MODES_OPTIONS: {
      drawing: "drawing",
      text: "text",
      textEditing: "text-editing",
      media: "media",
      mediaEmojis: "media-emojis",
      shapes: "media-shapes",
    },

    /*
     * elements
     */
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
    RESIZE_HANDLES_OPTIONS: {
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

      let angle, centerX, centerY, rotatedMouseX, rotatedMouseY;

      this.elements.map((element, index) => {
        switch (element.mode) {
          /*
           * drawing
           */
          case this.MODES_OPTIONS.drawing:
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

          // case this.MODES_OPTIONS.drawing:
          //   angle = (element.rotationAngle * Math.PI) / 180;
          //   centerX = element.x + element.width / 2;
          //   centerY = element.y + element.height / 2;
          //
          //   // Rotate the mouse coordinates around the element's center
          //   rotatedMouseX =
          //       centerX +
          //       Math.cos(angle) * (this.mouse.x - centerX) -
          //       Math.sin(angle) * (this.mouse.y - centerY);
          //   rotatedMouseY =
          //       centerY +
          //       Math.sin(angle) * (this.mouse.x - centerX) +
          //       Math.cos(angle) * (this.mouse.y - centerY);
          //
          //   const minX = Math.min(...element.points.map((point) => point.x));
          //   const maxX = Math.max(...element.points.map((point) => point.x));
          //   const minY = Math.min(...element.points.map((point) => point.y));
          //   const maxY = Math.max(...element.points.map((point) => point.y));
          //
          //   if (
          //       rotatedMouseX >= minX &&
          //       rotatedMouseX <= maxX &&
          //       rotatedMouseY >= minY &&
          //       rotatedMouseY <= maxY
          //   ) {
          //     hoveredElement = element;
          //     hoveredElementIndex = index;
          //   }
          //   break;

          /*
           * text
           */
          case this.MODES_OPTIONS.text:
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

          // case this.MODES_OPTIONS.text:
          // const angle = (element.rotationAngle * Math.PI) / 180;
          // const centerX =
          //   element.x + this.computeAdjustedSize(element.width) / 2;
          // const centerY =
          //   element.y + this.computeAdjustedSize(element.height) / 2;
          //
          // // Rotate the mouse coordinates around the element's center
          // const rotatedMouseX =
          //   centerX +
          //   Math.cos(angle) * (this.mouse.x - centerX) -
          //   Math.sin(angle) * (this.mouse.y - centerY);
          // const rotatedMouseY =
          //   centerY +
          //   Math.sin(angle) * (this.mouse.x - centerX) +
          //   Math.cos(angle) * (this.mouse.y - centerY);
          //
          // if (
          //   Math.round(rotatedMouseX) >= Math.round(element.x) &&
          //   Math.round(rotatedMouseX) <=
          //     Math.round(
          //       element.x + this.computeAdjustedSize(element.width)
          //     ) &&
          //   Math.round(rotatedMouseY) >= Math.round(element.y) &&
          //   Math.round(rotatedMouseY) <=
          //     Math.round(element.y + this.computeAdjustedSize(element.height))
          // ) {
          //   hoveredElement = element;
          //   hoveredElementIndex = index;
          // }
          // break;

          /*
           * media
           */
          case this.MODES_OPTIONS.media:
            angle = (element.rotationAngle * Math.PI) / 180;
            centerX = element.x + element.width / 2;
            centerY = element.y + element.height / 2;

            // Rotate the mouse coordinates around the element's center
            rotatedMouseX =
              centerX +
              Math.cos(angle) * (this.mouse.x - centerX) -
              Math.sin(angle) * (this.mouse.y - centerY);
            rotatedMouseY =
              centerY +
              Math.sin(angle) * (this.mouse.x - centerX) +
              Math.cos(angle) * (this.mouse.y - centerY);

            if (
              Math.round(rotatedMouseX) >= Math.round(element.x) &&
              Math.round(rotatedMouseX) <=
                Math.round(element.x + element.width) &&
              Math.round(rotatedMouseY) >= Math.round(element.y) &&
              Math.round(rotatedMouseY) <=
                Math.round(element.y + element.height)
            ) {
              hoveredElement = element;
              hoveredElementIndex = index;
            }
            break;
        }
      });

      return { hoveredElement, hoveredElementIndex };
    },

    selectElement(element = null) {
      if (element) {
        this.selectedElement = element;
        this.selectedElementIndex = this.elements.findIndex(
          (item) => item.id === element.id
        );
      } else {
        this.selectedElement = null;
        this.selectedElementIndex = -1;

        const { hoveredElement, hoveredElementIndex } =
          this.getHoveredElement();

        if (hoveredElement) {
          this.selectedElement = hoveredElement;
          this.selectedElementIndex = hoveredElementIndex;
        }
      }

      if (this.selectedElement) {
        this.switchMode(this.selectedElement.mode);
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
        this.switchMode(hoveredElement.mode);

        if (previousSelectedElementIndex === this.selectedElementIndex)
          switch (this.mode) {
            case this.MODES_OPTIONS.text:
              this.switchMode(this.MODES_OPTIONS.textEditing);
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

    deleteElement(element = this.selectedElement) {
      if (element) {
        this.elements = this.elements.filter((item) => item.id !== element.id);

        this.selectedElement = null;
        this.selectedElementIndex = -1;

        this.redrawCanvas();
      }
    },

    updateSelectedElement() {
      this.elements[this.selectedElementIndex] = this.selectedElement;
    },

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

        this.ctx.save();

        if (element.rotationAngle) {
          const centerX = element.x + element.width / 2;
          const centerY = element.y + element.height / 2;
          this.ctx.translate(centerX, centerY);
          this.ctx.rotate((element.rotationAngle * Math.PI) / 180);
          this.ctx.translate(-centerX, -centerY);
        }

        switch (element.mode) {
          /*
           * drawing
           */
          case this.MODES_OPTIONS.drawing:
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
          case this.MODES_OPTIONS.text:
            /*
             * compute props
             */
            const padding = 4;
            const adjustedFontSize =
              (parseFloat(element.fontSize) * this.canvas.width) /
              this.canvasRect().width;

            /*
             * wrap text
             */
            const wrapText = () => {
              // change context to element customization
              this.ctx.font = `${element.fontStyle} ${element.fontWeight} ${element.fontSize} ${element.fontFamily}`;

              let line = "";
              let wrappedText = "";

              // exception: one-word string is always inline
              const words = element.text.split(" ");
              if (words.length === 1) {
                element.width =
                  this.ctx.measureText(element.text).width + padding;
                return element.text;
              }

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

            /*
             * break text into lines
             */
            let lines = wrapText().split("<br>");

            /*
             * align
             */
            let linesPosition = [];

            const width = this.computeAdjustedSize(element.width);
            const height = this.computeAdjustedSize(element.height);

            lines.forEach((line, index) => {
              /*
               * x
               */
              let x = element.x;
              const lineWidth = this.computeAdjustedSize(
                this.ctx.measureText(line).width
              );

              this.computeAdjustedSize(element.width);

              switch (element.textAlign) {
                case ALIGNMENT.horizontal.right:
                  x =
                    element.x +
                    width -
                    lineWidth -
                    this.computeAdjustedSize(padding / 2);
                  break;

                case ALIGNMENT.horizontal.center:
                  x = element.x + width / 2 - lineWidth / 2;
                  break;
              }

              /*
               * y
               */
              let y =
                element.y +
                adjustedFontSize * element.lineHeight +
                index * adjustedFontSize * element.lineHeight;

              switch (element.verticalAlign) {
                case ALIGNMENT.vertical.bottom:
                  y +=
                    height -
                    adjustedFontSize * element.lineHeight -
                    this.computeAdjustedSize(padding - 1) * 3;
                  break;

                case ALIGNMENT.vertical.middle:
                  y +=
                    height / 2 -
                    adjustedFontSize * element.lineHeight +
                    this.computeAdjustedSize(padding + 1);
                  break;
              }

              linesPosition.push({ x: x, y: y });
            });

            /*
             * apply text customization
             */
            this.ctx.font = `${element.fontStyle} ${element.fontWeight} ${adjustedFontSize}px ${element.fontFamily}`;
            this.ctx.fillStyle = element.color;

            /*
             * draw text lines
             */
            lines.map((line, index) => {
              const x = linesPosition[index].x;
              const y = linesPosition[index].y;

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
          case this.MODES_OPTIONS.media:
          case this.MODES_OPTIONS.mediaEmojis:
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

        this.ctx.restore();
      });

      /*
       * border
       */
      if (this.selectedElement && this.selectedElement.isVisible) {
        this.ctx.save();
        if (this.selectedElement.rotationAngle) {
          const centerX =
            this.selectedElement.x + this.selectedElement.width / 2;
          const centerY =
            this.selectedElement.y + this.selectedElement.height / 2;
          this.ctx.translate(centerX, centerY);
          this.ctx.rotate((this.selectedElement.rotationAngle * Math.PI) / 180);
          this.ctx.translate(-centerX, -centerY);
        }

        switch (this.selectedElement.mode) {
          /*
           * drawing
           */
          case this.MODES_OPTIONS.drawing:
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

            this.drawBorder(minX, minY, maxX - minX, maxY - minY, [], false);
            break;

          /*
           * text
           */
          case this.MODES_OPTIONS.text:
            this.drawBorder(
              this.selectedElement.x,
              this.selectedElement.y,
              this.computeAdjustedSize(this.selectedElement.width),
              this.computeAdjustedSize(this.selectedElement.height),
              [],
              false
            );
            break;

          /*
           * media
           */
          case this.MODES_OPTIONS.media:
          case this.MODES_OPTIONS.mediaEmojis:
            this.drawBorder(
              this.selectedElement.x,
              this.selectedElement.y,
              this.selectedElement.width,
              this.selectedElement.height
            );
            break;
        }

        this.ctx.restore();
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
      RESIZE_HANDLES_OPTIONS = Object.values(this.RESIZE_HANDLES_OPTIONS),
      drawRotationHandle = true
    ) {
      const padding =
        this.selectedElement.mode === this.MODES_OPTIONS.text
          ? this.computeAdjustedSize(this.selectedElementBorder.padding)
          : 0;

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
      if (RESIZE_HANDLES_OPTIONS.length) {
        const handleSize = borderWidth * 3;

        RESIZE_HANDLES_OPTIONS.forEach((handle) => {
          const { minX, minY } = this.computeResizeHandlePosition(
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
      if (drawRotationHandle) {
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
      }
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
        case this.RESIZE_HANDLES_OPTIONS.topLeft:
          minX = x - padding - handleSize / 2;
          minY = y - handleSize / 2;
          break;

        /*
         * top right
         */
        case this.RESIZE_HANDLES_OPTIONS.topRight:
          minX = x + width - handleSize / 2;
          minY = y - handleSize / 2;
          break;

        /*
         * bottom left
         */
        case this.RESIZE_HANDLES_OPTIONS.bottomLeft:
          minX = x - padding - handleSize / 2;
          minY = y + height - handleSize / 2;
          break;

        /*
         * bottom right
         */
        case this.RESIZE_HANDLES_OPTIONS.bottomRight:
          minX = x + width - handleSize / 2;
          minY = y + height - handleSize / 2;
          break;

        /*
         * center top
         */
        case this.RESIZE_HANDLES_OPTIONS.centerTop:
          minX = x + width / 2 - handleSize / 2 - handleSize / 3;
          minY = y - handleSize / 2;
          break;

        /*
         * center bottom
         */
        case this.RESIZE_HANDLES_OPTIONS.centerBottom:
          minX = x + width / 2 - handleSize / 2 - handleSize / 3;
          minY = y + height - handleSize / 2;
          break;

        /*
         * center left
         */
        case this.RESIZE_HANDLES_OPTIONS.centerLeft:
          minX = x - padding - handleSize / 2;
          minY = y + height / 2 - handleSize / 2;
          break;

        /*
         * center right
         */
        case this.RESIZE_HANDLES_OPTIONS.centerRight:
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
