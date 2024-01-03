import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { ALIGNMENT } from "src/constants/canvas/canvasVariables";
import { generateUniqueId } from "src/helpers/generationUtils";
import {
  deselectElement,
  selectElement,
  syncSelectedElementWithStoredElements,
} from "stores/canvas/helpers/select";

const {
  MODE_OPTIONS,
  mouse,
  selectedElementBorder,
  elements,
  selectedElement,
  resizeHandle,
  rotationHandle,
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
      fontSize: "38px",
      font: "Arial",
      lineHeight: 1.2,
      formatting: {
        isBold: false,
        isUnderline: false,
        isLineThrough: false,
        isItalic: false,
        textAlign: ALIGNMENT.horizontal.left,
        verticalAlign: ALIGNMENT.vertical.top,
      },

      default: {
        color: "#313232",
        fontSize: "38px",
        font: "Arial",
        lineHeight: 1.2,
        formatting: {
          isBold: false,
          isUnderline: false,
          isLineThrough: false,
          isItalic: false,
          textAlign: ALIGNMENT.horizontal.left,
          verticalAlign: ALIGNMENT.vertical.top,
        },
      },
    },

    fontSizeNumber: 16,
  }),

  actions: {
    handleInputPasteEvent(event) {
      event.stopPropagation();
      event.preventDefault();

      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData("Text");

      document.execCommand("insertText", false, pastedData);
    },

    handleInputTypingEvent() {
      if (!selectedElement.value) return;

      selectedElement.value.text = this.input.innerHTML;
      syncSelectedElementWithStoredElements();

      canvasStore.redrawCanvas(false);

      this.input.style.height =
        canvasStore.computeRealSize(selectedElement.value.height) + "px";
    },

    /*
     * input life-cycle
     */
    createTextInput() {
      this.input = document.createElement("div");
      this.input.setAttribute("contentEditable", "true");
      this.input.addEventListener("paste", this.handleInputPasteEvent);
      this.input.addEventListener("input", this.handleInputTypingEvent);

      this.applyStyles();
    },

    removeTextInput() {
      this.input.removeEventListener("paste", this.handleInputPasteEvent);
      this.input.removeEventListener("input", this.handleInputTypingEvent);
      this.input.remove();
      this.input = null;
    },

    /*
     * add new text
     */
    addNewText(event = null, t) {
      this.clearFormatting();

      /*
       * create text input
       */
      this.createTextInput();

      /*
       * compute default center position
       */
      if (!event) {
        const canvasRect = canvasStore.canvasRect();

        const canvasWidth = canvasStore.computeRealSize(canvas.value.width);
        const canvasHeight = canvasStore.computeRealSize(canvas.value.height);

        const inputWidth = 231;
        const inputHeight = 21;

        event = {
          clientX: canvasRect.left + canvasWidth / 2 - inputWidth / 2,
          clientY: canvasRect.top + canvasHeight / 2 - inputHeight / 2,
        };
      }

      /*
       * re-position & append input
       */
      this.input.style.left =
        event.clientX - selectedElementBorder.value.borderWidth + "px";
      this.input.style.top =
        event.clientY + selectedElementBorder.value.borderWidth + "px";

      document.body.appendChild(this.input);

      /*
       * set default input text
       */
      this.input.innerHTML = t("presentationStudio.toolbar.text.newTextValue");

      /*
       * add text to canvas and start editing it
       */
      canvasStore.computePosition(event);

      elements.value.unshift(
        this.computeTextElementProps(mouse.value.x, mouse.value.y)
      );

      canvasStore.switchMode(MODE_OPTIONS.value.textEditing);
      this.removeTextInput();

      selectElement(elements.value[0]);
      this.editText();

      /*
       * select default text
       */
      let selection = window.getSelection();
      let range = document.createRange();
      range.selectNodeContents(this.input);
      selection.removeAllRanges();
      selection.addRange(range);
    },

    /*
     * edit text
     */
    editText() {
      /*
       * remove text from canvas
       */
      selectedElement.value.isVisible = false;
      syncSelectedElementWithStoredElements();
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
       * select default text
       */
      if (
        selectedElement.value.text.includes("Нажмите чтобы добавить") ||
        selectedElement.value.text.includes("Click to add")
      ) {
        let selection = window.getSelection();
        let range = document.createRange();
        range.selectNodeContents(this.input);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      /*
       * add text to canvas
       */
      const x = selectedElement.value.x;
      const y = selectedElement.value.y;
      const element = selectedElement.value;

      const addTextToCanvas = () => {
        selectedElement.value = {
          ...this.computeTextElementProps(x, y, element.id),
        };
        canvasStore.switchMode(MODE_OPTIONS.value.text);
        syncSelectedElementWithStoredElements();

        canvasStore.redrawCanvas();
        this.removeTextInput();
        deselectElement();
        this.clearFormatting();
      };

      /*
       * input events
       */
      this.input.addEventListener("blur", () => {
        if (!resizeHandle.value && !rotationHandle.value) {
          addTextToCanvas();
        }
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
          textAlign: this.customization.default.formatting.textAlign,
          verticalAlign: this.customization.default.formatting.verticalAlign,
        },
      };

      this.fontSizeNumber = parseFloat(this.customization.fontSize);

      this.applyStyles();
    },

    computeTextElementProps(
      x = selectedElement.value?.x,
      y = selectedElement.value?.y,
      id = generateUniqueId(undefined, elements.value)
    ) {
      if (!x || !y) return;

      const newTextDecoration = `${
        this.customization.formatting.isLineThrough ? "line-through" : ""
      } ${this.customization.formatting.isUnderline ? "underline" : ""}`;

      const text = this.input.innerHTML
        .replace(/<(?!br\s*\/?)[^>]+>/g, "")
        .trim();

      return {
        id: id,
        mode: MODE_OPTIONS.value.text,
        isVisible: true,
        isLocked: false,
        text: text,
        x: x,
        y: y,
        width: canvasStore.computeAdjustedSize(this.input.offsetWidth),
        height: canvasStore.computeAdjustedSize(this.input.offsetHeight), // computed automatically
        color: this.customization.color,
        fontFamily: this.customization.font,
        fontSize: this.customization.fontSize,
        lineHeight: this.customization.lineHeight,
        fontWeight: this.customization.formatting.isBold ? "bold" : "normal",
        textDecoration: newTextDecoration.trim().length
          ? newTextDecoration
          : "none",
        fontStyle: this.customization.formatting.isItalic ? "italic" : "normal",
        textAlign: this.customization.formatting.textAlign,
        verticalAlign: this.customization.formatting.verticalAlign,
        rotationAngle: selectedElement.value?.rotationAngle || 0,
      };
    },

    applyStyles() {
      /*
       * apply to active input
       */
      if (this.input) {
        this.input.style.position = "absolute";
        this.input.style.minWidth = "1em";
        this.input.style.minHeight = "1em";
        this.input.style.border = "none";
        this.input.style.outline = "none";
        this.input.style.zIndex = "2";
        this.input.style.marginTop = "-1px";
        this.input.style.padding = canvasStore.computeRealSize(20) + "px";
        // this.input.style.wordBreak = "break-all";

        this.input.style.color = this.customization.color;
        this.input.style.lineHeight = this.customization.lineHeight;
        this.input.style.fontFamily = this.customization.font;
        this.input.style.fontSize =
          canvasStore.computeRealSize(parseFloat(this.customization.fontSize)) +
          "px";
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
        this.input.style.textAlign = this.customization.formatting.textAlign;

        // this.input.style.display = "flex";
        //
        // switch (this.customization.formatting.textAlign) {
        //   case ALIGNMENT.horizontal.left:
        //     this.input.style.justifyContent = "flex-start";
        //     break;
        //
        //   case ALIGNMENT.horizontal.center:
        //     this.input.style.justifyContent = "center";
        //     break;
        //
        //   case ALIGNMENT.horizontal.right:
        //     this.input.style.justifyContent = "flex-end";
        //     break;
        // }

        // switch (this.customization.formatting.verticalAlign) {
        //   case ALIGNMENT.vertical.top:
        //     this.input.style.alignItems = "flex-start";
        //     break;
        //
        //   case ALIGNMENT.vertical.middle:
        //     this.input.style.alignItems = "center";
        //     break;
        //
        //   case ALIGNMENT.vertical.bottom:
        //     this.input.style.alignItems = "flex-end";
        //     break;
        // }
      }

      /*
       * apply to selected element
       */
      if (
        selectedElement.value &&
        (selectedElement.value.mode === MODE_OPTIONS.value.text ||
          selectedElement.value.mode === MODE_OPTIONS.value.textEditing)
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
          this.customization.formatting.textAlign;
        selectedElement.value.verticalAlign =
          this.customization.formatting.verticalAlign;

        // update
        syncSelectedElementWithStoredElements();
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

          textAlign: selectedElement.value.textAlign,
          verticalAlign: selectedElement.value.verticalAlign,
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
