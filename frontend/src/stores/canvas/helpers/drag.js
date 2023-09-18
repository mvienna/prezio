import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { updateSelectedElement } from "stores/canvas/helpers/select";
import { removeMagnet, useMagnet } from "stores/canvas/helpers/magnet";

const canvasStore = useCanvasStore();
const {
  isDragging,
  dragStart,
  mouse,
  selectedElement,
  MODES_OPTIONS,
  magnet,
  MAGNET_AXIS_OPTIONS,
} = storeToRefs(canvasStore);

export const startDragging = () => {
  isDragging.value = true;
  dragStart.value = {
    x: mouse.value.x,
    y: mouse.value.y,
  };
};

export const stopDragging = () => {
  isDragging.value = false;
  removeMagnet();
  canvasStore.redrawCanvas();
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

      break;
  }

  dragStart.value.x = newX;
  dragStart.value.y = newY;

  updateSelectedElement();
  canvasStore.redrawCanvas(false);
};
