export function copyNodes(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
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

  this.transformer.default?.nodes(nodes);
  this.copyNodes(nodes);

  this.handleSlideUpdate();
}

export function duplicateNodes(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  this.pasteNodes(nodes);
  this.handleSlideUpdate();
}

export function cutNodes(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  this.copyNodes(nodes);
  this.deleteNodes(nodes);
}

export function deleteNodes(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  this.deselectElements();
  nodes.forEach((node) => node.destroy());
  this.handleSlideUpdate();
}

export function moveUp(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  nodes.forEach((node) => node.moveUp());
  this.handleSlideUpdate();
}

export function moveDown(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  nodes.forEach((node) => node.moveDown());
  this.handleSlideUpdate();
}

export function moveToTop(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  nodes.forEach((node) => node.moveToTop());
  this.handleSlideUpdate();
}

export function moveToBottom(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  nodes.forEach((node) => node.moveToBottom());
  this.handleSlideUpdate();
}