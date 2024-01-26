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

export function handleZoom(event) {
  event.evt.preventDefault();

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
