export function setCustomization() {
  const nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes();

  if (nodes) {
    nodes.forEach((node) => {
      switch (node.getAttr("name")) {
        case this.MODE_OPTIONS.IMAGE:
          this.setImageCustomization(node);
          break;

        case this.MODE_OPTIONS.DRAWING:
          this.setDrawingCustomization(node);
          break;

        case this.MODE_OPTIONS.SHAPE:
          this.setShapeCustomization(node);
          break;

        case this.MODE_OPTIONS.TEXT:
          this.setTextCustomization(node);
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
        case this.MODE_OPTIONS.IMAGE:
          this.applyImageCustomization(node);
          break;

        case this.MODE_OPTIONS.DRAWING:
          this.applyDrawingCustomization(node);
          break;

        case this.MODE_OPTIONS.SHAPE:
          this.applyShapeCustomization(node);
          break;

        case this.MODE_OPTIONS.TEXT:
          this.applyTextCustomization(node);
          break;
      }
    });
  }

  this.handleSlideUpdate();
}
