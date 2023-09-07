import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { updateSelectedElement } from "stores/canvas/helpers/select";

const canvasStore = useCanvasStore();
const {
  mouse,
  MODES_OPTIONS,
  selectedElement,
  selectedElementBorder,
  resizeStart,
  isResizing,
  RESIZE_HANDLES_OPTIONS,
  resizeHandle,
} = storeToRefs(canvasStore);

/*
 * get resize handle
 */
export const getResizeHandle = () => {
  if (
    [MODES_OPTIONS.value.drawing, MODES_OPTIONS.value.text].includes(
      selectedElement.value.mode
    )
  )
    return null;

  /*
   * compute props
   */
  const borderWidth = canvasStore.computeAdjustedSize(
    selectedElementBorder.value.borderWidth
  );
  const handleSize = borderWidth * 3;
  const padding = canvasStore.computeAdjustedSize(
    selectedElementBorder.value.padding
  );

  let width, height;
  switch (selectedElement.value.mode) {
    case MODES_OPTIONS.value.media:
    case MODES_OPTIONS.value.mediaEmoji:
    case MODES_OPTIONS.value.shape:
      width = selectedElement.value.width;
      height = selectedElement.value.height;
      break;

    default:
      width = canvasStore.computeAdjustedSize(selectedElement.value.width);
      height = canvasStore.computeAdjustedSize(selectedElement.value.height);
      break;
  }

  /*
   * find active handle
   */
  let activeHandle = null;

  const centerX = selectedElement.value.x + width / 2;
  const centerY = selectedElement.value.y + height / 2;
  const angle = (selectedElement.value.rotationAngle * Math.PI) / 180;

  let handles;

  switch (selectedElement.value.mode) {
    case MODES_OPTIONS.value.media:
    case MODES_OPTIONS.value.mediaEmoji:
      handles = Object.values(RESIZE_HANDLES_OPTIONS.value);
      break;

    case MODES_OPTIONS.value.shape:
      const allowedHandles = [
        RESIZE_HANDLES_OPTIONS.value.topLeft,
        RESIZE_HANDLES_OPTIONS.value.topRight,
        RESIZE_HANDLES_OPTIONS.value.bottomLeft,
        RESIZE_HANDLES_OPTIONS.value.bottomRight,
      ];
      handles = Object.values(RESIZE_HANDLES_OPTIONS.value).filter((handle) =>
        allowedHandles.includes(handle)
      );
      break;

    default:
      handles = [];
  }

  handles.forEach((handle) => {
    const { minX, minY, maxX, maxY } = canvasStore.computeResizeHandlePosition(
      handle,
      selectedElement.value.x,
      selectedElement.value.y,
      width,
      height,
      handleSize,
      padding
    );

    const rotatedMinX =
      centerX +
      Math.cos(angle) * (minX - centerX) -
      Math.sin(angle) * (minY - centerY);
    const rotatedMinY =
      centerY +
      Math.sin(angle) * (minX - centerX) +
      Math.cos(angle) * (minY - centerY);
    const rotatedMaxX =
      centerX +
      Math.cos(angle) * (maxX - centerX) -
      Math.sin(angle) * (maxY - centerY);
    const rotatedMaxY =
      centerY +
      Math.sin(angle) * (maxX - centerX) +
      Math.cos(angle) * (maxY - centerY);

    if (
      mouse.value.x >= rotatedMinX - padding &&
      mouse.value.x <= rotatedMaxX + padding &&
      mouse.value.y >= rotatedMinY - padding &&
      mouse.value.y <= rotatedMaxY + padding
    ) {
      activeHandle = handle;
    }
  });

  return activeHandle;
};

/*
 * start resizing
 */
export const startResizing = () => {
  isResizing.value = true;
  resizeStart.value = {
    x: selectedElement.value.x,
    y: selectedElement.value.y,
    width: selectedElement.value.width,
    height: selectedElement.value.height,
    clientX: mouse.value.x,
    clientY: mouse.value.y,
  };
};

/*
 * stop resizing
 */
export const stopResizing = () => {
  isResizing.value = false;
  resizeHandle.value = null;
};

/*
 * resize element
 */
export const resizeElement = () => {
  if (!isResizing.value) return;

  const deltaX = mouse.value.x - resizeStart.value.clientX;
  const deltaY = mouse.value.y - resizeStart.value.clientY;

  const aspectRatio =
    selectedElement.value.width / selectedElement.value.height;

  const minWidth = canvasStore.computeAdjustedSize(50);
  const minHeight = minWidth / aspectRatio;

  switch (resizeHandle.value) {
    /*
     * top left
     */
    case RESIZE_HANDLES_OPTIONS.value.topLeft:
      const newTopLeftWidth = Math.max(
        minWidth,
        resizeStart.value.width - deltaX
      );
      const newTopLeftHeight = Math.max(
        minHeight,
        newTopLeftWidth / aspectRatio
      );

      selectedElement.value.width = newTopLeftWidth;
      selectedElement.value.height = newTopLeftHeight;

      selectedElement.value.x =
        resizeStart.value.x + (resizeStart.value.width - newTopLeftWidth);
      selectedElement.value.y =
        resizeStart.value.y + (resizeStart.value.height - newTopLeftHeight);

      break;

    /*
     * top right
     */
    case RESIZE_HANDLES_OPTIONS.value.topRight:
      const newTopRightWidth = Math.max(
        minWidth,
        resizeStart.value.width + deltaX
      );
      const newTopRightHeight = Math.max(
        minHeight,
        newTopRightWidth / aspectRatio
      );

      selectedElement.value.width = newTopRightWidth;
      selectedElement.value.height = newTopRightHeight;

      selectedElement.value.y =
        resizeStart.value.y + (resizeStart.value.height - newTopRightHeight);

      break;

    /*
     * bottom left
     */
    case RESIZE_HANDLES_OPTIONS.value.bottomLeft:
      const newBottomLeftWidth = Math.max(
        minWidth,
        resizeStart.value.width - deltaX
      );
      const newBottomLeftHeight = Math.max(
        minHeight,
        newBottomLeftWidth / aspectRatio
      );

      selectedElement.value.width = newBottomLeftWidth;
      selectedElement.value.height = newBottomLeftHeight;

      selectedElement.value.x =
        resizeStart.value.x + (resizeStart.value.width - newBottomLeftWidth);

      break;

    /*
     * bottom right
     */
    case RESIZE_HANDLES_OPTIONS.value.bottomRight:
      const newBottomRightWidth = Math.max(
        minWidth,
        resizeStart.value.width + deltaX
      );
      const newBottomRightHeight = Math.max(
        minHeight,
        newBottomRightWidth / aspectRatio
      );

      selectedElement.value.width = newBottomRightWidth;
      selectedElement.value.height = newBottomRightHeight;

      break;

    /*
     * center top
     */
    case RESIZE_HANDLES_OPTIONS.value.centerTop:
      const newCenterTopHeight = Math.max(
        minHeight,
        resizeStart.value.height - deltaY
      );
      selectedElement.value.height = newCenterTopHeight;
      selectedElement.value.y =
        resizeStart.value.y + (resizeStart.value.height - newCenterTopHeight);

      break;

    /*
     * center bottom
     */
    case RESIZE_HANDLES_OPTIONS.value.centerBottom:
      const newCenterBottomHeight = Math.max(
        minHeight,
        resizeStart.value.height + deltaY
      );
      selectedElement.value.height = newCenterBottomHeight;

      break;

    /*
     * center left
     */
    case RESIZE_HANDLES_OPTIONS.value.centerLeft:
      const newCenterLeftWidth = Math.max(
        minWidth,
        resizeStart.value.width - deltaX
      );

      selectedElement.value.width = newCenterLeftWidth;
      selectedElement.value.x =
        resizeStart.value.x + (resizeStart.value.width - newCenterLeftWidth);

      break;

    /*
     * center right
     */
    case RESIZE_HANDLES_OPTIONS.value.centerRight:
      selectedElement.value.width = Math.max(
        minWidth,
        resizeStart.value.width + deltaX
      );

      break;
  }

  updateSelectedElement();
  canvasStore.redrawCanvas();
};
