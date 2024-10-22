import Konva from "konva";
import { DRAWING_MODES } from "src/constants/canvas/canvasVariables";

export function handleDrawing() {
  this.stages.default.on("mousedown touchstart", this.handleDrawingMouseDown);
  this.stages.default.on("mouseup touchend", this.handleDrawingMouseUp);
  this.stages.default.on("mousemove touchmove", this.handleDrawingMouseMove);
}

export function handleDrawingMouseDown() {
  // disable drawing in other modes
  if (this.mode !== this.MODE_OPTIONS.DRAWING) return;

  // disable drawing while there're selected elements
  if (this.transformer.default?.nodes()?.length) return;

  // temp disable dragging for all elements
  this.layers.default.getChildren().forEach((node) => {
    node.setAttr("draggable--saved", node.draggable());
    node.draggable(false);
  });

  this.drawing.isPainting = true;

  const stageTransform = this.stages.default.getAbsoluteTransform().copy();
  const position = stageTransform
    .invert()
    .point(this.stages.default.getPointerPosition());

  this.drawing.lastLine = new Konva.Line({
    stroke: this.drawing.stroke,
    strokeWidth: this.drawing.strokeWidth,
    globalCompositeOperation:
      this.drawing.mode === DRAWING_MODES.BRUSH
        ? "source-over"
        : "destination-out",
    lineCap: "round",
    lineJoin: "round",
    points: [position.x, position.y, position.x, position.y],
    draggable: true,
    name: this.MODE_OPTIONS.DRAWING,
  });
  this.layers.default.add(this.drawing.lastLine);
}

export function handleDrawingMouseMove(event) {
  if (!this.drawing.isPainting) return;

  // prevent scrolling on touch devices
  event.evt.preventDefault();

  this.layers.default.getChildren().forEach((node) => {
    if (!!node.getAttr("draggable--saved")) {
      node.draggable(node.getAttr("draggable--saved"));
      node.setAttr("draggable--saved", undefined);
    }
  });

  const stageTransform = this.stages.default.getAbsoluteTransform().copy();
  const position = stageTransform
    .invert()
    .point(this.stages.default.getPointerPosition());

  const newPoints = this.drawing.lastLine
    .points()
    .concat([position.x, position.y]);
  this.drawing.lastLine.points(newPoints);
}

export function handleDrawingMouseUp() {
  this.drawing.isPainting = false;

  this.layers.default.getChildren().forEach((node) => {
    if (!!node.getAttr("draggable--saved")) {
      node.draggable(node.getAttr("draggable--saved"));
      node.setAttr("draggable--saved", undefined);
    }
  });

  if (this.mode === this.MODE_OPTIONS.DRAWING) {
    this.handleSlideUpdate();
  }

  // todo: process drawing (on drag it should auto-select the element)
  // this.processDrawing(this.drawing.lastLine);
}

export function processDrawing(drawing) {
  drawing.on("dragstart", this.handleSelectionDragStart);
  drawing.on("transformend", this.handleSnappingEnd);
}

export function setDrawingCustomization(node) {
  this.drawing = {
    ...this.drawing,
    stroke: node.stroke(),
    strokeWidth: node.strokeWidth(),
  };
}

export function applyDrawingCustomization(node) {
  node.setAttrs({
    stroke: this.drawing.stroke,
    strokeWidth: this.drawing.strokeWidth,
  });
}
