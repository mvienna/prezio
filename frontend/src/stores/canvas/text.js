import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { ALIGNMENT } from "src/constants/canvas/canvasVariables";
import { generateUniqueId } from "src/helpers/generationUtils";
import { updateSelectedElement } from "stores/canvas/helpers/select";

const {
  MODES_OPTIONS,
  mouse,
  selectedElementBorder,
  elements,
  canvas,
  selectedElement,
} = storeToRefs(useCanvasStore());
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
      color: "#313232",
      fontSize: "16px",
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
  }),

  actions: {
    sanitize() {
      const pattern = /<(?!br\s*\/?)[^>]+>/gi;
      if (pattern.test(this.input.textContent)) {
        this.input.innerHTML = this.input.textContent.replace(pattern, "");
        this.moveInputCursorToTheEnd();
      }
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
      this.input.removeEventListener("input", this.sanitize);
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
       * add text to canvas
       */
      canvasStore.computePosition(event);
      const clickedX = mouse.value.x;
      const clickedY = mouse.value.y;

      const addTextToCanvas = () => {
        elements.value.unshift(
          this.computeTextElementProps(clickedX, clickedY)
        );

        this.isNewText = false;

        canvasStore.redrawCanvas(true, true);
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
      updateSelectedElement();
      canvasStore.redrawCanvas();

      /*
       * create text input
       */
      this.createTextInput();

      const canvasRect = canvasStore.canvasRect();
      this.input.style.left =
        canvasRect.left +
        (selectedElement.value.x * canvasRect.width) / canvas.value.width -
        selectedElementBorder.value.borderWidth +
        "px";
      this.input.style.top =
        canvasRect.top +
        (selectedElement.value.y * canvasRect.width) / canvas.value.width +
        selectedElementBorder.value.borderWidth +
        "px";

      this.input.style.width = selectedElement.value.width + "px";
      this.input.style.height = selectedElement.value.height + "px";

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

      const addTextToCanvas = () => {
        selectedElement.value = this.computeTextElementProps(x, y);
        canvasStore.switchMode(MODES_OPTIONS.value.text);
        updateSelectedElement();

        canvasStore.redrawCanvas(true, true);
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
      this.customization.color = "#000000";
      this.customization.fontSize = "16px";
      this.customization.font = "Arial";
      this.customization.lineHeight = 1.2;
      this.customization.formatting.isBold = false;
      this.customization.formatting.isUnderline = false;
      this.customization.formatting.isLineThrough = false;
      this.customization.formatting.isItalic = false;
      this.customization.formatting.alignment = {
        horizontal: ALIGNMENT.horizontal.left,
        vertical: ALIGNMENT.vertical.top,
      };

      this.applyStyles();
    },

    computeTextElementProps(
      x = selectedElement.value?.x,
      y = selectedElement.value?.y
    ) {
      if (!x || !y) return;

      const newTextDecoration = `${
        this.customization.formatting.isLineThrough ? "line-through" : ""
      } ${this.customization.formatting.isUnderline ? "underline" : ""}`;

      this.input.innerHTML = this.input.innerHTML.replace(/&nbsp;/g, "").trim();

      return {
        id: generateUniqueId(undefined, elements.value),
        mode: MODES_OPTIONS.value.text,
        isVisible: true,
        isLocked: false,
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
        this.input.style.borderRadius = "4px";
        this.input.style.border = "2px solid #4971FF";
        this.input.style.outline = "3px solid #D7E0FF";
        this.input.style.zIndex = "2";

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
      this.customization.color = selectedElement.value.color;
      this.customization.fontSize = selectedElement.value.fontSize;
      this.customization.font = selectedElement.value.fontFamily;
      this.customization.lineHeight = selectedElement.value.lineHeight;

      this.customization.formatting.isBold =
        selectedElement.value.fontWeight === "bold";
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
