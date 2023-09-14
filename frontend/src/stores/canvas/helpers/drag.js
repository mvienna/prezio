import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { updateSelectedElement } from "stores/canvas/helpers/select";

const canvasStore = useCanvasStore();
const {
  elements,
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
      elements.value.forEach((element) => {
        if (element.id !== selectedElement.value.id) {
          const selectedElementMinX = selectedElement.value.x;
          const selectedElementMaxX =
            selectedElement.value.x + selectedElement.value.width;
          const selectedElementMinY = selectedElement.value.y;
          const selectedElementMaxY =
            selectedElement.value.y + selectedElement.value.height;

          const magnetVisionRangeX = canvasStore.computeAdjustedSize(
            (element.width * 30) / 100
          );
          const magnetVisionRangeY = canvasStore.computeAdjustedSize(
            (element.height * 30) / 100
          );

          const magnetElementMinX = element.x - magnetVisionRangeX;
          const magnetElementMaxX =
            element.x + element.width + magnetVisionRangeX;
          const magnetElementMinY = element.y - magnetVisionRangeY;
          const magnetElementMaxY =
            element.y + element.height + magnetVisionRangeY;

          const magnetElementCorners = [
            { x: magnetElementMinX, y: magnetElementMinY },
            { x: magnetElementMaxX, y: magnetElementMinY },
            { x: magnetElementMinX, y: magnetElementMaxY },
            { x: magnetElementMaxX, y: magnetElementMaxY },
          ];

          const isAnyCornerWithinRange = magnetElementCorners.some((corner) => {
            return (
              corner.x >= selectedElementMinX &&
              corner.x <= selectedElementMaxX &&
              corner.y >= selectedElementMinY &&
              corner.y <= selectedElementMaxY
            );
          });

          if (isAnyCornerWithinRange) {
            /*
             * magnet vertically
             */
            const draggableElementRightSideX = Math.round(
              selectedElement.value.x + selectedElement.value.width
            );
            const draggableElementLeftSideX = Math.round(
              selectedElement.value.x
            );

            const magnetElementRightSide = Math.round(
              element.x + element.width
            );
            const magnetElementLeftSide = Math.round(element.x);

            // right side - left side
            if (
              Math.abs(draggableElementRightSideX - magnetElementLeftSide) <= 1
            ) {
              magnet.value = {
                axis: MAGNET_AXIS_OPTIONS.value.vertical,
                from: {
                  x: selectedElement.value.x + selectedElement.value.width,
                  y: selectedElement.value.y,
                },
                to: {
                  x: element.x,
                  y:
                    selectedElement.value.y < element.y
                      ? element.y
                      : element.y + element.height,
                },
              };
            }

            // right side - right side
            if (
              Math.abs(draggableElementRightSideX - magnetElementRightSide) <= 1
            ) {
              magnet.value = {
                axis: MAGNET_AXIS_OPTIONS.value.vertical,
                from: {
                  x: selectedElement.value.x + selectedElement.value.width,
                  y: selectedElement.value.y,
                },
                to: {
                  x: element.x + element.width,
                  y:
                    selectedElement.value.y < element.y
                      ? element.y
                      : element.y + element.height,
                },
              };
            }

            // left side - left side
            if (
              Math.abs(draggableElementLeftSideX - magnetElementLeftSide) <= 1
            ) {
              magnet.value = {
                axis: MAGNET_AXIS_OPTIONS.value.vertical,
                from: {
                  x: selectedElement.value.x,
                  y: selectedElement.value.y,
                },
                to: {
                  x: element.x,
                  y:
                    selectedElement.value.y < element.y
                      ? element.y
                      : element.y + element.height,
                },
              };
            }

            // left side - right side
            if (
              Math.abs(draggableElementLeftSideX - magnetElementRightSide) <= 1
            ) {
              magnet.value = {
                axis: MAGNET_AXIS_OPTIONS.value.vertical,
                from: {
                  x: selectedElement.value.x,
                  y: selectedElement.value.y,
                },
                to: {
                  x: element.x + element.width,
                  y:
                    selectedElement.value.y < element.y
                      ? element.y
                      : element.y + element.height,
                },
              };
            }

            /*
             * magnet horizontally
             */
            const draggableElementTopSideX = Math.round(
              selectedElement.value.y
            );
            const draggableElementBottomSideX = Math.round(
              selectedElement.value.y + selectedElement.value.height
            );

            const magnetElementTopSide = Math.round(element.y);
            const magnetElementBottomSide = Math.round(
              element.y + element.height
            );

            // top side - bottom side
            if (
              Math.abs(draggableElementTopSideX - magnetElementBottomSide) <= 1
            ) {
              magnet.value = {
                axis: MAGNET_AXIS_OPTIONS.value.horizontal,
                from: {
                  x: selectedElement.value.x + selectedElement.value.width,
                  y: selectedElement.value.y,
                },
                to: {
                  x:
                    selectedElement.value.x < element.x
                      ? element.x
                      : element.x + element.width,
                  y: element.y + element.height,
                },
              };
            }

            // top side - top side
            if (
              Math.abs(draggableElementTopSideX - magnetElementTopSide) <= 1
            ) {
              magnet.value = {
                axis: MAGNET_AXIS_OPTIONS.value.horizontal,
                from: {
                  x: selectedElement.value.x + selectedElement.value.width,
                  y: selectedElement.value.y,
                },
                to: {
                  x:
                    selectedElement.value.x < element.x
                      ? element.x
                      : element.x + element.width,
                  y: element.y,
                },
              };
            }

            // bottom side - bottom side
            if (
              Math.abs(draggableElementBottomSideX - magnetElementBottomSide) <=
              1
            ) {
              magnet.value = {
                axis: MAGNET_AXIS_OPTIONS.value.horizontal,
                from: {
                  x: selectedElement.value.x + selectedElement.value.width,
                  y: selectedElement.value.y + selectedElement.value.height,
                },
                to: {
                  x:
                    selectedElement.value.x < element.x
                      ? element.x
                      : element.x + element.width,
                  y: element.y + element.height,
                },
              };
            }

            // bottom side - top side
            if (
              Math.abs(draggableElementBottomSideX - magnetElementTopSide) <= 1
            ) {
              magnet.value = {
                axis: MAGNET_AXIS_OPTIONS.value.horizontal,
                from: {
                  x: selectedElement.value.x + selectedElement.value.width,
                  y: selectedElement.value.y + selectedElement.value.height,
                },
                to: {
                  x:
                    selectedElement.value.x < element.x
                      ? element.x
                      : element.x + element.width,
                  y: element.y,
                },
              };
            }

            const distanceX = Math.abs(newX - dragStart.value.x);
            const distanceY = Math.abs(newY - dragStart.value.y);

            if (
              (magnet.value.axis === MAGNET_AXIS_OPTIONS.value.vertical &&
                distanceY >= 3) ||
              (magnet.value.axis === MAGNET_AXIS_OPTIONS.value.horizontal &&
                distanceX >= 3)
            ) {
              magnet.value.axis = null;
            }
          }
        }
      });

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

          magnet.value.axis = null;
      }

      break;
  }

  dragStart.value.x = newX;
  dragStart.value.y = newY;

  updateSelectedElement();
  canvasStore.redrawCanvas();
};
