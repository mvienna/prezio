import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { syncSelectedElementWithStoredElements } from "stores/canvas/helpers/select";
import { removeMagnet, useMagnet } from "stores/canvas/helpers/magnet";
import { SHAPES_OPTIONS } from "src/constants/canvas/canvasVariables";
import { useCanvasTextStore } from "stores/canvas/text";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { usePresentationsStore } from "stores/presentations";

const canvasStore = useCanvasStore();
const {
  mouse,
  MODE_OPTIONS,
  selectedElement,
  selectedElementBorder,
  resizeStart,
  isResizing,
  RESIZE_HANDLES_OPTIONS,
  resizeHandle,
} = storeToRefs(canvasStore);

const textStore = useCanvasTextStore();
const { input } = storeToRefs(textStore);

const presentationsStore = usePresentationsStore();
const { slide } = storeToRefs(presentationsStore);

/*
 * get resize handle
 */
export const getResizeHandle = () => {
  /*
   * allow only for content slide
   */
  if (slide.value?.type !== SLIDE_TYPES.CONTENT) return;

  /*
   * compute props
   */
  const borderWidth = canvasStore.computeAdjustedSize(
    selectedElementBorder.value.borderWidth
  );
  const handleSize = borderWidth * 16;

  /*
   * find active handle
   */
  let activeHandle = null;

  const centerX = selectedElement.value.x + selectedElement.value.width / 2;
  const centerY = selectedElement.value.y + selectedElement.value.height / 2;
  const angle = (selectedElement.value.rotationAngle * Math.PI) / 180;

  let allowedHandles = [];

  switch (selectedElement.value.mode) {
    /*
     * text
     */
    case MODE_OPTIONS.value.text:
      allowedHandles = [
        RESIZE_HANDLES_OPTIONS.value.centerLeft,
        RESIZE_HANDLES_OPTIONS.value.centerRight,
      ];
      break;

    /*
     * shapes
     */
    case MODE_OPTIONS.value.shape:
      allowedHandles = [SHAPES_OPTIONS.circle, SHAPES_OPTIONS.star].includes(
        selectedElement.value.type
      )
        ? [
            RESIZE_HANDLES_OPTIONS.value.topLeft,
            RESIZE_HANDLES_OPTIONS.value.topRight,
            RESIZE_HANDLES_OPTIONS.value.bottomLeft,
            RESIZE_HANDLES_OPTIONS.value.bottomRight,
          ]
        : Object.values(RESIZE_HANDLES_OPTIONS.value);
      break;

    /*
     * drawing
     */
    case MODE_OPTIONS.value.drawing:
      allowedHandles = [];
      break;

    /*
     * others
     */
    default:
      allowedHandles = Object.values(RESIZE_HANDLES_OPTIONS.value);
      break;
  }

  const handles = Object.values(RESIZE_HANDLES_OPTIONS.value).filter((handle) =>
    allowedHandles.includes(handle)
  );

  handles.forEach((handle) => {
    const { minX, minY, maxX, maxY } = canvasStore.computeResizeHandlePosition(
      handle,
      selectedElement.value.x,
      selectedElement.value.y,
      selectedElement.value.width,
      selectedElement.value.height,
      handleSize
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
      mouse.value.x >= rotatedMinX &&
      mouse.value.x <= rotatedMaxX &&
      mouse.value.y >= rotatedMinY &&
      mouse.value.y <= rotatedMaxY
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
  removeMagnet();
  canvasStore.redrawCanvas(false);
};

/*
 * resize element
 */
export const resizeElement = (event) => {
  if (!isResizing.value) return;

  const deltaX = mouse.value.x - resizeStart.value.clientX;
  const deltaY = mouse.value.y - resizeStart.value.clientY;

  const aspectRatio =
    selectedElement.value.width / selectedElement.value.height;

  const minWidth = canvasStore.computeAdjustedSize(25);
  const minHeight = event.shiftKey ? minWidth / aspectRatio : minWidth;

  // resize proportionally
  if (event.shiftKey) {
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
        const newCenterTopWidth = newCenterTopHeight * aspectRatio;
        selectedElement.value.height = newCenterTopHeight;
        selectedElement.value.width = newCenterTopWidth;
        selectedElement.value.y =
          resizeStart.value.y + (resizeStart.value.height - newCenterTopHeight);
        selectedElement.value.x =
          resizeStart.value.x + (resizeStart.value.width - newCenterTopWidth);
        break;

      /*
       * center bottom
       */
      case RESIZE_HANDLES_OPTIONS.value.centerBottom:
        const newCenterBottomHeight = Math.max(
          minHeight,
          resizeStart.value.height + deltaY
        );
        const newCenterBottomWidth = newCenterBottomHeight * aspectRatio;
        selectedElement.value.height = newCenterBottomHeight;
        selectedElement.value.width = newCenterBottomWidth;
        break;

      /*
       * center left
       */
      case RESIZE_HANDLES_OPTIONS.value.centerLeft:
        const newCenterLeftWidth = Math.max(
          minWidth,
          resizeStart.value.width - deltaX
        );
        const newCenterLeftHeight = newCenterLeftWidth / aspectRatio;
        selectedElement.value.width = newCenterLeftWidth;
        selectedElement.value.height = newCenterLeftHeight;
        selectedElement.value.x =
          resizeStart.value.x + (resizeStart.value.width - newCenterLeftWidth);
        selectedElement.value.y =
          resizeStart.value.y +
          (resizeStart.value.height - newCenterLeftHeight);
        break;

      /*
       * center right
       */
      case RESIZE_HANDLES_OPTIONS.value.centerRight:
        const newCenterRightWidth = Math.max(
          minWidth,
          resizeStart.value.width + deltaX
        );
        const newCenterRightHeight = newCenterRightWidth / aspectRatio;
        selectedElement.value.width = newCenterRightWidth;
        selectedElement.value.height = newCenterRightHeight;
        break;
    }

    /*
     * resize not proportionally
     */
  } else {
    switch (resizeHandle.value) {
      /*
       * top left
       */
      case RESIZE_HANDLES_OPTIONS.value.topLeft:
        const newTopLeftWidth = Math.max(
          minWidth,
          selectedElement.value.width - deltaX
        );
        const newTopLeftHeight = Math.max(
          minHeight,
          selectedElement.value.height - deltaY
        );

        if (newTopLeftWidth !== selectedElement.value.width) {
          selectedElement.value.width = newTopLeftWidth;
          selectedElement.value.x += deltaX;
        }

        if (newTopLeftHeight !== selectedElement.value.height) {
          selectedElement.value.height = newTopLeftHeight;
          selectedElement.value.y += deltaY;
        }
        break;

      /*
       * top right
       */
      case RESIZE_HANDLES_OPTIONS.value.topRight:
        const newTopRightWidth = Math.max(
          minWidth,
          selectedElement.value.width + deltaX
        );
        const newTopRightHeight = Math.max(
          minHeight,
          selectedElement.value.height - deltaY
        );

        if (newTopRightWidth !== selectedElement.value.width) {
          selectedElement.value.width = newTopRightWidth;
        }

        if (newTopRightHeight !== selectedElement.value.height) {
          selectedElement.value.height = newTopRightHeight;
          selectedElement.value.y += deltaY;
        }
        break;

      /*
       * bottom left
       */
      case RESIZE_HANDLES_OPTIONS.value.bottomLeft:
        const newBottomLeftWidth = Math.max(
          minWidth,
          selectedElement.value.width - deltaX
        );
        const newBottomLeftHeight = Math.max(
          minHeight,
          selectedElement.value.height + deltaY
        );

        if (newBottomLeftWidth !== selectedElement.value.width) {
          selectedElement.value.width = newBottomLeftWidth;
          selectedElement.value.x += deltaX;
        }

        if (newBottomLeftHeight !== selectedElement.value.height) {
          selectedElement.value.height = newBottomLeftHeight;
        }
        break;

      /*
       * bottom right
       */
      case RESIZE_HANDLES_OPTIONS.value.bottomRight:
        const newBottomRightWidth = Math.max(
          minWidth,
          selectedElement.value.width + deltaX
        );
        const newBottomRightHeight = Math.max(
          minHeight,
          selectedElement.value.height + deltaY
        );

        if (newBottomRightWidth !== selectedElement.value.width) {
          selectedElement.value.width = newBottomRightWidth;
        }

        if (newBottomRightHeight !== selectedElement.value.height) {
          selectedElement.value.height = newBottomRightHeight;
        }
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
        selectedElement.value.width = Math.max(
          minWidth,
          selectedElement.value.width - deltaX
        );
        selectedElement.value.x += deltaX;
        break;

      /*
       * center right
       */
      case RESIZE_HANDLES_OPTIONS.value.centerRight:
        selectedElement.value.width = Math.max(
          minWidth,
          selectedElement.value.width + deltaX
        );
        break;
    }
  }

  removeMagnet();
  useMagnet();

  resizeStart.value = {
    x: selectedElement.value.x,
    y: selectedElement.value.y,
    width: selectedElement.value.width,
    height: selectedElement.value.height,
    clientX: mouse.value.x,
    clientY: mouse.value.y,
  };

  if (input.value) {
    selectedElement.value.text = input.value.innerHTML;
  }

  syncSelectedElementWithStoredElements();
  canvasStore.redrawCanvas(false);

  if (input.value) {
    input.value.style.width =
      canvasStore.computeRealSize(selectedElement.value.width) + "px";

    input.value.style.height =
      canvasStore.computeRealSize(selectedElement.value.height) + "px";

    textStore.moveInputCursorToTheEnd();
  }
};
