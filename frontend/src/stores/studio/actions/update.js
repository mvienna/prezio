import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

const presentationsStore = usePresentationsStore();
const { slide } = storeToRefs(presentationsStore);

export function generatePreviewForStage(stage = this.stages.default) {
  const scale = 1 / 2;
  return stage.toDataURL({
    pixelRatio: scale,
  });
}

export function prepareCanvasForPreview() {
  // save current scale and position
  const currentScale = this.stages.default.scaleX();
  const currentPosition = this.stages.default.position();

  // temporarily hide transformers
  this.transformer.default?.hide();
  this.layers.default.find(".customTransformer").forEach((node) => node.hide());

  // reset zoom and position to initial state
  this.stages.default.scale({ x: this.zoom.min, y: this.zoom.min });
  this.stages.default.position({ x: 0, y: 0 });

  // restore original scale and position
  this.stages.default.scale({ x: currentScale, y: currentScale });
  this.stages.default.position(currentPosition);
}

export function restoreCanvasAfterPreview() {
  // show transformers
  this.transformer.default?.show();
  this.layers.default.find(".customTransformer").forEach((node) => node.show());
  this.transformer.default?.moveToTop();
  if (this.transformer.default?.nodes()?.length) {
    this.applyTransformerCustomization();
  }
}

export async function handleSlideUpdate() {
  // prepare canvas for preview: hide additional elements, reset zoom
  this.prepareCanvasForPreview();

  // save preview
  slide.value.preview = this.generatePreviewForStage();

  // compute color scheme & save and capture stage
  slide.value.color_scheme = await this.defineColorScheme();
  this.captureState();
  slide.value.canvas_data = this.stages.default.toJSON();

  // restore canvas additional elements after preview has been generated
  this.restoreCanvasAfterPreview();

  // save slide
  await presentationsStore.saveSlide();
}

export function captureState() {
  this.history.undo.push(slide.value.canvas_data);
  if (this.history.undo.length > 10) {
    this.history.undo.shift();
  }
  this.history.redo = [];
}

export function undo() {
  if (this.history.undo.length) {
    let previousState = this.history.undo.pop();
    this.history.redo.push(slide.value.canvas_data);

    if (this.history.redo.length > this.history.STACK_LIMIT) {
      this.history.redo.shift();
    }

    slide.value.canvas_data = previousState;
    this.loadStudio();
  }
}

export function redo() {
  if (this.history.redo.length) {
    let nextState = this.history.redo.pop();
    this.history.undo.push(slide.value.canvas_data);

    if (this.history.undo.length > this.history.STACK_LIMIT) {
      this.history.undo.shift();
    }

    slide.value.canvas_data = nextState;
    this.loadStudio();
  }
}
