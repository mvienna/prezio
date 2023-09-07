import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { updateSelectedElement } from "stores/canvas/helpers/select";

const canvasStore = useCanvasStore();
const {
  mouse,
  MODES_OPTIONS,
  selectedElement,
  selectedElementBorder,
  selectedElementRotationHandle,
  isRotating,
  rotationHandle,
} = storeToRefs(canvasStore);

/*
 * get rotation handle
 */
export const getRotationHandle = () => {
  /*
   * compute props
   */
  const borderWidth = canvasStore.computeAdjustedSize(
    selectedElementBorder.value.borderWidth
  );
  const padding = canvasStore.computeAdjustedSize(
    selectedElementBorder.value.padding
  );

  let width, height;
  switch (selectedElement.value.mode) {
    case MODES_OPTIONS.value.media:
    case MODES_OPTIONS.value.mediaEmojis:
      width = selectedElement.value.width;
      height = selectedElement.value.height;
      break;

    case MODES_OPTIONS.value.drawing:
      const minX = Math.min(
        ...selectedElement.value.points.map((point) => point.x)
      );
      const maxX = Math.max(
        ...selectedElement.value.points.map((point) => point.x)
      );
      const minY = Math.min(
        ...selectedElement.value.points.map((point) => point.y)
      );
      const maxY = Math.max(
        ...selectedElement.value.points.map((point) => point.y)
      );

      width = maxX - minX;
      height = maxY - minY;

      selectedElement.value.x = minX;
      selectedElement.value.y = minY;
      break;

    default:
      width = canvasStore.computeAdjustedSize(selectedElement.value.width);
      height = canvasStore.computeAdjustedSize(selectedElement.value.height);
      break;
  }

  const rotationHandleWidth = borderWidth / 2;

  /*
   * compute position with rotation angle
   */
  const centerX = selectedElement.value.x + width / 2;
  const centerY = selectedElement.value.y + height / 2;
  const angle = (selectedElement.value.rotationAngle * Math.PI) / 180;

  const handleOffsetX = -rotationHandleWidth / 2;
  const handleOffsetY =
    -height / 2 - selectedElementRotationHandle.value.height - padding;

  const handleX =
    centerX + Math.cos(angle) * handleOffsetX - Math.sin(angle) * handleOffsetY;
  const handleY =
    centerY + Math.sin(angle) * handleOffsetX + Math.cos(angle) * handleOffsetY;

  /*
   * check if hovered
   */
  return (
    mouse.value.x >= handleX - padding &&
    mouse.value.x <= handleX + rotationHandleWidth + padding &&
    mouse.value.y >= handleY - padding &&
    mouse.value.y <=
      handleY + selectedElementRotationHandle.value.height + padding
  );
};

/*
 * start rotating
 */
export const startRotating = () => {
  isRotating.value = true;
};

/*
 * stop rotating
 */
export const stopRotating = () => {
  isRotating.value = false;
  rotationHandle.value = null;
};

/*
 * rotate element
 */
export const rotateElement = () => {
  if (!isRotating.value || !selectedElement.value) return;

  const centerX = selectedElement.value.x + selectedElement.value.width / 2;
  const centerY = selectedElement.value.y + selectedElement.value.height / 2;
  const deltaX = mouse.value.x - centerX;
  const deltaY = mouse.value.y - centerY;

  let newRotationAngle = 90 + (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  newRotationAngle = (newRotationAngle + 360) % 360;

  const rotationChange = newRotationAngle - selectedElement.value.rotationAngle;

  selectedElement.value.rotationAngle += rotationChange;

  updateSelectedElement();
  canvasStore.redrawCanvas();
};
