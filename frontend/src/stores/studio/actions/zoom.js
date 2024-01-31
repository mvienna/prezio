import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

const presentationsStore = usePresentationsStore();
const { slide } = storeToRefs(presentationsStore);

export function fitStageIntoParentContainer() {
  if (!this.stages.default) return;
  const container = document.querySelector("#stage-parent");
  const scale = container.offsetWidth / this.scene.width;
  this.stages.default.width(this.scene.width * scale);
  this.stages.default.height(this.scene.height * scale);
  this.stages.default.scale({ x: scale, y: scale });
  this.stages.default.position({ x: 0, y: 0 });
  this.zoom.min = scale;
}

export function setZoom(newScale) {
  if (!this.stages.default) return;
  if (newScale === 1) this.fitStageIntoParentContainer();

  newScale =
    (newScale * this.stages.default.container().getBoundingClientRect().width) /
    this.scene.width;

  const oldScale = this.stages.default.scaleX();
  const container = document.querySelector("#stage-parent");

  newScale = Math.max(this.zoom.min, Math.min(newScale, this.zoom.max));

  const containerCenter = {
    x: container.offsetWidth / 2,
    y: container.offsetHeight / 2,
  };

  const scaleRatio = newScale / oldScale;

  const oldPosition = this.stages.default.position();

  const newPosition = {
    x: containerCenter.x - (containerCenter.x - oldPosition.x) * scaleRatio,
    y: containerCenter.y - (containerCenter.y - oldPosition.y) * scaleRatio,
  };

  this.stages.default.scale({ x: newScale, y: newScale });
  this.stages.default.position(newPosition);
}

export function handleZoom(event) {
  event.evt.preventDefault();

  if (slide.value.type !== SLIDE_TYPES.CONTENT) return;

  const oldScale = this.stages.default.scaleX();

  const position = this.stages.default.getPointerPosition();

  const mousePointTo = {
    x: (position.x - this.stages.default.x()) / oldScale,
    y: (position.y - this.stages.default.y()) / oldScale,
  };

  // how to scale? Zoom in? Or zoom out?
  let direction = event.evt.deltaY > 0 ? 1 : -1;

  // when we zoom on trackpad, e.evt.ctrlKey is true
  // in that case lets revert direction
  if (event.evt.ctrlKey) {
    direction = -direction;
  }

  let newScale =
    direction > 0
      ? oldScale * this.zoom.coefficient
      : oldScale / this.zoom.coefficient;

  if (newScale < this.zoom.min) {
    this.fitStageIntoParentContainer();
    return;
  }

  if (newScale > this.zoom.max) return;

  this.stages.default.scale({ x: newScale, y: newScale });

  const newPos = {
    x: position.x - mousePointTo.x * newScale,
    y: position.y - mousePointTo.y * newScale,
  };
  this.stages.default.position(newPos);
}
