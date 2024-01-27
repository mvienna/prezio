import Konva from "konva";
import { DRAWING_MODES } from "src/constants/canvas/canvasVariables";

export function handleDrawing() {
  this.stages.default.on("mousedown touchstart", this.handleMouseDown);
  this.stages.default.on("mouseup touchend", this.handleMouseUp);
  this.stages.default.on("mousemove touchmove", this.handleMouseMove);
}

export function handleMouseDown() {
  // disable drawing in other modes
  if (this.mode !== this.MODE_OPTIONS.DRAWING) return;

  // disable drawing while there're selected elements
  if (this.transformer.default?.nodes()?.length) return;

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

export function handleMouseUp() {
  this.drawing.isPainting = false;

  // save drawing
  if (this.mode === this.MODE_OPTIONS.DRAWING) {
    this.handleSlideUpdate();
  }
}

export function handleMouseMove(event) {
  if (!this.drawing.isPainting) return;

  // prevent scrolling on touch devices
  event.evt.preventDefault();

  const stageTransform = this.stages.default.getAbsoluteTransform().copy();
  const position = stageTransform
    .invert()
    .point(this.stages.default.getPointerPosition());

  const newPoints = this.drawing.lastLine
    .points()
    .concat([position.x, position.y]);
  this.drawing.lastLine.points(newPoints);
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
