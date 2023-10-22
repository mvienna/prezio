import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { updateSelectedElement } from "stores/canvas/helpers/select";
import { removeMagnet, useMagnet } from "stores/canvas/helpers/magnet";

const canvasStore = useCanvasStore();
const {
  isDragging,
  dragStart,
  dragFrom,
  mouse,
  selectedElement,
  MODE_OPTIONS,
  magnet,
  MAGNET_AXIS_OPTIONS,
} = storeToRefs(canvasStore);

export const startDragging = () => {
  isDragging.value = true;
  dragStart.value = {
    x: mouse.value.x,
    y: mouse.value.y,
  };

  dragFrom.value = {
    x: selectedElement.value.x,
    y: selectedElement.value.y,
  };
};

export const stopDragging = () => {
  isDragging.value = false;
  removeMagnet();

  const canvasRect = canvasStore.canvasRect();

  const elementMinX =
    canvasRect.left + canvasStore.computeRealSize(selectedElement.value.x);
  const elementMaxX =
    elementMinX + canvasStore.computeRealSize(selectedElement.value.width);
  const elementMinY =
    canvasRect.top + canvasStore.computeRealSize(selectedElement.value.y);
  const elementMaxY =
    elementMinY + canvasStore.computeRealSize(selectedElement.value.height);

  const canvasMinX = canvasRect.left;
  const canvasMaxX = canvasRect.left + canvasRect.width;
  const canvasMinY = canvasRect.top;
  const canvasMaxY = canvasRect.top + canvasRect.height;

  if (
    elementMaxX < canvasMinX ||
    elementMinX > canvasMaxX ||
    elementMaxY < canvasMinY ||
    elementMinY > canvasMaxY
  ) {
    selectedElement.value.x = dragFrom.value.x;
    selectedElement.value.y = dragFrom.value.y;
    updateSelectedElement();
  }

  canvasStore.redrawCanvas();
};

export const dragElement = () => {
  moveElement(mouse.value.x, mouse.value.y);
};

export const moveElement = (newX, newY) => {
  let deltaX, deltaY;

  if (selectedElement.value.mode === MODE_OPTIONS.value.drawing) {
    deltaX = newX - dragStart.value.x;
    deltaY = newY - dragStart.value.y;
    selectedElement.value.points.forEach((point) => {
      point.x += deltaX;
      point.y += deltaY;
    });
  }

  useMagnet(newX, newY);

  /*
   * drag element on a specific axis (if magnet is used)
   * or use normal drag
   */
  switch (magnet.value.axis) {
    case MAGNET_AXIS_OPTIONS.value.vertical:
      selectedElement.value.y += newY - dragStart.value.y;
      break;

    case MAGNET_AXIS_OPTIONS.value.horizontal:
      selectedElement.value.x += newX - dragStart.value.x;
      break;

    default:
      selectedElement.value.x += newX - dragStart.value.x;
      selectedElement.value.y += newY - dragStart.value.y;

      removeMagnet();
  }

  dragStart.value.x = newX;
  dragStart.value.y = newY;

  updateSelectedElement();
  canvasStore.redrawCanvas(false);
};
