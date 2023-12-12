import { defineStore, storeToRefs } from "pinia";
import {
  ALIGNMENT,
  BRUSH_TYPES,
  SHAPES_OPTIONS,
} from "src/constants/canvas/canvasVariables";
import { usePresentationsStore } from "stores/presentations";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";

const presentationsStore = usePresentationsStore();
const {
  presentation,
  slide,
  lastChangedAt,
  averageBackgroundBrightness,
  backgroundBrightnessThreshold,
} = storeToRefs(presentationsStore);

export const useCanvasStore = defineStore("canvas", {
  state: () => ({
    /*
     * canvas
     */
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
    ZOOM_OPTIONS: [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3],
    minZoom: 0.5,
    maxZoom: 4,
    sensitivity: 0.05,

    /*
     * modes
     */
    mode: null,
    MODE_OPTIONS: {
      drawing: "drawing",
      text: "text",
      textEditing: "textEditing",
      media: "media",
      mediaEmoji: "mediaEmojis",
      shape: "shape",
      background: "background",
      backgroundPreview: "backgroundPreview",
      baseFill: "baseFill",
    },

    /*
     * elements
     */
    elements: [],

    /*
     * copy
     */
    copiedElement: null,
    slideIdElementCopiedFrom: -1,

    /*
     * selection
     */
    selectedElement: null,
    selectedElementIndex: -1,

    selectedElementBorder: {
      borderWidth: 2,
      borderColor: "#4971FF",
      outlineColor: "#D7E0FF",
    },

    selectedElementRotationHandle: {
      height: 24,
      radius: 6,
    },

    /*
     * dragging
     */
    isDragging: false,
    dragStart: {
      x: null,
      y: null,
    },
    dragFrom: {
      x: null,
      y: null,
    },
    MAGNET_AXIS_OPTIONS: {
      vertical: "vertical",
      horizontal: "horizontal",
    },
    magnet: {
      axis: null,
      connectionLines: [],
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
      return this.canvas?.getBoundingClientRect();
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

    computeAdjustedSize(size) {
      return (size * this.canvas.width) / this.canvasRect().width;
    },

    computeRealSize(size) {
      return (size * this.canvasRect().width) / this.canvas.width;
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

      // TODO: get rid of timeout
      setTimeout(() => {
        this.ctx.imageSmoothingEnabled = true;
      }, 200);
    },

    /*
     * slide
     */
    async setElementsFromSlide(canvas_data = slide.value.canvas_data) {
      this.elements = JSON.parse(canvas_data) || [];

      const loadImage = (element) => {
        return new Promise(async (resolve, reject) => {
          switch (element.mode) {
            case this.MODE_OPTIONS.media:
            case this.MODE_OPTIONS.mediaEmoji:
            case this.MODE_OPTIONS.background:
            case this.MODE_OPTIONS.backgroundPreview:
              if (!element?.image?.nodeType) {
                const image = new Image();
                if (element.imageBase64) {
                  image.src = element.imageBase64;
                } else {
                  image.src = element.imageSrc;
                }

                image.onload = () => {
                  element.image = image;
                  resolve(element);
                };

                image.onerror = (error) => {
                  reject(error);
                };
              } else {
                resolve(element);
              }
              break;

            default:
              resolve(element);
          }
        });
      };

      const imageLoadingPromises = this.elements?.map(loadImage);

      try {
        this.elements = await Promise.all(imageLoadingPromises);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    },

    saveSlidePreview() {
      this.redrawCanvas(false, undefined, false);

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = 512;
      tempCanvas.height = 288;
      tempCtx.drawImage(this.canvas, 0, 0, tempCanvas.width, tempCanvas.height);
      if (slide.value) {
        slide.value.preview = tempCanvas.toDataURL("image/png");
      }
      tempCanvas.remove();

      presentationsStore.syncCurrentSlideWithPresentationSlides();
    },

    renderSlidePreview() {
      // canvas
      const slideIndex = presentation.value?.slides?.findIndex(
        (item) => item.id === slide.value?.id
      );
      if (slideIndex === -1) return;

      const slide_preview_canvas = document.getElementById(
        `canvas_slide_preview_${slideIndex}`
      );
      if (!slide_preview_canvas) return;

      slide_preview_canvas.width = 2560;
      slide_preview_canvas.height = 1440;

      // ctx
      const slide_preview_ctx = slide_preview_canvas.getContext("2d");
      slide_preview_ctx.clearRect(
        0,
        0,
        slide_preview_canvas.width,
        slide_preview_canvas.height
      );
      slide_preview_ctx.drawImage(this.canvas, 0, 0);

      slide.value.isLivePreview = true;
    },

    /*
     * render canvas
     */
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    reorderDesignLayers(elements) {
      // background preview to the bottom of layers list
      const backgroundPreviewElementIndex = elements.findIndex(
        (element) => element.mode === this.MODE_OPTIONS.backgroundPreview
      );
      if (backgroundPreviewElementIndex !== -1) {
        const backgroundPreviewElement =
          elements[backgroundPreviewElementIndex];
        elements.splice(backgroundPreviewElementIndex, 1);
        elements.push(backgroundPreviewElement);
      }

      // background to the bottom of layers list
      const backgroundElementIndex = elements.findIndex(
        (element) => element.mode === this.MODE_OPTIONS.background
      );
      if (backgroundElementIndex !== -1) {
        const backgroundElement = elements[backgroundElementIndex];
        elements.splice(backgroundElementIndex, 1);
        elements.push(backgroundElement);
      }

      // base fill to the bottom of layers list
      const baseFillElementIndex = elements.findIndex(
        (element) => element.mode === this.MODE_OPTIONS.baseFill
      );
      if (baseFillElementIndex !== -1) {
        const backgroundElement = this.elements[baseFillElementIndex];
        elements.splice(baseFillElementIndex, 1);
        elements.push(backgroundElement);
      }

      return elements;
    },

    redrawCanvas(
      saveSlide = true,
      elements = this.elements,
      showHelpers = true
    ) {
      lastChangedAt.value = new Date();

      this.clearCanvas();

      elements = this.reorderDesignLayers(elements);
      const reversedElements = [...elements].reverse();

      // draw elements one-by-one
      reversedElements.forEach((element) => {
        if (
          element.isVisible === false &&
          element.mode !== this.MODE_OPTIONS.text
        )
          return;

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
          case this.MODE_OPTIONS.drawing:
            this.renderLine(element);
            break;

          /*
           * text
           */
          case this.MODE_OPTIONS.text:
            this.renderText(element);
            break;

          /*
           * media
           * background
           */
          case this.MODE_OPTIONS.media:
          case this.MODE_OPTIONS.mediaEmoji:
          case this.MODE_OPTIONS.background:
          case this.MODE_OPTIONS.backgroundPreview:
            this.renderImage(element);
            break;

          /*
           * shape
           * base fill
           */
          case this.MODE_OPTIONS.shape:
          case this.MODE_OPTIONS.baseFill:
            this.renderShape(element);
            break;
        }

        this.ctx.restore();
      });

      /*
       * save slide if last save was > 10s ago
       */
      if (saveSlide) {
        // const now = new Date();
        // const secondsDifference = date.getDateDiff(
        //   now,
        //   lastSavedAt.value,
        //   "seconds"
        // );

        // if (secondsDifference >= 10 || forceSlideSave)
        this.saveSlidePreview();
        presentationsStore.saveSlide(undefined, this.elements);
      }

      /*
       * render live slide preview
       */
      this.renderSlidePreview();

      /*
       * stop if helpers render disabled
       */
      if (!showHelpers) return;

      /*
       * border
       */
      if (
        this.selectedElement &&
        (this.selectedElement.isVisible ||
          this.selectedElement.mode === this.MODE_OPTIONS.text)
      ) {
        this.renderBorderForSelectedElement();
      }

      /*
       * magnet line
       */
      if (this.magnet.axis) {
        this.renderMagnetLines();
      }
    },

    /*
     * render line
     */
    renderLine(element) {
      this.ctx.strokeStyle = element.color;
      this.ctx.lineWidth = element.brushSize;

      switch (element.brushType) {
        case BRUSH_TYPES[0].value:
          break;

        case BRUSH_TYPES[1].value:
          this.ctx.globalAlpha = 0.1;
          break;
      }

      this.ctx.beginPath();

      for (let i = 0; i < element.points.length; i++) {
        const point = element.points[i];

        if (i === 0) {
          this.ctx.moveTo(point.x, point.y);
        } else {
          this.ctx.lineTo(point.x, point.y);
        }
      }

      this.ctx.stroke();

      this.ctx.globalAlpha = 1;
      this.ctx.beginPath();
    },

    /*
     * render text
     */
    renderText(element) {
      if (!element.text) return;

      /*
       * compute props
       */
      // const padding = this.computeAdjustedSize(10);
      // const adjustedFontSize =
      //   (parseFloat(element.fontSize) * this.canvas.width) /
      //   this.canvasRect().width;
      const padding = 20;
      const adjustedFontSize = parseFloat(element.fontSize);

      /*
       * apply text customization
       */
      this.ctx.font = `${element.fontStyle} ${element.fontWeight} ${adjustedFontSize}px ${element.fontFamily}`;
      if (
        [
          ...SLIDE_TYPES_OF_QUIZ,
          SLIDE_TYPES.LEADERBOARD,
          SLIDE_TYPES.WORD_CLOUD,
        ].includes(slide.value?.type)
      ) {
        this.ctx.fillStyle =
          averageBackgroundBrightness.value >=
          backgroundBrightnessThreshold.value
            ? "#000000"
            : "#FFFFFF";
      } else {
        this.ctx.fillStyle = element.color;
      }

      /*
       * wrap text
       * break text into lines
       */
      let text = element.text.split(/<br\s*\/?>/);

      const wrapTextByWords = (text) => {
        const words = text.split(" ");
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + " " + words[i];
          const testLineWidth = this.ctx.measureText(testLine).width;

          if (testLineWidth < element.width - padding * 2) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = words[i];
          }
        }

        lines.push(currentLine);
        return lines;
      };

      const lines = [];
      text.map((item) => {
        lines.push(...wrapTextByWords(item));
      });

      /*
       * align
       */
      let linesPosition = [];

      lines.forEach((line, index) => {
        /*
         * x
         */
        let x = element.x + padding;
        const lineWidth = this.ctx.measureText(line).width;

        switch (element.textAlign) {
          case ALIGNMENT.horizontal.right:
            x = element.x + element.width - lineWidth - padding;
            break;

          case ALIGNMENT.horizontal.center:
            x = element.x + element.width / 2 - lineWidth / 2;
            break;
        }

        /*
         * y
         */
        let y =
          element.y +
          padding +
          adjustedFontSize +
          index * adjustedFontSize * element.lineHeight;

        // switch (element.verticalAlign) {
        //   case ALIGNMENT.vertical.bottom:
        //     y +=
        //       element.height -
        //       adjustedFontSize * element.lineHeight * lines.length;
        //     break;
        //
        //   case ALIGNMENT.vertical.middle:
        //     y += element.height / 2 - adjustedFontSize + element.lineHeight;
        //     break;
        // }

        linesPosition.push({ x: x, y: y });
      });

      const elementIndex = this.elements.findIndex(
        (item) => item.id === element.id
      );
      this.elements[elementIndex].height =
        adjustedFontSize * element.lineHeight * lines.length + padding * 2;

      if (!element.isVisible) return;

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
            adjustedFontSize / 16
          );
        }

        // line through
        if (element.textDecoration.includes("line-through")) {
          this.ctx.fillStyle = element.color;
          this.ctx.fillRect(
            x,
            y - (adjustedFontSize * element.lineHeight) / 3 + 4,
            this.ctx.measureText(line).width,
            adjustedFontSize / 16
          );
        }

        // render text
        this.ctx.fillText(line, x, y);
      });
    },

    /*
     * render image
     */
    renderImage(element) {
      this.ctx.translate(
        element.x + element.width / 2,
        element.y + element.height / 2
      );

      this.applyImageFilters(element);

      if (!element?.image?.nodeType) {
        const image = new Image();
        if (element.imageBase64) {
          image.src = element.imageBase64;
        } else {
          image.src = element.imageSrc;
        }

        image.onload = () => {
          element.image = image;

          this.ctx.drawImage(
            element.image,
            element.x,
            element.y,
            element.width,
            element.height
          );
        };
      } else {
        this.ctx.drawImage(
          element.image,
          -element.width / 2,
          -element.height / 2,
          element.width,
          element.height
        );
      }
    },

    applyImageFilters(element) {
      this.ctx.filter = `blur(${element.blur || 0}px) contrast(${
        element.contrast >= 0 ? element.contrast : 100
      }%) brightness(${
        element.brightness >= 0 ? element.brightness : 100
      }%) invert(${element.invert || 0}%) grayscale(${
        element.grayscale || 0
      }%)`;

      if (element.opacity >= 0) {
        this.ctx.globalAlpha = element.opacity / 100;
      }
    },

    /*
     * render shape
     */
    renderShape(element) {
      this.ctx.strokeStyle = element.strokeColor || "rgba(255, 0, 0, 0)";
      this.ctx.lineWidth = element.lineWidth;
      this.ctx.beginPath();

      switch (element.type) {
        /*
         * circle
         */
        case SHAPES_OPTIONS.circle:
          this.ctx.arc(
            element.x + element.width / 2,
            element.y + element.height / 2,
            element.width / 2,
            0,
            2 * Math.PI
          );

          if (element.fillColor) {
            this.ctx.fillStyle = element.fillColor;
            this.ctx.fill();
          }

          break;

        /*
         * square
         */
        case SHAPES_OPTIONS.square:
          this.ctx.rect(element.x, element.y, element.width, element.height);

          if (element.fillColor) {
            this.ctx.fillStyle = element.fillColor;
            this.ctx.fill();
          }

          break;

        /*
         * triangle
         */
        case SHAPES_OPTIONS.triangle:
          const triangleX1 = element.x + element.width / 2;
          const triangleX2 = element.x;
          const triangleX3 = element.x + element.width;

          const triangleY1 = element.y;
          const triangleY2 = element.y + element.height;
          const triangleY3 = element.y + element.height;

          this.ctx.moveTo(triangleX1, triangleY1);

          this.ctx.lineTo(triangleX2, triangleY2);
          this.ctx.lineTo(triangleX3, triangleY3);
          this.ctx.lineTo(triangleX1, triangleY1);

          if (element.fillColor) {
            this.ctx.fillStyle = element.fillColor;
            this.ctx.fill();
          }

          break;

        /*
         * star
         */
        case SHAPES_OPTIONS.star:
          const size = element.width;
          const cx = element.x + size / 2;
          const cy = element.y + size / 2;
          const spikes = 5;
          const outerRadius = size / 2;
          const innerRadius = outerRadius / 2;
          const rot = (Math.PI / 2) * 3;

          const angleIncrement = (2 * Math.PI) / (spikes * 2);

          this.ctx.moveTo(cx, cy - outerRadius);

          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = cx + Math.cos(rot + angleIncrement * i) * radius;
            const y = cy + Math.sin(rot + angleIncrement * i) * radius;
            this.ctx.lineTo(x, y);
          }

          this.ctx.lineTo(cx, cy - outerRadius);

          if (element.fillColor) {
            this.ctx.fillStyle = element.fillColor;
            this.ctx.fill();
          }

          break;

        /*
         * line
         */
        case SHAPES_OPTIONS.line:
          const x1 = element.x;
          const y1 = element.y + element.height;
          const x2 = element.x + element.width;
          const y2 = element.y;

          this.ctx.moveTo(x1, y1);
          this.ctx.lineTo(x2, y2);
          break;

        /*
         * arrow
         */
        case SHAPES_OPTIONS.arrow:
          const arrowBaseX = element.x;
          const arrowBaseY = element.y + element.height;
          const arrowTipX = element.x + element.width;
          const arrowTipY = element.y;
          const arrowHeadSize = element.width / 4;

          this.ctx.moveTo(arrowBaseX, arrowBaseY);
          this.ctx.lineTo(arrowTipX, arrowTipY);

          const angle = Math.atan2(
            arrowTipY - arrowBaseY,
            arrowTipX - arrowBaseX
          );

          const arrowX1 =
            arrowTipX - arrowHeadSize * Math.cos(angle - Math.PI / 6);
          const arrowY1 =
            arrowTipY - arrowHeadSize * Math.sin(angle - Math.PI / 6);
          const arrowX2 =
            arrowTipX - arrowHeadSize * Math.cos(angle + Math.PI / 6);
          const arrowY2 =
            arrowTipY - arrowHeadSize * Math.sin(angle + Math.PI / 6);

          this.ctx.moveTo(arrowTipX, arrowTipY);
          this.ctx.lineTo(arrowX1, arrowY1);

          this.ctx.moveTo(arrowTipX, arrowTipY);
          this.ctx.lineTo(arrowX2, arrowY2);
          break;
      }

      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.beginPath();
    },

    /*
     * render magnet line
     */
    renderMagnetLines() {
      this.ctx.save();

      this.magnet.connectionLines.forEach((connectionLine) => {
        this.ctx.strokeStyle = "#4971FF";
        this.ctx.lineWidth = this.computeAdjustedSize(1);

        const fromX = connectionLine.from.x;
        const fromY = connectionLine.from.y;
        const toX = connectionLine.to.x;
        const toY = connectionLine.to.y;

        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.stroke();
        this.ctx.closePath();
      });

      this.ctx.beginPath();
      this.ctx.restore();
    },

    /*
     * render border for selected element
     */
    renderBorderForSelectedElement() {
      this.ctx.save();
      if (this.selectedElement.rotationAngle) {
        const centerX = this.selectedElement.x + this.selectedElement.width / 2;
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
        case this.MODE_OPTIONS.drawing:
          this.drawBorder(
            this.selectedElement.x,
            this.selectedElement.y,
            this.selectedElement.width,
            this.selectedElement.height,
            [],
            true
          );
          break;

        /*
         * text
         */
        case this.MODE_OPTIONS.text:
          this.drawBorder(
            this.selectedElement.x,
            this.selectedElement.y,
            this.selectedElement.width,
            this.selectedElement.height,
            ["center-left", "center-right"],
            true
          );
          break;

        /*
         * shape
         */
        case this.MODE_OPTIONS.shape:
          this.drawBorder(
            this.selectedElement.x,
            this.selectedElement.y,
            this.selectedElement.width,
            this.selectedElement.height,
            [SHAPES_OPTIONS.circle, SHAPES_OPTIONS.star].includes(
              this.selectedElement.type
            )
              ? ["top-left", "top-right", "bottom-right", "bottom-left"]
              : undefined,
            true
          );
          break;

        /*
         * others
         */
        default:
          this.drawBorder(
            this.selectedElement.x,
            this.selectedElement.y,
            this.selectedElement.width,
            this.selectedElement.height,
            undefined,
            true
          );
          break;
      }

      this.ctx.restore();
    },

    /*
     * border
     */
    drawBorder(
      x,
      y,
      width,
      height,
      RESIZE_HANDLES_OPTIONS = Object.values(this.RESIZE_HANDLES_OPTIONS),
      drawRotationHandle = true
    ) {
      /*
       * border
       */
      const borderWidth = this.computeAdjustedSize(
        this.selectedElementBorder.borderWidth
      );

      const padding = 4;

      this.ctx.strokeStyle = this.selectedElementBorder.outlineColor;
      this.ctx.lineWidth = borderWidth;
      this.ctx.strokeRect(
        x - padding,
        y - padding,
        width + padding * 2,
        height + padding * 2
      );

      this.ctx.strokeRect(
        x + padding,
        y + padding,
        width - padding * 2,
        height - padding * 2
      );

      this.ctx.strokeStyle = this.selectedElementBorder.borderColor;
      this.ctx.lineWidth = borderWidth;
      this.ctx.strokeRect(x, y, width, height);

      /*
       * resizing & rotation handles only for content slide
       */
      if (slide.value?.type !== SLIDE_TYPES.CONTENT) return;

      /*
       * resize handles
       */
      if (RESIZE_HANDLES_OPTIONS.length) {
        const handleSize = borderWidth * 4;

        RESIZE_HANDLES_OPTIONS.forEach((handle) => {
          const { minX, minY } = this.computeResizeHandlePosition(
            handle,
            x,
            y,
            width,
            height,
            handleSize
          );

          this.ctx.fillStyle = this.selectedElementBorder.outlineColor;
          this.ctx.fillRect(
            minX - padding,
            minY - padding,
            handleSize + padding * 2,
            handleSize + padding * 2
          );

          this.ctx.fillStyle = this.selectedElementBorder.borderColor;
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
        const rotationHandleY = y + height;

        this.ctx.lineWidth = borderWidth / 2;
        this.ctx.strokeRect(
          rotationHandleX,
          rotationHandleY,
          rotationHandleWidth,
          this.computeAdjustedSize(this.selectedElementRotationHandle.height)
        );

        this.ctx.beginPath();
        this.ctx.arc(
          rotationHandleX + rotationHandleWidth / 2,
          rotationHandleY +
            this.computeAdjustedSize(this.selectedElementRotationHandle.height),
          this.computeAdjustedSize(this.selectedElementRotationHandle.radius),
          0,
          2 * Math.PI
        );
        this.ctx.fill();
      }

      this.ctx.beginPath();
    },

    computeResizeHandlePosition(handle, x, y, width, height, handleSize) {
      let minX, minY, maxX, maxY;

      switch (handle) {
        /*
         * top left
         */
        case this.RESIZE_HANDLES_OPTIONS.topLeft:
          minX = x - handleSize / 2;
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
          minX = x - handleSize / 2;
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
          minX = x - handleSize / 2;
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
