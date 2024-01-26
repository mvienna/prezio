import { SHAPES_OPTIONS } from "src/constants/canvas/canvasVariables";

export function setCustomization() {
  const nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes();

  if (nodes) {
    nodes.forEach((node) => {
      switch (node.getAttr("name")) {
        /*
         * image
         */
        case this.MODE_OPTIONS.image:
          this.image.opacity = node.opacity();

          this.image.cornerRadius = Math.round(
            (node.cornerRadius() / Math.min(node.width(), node.height())) * 100,
          );

          this.image.stroke = node.stroke();
          this.image.strokeWidth =
            !node.strokeWidth() || node.strokeWidth() === 0.1
              ? 0
              : node.strokeWidth();

          this.image.shadowColor = node.shadowColor();
          this.image.shadowBlur = node.shadowBlur();
          this.image.shadowOffset = node.shadowOffset();
          this.image.shadowOpacity = node.shadowOpacity();

          this.image.clipPosition = node.getAttr("lastCropUsed");

          break;

        /*
         * drawing
         */
        case this.MODE_OPTIONS.drawing:
          this.drawing.stroke = node.stroke();
          this.drawing.strokeWidth = node.strokeWidth();

          break;

        /*
         * shape
         */
        case this.MODE_OPTIONS.shape:
          this.shape.opacity = node.opacity();

          if (node.getClassName() === SHAPES_OPTIONS.RECT) {
            this.shape.cornerRadius = Math.round(
              (node.cornerRadius() / Math.min(node.width(), node.height())) *
                100,
            );
          }

          if (
            [SHAPES_OPTIONS.ARROW, SHAPES_OPTIONS.ARROW_DOUBLE].includes(
              node.getClassName(),
            )
          ) {
            this.shape.pointerSize = node.pointerWidth();
          }

          this.shape.fill = node.fill();
          this.shape.stroke = node.stroke();
          this.shape.strokeWidth = node.strokeWidth();

          this.shape.shadowColor = node.shadowColor();
          this.shape.shadowBlur = node.shadowBlur();
          this.shape.shadowOffset = node.shadowOffset();
          this.shape.shadowOpacity = node.shadowOpacity();

          break;
      }
    });
  }
}

export function applyCustomization() {
  const nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes();

  if (nodes) {
    nodes.forEach((node) => {
      switch (node.getAttr("name")) {
        /*
         * image
         */
        case this.MODE_OPTIONS.image:
          node.opacity(this.image.opacity);

          node.cornerRadius(
            Math.min(node.width(), node.height()) *
              (this.image.cornerRadius / 100),
          );

          node.stroke(
            !this.image.strokeWidth ? "transparent" : this.image.stroke,
          );
          node.strokeWidth(
            !this.image.strokeWidth ? 0.1 : Number(this.image.strokeWidth),
          );

          node.shadowColor(this.image.shadowColor);
          node.shadowBlur(this.image.shadowBlur);
          node.shadowOffset(this.image.shadowOffset);
          node.shadowOpacity(this.image.shadowOpacity);

          // crop
          node.setAttrs({
            scaleX: 1,
            scaleY: 1,
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
          });

          node.setAttr("lastCropUsed", this.image.clipPosition);
          const crop = this.getCrop(
            node.image(),
            { width: node.width(), height: node.height() },
            this.image.clipPosition,
          );
          node.setAttrs(crop);

          break;

        /*
         * drawing
         */
        case this.MODE_OPTIONS.drawing:
          node.stroke(this.drawing.stroke);
          node.strokeWidth(this.drawing.strokeWidth);

          break;

        /*
         * shape
         */
        case this.MODE_OPTIONS.shape:
          node.opacity(this.shape.opacity);

          if (node.getClassName() === SHAPES_OPTIONS.RECT) {
            node.cornerRadius(
              Math.min(node.width(), node.height()) *
                (this.shape.cornerRadius / 100),
            );
          }

          if (
            [SHAPES_OPTIONS.ARROW, SHAPES_OPTIONS.ARROW_DOUBLE].includes(
              node.getClassName(),
            )
          ) {
            node.fill(this.shape.stroke);

            node.pointerLength(this.shape.pointerSize);
            node.pointerWidth(this.shape.pointerSize);
          } else {
            node.fill(this.shape.fill);
          }

          node.stroke(this.shape.stroke);
          node.strokeWidth(this.shape.strokeWidth);

          node.shadowColor(this.shape.shadowColor);
          node.shadowBlur(this.shape.shadowBlur);
          node.shadowOffset(this.shape.shadowOffset);
          node.shadowOpacity(this.shape.shadowOpacity);

          break;
      }
    });
  }

  this.handleSlideUpdate();
}

export function copyNodes(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default.nodes(),
) {
  this.copiedNodes = nodes;
  this.deselectElements();
}

export function pasteNodes(nodes = this.copiedNodes) {
  nodes = nodes.map((node) => {
    let clone = node.clone();
    clone.x(clone.x() + 100);
    clone.y(clone.y() + 100);
    this.layers.default.add(clone);
    if (clone.getClassName() === "Image") {
      this.processImageNode(
        clone,
        clone.getAttr("source"),
        clone.getAttr("lastCropUsed"),
      );
    }
    return clone;
  });

  this.transformer.default.nodes(nodes);
  this.copyNodes(nodes);

  this.handleSlideUpdate();
}

export function duplicateNodes(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default.nodes(),
) {
  this.pasteNodes(nodes);
  this.handleSlideUpdate();
}

export function cutNodes(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default.nodes(),
) {
  this.copyNodes(nodes);
  this.deleteNodes(nodes);
}

export function deleteNodes(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default.nodes(),
) {
  this.deselectElements();
  nodes.forEach((node) => node.destroy());
  this.handleSlideUpdate();
}

export function moveUp(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default.nodes(),
) {
  nodes.forEach((node) => node.moveUp());
  this.handleSlideUpdate();
}

export function moveDown(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default.nodes(),
) {
  nodes.forEach((node) => node.moveDown());
  this.handleSlideUpdate();
}

export function moveToTop(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default.nodes(),
) {
  nodes.forEach((node) => node.moveToTop());
  this.handleSlideUpdate();
}

export function moveToBottom(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default.nodes(),
) {
  nodes.forEach((node) => node.moveToBottom());
  this.handleSlideUpdate();
}
