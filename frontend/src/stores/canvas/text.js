import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { ALIGNMENT } from "src/constants/canvas/canvasVariables";
import { generateUniqueId } from "src/helpers/generationUtils";
import {
  deselectElement,
  updateSelectedElement,
} from "stores/canvas/helpers/select";

const {
  MODES_OPTIONS,
  mouse,
  selectedElementBorder,
  elements,
  selectedElement,
  canvas,
} = storeToRefs(useCanvasStore());
const canvasStore = useCanvasStore();

export const useCanvasTextStore = defineStore("canvasText", {
  state: () => ({
    /*
     * input
     */
    input: null,

    /*
     * customization
     */
    customization: {
      color: "#313232",
      fontSize: "14px",
      font: "Arial",
      lineHeight: 1.2,
      formatting: {
        isBold: false,
        isUnderline: false,
        isLineThrough: false,
        isItalic: false,
        alignment: {
          horizontal: ALIGNMENT.horizontal.left,
          vertical: ALIGNMENT.vertical.top,
        },
      },

      default: {
        color: "#313232",
        fontSize: "14px",
        font: "Arial",
        lineHeight: 1.2,
        formatting: {
          isBold: false,
          isUnderline: false,
          isLineThrough: false,
          isItalic: false,
          alignment: {
            horizontal: ALIGNMENT.horizontal.left,
            vertical: ALIGNMENT.vertical.top,
          },
        },
      },
    },

    fontSizeNumber: 14,
  }),

  actions: {
    sanitize(string) {
      const pattern = /<(?!br\s*\/?)[^>]+>/gi;
      if (pattern.test(string)) {
        return string.replace(pattern, "");
      }

      return string;
    },

    /*
     * input life-cycle
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
     * add new text
     */
    addNewText(event) {
      /*
       * create text input
       */
      this.createTextInput();

      this.input.style.left =
        event.clientX - selectedElementBorder.value.borderWidth + "px";
      this.input.style.top =
        event.clientY + selectedElementBorder.value.borderWidth + "px";

      document.body.appendChild(this.input);
      this.input.focus();

      /*
       * apply & select default text input
       */
      this.input.innerHTML = "Enter text here";

      let selection = window.getSelection();
      let range = document.createRange();
      range.selectNodeContents(this.input);
      selection.removeAllRanges();
      selection.addRange(range);

      /*
       * add text to canvas
       */
      canvasStore.computePosition(event);
      const clickedX = mouse.value.x;
      const clickedY = mouse.value.y;

      const addTextToCanvas = () => {
        elements.value.unshift(
          this.computeTextElementProps(clickedX, clickedY)
        );

        canvasStore.redrawCanvas(true, true);
        canvasStore.switchMode(null);
        this.removeTextInput();
        this.clearFormatting();
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
      updateSelectedElement();
      canvasStore.redrawCanvas();

      /*
       * create text input
       */
      this.createTextInput();

      const canvasRect = canvasStore.canvasRect();
      this.input.style.left =
        canvasRect.left +
        canvasStore.computeRealSize(selectedElement.value.x) +
        "px";
      this.input.style.top =
        canvasRect.top +
        canvasStore.computeRealSize(selectedElement.value.y) +
        selectedElementBorder.value.borderWidth +
        "px";

      this.input.style.width =
        canvasStore.computeRealSize(selectedElement.value.width) +
        selectedElementBorder.value.borderWidth +
        "px";
      this.input.style.height =
        canvasStore.computeRealSize(selectedElement.value.height) +
        selectedElementBorder.value.borderWidth +
        "px";

      this.input.style.transform = `rotate(${selectedElement.value.rotationAngle}deg)`;

      document.body.appendChild(this.input);
      this.input.focus();

      // paste text content
      this.input.innerHTML = selectedElement.value.text;
      this.moveInputCursorToTheEnd();

      /*
       * add text to canvas
       */
      const x = selectedElement.value.x;
      const y = selectedElement.value.y;
      const element = selectedElement.value;

      const addTextToCanvas = () => {
        selectedElement.value = this.computeTextElementProps(x, y, element);
        canvasStore.switchMode(MODES_OPTIONS.value.text);
        updateSelectedElement();

        canvasStore.redrawCanvas(true, true);
        this.removeTextInput();
        deselectElement();
        this.clearFormatting();
      };

      /*
       * input events
       */
      this.input.addEventListener("blur", () => {
        addTextToCanvas();
      });

      this.input.addEventListener("keydown", (event) => {
        if (
          (event.key === "Enter" && !event.shiftKey) ||
          event.key === "Escape"
        ) {
          this.input.blur();
        }
      });
    },

    moveInputCursorToTheEnd() {
      // collapse the range to the end.
      const range = document.createRange();
      range.selectNodeContents(this.input);
      range.collapse(false);

      // clear any existing selections.
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    },

    /*
     * customization
     */
    clearFormatting() {
      this.customization = {
        default: this.customization.default,

        color: this.customization.default.color,
        fontSize: this.customization.default.fontSize,
        font: this.customization.default.font,
        lineHeight: this.customization.default.lineHeight,

        formatting: {
          isBold: this.customization.default.formatting.isBold,
          isUnderline: this.customization.default.formatting.isUnderline,
          isLineThrough: this.customization.default.formatting.isLineThrough,
          isItalic: this.customization.default.formatting.isItalic,

          alignment: {
            horizontal: this.customization.default.formatting.horizontal,
            vertical: this.customization.default.formatting.vertical,
          },
        },
      };

      this.fontSizeNumber = parseFloat(this.customization.fontSize);

      this.applyStyles();
    },

    computeTextElementProps(
      x = selectedElement.value?.x,
      y = selectedElement.value?.y,
      element = null
    ) {
      if (!x || !y) return;

      const newTextDecoration = `${
        this.customization.formatting.isLineThrough ? "line-through" : ""
      } ${this.customization.formatting.isUnderline ? "underline" : ""}`;

      const text = this.sanitize(this.input.textContent)
        .replace(/&nbsp;/g, "")
        .trim();

      return {
        id: element?.id || generateUniqueId(undefined, elements.value),
        mode: MODES_OPTIONS.value.text,
        isVisible: true,
        isLocked: false,
        text: text,
        x: x,
        y: y,
        width: canvasStore.computeAdjustedSize(this.input.offsetWidth),
        height: canvasStore.computeAdjustedSize(this.input.offsetHeight),
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
        rotationAngle: selectedElement.value?.rotationAngle || 0,
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
        this.input.style.border = "none";
        this.input.style.outline = "none";
        this.input.style.zIndex = "99999999992";

        this.input.style.color = this.customization.color;
        this.input.style.lineHeight = this.customization.lineHeight;
        this.input.style.fontFamily = this.customization.font;
        this.input.style.fontSize = this.customization.fontSize;
        this.input.style.fontWeight = this.customization.formatting.isBold
          ? "bold"
          : "normal";
        this.input.style.fontStyle = this.customization.formatting.isItalic
          ? "italic"
          : "normal";

        // text decoration
        const newTextDecoration = `${
          this.customization.formatting.isLineThrough ? "line-through" : ""
        } ${this.customization.formatting.isUnderline ? "underline" : ""}`;
        this.input.style.textDecoration = newTextDecoration.trim().length
          ? newTextDecoration
          : "none";

        // alignment
        this.input.style.display = "flex";

        switch (this.customization.formatting.alignment.horizontal) {
          case ALIGNMENT.horizontal.left:
            this.input.style.justifyContent = "flex-start";
            break;

          case ALIGNMENT.horizontal.center:
            this.input.style.justifyContent = "center";
            break;

          case ALIGNMENT.horizontal.right:
            this.input.style.justifyContent = "flex-end";
            break;
        }

        switch (this.customization.formatting.alignment.vertical) {
          case ALIGNMENT.vertical.top:
            this.input.style.alignItems = "flex-start";
            break;

          case ALIGNMENT.vertical.middle:
            this.input.style.alignItems = "center";
            break;

          case ALIGNMENT.vertical.bottom:
            this.input.style.alignItems = "flex-end";
            break;
        }
      }

      /*
       * apply to selected element
       */
      if (
        selectedElement.value &&
        (selectedElement.value.mode === MODES_OPTIONS.value.text ||
          selectedElement.value.mode === MODES_OPTIONS.value.textEditing)
      ) {
        selectedElement.value.color = this.customization.color;

        selectedElement.value.fontFamily = this.customization.font;
        selectedElement.value.fontSize = this.customization.fontSize;
        selectedElement.value.fontWeight = this.customization.formatting.isBold
          ? "bold"
          : "normal";
        selectedElement.value.fontStyle = this.customization.formatting.isItalic
          ? "italic"
          : "normal";

        // text decoration
        const newTextDecoration = `${
          this.customization.formatting.isLineThrough ? "line-through" : ""
        } ${this.customization.formatting.isUnderline ? "underline" : ""}`;
        selectedElement.value.textDecoration = newTextDecoration.trim().length
          ? newTextDecoration
          : "none";

        // alignment
        selectedElement.value.textAlign =
          this.customization.formatting.alignment.horizontal;
        selectedElement.value.verticalAlign =
          this.customization.formatting.alignment.vertical;

        // update
        updateSelectedElement();
        canvasStore.redrawCanvas();
      }
    },

    loadSelectedElementCustomization() {
      this.customization = {
        default: this.customization.default,

        color: selectedElement.value.color,
        fontSize: selectedElement.value.fontSize,
        font: selectedElement.value.fontFamily,
        lineHeight: selectedElement.value.lineHeight,

        formatting: {
          isBold: selectedElement.value.fontWeight === "bold",
          isUnderline:
            selectedElement.value.textDecoration.includes("underline"),
          isLineThrough:
            selectedElement.value.textDecoration.includes("line-through"),
          isItalic: selectedElement.value.fontStyle === "italic",

          alignment: {
            horizontal: selectedElement.value.textAlign,
            vertical: selectedElement.value.verticalAlign,
          },
        },
      };

      this.fontSizeNumber = parseFloat(this.customization.fontSize);

      this.applyStyles();
    },

    /*
     * shortcuts
     */
    shortcuts(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        canvasStore.switchMode(null);
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "b":
            this.customization.formatting.isBold =
              !this.customization.formatting.isBold;

            if (selectedElement.value) {
              this.applyStyles();
            }

            break;

          case "u":
            this.customization.formatting.isUnderline =
              !this.customization.formatting.isUnderline;

            if (selectedElement.value) {
              this.applyStyles();
            }

            break;

          case "i":
            this.customization.formatting.isItalic =
              !this.customization.formatting.isItalic;

            if (selectedElement.value) {
              this.applyStyles();
            }

            break;
        }

        if (event.shiftKey) {
          switch (event.key) {
            case "x":
              this.customization.formatting.isLineThrough =
                !this.customization.formatting.isLineThrough;

              if (selectedElement.value) {
                this.applyStyles();
              }

              break;
          }
        }
      }
    },
  },
});
