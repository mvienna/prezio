import { SHAPES_OPTIONS } from "src/constants/canvas/canvasVariables";
import Konva from "konva";

export function addShape(shapeName) {
  let shapeNode;
  const size = 200;

  const shapeDefaultConfig = {
    opacity: this.shape.default.opacity,
    fill: this.shape.default.fill,
    stroke: this.shape.default.stroke,
    strokeWidth: this.shape.default.strokeWidth,
    lineCap: "round",
    lineJoin: "round",
    draggable: true,
    name: this.MODE_OPTIONS.SHAPE,
  };

  switch (shapeName) {
    /*
     * lines
     */
    case SHAPES_OPTIONS.LINE:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        x: this.scene.width / 4,
        y: this.scene.height / 2,
        points: [0, 0, this.scene.width / 2, 0],
        strokeWidth: 25,
      });
      break;

    case SHAPES_OPTIONS.ARROW:
      shapeNode = new Konva.Arrow({
        ...shapeDefaultConfig,
        x: this.scene.width / 4,
        y: this.scene.height / 2,
        points: [0, 0, this.scene.width / 2, 0],
        pointerLength: this.shape.pointerSize,
        pointerWidth: this.shape.pointerSize,
        strokeWidth: 25,
        pointerAtEnding: true,
      });
      break;

    case SHAPES_OPTIONS.ARROW_DOUBLE:
      shapeNode = new Konva.Arrow({
        ...shapeDefaultConfig,
        x: this.scene.width / 4,
        y: this.scene.height / 2,
        points: [0, 0, this.scene.width / 2, 0],
        pointerLength: this.shape.pointerSize,
        pointerWidth: this.shape.pointerSize,
        strokeWidth: 25,
        pointerAtBeginning: true,
        pointerAtEnding: true,
      });
      break;

    /*
     * simple shapes
     */
    case SHAPES_OPTIONS.CIRCLE:
      shapeNode = new Konva.Circle({
        ...shapeDefaultConfig,
        x: this.scene.width / 2,
        y: this.scene.height / 2,
        radius: size / 2,
      });
      break;

    case SHAPES_OPTIONS.RECT:
      shapeNode = new Konva.Rect({
        ...shapeDefaultConfig,
        x: this.scene.width / 2 - size / 2,
        y: this.scene.height / 2 - size / 2,
        width: size,
        height: size,
        cornerRadius: this.shape.cornerRadius,
      });
      break;

    case SHAPES_OPTIONS.STAR:
      shapeNode = new Konva.Star({
        ...shapeDefaultConfig,
        x: this.scene.width / 2,
        y: this.scene.height / 2,
        numPoints: 5,
        innerRadius: size / 3,
        outerRadius: size - size / 3,
      });
      break;

    case SHAPES_OPTIONS.TRIANGLE:
      shapeNode = new Konva.RegularPolygon({
        ...shapeDefaultConfig,
        x: this.scene.width / 2,
        y: this.scene.height / 2,
        radius: size / 2,
        sides: 3,
      });

      break;

    case SHAPES_OPTIONS.POLYGON:
      shapeNode = new Konva.RegularPolygon({
        ...shapeDefaultConfig,
        x: this.scene.width / 2,
        y: this.scene.height / 2,
        radius: size / 2,
        sides: 6,
        rotation: -90,
      });
      break;
  }

  this.layers.default.add(shapeNode);

  this.handleSlideUpdate();

  shape.on("transformend", this.handleSlideUpdate);
}

export function setShapeCustomization(node) {
  this.shape = {
    ...this.shape,
    opacity: node.opacity(),
    fill: node.fill(),
    stroke: node.stroke(),
    strokeWidth: node.strokeWidth(),
    shadowColor: node.shadowColor(),
    shadowBlur: node.shadowBlur(),
    shadowOffset: node.shadowOffset(),
    shadowOpacity: node.shadowOpacity(),
    cornerRadius:
      node.getClassName() === SHAPES_OPTIONS.RECT
        ? Math.round(
            (node.cornerRadius() / Math.min(node.width(), node.height())) * 100,
          )
        : null,
    pointerSize: [SHAPES_OPTIONS.ARROW, SHAPES_OPTIONS.ARROW_DOUBLE].includes(
      node.getClassName(),
    )
      ? node.pointerWidth()
      : null,
  };
}

export function applyShapeCustomization(node) {
  node.setAttrs({
    opacity: this.shape.opacity,
    fill: [SHAPES_OPTIONS.ARROW, SHAPES_OPTIONS.ARROW_DOUBLE].includes(
      node.getClassName(),
    )
      ? this.shape.stroke
      : this.shape.fill,
    stroke: this.shape.stroke,
    strokeWidth: this.shape.strokeWidth,
    shadowColor: this.shape.shadowColor,
    shadowBlur: this.shape.shadowBlur,
    shadowOffset: this.shape.shadowOffset,
    shadowOpacity: this.shape.shadowOpacity,
  });

  if (node.getClassName() === SHAPES_OPTIONS.RECT) {
    node.cornerRadius(
      Math.min(node.width(), node.height()) * (this.shape.cornerRadius / 100),
    );
  }

  if (
    [SHAPES_OPTIONS.ARROW, SHAPES_OPTIONS.ARROW_DOUBLE].includes(
      node.getClassName(),
    )
  ) {
    this.node.pointerLength(this.shape.pointerSize);
    this.node.pointerWidth(this.shape.pointerSize);
  }
}
