import { SHAPE_OPTIONS } from "src/constants/canvas/canvasVariables";
import Konva from "konva";

export function addShape(shapeName) {
  let shapeNode;

  const shapeDefaultConfig = {
    opacity: this.shape.default.opacity,
    fill: this.shape.default.fill,
    stroke: this.shape.default.stroke,
    strokeWidth: this.shape.default.strokeWidth,
    dash: this.shape.default.dash,
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
        radius: this.shape.default.width / 2,
      });
      break;

    case SHAPE_OPTIONS.RECT.name:
      shapeNode = new Konva.Rect({
        ...shapeDefaultConfig,
        width: this.shape.default.width,
        height: this.shape.default.height,
        cornerRadius: this.shape.default.cornerRadius,
      });
      break;

    case SHAPE_OPTIONS.STAR.name:
      shapeNode = new Konva.Star({
        ...shapeDefaultConfig,
        numPoints: 5,
        innerRadius: this.shape.default.width / 3,
        outerRadius: this.shape.default.width - this.shape.default.width / 3,
      });
      break;

    case SHAPE_OPTIONS.TRIANGLE.name:
      shapeNode = new Konva.RegularPolygon({
        ...shapeDefaultConfig,
        radius: this.shape.default.width / 2,
        sides: 3,
      });

      break;

    case SHAPE_OPTIONS.POLYGON.name:
      shapeNode = new Konva.RegularPolygon({
        ...shapeDefaultConfig,
        radius: this.shape.default.width / 2,
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
          748, 300, 700, 400, 600, 484, 476, 420, 468, 300, 512, 212, 600, 124,
          708, 188,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_2.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          788, 300, 712, 412, 600, 484, 492, 404, 436, 300, 512, 212, 600, 128,
          740, 156,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_3.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          772, 300, 732, 432, 600, 436, 496, 400, 416, 300, 496, 196, 600, 144,
          696, 200,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_4.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          768, 300, 712, 412, 600, 464, 496, 400, 408, 300, 468, 168, 600, 112,
          728, 168,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_5.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          780, 300, 684, 384, 600, 444, 476, 420, 404, 300, 496, 196, 600, 132,
          688, 208,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_6.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          720, 300, 728, 428, 600, 428, 468, 428, 436, 300, 488, 188, 600, 100,
          724, 172,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_7.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          724, 300, 736, 436, 600, 468, 500, 396, 416, 300, 504, 204, 600, 128,
          716, 180,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_8.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          744, 300, 736, 436, 600, 444, 456, 440, 444, 300, 472, 172, 600, 160,
          696, 200,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_9.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          772, 300, 716, 416, 600, 444, 500, 396, 440, 300, 504, 204, 600, 136,
          732, 164,
        ],
        closed: true,
        tension: 0.3,
      });
      break;

    case SHAPE_OPTIONS.ABSTRACT_10.name:
      shapeNode = new Konva.Line({
        ...shapeDefaultConfig,
        points: [
          728, 300, 716, 416, 600, 492, 468, 428, 472, 300, 480, 180, 600, 144,
          692, 204,
        ],
        closed: true,
        tension: 0.3,
      });
      break;
  }

  if (
    [
      SHAPE_OPTIONS.ABSTRACT_1.name,
      SHAPE_OPTIONS.ABSTRACT_2.name,
      SHAPE_OPTIONS.ABSTRACT_3.name,
      SHAPE_OPTIONS.ABSTRACT_4.name,
      SHAPE_OPTIONS.ABSTRACT_5.name,
      SHAPE_OPTIONS.ABSTRACT_6.name,
      SHAPE_OPTIONS.ABSTRACT_7.name,
      SHAPE_OPTIONS.ABSTRACT_8.name,
      SHAPE_OPTIONS.ABSTRACT_9.name,
      SHAPE_OPTIONS.ABSTRACT_10.name,
    ].includes(shapeName)
  ) {
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (let i = 0; i < shapeNode.points().length; i += 2) {
      const x = shapeNode.points()[i];
      const y = shapeNode.points()[i + 1];
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    const shapeWidth = maxX - minX;
    const shapeHeight = maxY - minY;

    shapeNode.setAttrs({
      x: this.scene.width / 2 - shapeWidth / 2 - minX,
      y: this.scene.height / 2 - shapeHeight / 2 - minY,
    });
  } else {
    shapeNode.setAttrs({
      x: this.scene.width / 2 - shapeNode.width() / 2,
      y: this.scene.height / 2 - shapeNode.height() / 2,
    });
  }

  shapeNode.setAttrs({
    shape: shapeName,
  });

  this.layers.default.add(shapeNode);

  this.setShapeCustomization(shapeNode);
  this.applyShapeCustomization(shapeNode);

  this.handleSlideUpdate();

  this.processShape(shapeNode);
}

export function processShape(shape) {
  shape.on("transformend", () => {
    this.handleSlideUpdate();
    this.handleSnappingEnd();
  });
  shape.on("transform", () => {
    shape.width(Math.max(5, shape.width() * shape.scaleX()));
    shape.height(Math.max(5, shape.height() * shape.scaleY()));

    shape.scaleX(1);
    shape.scaleY(1);

    this.setShapeCustomization(shape);
  });
  shape.on("dragstart", this.handleSelectionDragStart);
}

export function setShapeCustomization(node) {
  this.shape = {
    ...this.shape,
    width: node.width(),
    height: node.height(),
    opacity: node.opacity(),
    stroke: node.stroke(),
    strokeWidth: node.strokeWidth(),
    dash: node.dash() || this.image.default.dash,
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
    linearGradientDegrees:
      node.getAttr("linearGradientDegrees") ||
      this.shape.default.linearGradientDegrees,
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
    width: this.shape.width,
    height: this.shape.height,
    opacity: this.shape.opacity,
    stroke: this.shape.stroke,
    strokeWidth: this.shape.strokeWidth,
    dash: this.shape.dash,
    shadowColor: this.shape.shadowColor,
    shadowBlur: this.shape.shadowBlur,
    shadowOffset: this.shape.shadowOffset,
    shadowOpacity: this.shape.shadowOpacity,
    linearGradientDegrees: this.shape.linearGradientDegrees,
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
    const radians = ((-45 + this.shape.linearGradientDegrees) * Math.PI) / 180;

    const centerX = node.width() / 2;
    const centerY = node.height() / 2;

    const rotatedStartX =
      Math.cos(radians) * (0 - centerX) -
      Math.sin(radians) * (0 - centerY) +
      centerX;
    const rotatedStartY =
      Math.sin(radians) * (0 - centerX) +
      Math.cos(radians) * (0 - centerY) +
      centerY;
    const rotatedEndX =
      Math.cos(radians) * (node.width() - centerX) -
      Math.sin(radians) * (node.height() - centerY) +
      centerX;
    const rotatedEndY =
      Math.sin(radians) * (node.width() - centerX) +
      Math.cos(radians) * (node.height() - centerY) +
      centerY;

    node.setAttrs({
      fill: undefined,
      fillLinearGradientColorStops: this.shape.fillLinearGradientColorStops,
      fillLinearGradientStartPoint: {
        x: rotatedStartX,
        y: rotatedStartY,
      },
      fillLinearGradientEndPoint: {
        x: rotatedEndX,
        y: rotatedEndY,
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
