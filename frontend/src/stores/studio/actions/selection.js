import Konva from "konva";
import {
  COLOR_PALETTE,
  COLOR_SCHEME_OPTIONS,
  SHAPES_OPTIONS,
} from "src/constants/canvas/canvasVariables";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

const presentationsStore = usePresentationsStore();
const { slide } = storeToRefs(presentationsStore);

export function handleSelection() {
  this.stages.default.find("Transformer")?.forEach((node) => node.destroy());

  this.transformer.default = new Konva.Transformer({
    nodes: [],
    rotationSnaps: [0, 90, 180, 270],
    anchorStroke:
      slide.value.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
        ? COLOR_PALETTE.BLACK
        : COLOR_PALETTE.WHITE,
    anchorFill:
      slide.value.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
        ? COLOR_PALETTE.WHITE
        : COLOR_PALETTE.BLACK,
    borderStroke:
      slide.value.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
        ? COLOR_PALETTE.BLACK
        : COLOR_PALETTE.WHITE,
    anchorSize: 12,
    keepRatio: false,
    boundBoxFunc: (oldBox, newBox) => {
      if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
        return oldBox;
      }
      return newBox;
    },
    anchorStyleFunc: (anchor) => {
      if (anchor.hasName("rotater")) {
        const size = 14;
        anchor.width(size);
        anchor.height(size);
        anchor.offsetY(size / 2);
        anchor.offsetX(size / 2);
        anchor.cornerRadius(size);
      } else {
        anchor.cornerRadius(2);
      }
    },
  });

  this.layers.default.add(this.transformer.default);
  this.transformer.default?.moveToTop();

  this.transformer.default?.on("transform", () => {
    this.isTransforming = true;
  });
  this.transformer.default?.on("transformend", () => {
    this.isTransforming = false;
  });

  this.layers.default.find(".selectionRect")?.forEach((node) => node.destroy());
  this.selection.rect = new Konva.Rect({
    fill:
      slide.value.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
        ? COLOR_PALETTE.BLACK_TRANSPARENT
        : COLOR_PALETTE.WHITE_TRANSPARENT,
    visible: false,
    name: "selectionRect",
  });
  this.layers.default.add(this.selection.rect);

  this.stages.default.on("mousedown", this.handleSelectionMouseDown);
  this.stages.default.on("click", this.handleSelectionClick);
}

export function handleSelectionMouseDown(event) {
  // disable selection if mouse is not on the stage
  // gives ability to start dragging an element right away, otherwise it would start selecting
  if (event.target.getClassName() !== "Stage") return;

  // disable selecting in drawing mode
  if (this.mode === this.MODE_OPTIONS.DRAWING) return;

  event.evt.preventDefault();

  const stageTransform = this.stages.default.getAbsoluteTransform().copy();
  const position = stageTransform
    .invert()
    .point(this.stages.default.getPointerPosition());

  this.selection.rect.fill(
    slide.value.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
      ? COLOR_PALETTE.BLACK_TRANSPARENT
      : COLOR_PALETTE.WHITE_TRANSPARENT,
  );

  this.selection.x1 = position.x;
  this.selection.y1 = position.y;
  this.selection.x2 = position.x;
  this.selection.y2 = position.y;

  this.selection.rect.width(0);
  this.selection.rect.height(0);
  this.selection.isSelecting = true;

  // Register global event listeners
  window.addEventListener("mousemove", this.handleSelectionMouseMove);
  window.addEventListener("mouseup", this.handleSelectionMouseUp);
}

export function handleSelectionMouseMove(event) {
  if (!this.selection.isSelecting) return;

  // Convert the global mouse position to the stage's local coordinates
  const stageBox = this.stages.default.container().getBoundingClientRect();
  const scale = this.stages.default.scaleX(); // Assuming scaleX and scaleY are the same
  const position = {
    x: (event.clientX - stageBox.left) / scale,
    y: (event.clientY - stageBox.top) / scale,
  };

  this.selection.x2 = position.x;
  this.selection.y2 = position.y;

  this.selection.rect.setAttrs({
    visible: true,
    x: Math.min(this.selection.x1, this.selection.x2),
    y: Math.min(this.selection.y1, this.selection.y2),
    width: Math.abs(this.selection.x2 - this.selection.x1),
    height: Math.abs(this.selection.y2 - this.selection.y1),
  });
}

export function handleSelectionMouseUp(event) {
  this.selection.isSelecting = false;
  if (!this.selection.rect.visible()) {
    return;
  }

  this.selection.rect.visible(false);

  const elements = this.stages.default.find((node) => {
    return (
      Object.values(this.MODE_OPTIONS).includes(node.getAttr("name")) &&
      node.getLayer().attrs.name === "defaultLayer" &&
      node.draggable() &&
      node.visible()
    );
  });
  const box = this.selection.rect.getClientRect();

  const selected = elements.filter((shape) =>
    Konva.Util.haveIntersection(box, shape.getClientRect()),
  );

  this.transformer.default?.nodes(selected);

  this.applyTransformerCustomization();

  window.removeEventListener("mousemove", this.handleSelectionMouseMove);
  window.removeEventListener("mouseup", this.handleSelectionMouseUp);
}

export function handleSelectionClick(event) {
  // if we are selecting with rect, do nothing
  if (this.selection.rect.visible()) return;

  // if click on empty area - remove all selections
  if (event.target.getClassName() === "Stage") {
    this.deselectElements();
    return;
  }

  if (event.target.getAttr("name") === this.MODE_OPTIONS.SHAPE) {
    if (
      [
        SHAPES_OPTIONS.LINE,
        SHAPES_OPTIONS.ARROW,
        SHAPES_OPTIONS.ARROW_DOUBLE,
      ].includes(event.target.getClassName())
    ) {
      this.setCustomShapeTransformer(event.target);
      return;
    }
  }

  if (
    !Object.values(this.MODE_OPTIONS).includes(event.target.getAttr("name")) ||
    !event.target.draggable() ||
    !event.target.visible()
  )
    return;

  // do we pressed shift or ctrl?
  const metaPressed =
    event.evt.shiftKey || event.evt.ctrlKey || event.evt.metaKey;
  const isSelected =
    this.transformer.default?.nodes().indexOf(event.target) >= 0;

  if (!metaPressed && !isSelected) {
    // if no key pressed and the node is not selected
    // select just one
    this.transformer.default?.nodes([event.target]);
  } else if (metaPressed && isSelected) {
    // if we pressed keys and node was selected
    // we need to remove it from selection:
    const nodes = this.transformer.default?.nodes().slice(); // use slice to have new copy of array
    // remove node from array
    nodes.splice(nodes.indexOf(event.target), 1);
    this.transformer.default?.nodes(nodes);
  } else if (metaPressed && !isSelected) {
    // add the node into selection
    const nodes = this.transformer.default?.nodes().concat([event.target]);
    this.transformer.default?.nodes(nodes);
  }

  this.applyTransformerCustomization();
  this.setCustomization();
}

export function deselectElements() {
  this.layers.default
    .find(".customTransformer")
    .forEach((node) => node.destroy());
  this.mode = null;
  this.transformer.custom.shape.node = null;
  this.transformer.default?.nodes([]);
}

/*
 * transformers
 */
export function setCustomShapeTransformer(node) {
  this.deselectElements();
  this.transformer.custom.shape.node = node;

  this.transformer.custom.shape.anchor1 = new Konva.Circle({
    x:
      this.transformer.custom.shape.node.x() +
      this.transformer.custom.shape.node.points()[0],
    y:
      this.transformer.custom.shape.node.y() +
      this.transformer.custom.shape.node.points()[1],
    radius: 10,
    fill: COLOR_PALETTE.PRIMARY,
    stroke: COLOR_PALETTE.WHITE,
    strokeWidth: 4,
    draggable: true,
    name: "customTransformer",
  });
  this.layers.default.add(this.transformer.custom.shape.anchor1);

  this.transformer.custom.shape.anchor2 = new Konva.Circle({
    x:
      this.transformer.custom.shape.node.x() +
      this.transformer.custom.shape.node.points()[2],
    y:
      this.transformer.custom.shape.node.y() +
      this.transformer.custom.shape.node.points()[3],
    radius: 10,
    fill: COLOR_PALETTE.PRIMARY,
    stroke: COLOR_PALETTE.WHITE,
    strokeWidth: 4,
    draggable: true,
    name: "customTransformer",
  });
  this.layers.default.add(this.transformer.custom.shape.anchor2);

  const updateLine = () => {
    if (!this.transformer.custom.shape.node) return;

    this.transformer.custom.shape.node.points([
      this.transformer.custom.shape.anchor1.x() -
        this.transformer.custom.shape.node.x(),
      this.transformer.custom.shape.anchor1.y() -
        this.transformer.custom.shape.node.y(),
      this.transformer.custom.shape.anchor2.x() -
        this.transformer.custom.shape.node.x(),
      this.transformer.custom.shape.anchor2.y() -
        this.transformer.custom.shape.node.y(),
    ]);
  };
  this.transformer.custom.shape.anchor1.on("dragmove", updateLine);
  this.transformer.custom.shape.anchor2.on("dragmove", updateLine);

  const updateAnchors = () => {
    if (!this.transformer.custom.shape.node) return;

    this.transformer.custom.shape.anchor1.x(
      this.transformer.custom.shape.node.x() +
        this.transformer.custom.shape.node.points()[0],
    );
    this.transformer.custom.shape.anchor1.y(
      this.transformer.custom.shape.node.y() +
        this.transformer.custom.shape.node.points()[1],
    );
    this.transformer.custom.shape.anchor2.x(
      this.transformer.custom.shape.node.x() +
        this.transformer.custom.shape.node.points()[2],
    );
    this.transformer.custom.shape.anchor2.y(
      this.transformer.custom.shape.node.y() +
        this.transformer.custom.shape.node.points()[3],
    );
  };
  this.transformer.custom.shape.node.on("dragmove", updateAnchors);

  this.setCustomization();
}

export function applyTransformerCustomization() {
  this.layers.default
    .find(".customTransformer")
    .forEach((node) => node.destroy());
  this.transformer.custom.shape.node = null;

  if (!this.transformer.default) return;

  this.transformer.default?.setAttrs({
    anchorStroke:
      slide.value.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
        ? COLOR_PALETTE.BLACK
        : COLOR_PALETTE.WHITE,
    anchorFill:
      slide.value.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
        ? COLOR_PALETTE.WHITE
        : COLOR_PALETTE.BLACK,
    borderStroke:
      slide.value.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
        ? COLOR_PALETTE.BLACK
        : COLOR_PALETTE.WHITE,
    anchorStyleFunc: function (anchor) {
      if (anchor.hasName("rotater")) {
        const size = 14;
        anchor.width(size);
        anchor.height(size);
        anchor.offsetY(size / 2);
        anchor.offsetX(size / 2);
        anchor.cornerRadius(size);
      } else {
        anchor.cornerRadius(2);
      }
    },
    keepRatio: this.transformer.default
      .nodes()
      .filter((node) =>
        [this.MODE_OPTIONS.SHAPE].includes(node.getAttr("name")),
      ).length,
    enabledAnchors: this.transformer.default
      .nodes()
      .filter((node) => node.getAttr("name") === this.MODE_OPTIONS.TEXT).length
      ? ["middle-left", "middle-right"]
      : [
          "top-left",
          "top-center",
          "top-right",
          "middle-right",
          "middle-left",
          "bottom-left",
          "bottom-center",
          "bottom-right",
        ],
  });

  if (
    this.transformer.default
      .nodes()
      .filter((node) => node.getAttr("name") === this.MODE_OPTIONS.TEXT).length
  ) {
    this.transformer.default?.setAttrs({
      boundBoxFunc: function (oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
  }
}
