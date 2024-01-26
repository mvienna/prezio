import { SHAPES_OPTIONS } from "src/constants/canvas/canvasVariables";
import Konva from "konva";

export function addShape(shapeName) {
  let shape;
  const size = 200;

  const shapeDefaultConfig = {
    opacity: this.shape.default.opacity,
    fill: this.shape.default.fill,
    stroke: this.shape.default.stroke,
    strokeWidth: this.shape.default.strokeWidth,
    lineCap: "round",
    lineJoin: "round",
    draggable: true,
    name: this.MODE_OPTIONS.shape,
  };

  switch (shapeName) {
    /*
     * lines
     */
    case SHAPES_OPTIONS.LINE:
      shape = new Konva.Line({
        ...shapeDefaultConfig,
        x: this.scene.width / 4,
        y: this.scene.height / 2,
        points: [0, 0, this.scene.width / 2, 0],
        strokeWidth: 25,
      });
      break;

    case SHAPES_OPTIONS.ARROW:
      shape = new Konva.Arrow({
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
      shape = new Konva.Arrow({
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
      shape = new Konva.Circle({
        ...shapeDefaultConfig,
        x: this.scene.width / 2,
        y: this.scene.height / 2,
        radius: size / 2,
      });
      break;

    case SHAPES_OPTIONS.RECT:
      shape = new Konva.Rect({
        ...shapeDefaultConfig,
        x: this.scene.width / 2 - size / 2,
        y: this.scene.height / 2 - size / 2,
        width: size,
        height: size,
        cornerRadius: this.shape.cornerRadius,
      });
      break;

    case SHAPES_OPTIONS.STAR:
      shape = new Konva.Star({
        ...shapeDefaultConfig,
        x: this.scene.width / 2,
        y: this.scene.height / 2,
        numPoints: 5,
        innerRadius: size / 3,
        outerRadius: size - size / 3,
      });
      break;

    case SHAPES_OPTIONS.TRIANGLE:
      shape = new Konva.RegularPolygon({
        ...shapeDefaultConfig,
        x: this.scene.width / 2,
        y: this.scene.height / 2,
        radius: size / 2,
        sides: 3,
      });

      break;

    case SHAPES_OPTIONS.POLYGON:
      shape = new Konva.RegularPolygon({
        ...shapeDefaultConfig,
        x: this.scene.width / 2,
        y: this.scene.height / 2,
        radius: size / 2,
        sides: 6,
        rotation: -90,
      });
      break;
  }

  this.layers.default.add(shape);

  this.handleSlideUpdate();
  shape.on("transformend", this.handleSlideUpdate);
}
