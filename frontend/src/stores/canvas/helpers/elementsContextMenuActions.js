import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { deleteElement, selectElement } from "stores/canvas/helpers/select";
import { generateUniqueId } from "src/helpers/generateUniqueId";
import { usePresentationsStore } from "stores/presentations";

const canvasStore = useCanvasStore();
const { elements, selectedElement, copiedElement, slideIdElementCopiedFrom } =
  storeToRefs(canvasStore);

const presentationStore = usePresentationsStore();
const { presentation, slide } = storeToRefs(presentationStore);

/*
 * copy
 */
export const copy = (element = selectedElement.value) => {
  copiedElement.value = element;
  slideIdElementCopiedFrom.value = presentation.value.slides.find(
    (item) => item.id === slide.value.id
  )?.id;
};

/*
 * cut
 */
export const cut = (element = selectedElement.value) => {
  copy(element);
  deleteElement(element);
};

/*
 * duplicate
 */
export const duplicate = (element = selectedElement.value) => {
  element = {
    ...element,
    id: generateUniqueId(undefined, elements.value),
    x: element.x + canvasStore.computeAdjustedSize(20),
    y: element.y + canvasStore.computeAdjustedSize(20),
  };

  elements.value.unshift(element);
  selectElement(element);

  canvasStore.redrawCanvas();
};

/*
 * paste
 */
export const paste = () => {
  if (!copiedElement.value) return;

  copiedElement.value = {
    ...copiedElement.value,
    id: generateUniqueId(undefined, elements.value),
    x:
      slideIdElementCopiedFrom.value === slide.value.id
        ? copiedElement.value.x + canvasStore.computeAdjustedSize(20)
        : copiedElement.value.x,
    y:
      slideIdElementCopiedFrom.value === slide.value.id
        ? copiedElement.value.y + canvasStore.computeAdjustedSize(20)
        : copiedElement.value.y,
  };

  elements.value.unshift(copiedElement.value);
  selectElement(copiedElement.value);
  canvasStore.redrawCanvas();
};

/*
 * move layers
 */
export const moveLayer = (element = selectedElement.value, shift) => {
  const elementIndex = elements.value.findIndex(
    (item) => item.id === element.id
  );

  const isMoveAvailable =
    shift < 0
      ? elementIndex >= 0 && elementIndex < elements.value.length - shift * -1
      : elementIndex > 0 && elementIndex < elements.value.length;

  if (isMoveAvailable) {
    const temp = elements.value[elementIndex];
    elements.value[elementIndex] = elements.value[elementIndex + shift * -1];
    elements.value[elementIndex + shift * -1] = temp;

    // redraw canvas with updated layers
    selectElement(element);
    canvasStore.redrawCanvas();
  }
};

export const moveLayerToTheTop = (element = selectedElement.value) => {
  const elementIndex = elements.value.findIndex(
    (item) => item.id === element.id
  );

  if (elementIndex > 0 && elementIndex < elements.value.length) {
    const obj = elements.value.splice(elementIndex, 1)[0];
    elements.value.unshift(obj);

    // redraw canvas with updated layers
    selectElement(element);
    canvasStore.redrawCanvas();
  }
};

export const moveLayerToTheBottom = (element = selectedElement.value) => {
  const elementIndex = elements.value.findIndex(
    (item) => item.id === element.id
  );

  if (elementIndex >= 0 && elementIndex < elements.value.length - 1) {
    const obj = elements.value.splice(elementIndex, 1)[0];
    elements.value.push(obj);

    // redraw canvas with updated layers
    selectElement(element);
    canvasStore.redrawCanvas();
  }
};
