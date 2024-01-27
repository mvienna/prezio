import Konva from "konva";

export function addText(t) {
  const textNode = new Konva.Text({
    text: t("presentationStudio.layouts.defaultTexts.body"),
    x: this.scene.width / 4,
    y: this.scene.height / 2,
    fontSize: this.text.default.fontSize,
    padding: this.text.default.padding,
    draggable: true,
    width: this.scene.width / 2,
    name: this.MODE_OPTIONS.TEXT,
  });

  this.layers.default.add(textNode);

  textNode.on("transformend", this.handleSlideUpdate);
  this.processText(textNode);

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
    // hide text node and transformer:
    textNode.hide();
    this.transformer.default.hide();

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
    console.log(textNode.textDecoration());
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
      this.transformer.default.show();
      this.transformer.default.forceUpdate();
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
