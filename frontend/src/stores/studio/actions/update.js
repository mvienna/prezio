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

export async function handleSlideUpdate() {
  // Save current scale and position
  const currentScale = this.stages.default.scaleX();
  const currentPosition = this.stages.default.position();

  // temporarily hide transformers
  this.transformer.default?.hide();
  this.layers.default.find(".customTransformer").forEach((node) => node.hide());

  // Reset zoom and position to initial state
  this.stages.default.scale({ x: this.zoom.min, y: this.zoom.min });
  this.stages.default.position({ x: 0, y: 0 });

  // save preview with initial zoom
  slide.value.preview = this.generatePreviewForStage();

  // Restore original scale and position
  this.stages.default.scale({ x: currentScale, y: currentScale });
  this.stages.default.position(currentPosition);

  // compute color scheme & save and capture stage
  slide.value.color_scheme = await this.defineColorScheme();
  this.captureState();
  slide.value.canvas_data = this.stages.default.toJSON();

  // show transformers
  this.transformer.default?.show();
  this.layers.default.find(".customTransformer").forEach((node) => node.show());
  this.transformer.default?.moveToTop();
  if (this.transformer.default?.nodes()?.length) {
    this.applyTransformerCustomization();
  }

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
