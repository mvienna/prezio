import Konva from "konva";
import { i18n } from "src/boot/i18n";
import {
  COLOR_PALETTE,
  LAYOUT_ELEMENT_OPTIONS,
} from "src/constants/canvas/canvasVariables";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

const presentationsStore = usePresentationsStore();
const { slide } = storeToRefs(presentationsStore);

export function addText(config = {}, isSave = true) {
  const textNode = new Konva.Text({
    text:
      config.text ||
      i18n.global.t("presentationStudio.layouts.defaultTexts.body"),
    x: config.x || this.scene.width / 4,
    y:
      config.y ||
      this.scene.height / 2 -
        this.text.default.fontSize * this.text.default.lineHeight,
    fontSize: config.fontSize || this.text.default.fontSize,
    fontFamily: config.fontFamily || this.text.default.fontFamily,
    padding: this.text.default.padding,
    draggable: config.draggable !== false,
    fontStyle: config.fontStyle || this.text.default.fontStyle,
    align: config.align || "center",
    width: config.width || this.scene.width / 2,
    name: this.MODE_OPTIONS.TEXT,
    fill: config.fill || this.text.default.fill,
  });

  if (config.layout) {
    textNode.setAttrs({ layout: config.layout });
  }

  this.layers.default.add(textNode);

  textNode.on("transformend", this.handleSlideUpdate);
  this.processText(textNode);

  if (isSave) {
    this.handleSlideUpdate();
  }
}

export function setLayout(layout) {
  this.layers.default.find(this.MODE_OPTIONS.TEXT).forEach((node) => {
    if (node.getAttr("layout")) {
      node.destroy();
    }
  });

  layout.elements.forEach((element) => {
    let options = { layout: layout.name };

    switch (element) {
      case LAYOUT_ELEMENT_OPTIONS.titleCenterAbove:
        options = {
          ...options,
          text: i18n.global.t("presentationStudio.layouts.defaultTexts.title"),
          x: 64,
          y: this.scene.height / 2 - 70 * this.text.default.lineHeight,
          fontSize: 70,
          align: "center",
          width: this.scene.width - 64 * 2,
          fontStyle: "bold",
        };
        break;

      case LAYOUT_ELEMENT_OPTIONS.subtitleCenterBelow:
        options = {
          ...options,
          text: i18n.global.t(
            "presentationStudio.layouts.defaultTexts.subtitle",
          ),
          x: 64,
          y: this.scene.height / 2,
          fontSize: 54,
          align: "center",
          width: this.scene.width - 64 * 2,
          fontStyle: "bold",
        };
        break;

      case LAYOUT_ELEMENT_OPTIONS.title:
        options = {
          ...options,
          text: i18n.global.t("presentationStudio.layouts.defaultTexts.title"),
          x: 64,
          y: 100,
          fontSize: 70,
          align: "left",
          width: this.scene.width - 64 * 2,
          fontStyle: "bold",
        };
        break;

      case LAYOUT_ELEMENT_OPTIONS.body:
        options = {
          ...options,
          text: i18n.global.t("presentationStudio.layouts.defaultTexts.body"),
          x: 64,
          y: 100 + 100,
          fontSize: this.text.default.fontSize,
          align: "left",
          width: this.scene.width - 64 * 2,
          fill: COLOR_PALETTE.GREY,
        };
        break;

      case LAYOUT_ELEMENT_OPTIONS.bodyLeft:
        options = {
          ...options,
          text: i18n.global.t("presentationStudio.layouts.defaultTexts.body"),
          x: 64,
          y: 100 + 100,
          fontSize: this.text.default.fontSize,
          align: "left",
          width: this.scene.width / 2 - 64 - 64 / 2,
          fill: COLOR_PALETTE.GREY,
        };
        break;

      case LAYOUT_ELEMENT_OPTIONS.bodyRight:
        options = {
          ...options,
          text: i18n.global.t("presentationStudio.layouts.defaultTexts.body"),
          x: 64 + this.scene.width / 2 + 64 / 2,
          y: 100 + 100,
          fontSize: this.text.default.fontSize,
          align: "left",
          width: this.scene.width / 2 - 64 - 64 / 2,
          fill: COLOR_PALETTE.GREY,
        };
        break;

      case LAYOUT_ELEMENT_OPTIONS.titleCenterCenter:
        options = {
          ...options,
          text: i18n.global.t("presentationStudio.layouts.defaultTexts.title"),
          x: 64,
          y: this.scene.height / 2 - (70 * this.text.default.lineHeight) / 2,
          fontSize: 70,
          align: "center",
          width: this.scene.width - 64 * 2,
          fontStyle: "bold",
        };
        break;
    }

    this.addText(options, false);
  });

  this.handleSlideUpdate();
}

export function processText(textNode) {
  textNode.on("transform", function () {
    // reset scale, so only with is changing by transformer
    textNode.setAttrs({
      width: textNode.width() * textNode.scaleX(),
      scaleX: 1,
    });
  });

  textNode.on("dblclick dbltap", () => {
    if (!textNode.draggable() && slide.value.type === SLIDE_TYPES.CONTENT)
      return;

    // hide text node and transformer:
    textNode.hide();
    this.transformer.default?.hide();

    this.mode = this.MODE_OPTIONS.TEXT_EDITING;

    // create textarea over canvas with absolute position
    // first we need to find position for textarea
    // how to find it?

    // at first lets find position of text node relative to the stage:
    var textPosition = textNode.absolutePosition();

    const box = this.stages.default.container().getBoundingClientRect();

    // so position of textarea will be the sum of positions above:
    var areaPosition = {
      x: box.left + textPosition.x,
      y: box.top + textPosition.y,
    };

    // create textarea and style it
    var textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    const getRealSize = (size) => {
      return (size * box.width) / this.scene.width;
    };

    // apply many styles to match text on canvas as close as possible
    // remember that text rendering on canvas and on the textarea can be different
    // and sometimes it is hard to make it 100% the same. But we will try...
    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.width =
      getRealSize(textNode.width() - textNode.padding() * 2) + "px";
    textarea.style.height =
      getRealSize(textNode.height() - textNode.padding() * 2 + 5) + "px";
    textarea.style.fontSize = getRealSize(textNode.fontSize()) + "px";
    textarea.style.border = "none";
    textarea.style.padding = getRealSize(textNode.padding()) + "px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.fontWeight = textNode.fontStyle().includes("bold")
      ? "bold"
      : "normal";
    textarea.style.fontStyle = textNode.fontStyle().includes("italic")
      ? "italic"
      : "normal";
    textarea.style.textDecoration = textNode.textDecoration();
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    let rotation = textNode.rotation();
    let transform = "";
    if (rotation) {
      transform += "rotateZ(" + rotation + "deg)";
    }

    let px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += "translateY(-" + px + "px)";

    textarea.style.transform = transform;

    // reset height
    textarea.style.height = "auto";
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + "px";

    textarea.focus();

    const removeTextarea = () => {
      textarea.parentNode.removeChild(textarea);
      window.removeEventListener("click", handleOutsideClick);
      textNode.show();
      this.transformer.default?.show();
      this.transformer.default?.forceUpdate();
      this.mode = null;
    };

    const setTextareaWidth = (newWidth) => {
      if (!newWidth) {
        // set width for placeholder
        newWidth = textNode.placeholder.length * textNode.fontSize();
      }
      // some extra fixes on different browsers
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent,
      );
      const isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }

      const isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
      if (isEdge) {
        newWidth += 1;
      }
      textarea.style.width = newWidth + "px";
    };

    textarea.addEventListener("keydown", function (e) {
      // hide on enter
      // but don't hide on shift + enter
      if (e.keyCode === 13 && !e.shiftKey) {
        textNode.text(textarea.value);
        removeTextarea();
      }
      // on esc do not set value back to node
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });

    textarea.addEventListener("keydown", function (e) {
      let scale = textNode.getAbsoluteScale().x;
      setTextareaWidth(textNode.width() * scale);
      textarea.style.height = "auto";
      textarea.style.height =
        textarea.scrollHeight + textNode.fontSize() + "px";
    });

    const handleOutsideClick = (e) => {
      if (e.target !== textarea) {
        textNode.text(textarea.value);
        removeTextarea();
      }
    };
    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });
  });
}

export function setTextCustomization(node) {
  this.text = {
    ...this.text,
    fontFamily: node.fontFamily(),
    fontSize: node.fontSize(),
    fontStyle: node.fontStyle(),
    textDecoration: node.textDecoration(),
    align: node.align(),
    fill: node.fill(),
  };
}

export function applyTextCustomization(node) {
  node.setAttrs({
    fontFamily: this.text.fontFamily,
    fontSize: this.text.fontSize,
    fontStyle: this.text.fontStyle,
    textDecoration: this.text.textDecoration,
    align: this.text.align,
    fill: this.text.fill,
  });
}
