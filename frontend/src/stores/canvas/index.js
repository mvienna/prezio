import { defineStore } from "pinia";

export const useCanvasStore = defineStore("canvas", {
  state: () => ({
    canvas: null,
    ctx: null,

    mouse: {
      x: null,
      y: null,
    },

    mode: "drawing",

    texts: [],
    lines: [],
    images: [],
  }),

  actions: {
    canvasRect() {
      return this.canvas.getBoundingClientRect();
    },

    switchMode(mode) {
      this.mode = mode;
    },

    getPaddings() {
      const canvasContainerStyle = window.getComputedStyle(
        this.canvas.parentElement
      );
      const paddingLeft = parseFloat(canvasContainerStyle.paddingLeft);
      const paddingTop = parseFloat(canvasContainerStyle.paddingTop);

      return { paddingLeft: paddingLeft, paddingTop: paddingTop };
    },

    /*
     * REDRAW
     */
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    redrawCanvas() {
      this.clearCanvas();
      this.redrawTexts();
      this.redrawLines();
      this.redrawImages();
    },

    /*
     * REDRAW LINES
     */
    redrawLines() {
      this.lines.forEach((line, index) => {
        this.ctx.strokeStyle = line.color;
        this.ctx.lineWidth = line.brushSize;

        // reset default styles
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = null;
        this.ctx.shadowColor = null;

        switch (line.brushType) {
          case "pen":
            break;

          case "pencil":
            this.ctx.globalAlpha = 0.1;
            break;

          case "marker":
            this.ctx.shadowBlur = 4;
            this.ctx.shadowColor = line.color;
            break;
        }

        this.ctx.beginPath();
        line.points.forEach((point, pointIndex) => {
          if (pointIndex === 0) {
            this.ctx.moveTo(point.x, point.y);
          } else {
            this.ctx.lineTo(point.x, point.y);
            this.ctx.stroke();
          }
        });
      });
      this.ctx.beginPath();
    },

    /*
     * REDRAW TEXTS
     */
    redrawTexts() {
      this.texts.forEach((textObject, index) => {
        if (!textObject.isVisible) {
          return;
        }

        const lines = textObject.text.split("<br>");
        const { paddingLeft, paddingTop } = this.getPaddings();

        let lineY = textObject.y + paddingTop;

        lines.forEach((line, lineIndex) => {
          const formattedSegments = this.parseFormattedSegments(
            line,
            textObject
          );
          let currentX = textObject.x + paddingLeft;

          formattedSegments.forEach((segment) => {
            this.ctx.font = `${segment.fontStyle} ${segment.fontWeight} ${segment.fontSize} ${segment.font}`;
            this.ctx.fillStyle = segment.color;

            if (segment.textDecoration === "underline") {
              const textMetrics = this.ctx.measureText(segment.text);
              const segmentX = currentX;
              const segmentY = lineY + textMetrics.actualBoundingBoxAscent;

              this.ctx.beginPath();
              this.ctx.strokeStyle = segment.color;
              this.ctx.lineWidth = 1;
              this.ctx.moveTo(segmentX, segmentY);
              this.ctx.lineTo(segmentX + textMetrics.width, segmentY);
              this.ctx.stroke();
            }

            this.ctx.fillText(segment.text, currentX, lineY);
            const segmentWidth = this.ctx.measureText(segment.text).width;
            currentX += segmentWidth;
          });

          lineY += textObject.lineHeight;
        });
      });
    },

    parseFormattedSegments(line, textObject) {
      function computeSegment(node, parentSegment) {
        const segment = {
          ...textObject,
          ...parentSegment,
          text: node.textContent,
        };

        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName?.toLowerCase();
          const style = node.getAttribute("style");

          switch (tagName) {
            case "b":
              segment.fontWeight = "bold";
              break;
            case "u":
              segment.textDecoration = "underline";
              break;
            case "s":
              segment.textDecoration = "line-through";
              break;
            case "i":
              segment.fontStyle = "italic";
              break;
            case "span":
              const cssProps = {};
              if (style) {
                style.split(";").forEach((pair) => {
                  const [property, value] = pair
                    .split(":")
                    .map((item) => item.trim());
                  cssProps[property] = value;
                });
              }
              segment.color = cssProps.color;
              segment.fontFamily = cssProps.font;
              segment.fontSize = cssProps["font-size"];
              break;
          }
        }

        return segment;
      }

      const formattedSegments = [];

      function processNestedNodes(node, parentSegment = null) {
        const childNodes = node.childNodes;
        if (childNodes.length === 0) {
          formattedSegments.push(parentSegment);
          return;
        }

        Array.from(childNodes).forEach((childNode) => {
          const segment = computeSegment(childNode, parentSegment);
          processNestedNodes(childNode, segment);
        });
      }

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = line;
      processNestedNodes(tempDiv);
      tempDiv.remove();

      return formattedSegments.filter((segment) => segment !== null);
    },

    /*
     * REDRAW IMAGES
     */
    redrawImages() {
      for (const imageData of this.images) {
        this.ctx.save();
        this.ctx.translate(
          imageData.x + imageData.width / 2,
          imageData.y + imageData.height / 2
        );
        this.ctx.rotate((imageData.rotation * Math.PI) / 180);
        this.ctx.drawImage(
          imageData.image,
          -imageData.width / 2,
          -imageData.height / 2,
          imageData.width,
          imageData.height
        );
        this.ctx.restore();
      }
    },
  },
});
