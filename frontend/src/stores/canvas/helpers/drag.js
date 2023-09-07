import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { updateSelectedElement } from "stores/canvas/helpers/select";

const canvasStore = useCanvasStore();
const { isDragging, dragStart, mouse, selectedElement, MODES_OPTIONS } =
  storeToRefs(canvasStore);

export const startDragging = () => {
  isDragging.value = true;
  dragStart.value.x = mouse.value.x;
  dragStart.value.y = mouse.value.y;
};

export const stopDragging = () => {
  isDragging.value = false;
};

export const dragElement = () => {
  moveElement(mouse.value.x, mouse.value.y);
};

export const moveElement = (newX, newY) => {
  let deltaX, deltaY;

  switch (selectedElement.value.mode) {
    case MODES_OPTIONS.value.drawing:
      deltaX = newX - dragStart.value.x;
      deltaY = newY - dragStart.value.y;
      selectedElement.value.points.forEach((point) => {
        point.x += deltaX;
        point.y += deltaY;
      });
      break;

    default:
      selectedElement.value.x += newX - dragStart.value.x;
      selectedElement.value.y += newY - dragStart.value.y;
      break;
  }

  dragStart.value.x = newX;
  dragStart.value.y = newY;

  updateSelectedElement();
  canvasStore.redrawCanvas();
};
