import { SHAPE_OPTIONS } from "src/constants/canvas/canvasVariables";
import Konva from "konva";

export function addShape(shapeName) {
  let shapeNode;
  const size = 200;

  const shapeDefaultConfig = {
    opacity: this.shape.default.opacity,
    fill: this.shape.default.fill,
    stroke: this.shape.default.stroke,
    strokeWidth: this.shape.default.strokeWidth,
    draggable: true,
    name: this.MODE_OPTIONS.SHAPE,
  };

  switch (shapeName) {
    /*
     * lines
     */
    case SHAPE_OPTIONS.LINE.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [0, 0, (20 * this.scene.width) / 100, 0],
        strokeWidth: 10,
      });
      break;

    case SHAPE_OPTIONS.ARROW.name:
      shapeNode = new Konva.Arrow({
        ...shapeDefaultConfig,
        points: [0, 0, (20 * this.scene.width) / 100, 0],
        pointerLength: this.shape.default.pointerSize,
        pointerWidth: this.shape.default.pointerSize,
        strokeWidth: 10,
        pointerAtEnding: true,
      });
      break;

    case SHAPE_OPTIONS.ARROW_DOUBLE.name:
      shapeNode = new Konva.Arrow({
        ...shapeDefaultConfig,
        points: [0, 0, (20 * this.scene.width) / 100, 0],
        pointerLength: this.shape.default.pointerSize,
        pointerWidth: this.shape.default.pointerSize,
        strokeWidth: 10,
        pointerAtBeginning: true,
        pointerAtEnding: true,
      });
      break;

    /*
     * simple shapes
     */
    case SHAPE_OPTIONS.CIRCLE.name:
      shapeNode = new Konva.Circle({
        ...shapeDefaultConfig,
        radius: size / 2,
      });
      break;

    case SHAPE_OPTIONS.RECT.name:
      shapeNode = new Konva.Rect({
        ...shapeDefaultConfig,
        width: size,
        height: size,
        cornerRadius: this.shape.cornerRadius,
      });
      break;

    case SHAPE_OPTIONS.STAR.name:
      shapeNode = new Konva.Star({
        ...shapeDefaultConfig,
        numPoints: 5,
        innerRadius: size / 3,
        outerRadius: size - size / 3,
      });
      break;

    case SHAPE_OPTIONS.TRIANGLE.name:
      shapeNode = new Konva.RegularPolygon({
        ...shapeDefaultConfig,
        radius: size / 2,
        sides: 3,
      });

      break;

    case SHAPE_OPTIONS.POLYGON.name:
      shapeNode = new Konva.RegularPolygon({
        ...shapeDefaultConfig,
        radius: size / 2,
        sides: 6,
        rotation: -90,
      });
      break;

    /*
     * abstract shapes
     */
    case SHAPE_OPTIONS.ABSTRACT_1.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          187, 75, 175, 100, 150, 121, 119, 105, 117, 75, 128, 53, 150, 31, 177,
          47,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_2.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          197, 75, 178, 103, 150, 121, 123, 101, 109, 75, 128, 53, 150, 32, 185,
          39,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_3.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          193, 75, 183, 108, 150, 109, 124, 100, 104, 75, 124, 49, 150, 36, 174,
          50,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_4.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          192, 75, 178, 103, 150, 116, 124, 100, 102, 75, 117, 42, 150, 28, 182,
          42,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_5.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          195, 75, 171, 96, 150, 111, 119, 105, 101, 75, 124, 49, 150, 33, 172,
          52,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_6.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          180, 75, 182, 107, 150, 107, 117, 107, 109, 75, 122, 47, 150, 25, 181,
          43,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_7.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          181, 75, 184, 109, 150, 117, 125, 99, 104, 75, 126, 51, 150, 32, 179,
          45,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_8.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          186, 75, 184, 109, 150, 111, 114, 110, 111, 75, 118, 43, 150, 40, 174,
          50,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_9.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          193, 75, 179, 104, 150, 111, 125, 99, 110, 75, 126, 51, 150, 34, 183,
          41,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_10.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          182, 75, 179, 104, 150, 123, 117, 107, 118, 75, 120, 45, 150, 36, 173,
          51,
        ],
        closed: true,
        tension: 0.3,
      });
      break;
  }

  shapeNode.setAttrs({
    shape: shapeName,
    x: this.scene.width / 2 - shapeNode.width() / 2,
    y: this.scene.height / 2 - shapeNode.height() / 2,
  });

  this.layers.default.add(shapeNode);

  this.handleSlideUpdate();

  this.processShape(shapeNode);
}

export function processShape(shape) {
  shape.on("transformend", this.handleSlideUpdate);
  shape.on("dragstart", this.handleSelectionDragStart);
}

export function setShapeCustomization(node) {
  this.shape = {
    ...this.shape,
    opacity: node.opacity(),
    stroke: node.stroke(),
    strokeWidth: node.strokeWidth(),
    shadowColor: node.shadowColor(),
    shadowBlur: node.shadowBlur(),
    shadowOffset: node.shadowOffset(),
    shadowOpacity: node.shadowOpacity(),
    cornerRadius:
      node.getAttr("shape") === SHAPE_OPTIONS.RECT.name
        ? Math.round(
            (node.cornerRadius() / Math.min(node.width(), node.height())) * 100,
          )
        : null,
    fillLinearGradientColorStops: node.fillLinearGradientColorStops()
      ? node.fillLinearGradientColorStops()
      : null,
    fill: node.fillLinearGradientColorStops()
      ? node.fillLinearGradientColorStops()[1]
      : node.fill(),
  };

  if (
    [SHAPE_OPTIONS.ARROW.name, SHAPE_OPTIONS.ARROW_DOUBLE.name].includes(
      node.getAttr("shape"),
    )
  ) {
    this.shape.shapepointerSize = node.pointerWidth();
  }
}

export function applyShapeCustomization(node) {
  node.setAttrs({
    opacity: this.shape.opacity,
    stroke: this.shape.stroke,
    strokeWidth: this.shape.strokeWidth,
    shadowColor: this.shape.shadowColor,
    shadowBlur: this.shape.shadowBlur,
    shadowOffset: this.shape.shadowOffset,
    shadowOpacity: this.shape.shadowOpacity,
  });

  if (node.getAttr("shape") === SHAPE_OPTIONS.RECT.name) {
    node.cornerRadius(
      Math.min(node.width(), node.height()) * (this.shape.cornerRadius / 100),
    );
  }

  if (
    [SHAPE_OPTIONS.ARROW.name, SHAPE_OPTIONS.ARROW_DOUBLE.name].includes(
      node.getAttr("shape"),
    )
  ) {
    node.pointerLength(this.shape.pointerSize);
    node.pointerWidth(this.shape.pointerSize);
  }

  if (this.shape.fillLinearGradientColorStops) {
    // const isAbstract = Object.values(SHAPE_OPTIONS)
    //   .filter((item) => item.group === SHAPE_TYPES.ABSTRACT)
    //   .map((item) => item.name)
    //   .includes(node.getAttr("shape"));

    node.setAttrs({
      fill: undefined,
      fillLinearGradientColorStops: this.shape.fillLinearGradientColorStops,
      fillLinearGradientStartPoint: {
        x: 0,
        y: 0,
      },
      fillLinearGradientEndPoint: {
        x: node.width(),
        y: node.height(),
      },
    });
  } else {
    node.setAttrs({
      fillLinearGradientColorStops: undefined,
      fillLinearGradientStartPoint: undefined,
      fillLinearGradientEndPoint: undefined,
      fill: [
        SHAPE_OPTIONS.ARROW.name,
        SHAPE_OPTIONS.ARROW_DOUBLE.name,
      ].includes(node.getAttr("shape"))
        ? this.shape.stroke
        : this.shape.fill,
    });
  }
}
