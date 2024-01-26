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

export function handleSnapping() {
  this.layers.default.on("dragmove", this.handleSnappingDragMove);
  this.layers.default.on("dragend", this.handleSnappingDragEnd);
}

// where can we snap our objects?
export function handleSnappingGetLineGuideStops(skipShape) {
  let vertical = [
    0,
    this.stages.default.width() / 2,
    this.stages.default.width(),
  ];
  let horizontal = [
    0,
    this.stages.default.height() / 2,
    this.stages.default.height(),
  ];

  this.stages.default
    .find((node) =>
      Object.values(this.MODE_OPTIONS).includes(node.getAttr("name")),
    )
    .filter((node) => node._id !== skipShape._id)
    .forEach((guideItem) => {
      if (guideItem === skipShape) {
        return;
      }
      const box = guideItem.getClientRect();

      vertical.push(box.x, box.x + box.width, box.x + box.width / 2);
      horizontal.push(box.y, box.y + box.height, box.y + box.height / 2);
    });

  return { vertical, horizontal };
}

// what points of the object will trigger to snapping?
// it can be just center of the object
// but we will enable all edges and center
export function handleSnappingGetObjectEdges(node) {
  const box = node.getClientRect();
  const absPos = node.absolutePosition();

  return {
    vertical: [
      {
        guide: Math.round(box.x),
        offset: Math.round(absPos.x - box.x),
        snap: "start",
      },
      {
        guide: Math.round(box.x + box.width / 2),
        offset: Math.round(absPos.x - box.x - box.width / 2),
        snap: "center",
      },
      {
        guide: Math.round(box.x + box.width),
        offset: Math.round(absPos.x - box.x - box.width),
        snap: "end",
      },
    ],
    horizontal: [
      {
        guide: Math.round(box.y),
        offset: Math.round(absPos.y - box.y),
        snap: "start",
      },
      {
        guide: Math.round(box.y + box.height / 2),
        offset: Math.round(absPos.y - box.y - box.height / 2),
        snap: "center",
      },
      {
        guide: Math.round(box.y + box.height),
        offset: Math.round(absPos.y - box.y - box.height),
        snap: "end",
      },
    ],
  };
}

// find all snapping possibilities
export function handleSnappingGetGuides(lineGuideStops, itemBounds) {
  let guides = [];

  lineGuideStops.vertical.forEach((lineGuide) => {
    itemBounds.vertical.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff < this.snapping.GUIDELINE_OFFSET) {
        guides.push({
          lineGuide: lineGuide,
          offset: itemBound.offset,
          orientation: "V",
          snap: itemBound.snap,
        });
      }
    });
  });

  lineGuideStops.horizontal.forEach((lineGuide) => {
    itemBounds.horizontal.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff < this.snapping.GUIDELINE_OFFSET) {
        guides.push({
          lineGuide: lineGuide,
          offset: itemBound.offset,
          orientation: "H",
          snap: itemBound.snap,
        });
      }
    });
  });

  return guides;
}

export function handleSnappingDrawGuides(guides) {
  guides.forEach((lg) => {
    if (lg.orientation === "H") {
      const line = new Konva.Line({
        points: [-this.scene.width * 4, 0, this.scene.width * 4, 0],
        stroke:
          slide.value.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
            ? COLOR_PALETTE.BLACK
            : COLOR_PALETTE.WHITE,
        strokeWidth: 2,
        name: "guid-line",
        dash: [10, 10],
      });
      this.layers.default.add(line);

      line.absolutePosition({
        x: 0,
        y: lg.lineGuide,
      });
    } else if (lg.orientation === "V") {
      const line = new Konva.Line({
        points: [0, -this.scene.width * 4, 0, this.scene.width * 4],
        stroke:
          slide.value.color_scheme === COLOR_SCHEME_OPTIONS.LIGHT
            ? COLOR_PALETTE.BLACK
            : COLOR_PALETTE.WHITE,
        strokeWidth: 2,
        name: "guid-line",
        dash: [10, 10],
      });
      this.layers.default.add(line);
      line.absolutePosition({
        x: lg.lineGuide,
        y: 0,
      });
    }
  });
}

export function handleSnappingDragMove(event) {
  // disable dragging while in drawing mode
  if (this.mode === this.MODE_OPTIONS.drawing) return;

  // disable for transformer
  if (
    [
      this.transformer.default?._id,
      this.transformer.custom.shape.anchor1?._id,
      this.transformer.custom.shape.anchor2?._id,
    ].includes(event.target._id)
  )
    return;

  if (
    [
      SHAPES_OPTIONS.LINE,
      SHAPES_OPTIONS.ARROW,
      SHAPES_OPTIONS.ARROW_DOUBLE,
    ].includes(event.target.getClassName())
  ) {
    if (this.transformer.custom.shape.node?._id !== event.target._id) {
      this.setCustomShapeTransformer(event.target);
    }
  } else if (!this.transformer.default.nodes()?.length) {
    this.transformer.default.nodes([
      ...this.transformer.default.nodes(),
      event.target,
    ]);
  }

  // clear all previous lines on the screen
  this.layers.default.find(".guid-line").forEach((l) => l.destroy());

  // find possible snapping lines
  const lineGuideStops = this.handleSnappingGetLineGuideStops(event.target);
  // find snapping points of current object
  const itemBounds = this.handleSnappingGetObjectEdges(event.target);

  // now find where can we snap current object
  const guides = this.handleSnappingGetGuides(lineGuideStops, itemBounds);

  // do nothing of no snapping
  if (!guides.length) {
    return;
  }

  this.handleSnappingDrawGuides(guides);

  const absPos = event.target.absolutePosition();
  // now force object position
  guides.forEach((lg) => {
    switch (lg.snap) {
      case "start": {
        switch (lg.orientation) {
          case "V": {
            absPos.x = lg.lineGuide + lg.offset;
            break;
          }
          case "H": {
            absPos.y = lg.lineGuide + lg.offset;
            break;
          }
        }
        break;
      }
      case "center": {
        switch (lg.orientation) {
          case "V": {
            absPos.x = lg.lineGuide + lg.offset;
            break;
          }
          case "H": {
            absPos.y = lg.lineGuide + lg.offset;
            break;
          }
        }
        break;
      }
      case "end": {
        switch (lg.orientation) {
          case "V": {
            absPos.x = lg.lineGuide + lg.offset;
            break;
          }
          case "H": {
            absPos.y = lg.lineGuide + lg.offset;
            break;
          }
        }
        break;
      }
    }
  });
  event.target.absolutePosition(absPos);
}

export function handleSnappingDragEnd() {
  // clear all previous lines on the screen
  this.layers.default.find(".guid-line").forEach((l) => l.destroy());
}
