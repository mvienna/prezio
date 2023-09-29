import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { updateSelectedElement } from "stores/canvas/helpers/select";

const canvasStore = useCanvasStore();
const {
  mouse,
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

  const rotationHandleWidth = borderWidth / 2;

  /*
   * compute position with rotation angle
   */
  const centerX = selectedElement.value.x + selectedElement.value.width / 2;
  const centerY = selectedElement.value.y + selectedElement.value.height / 2;
  const angle = (selectedElement.value.rotationAngle * Math.PI) / 180;

  const handleOffsetX = -rotationHandleWidth / 2;
  const handleOffsetY =
    selectedElement.value.height / 2 +
    canvasStore.computeAdjustedSize(selectedElementRotationHandle.value.height);

  const handleX =
    centerX + Math.cos(angle) * handleOffsetX - Math.sin(angle) * handleOffsetY;
  const handleY =
    centerY + Math.sin(angle) * handleOffsetX + Math.cos(angle) * handleOffsetY;

  const radius = canvasStore.computeAdjustedSize(
    selectedElementRotationHandle.value.radius
  );

  /*
   * check if hovered
   */
  return (
    mouse.value.x >= handleX - radius &&
    mouse.value.x <= handleX + radius &&
    mouse.value.y >= handleY - radius &&
    mouse.value.y <= handleY + radius
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
  canvasStore.redrawCanvas();
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

  let newRotationAngle = 270 + (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  newRotationAngle = (newRotationAngle + 360) % 360;

  const rotationChange = newRotationAngle - selectedElement.value.rotationAngle;

  selectedElement.value.rotationAngle += rotationChange;

  updateSelectedElement();
  canvasStore.redrawCanvas(false);
};
