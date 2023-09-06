import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import {
  alignment,
  fontOptions,
  fontSizeOptions,
} from "src/constants/canvas/canvasVariables";

const { modes, mouse, elements, canvas, selectedElement } = storeToRefs(
  useCanvasStore()
);
const canvasStore = useCanvasStore();

export const useCanvasTextStore = defineStore("canvasText", {
  state: () => ({
    /*
     * input
     */
    input: null,

    /*
     * other
     */
    isNewText: false,

    /*
     * customization
     */
    customization: {
      color: "#000000",
      fontSize: "16px",
      font: "Arial",
      lineHeight: 1.2,
      formatting: {
        isBold: false,
        isUnderline: false,
        isLineThrough: false,
        isItalic: false,
        alignment: {
          horizontal: alignment.horizontal.left,
          vertical: alignment.vertical.top,
        },
      },
    },
  }),

  actions: {
    redrawCanvas() {
      canvasStore.redrawCanvas();
    },

    /*
     * input
     */
    createTextInput() {
      this.input = document.createElement("div");
      this.input.setAttribute("contentEditable", "true");

      this.applyStyles();
    },

    removeTextInput() {
      this.input.remove();
      this.input = null;
    },

    /*
     * new text
     */
    addNewText(event) {
      /*
       * create text input
       */
      this.createTextInput();
      const borderWidth = 2;
      this.input.style.left = event.clientX - borderWidth + "px";
      this.input.style.top = event.clientY + "px";

      document.body.appendChild(this.input);
      this.input.focus();

      /*
       * add text to canvas
       */
      canvasStore.computePosition(event);
      const clickedX = mouse.value.x;
      const clickedY = mouse.value.y;

      const addTextToCanvas = () => {
        elements.value.push(this.computeTextElementProps(clickedX, clickedY));

        this.isNewText = false;

        this.redrawCanvas();
        this.removeTextInput();
      };

      /*
       * input events
       */
      this.input.addEventListener("blur", () => {
        addTextToCanvas();
      });

      this.input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          this.input.blur();
        }
      });
    },

    /*
     * edit text
     */
    editText() {
      /*
       * remove text from canvas
       */
      selectedElement.value.isVisible = false;
      canvasStore.updateSelectedElement();
      this.redrawCanvas();

      /*
       * create text input
       */
      this.createTextInput();

      const canvasRect = canvasStore.canvasRect();
      this.input.style.left =
        canvasRect.left +
        (selectedElement.value.x * canvasRect.width) / canvas.value.width +
        "px";
      this.input.style.top =
        canvasRect.top +
        (selectedElement.value.y * canvasRect.width) / canvas.value.width +
        "px";

      this.input.style.width = selectedElement.value.width + "px";
      this.input.style.height = selectedElement.value.height + "px";

      document.body.appendChild(this.input);
      this.input.focus();

      // paste text content
      this.input.innerHTML = selectedElement.value.text;

      // collapse the range to the end.
      const range = document.createRange();
      range.selectNodeContents(this.input);
      range.collapse(false);

      // clear any existing selections.
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      /*
       * add text to canvas
       */
      const addTextToCanvas = () => {
        elements.value.push(this.computeTextElementProps());

        canvasStore.switchMode(modes.value.text);
        this.redrawCanvas();
        this.removeTextInput();
      };

      /*
       * input events
       */
      this.input.addEventListener("blur", () => {
        addTextToCanvas();
      });

      this.input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          this.input.blur();
        }
      });
    },

    /*
     * customization
     */
    computeTextElementProps(
      x = selectedElement.value.x,
      y = selectedElement.value.y
    ) {
      const newTextDecoration = `${
        this.customization.formatting.isLineThrough ? "line-through" : ""
      } ${this.customization.formatting.isUnderline ? "underline" : ""}`;

      this.input.innerHTML = this.input.innerHTML.replace(/&nbsp;/g, "").trim();

      return {
        mode: modes.value.text,
        isVisible: true,
        text: this.input.innerHTML,
        x: x,
        y: y,
        width: this.input.offsetWidth,
        height: this.input.offsetHeight,
        color: this.customization.color,
        fontFamily: this.customization.font,
        fontSize: this.customization.fontSize,
        lineHeight: this.customization.lineHeight,
        fontWeight: this.customization.formatting.isBold ? "bold" : "normal",
        textDecoration: newTextDecoration.trim().length
          ? newTextDecoration
          : "none",
        fontStyle: this.customization.formatting.isItalic ? "italic" : "normal",
        textAlign: this.customization.formatting.alignment.horizontal,
        verticalAlign: this.customization.formatting.alignment.vertical,
      };
    },

    applyStyles() {
      /*
       * apply to active input
       */
      if (this.input) {
        this.input.style.position = "absolute";
        this.input.style.resize = "both";
        this.input.style.overflow = "auto";
        this.input.style.minWidth = "1em";
        this.input.style.borderRadius = "4px";
        this.input.style.border = "2px solid #4971FF";
        this.input.style.outline = "3px solid #D7E0FF";
        this.input.style.zIndex = "2";

        // font family
        this.input.style.fontFamily = this.customization.font;

        // font size
        this.input.style.fontSize = this.customization.fontSize;

        // font weight
        this.input.style.fontWeight = this.customization.formatting.isBold
          ? "bold"
          : "normal";

        // text decoration
        const newTextDecoration = `${
          this.customization.formatting.isLineThrough ? "line-through" : ""
        } ${this.customization.formatting.isUnderline ? "underline" : ""}`;
        this.input.style.textDecoration = newTextDecoration.trim().length
          ? newTextDecoration
          : "none";

        // font style
        this.input.style.fontStyle = this.customization.formatting.isItalic
          ? "italic"
          : "normal";

        // color
        this.input.style.color = this.customization.color;

        // alignment
        this.input.style.display = "flex";

        switch (this.customization.formatting.alignment.horizontal) {
          case alignment.horizontal.left:
            this.input.style.justifyContent = "flex-start";
            break;

          case alignment.horizontal.center:
            this.input.style.justifyContent = "center";
            break;

          case alignment.horizontal.right:
            this.input.style.justifyContent = "flex-end";
            break;
        }

        switch (this.customization.formatting.alignment.vertical) {
          case alignment.vertical.top:
            this.input.style.alignItems = "flex-start";
            break;

          case alignment.vertical.middle:
            this.input.style.alignItems = "center";
            break;

          case alignment.vertical.bottom:
            this.input.style.alignItems = "flex-end";
            break;
        }
      }

      /*
       * apply to selected element
       */
      if (
        selectedElement.value &&
        selectedElement.value.mode === modes.value.text
      ) {
        // font family
        selectedElement.value.fontFamily = this.customization.font;

        // font size
        selectedElement.value.fontSize = this.customization.fontSize;

        // color
        selectedElement.value.color = this.customization.color;

        // font weight
        selectedElement.value.fontWeight = this.customization.formatting.isBold
          ? "bold"
          : "normal";

        // text decoration
        const newTextDecoration = `${
          this.customization.formatting.isLineThrough ? "line-through" : ""
        } ${this.customization.formatting.isUnderline ? "underline" : ""}`;
        selectedElement.value.textDecoration = newTextDecoration.trim().length
          ? newTextDecoration
          : "none";

        // font style
        selectedElement.value.fontStyle = this.customization.formatting.isItalic
          ? "italic"
          : "normal";

        selectedElement.value.textAlign =
          this.customization.formatting.alignment.horizontal;
        selectedElement.value.verticalAlign =
          this.customization.formatting.alignment.vertical;

        canvasStore.updateSelectedElement();
        this.redrawCanvas();
      }
    },

    loadSelectedElementCustomization() {
      this.customization.color = selectedElement.value.color;
      this.customization.fontSize = selectedElement.value.fontSize;
      this.customization.font = selectedElement.value.fontFamily;
      this.customization.lineHeight = selectedElement.value.lineHeight;

      this.customization.formatting.isBold =
        selectedElement.value.fontWeight === "bald";
      this.customization.formatting.isUnderline =
        selectedElement.value.textDecoration.includes("underline");
      this.customization.formatting.isLineThrough =
        selectedElement.value.textDecoration.includes("line-through");
      this.customization.formatting.isItalic =
        selectedElement.value.fontStyle === "italic";

      this.customization.formatting.alignment.horizontal =
        selectedElement.value.textAlign;
      this.customization.formatting.alignment.vertical =
        selectedElement.value.verticalAlign;
    },

    /*
     * shortcuts
     */
    shortcuts(event) {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "b":
            this.customization.formatting.isBold =
              !this.customization.formatting.isBold;
            this.applyStyles();
            break;

          case "u":
            this.customization.formatting.isUnderline =
              !this.customization.formatting.isUnderline;
            this.applyStyles();
            break;

          case "i":
            this.customization.formatting.isItalic =
              !this.customization.formatting.isItalic;
            this.applyStyles();
            break;
        }

        if (event.shiftKey) {
          switch (event.key) {
            case "x":
              this.customization.formatting.isLineThrough =
                !this.customization.formatting.isLineThrough;
              this.applyStyles();
              break;
          }
        }
      }
    },
  },
});
