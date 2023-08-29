import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";

const { ctx, texts } = storeToRefs(useCanvasStore());
const canvasStore = useCanvasStore();

export const useCanvasTextStore = defineStore("canvasText", {
  state: () => ({
    textState: {
      input: null,
      selectedTextIndex: -1,

      /*
       * dragging
       */
      isDraggingText: null,
      dragStart: {
        x: 0,
        y: 0,
      },

      /*
       * customization
       */
      customization: {
        color: "#000000",
        fontSize: "16px",
        fontSizeOptions: [
          "8px",
          "10px",
          "11px",
          "12px",
          "14px",
          "16px",
          "18px",
          "20px",
          "22px",
          "24px",
          "28px",
          "32px",
          "36px",
          "44px",
          "48px",
        ],
        font: "Arial",
        fontOptions: [
          "Arial",
          "Helvetica",
          "Times New Roman",
          "Times",
          "Courier New",
          "Courier",
          "monospace",
          "Georgia",
          "Palatino",
          "Palatino Linotype",
          "Verdana",
          "Geneva",
          "Tahoma",
          "Trebuchet MS",
          "Impact",
          "Montserrat",
          "Roboto",
        ],
        formatting: {
          isBold: false,
          isUnderline: false,
          isItalic: false,
        },
      },
    },
  }),

  actions: {
    redrawCanvas() {
      canvasStore.redrawCanvas();
    },

    /*
     * add new text
     */
    createTextInput() {
      this.textState.input = document.createElement("div");
      this.textState.input.setAttribute("contentEditable", "true");

      this.textState.input.style.position = "absolute";
      this.textState.input.style.resize = "both";
      this.textState.input.style.overflow = "auto";
      this.textState.input.style.minWidth = "1em";
      this.textState.input.style.padding = "4px";
      this.textState.input.style.borderRadius = "4px";
      this.textState.input.style.border = "2px solid #4971FF";
      this.textState.input.style.outline = "3px solid #D7E0FF";

      // customization
      this.textState.input.style.fontFamily = this.textState.customization.font;
      this.textState.input.style.fontSize =
        this.textState.customization.fontSize;
      this.textState.input.style.fontWeight = this.textState.customization
        .formatting.isBold
        ? "bold"
        : "normal";
      this.textState.input.style.textDecoration = this.textState.customization
        .formatting.isUnderline
        ? "underline"
        : "none";
      this.textState.input.style.fontStyle = this.textState.customization
        .formatting.isItalic
        ? "italic"
        : "none";
      this.textState.input.style.color = this.textState.customization.color;
    },

    removeTextInput() {
      this.textState.input.remove();
      this.textState.input = null;
    },

    createNewText(event) {
      if (this.textState.input) return;

      this.createTextInput(event);
      this.textState.input.style.left = event.clientX + "px";
      this.textState.input.style.top = event.clientY + "px";

      const x = event.clientX - canvasStore.canvasRect().left;
      const y = event.clientY - canvasStore.canvasRect().top;

      this.textState.input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          const props = {
            font: this.textState.customization.font,
            fontSize: this.textState.customization.fontSize,
            lineHeight: 20,
            color: this.textState.customization.color,
            fontWeight: this.textState.customization.formatting.isBold
              ? "bold"
              : "normal",
            textDecoration: this.textState.customization.formatting.isUnderline
              ? "underline"
              : "",
            fontStyle: this.textState.customization.formatting.isItalic
              ? "italic"
              : "",
            isVisible: true,
            box: {
              width: this.textState.input.offsetWidth,
              height: this.textState.input.offsetHeight,
            },
          };

          this.addTextToCanvas(this.textState.input.innerHTML, x, y, props);
          this.removeTextInput();
        }
      });

      document.body.appendChild(this.textState.input);
      this.textState.input.focus();
    },

    addTextToCanvas(text, x, y, props) {
      const newText = {
        text,
        x,
        y,
        ...props,
      };
      texts.value.push(newText);
      this.redrawCanvas();
    },

    /*
     * select
     * edit
     */
    selectText(textIndex) {
      const selectedText = texts.value[textIndex];

      if (this.textState.selectedTextIndex === textIndex) {
        this.createTextInput();
        this.textState.input.style.width = selectedText.box.width + "px";
        this.textState.input.style.height = selectedText.box.height + "px";

        texts.value[textIndex].isVisible = false;
        this.redrawCanvas();

        const canvasRect = canvasStore.canvasRect();
        this.textState.input.style.left =
          selectedText.x + canvasRect.left + "px";
        this.textState.input.style.top = selectedText.y + canvasRect.top + "px";

        this.textState.input.innerHTML = selectedText.text;

        this.textState.input.addEventListener("keydown", (event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            this.textState.selectedTextIndex = -1;
            this.editTextOnCanvas(textIndex, {
              text: this.textState.input.innerHTML,
              box: {
                width: this.textState.input.offsetWidth,
                height: this.textState.input.offsetHeight,
              },
            });
            this.removeTextInput();
            texts.value[textIndex].isVisible = true;
            this.redrawCanvas();
          }
        });

        document.body.appendChild(this.textState.input);
        this.textState.input.focus();
      } else {
        this.textState.selectedTextIndex = textIndex;
        this.redrawCanvas();

        const selectedText = texts.value[textIndex];

        const { paddingLeft } = canvasStore.getPaddings();
        const paddingTop = 8;

        this.drawBorder(
          selectedText.x + paddingLeft,
          selectedText.y + paddingTop,
          selectedText.box.width,
          selectedText.box.height
        );
      }
    },

    deselectText() {
      this.textState.selectedTextIndex = -1;
      this.redrawCanvas();
    },

    editTextOnCanvas(textIndex, props) {
      texts.value[textIndex].text = props.text;
      texts.value[textIndex].box = props.box;
      this.redrawCanvas();
    },

    deleteSelectedText(event) {
      if (this.textState.selectedTextIndex !== -1) {
        event.preventDefault();
        texts.value = texts.value.filter(
          (text, index) => index !== this.textState.selectedTextIndex
        );
        this.textState.selectedTextIndex = -1;
        this.redrawCanvas();
      }
    },

    getTextDimensions(text) {
      const lines = text.text.split("<br>");

      const textWidth = lines.reduce((maxWidth, line) => {
        const lineWidth = ctx.value.measureText(line).width;
        return Math.max(maxWidth, lineWidth);
      }, 0);
      const textHeight = lines.length * text.lineHeight;

      return { width: textWidth, height: textHeight };
    },

    findText(event, padding = 5) {
      const canvasRect = canvasStore.canvasRect();
      const x = event.clientX - canvasRect.left;
      const y = event.clientY - canvasRect.top;

      let foundTextIndex = -1;

      texts.value.forEach((textObject, index) => {
        const dimensions = this.getTextDimensions(textObject);

        const paddedX = textObject.x - padding;
        const paddedY = textObject.y - padding;
        const paddedWidth = dimensions.width + 2 * padding;
        const paddedHeight = dimensions.height + 2 * padding;

        if (
          x >= paddedX &&
          x <= paddedX + paddedWidth &&
          y >= paddedY &&
          y <= paddedY + paddedHeight
        ) {
          foundTextIndex = index;
        }
      });

      return foundTextIndex;
    },

    drawBorder(x, y, width, height) {
      ctx.value.lineWidth = 3;
      ctx.value.strokeStyle = "#4971FF";
      // const outlineColor = "#D7E0FF";
      const padding = 10;
      const borderRadius = 8;

      const paddedX = x - padding;
      const paddedY = y - padding;
      const paddedWidth = width + 2 * padding;
      const paddedHeight = height + 2 * padding;

      // ctx.value.strokeStyle = outlineColor;
      // ctx.value.strokeRect(
      //   paddedX - 3,
      //   paddedY - 3,
      //   paddedWidth + 6,
      //   paddedHeight + 6
      // );

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

    /*
     * dragging
     */
    startDrag(event) {
      const text = texts.value?.[this.textState.selectedTextIndex];
      if (!text) return;

      this.textState.isDraggingText = true;
      this.textState.dragStart.x =
        event.clientX - canvasStore.canvasRect().left - text.x;
      this.textState.dragStart.y =
        event.clientY - canvasStore.canvasRect().top - text.y;
    },

    endDrag() {
      this.textState.isDraggingText = false;
    },

    dragText(event) {
      if (this.textState.isDraggingText) {
        const newX =
          event.clientX -
          canvasStore.canvasRect().left -
          this.textState.dragStart.x;
        const newY =
          event.clientY -
          canvasStore.canvasRect().top -
          this.textState.dragStart.y;
        this.moveText(newX, newY);
      }
    },

    moveText(newX, newY) {
      const text = texts.value[this.textState.selectedTextIndex];
      const deltaX = newX - text.x;
      const deltaY = newY - text.y;

      text.x += deltaX;
      text.y += deltaY;

      this.redrawCanvas();
    },

    /*
     * customization
     */
    applyFormattingToSelectedText(tag) {
      const selection = window.getSelection();

      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);

        if (
          range.startContainer === range.endContainer &&
          range.startContainer.nodeType === Node.TEXT_NODE
        ) {
          this.textState.customization.formatting.isBold = false;
          this.textState.customization.formatting.isUnderline = false;
          this.textState.customization.formatting.isItalic = false;

          const selectedText = range.toString();

          const element = document.createElement(tag);
          element.textContent = selectedText;
          element.setAttribute(
            "style",
            `color: ${this.textState.customization.color}; font: ${this.textState.customization.font}; font-size: ${this.textState.customization.fontSize}`
          );

          range.deleteContents();
          range.insertNode(element);

          this.redrawCanvas();
        }
      }
    },

    underline(ctx, text, x, y, size, color, thickness) {
      ctx.font = `${size}px ${this.textState.customization.font}`;
      ctx.fillStyle = color;

      const width = ctx.measureText(text).width;
      ctx.fillText(text, x, y);

      const underlineY = y + size + 2;

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.moveTo(x, underlineY);
      ctx.lineTo(x + width, underlineY);
      ctx.stroke();
    },

    /*
     * shortcuts
     */
    shortcuts(event) {
      // delete selected text
      if (event.key === "Delete" || event.key === "Backspace") {
        this.deleteSelectedText(event);
      }

      // deselect
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        this.deselectText();
      }

      // formatting
      if (event.ctrlKey || event.metaKey) {
        // bald
        if (event.key === "b") {
          this.textState.customization.formatting.isBold = true;
          this.applyFormattingToSelectedText("b");
        }

        // underline
        if (event.key === "u") {
          this.textState.customization.formatting.isUnderline = true;
          this.applyFormattingToSelectedText("u");
        }

        // italic
        if (event.key === "i") {
          this.textState.customization.formatting.isItalic = true;
          this.applyFormattingToSelectedText("i");
        }
      }
    },
  },
});
