import Konva from "konva";
import {
  COLOR_PALETTE,
  COLOR_SCHEME_OPTIONS,
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
    .filter((node) => this.transformer?.custom.shape?.node?._id !== node._id)
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

// find all snapping possibilities and then filter to keep only the nearest guides
export function handleSnappingGetGuides(lineGuideStops, itemBounds) {
  let guides = [];

  // Existing logic to find all possible guides
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

  // Function to find the nearest guide lines for snapping, considering elements of the same size
  function findNearestGuides(guides, currentPosition, itemBounds) {
    let vGuides = { start: null, center: null, end: null };
    let hGuides = { start: null, center: null, end: null };

    guides.forEach((guide) => {
      if (guide.orientation === "V") {
        const vGuideKey = guide.snap; // 'start', 'center', or 'end'
        if (
          !vGuides[vGuideKey] ||
          Math.abs(vGuides[vGuideKey].lineGuide - currentPosition.x) >
            Math.abs(guide.lineGuide - currentPosition.x)
        ) {
          vGuides[vGuideKey] = guide;
        }
      } else if (guide.orientation === "H") {
        const hGuideKey = guide.snap; // 'start', 'center', or 'end'
        if (
          !hGuides[hGuideKey] ||
          Math.abs(hGuides[hGuideKey].lineGuide - currentPosition.y) >
            Math.abs(guide.lineGuide - currentPosition.y)
        ) {
          hGuides[hGuideKey] = guide;
        }
      }
    });

    // Flatten the guides and filter out the null values
    return [...Object.values(vGuides), ...Object.values(hGuides)].filter(
      (guide) => guide !== null,
    );
  }

  // Determine the position of the currently dragged element
  const currentPosition = {
    x: itemBounds.vertical[0] ? itemBounds.vertical[0].guide : 0,
    y: itemBounds.horizontal[0] ? itemBounds.horizontal[0].guide : 0,
  };

  // Filter to find the nearest guides, including top, middle, and bottom
  const nearestGuides = findNearestGuides(guides, currentPosition, itemBounds);

  // Return only the nearest guides
  return nearestGuides;
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
        strokeWidth: 1,
        name: "guid-line",
        dash: [20, 20],
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
        strokeWidth: 1,
        name: "guid-line",
        dash: [20, 20],
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
  if (this.mode === this.MODE_OPTIONS.DRAWING) return;

  // disable for transformer
  if ([this.transformer.default?._id].includes(event.target._id)) return;

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
