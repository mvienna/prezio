import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

const presentationsStore = usePresentationsStore();
const { slide } = storeToRefs(presentationsStore);

export function copyNodes(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  if (!nodes?.length) return;
  this.copiedNodes = nodes;
}

export function pasteNodes(nodes = this.copiedNodes) {
  if (slide.value.type !== SLIDE_TYPES.CONTENT) return;
  if (!nodes?.length) return;

  nodes = nodes.map((node) => {
    let clone = node.clone();
    clone.x(clone.x() + 100);
    clone.y(clone.y() + 100);

    // calculate new z-index for the cloned node
    const originalZIndex = node.zIndex();
    const newZIndex = originalZIndex + 1;

    this.layers.default.add(clone);

    // ensure the clone is placed right above the original node
    clone.moveToTop(); // temp. move to top to ensure it's above any node
    clone.zIndex(newZIndex); // set its z-index to be right above the original

    switch (clone.getClassName()) {
      case this.MODE_OPTIONS.IMAGE:
        this.processImageNode(
          clone,
          clone.getAttr("source"),
          clone.getAttr("lastCropUsed"),
        );
        break;
      case this.MODE_OPTIONS.TEXT:
        this.processText(clone);
        break;
      case this.MODE_OPTIONS.SHAPE:
        this.processShape(clone);
        break;
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
  if (!nodes?.length) return;
  this.pasteNodes(nodes);
  this.handleSlideUpdate();
}

export function cutNodes(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  if (!nodes?.length) return;
  this.copyNodes(nodes);
  this.deleteNodes(nodes);
}

export function deleteNodes(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  if (!nodes?.length) return;
  this.deselectElements();
  nodes.forEach((node) => node.destroy());
  this.handleSlideUpdate();
}

export function moveUp(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  if (!nodes?.length) return;
  nodes.forEach((node) => node.moveUp());
  this.handleSlideUpdate();
}

export function moveDown(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  if (!nodes?.length) return;
  nodes.forEach((node) => node.moveDown());
  this.handleSlideUpdate();
}

export function moveToTop(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  if (!nodes?.length) return;
  nodes.forEach((node) => node.moveToTop());
  this.handleSlideUpdate();
}

export function moveToBottom(
  nodes = this.transformer.custom.shape.node
    ? [this.transformer.custom.shape.node]
    : this.transformer.default?.nodes(),
) {
  if (!nodes?.length) return;
  nodes.forEach((node) => node.moveToBottom());
  this.handleSlideUpdate();
}
