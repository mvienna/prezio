import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { updateSelectedElement } from "stores/canvas/helpers/select";

const canvasStore = useCanvasStore();
const {
  elements,
  canvas,
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
      const magnetThreshold = 2;

      const magneticElements = [
        ...elements.value,

        // for canvas magnet (to the slide)
        {
          id: "canvas",
          x: 0,
          y: 0,
          width: canvas.value.width,
          height: canvas.value.height,
        },
      ];

      magneticElements.forEach((element) => {
        if (element.id !== selectedElement.value.id) {
          /*
           * compute help variables for draggable & magnet elements
           */
          const draggableElement = {
            sides: {
              // vertical
              right: Math.round(
                selectedElement.value.x + selectedElement.value.width
              ),
              left: Math.round(selectedElement.value.x),
              centerVertical: Math.round(
                selectedElement.value.x + selectedElement.value.width / 2
              ),

              // horizontal
              top: Math.round(selectedElement.value.y),
              bottom: Math.round(
                selectedElement.value.y + selectedElement.value.height
              ),
              centerHorizontal: Math.round(
                selectedElement.value.y + selectedElement.value.height / 2
              ),
            },
            connectionLine: {
              // vertical
              y:
                element.id === "canvas"
                  ? element.y
                  : selectedElement.value.y < element.y
                  ? selectedElement.value.y + selectedElement.value.height
                  : selectedElement.value.y,

              // horizontal
              x:
                element.id === "canvas"
                  ? element.x
                  : selectedElement.value.x < element.x
                  ? selectedElement.value.x + selectedElement.value.width
                  : selectedElement.value.x,
            },
          };

          const magnetElement = {
            sides: {
              // vertical
              right: Math.round(element.x + element.width),
              left: Math.round(element.x),
              centerVertical: Math.round(element.x + element.width / 2),

              // horizontal
              top: Math.round(element.y),
              bottom: Math.round(element.y + element.height),
              centerHorizontal: Math.round(element.y + element.height / 2),
            },
            connectionLine: {
              // vertical
              y:
                selectedElement.value.y < element.y
                  ? element.y
                  : element.y + element.height,

              // horizontal
              x:
                selectedElement.value.x < element.x
                  ? element.x
                  : element.x + element.width,
            },
          };

          /*
           * VERTICAL MAGNET
           * draggable element - magnet element
           */
          // right side - left side
          if (
            Math.abs(draggableElement.sides.right - magnetElement.sides.left) <=
            magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.vertical,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: selectedElement.value.x + selectedElement.value.width,
                    y: draggableElement.connectionLine.y,
                  },
                  to: {
                    x: element.x,
                    y: magnetElement.connectionLine.y,
                  },
                },
              ],
            };
          }

          // right side - right side
          if (
            Math.abs(
              draggableElement.sides.right - magnetElement.sides.right
            ) <= magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.vertical,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: selectedElement.value.x + selectedElement.value.width,
                    y: draggableElement.connectionLine.y,
                  },
                  to: {
                    x: element.x + element.width,
                    y: magnetElement.connectionLine.y,
                  },
                },
              ],
            };
          }

          // left side - left side
          if (
            Math.abs(draggableElement.sides.left - magnetElement.sides.left) <=
            magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.vertical,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: selectedElement.value.x,
                    y: draggableElement.connectionLine.y,
                  },
                  to: {
                    x: element.x,
                    y: magnetElement.connectionLine.y,
                  },
                },
              ],
            };
          }

          // left side - right side
          if (
            Math.abs(draggableElement.sides.left - magnetElement.sides.right) <=
            magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.vertical,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: selectedElement.value.x,
                    y: draggableElement.connectionLine.y,
                  },
                  to: {
                    x: element.x + element.width,
                    y: magnetElement.connectionLine.y,
                  },
                },
              ],
            };
          }

          // right side - center
          if (
            Math.abs(
              draggableElement.sides.right - magnetElement.sides.centerVertical
            ) <= magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.vertical,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: selectedElement.value.x + selectedElement.value.width,
                    y: draggableElement.connectionLine.y,
                  },
                  to: {
                    x: element.x + element.width / 2,
                    y: magnetElement.connectionLine.y,
                  },
                },
              ],
            };
          }

          // left side - center
          if (
            Math.abs(
              draggableElement.sides.left - magnetElement.sides.centerVertical
            ) <= magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.vertical,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: selectedElement.value.x,
                    y: draggableElement.connectionLine.y,
                  },
                  to: {
                    x: element.x + element.width / 2,
                    y: magnetElement.connectionLine.y,
                  },
                },
              ],
            };
          }

          // center - right side
          if (
            Math.abs(
              draggableElement.sides.centerVertical - magnetElement.sides.right
            ) <= magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.vertical,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x:
                      selectedElement.value.x + selectedElement.value.width / 2,
                    y: draggableElement.connectionLine.y,
                  },
                  to: {
                    x: element.x + element.width,
                    y: magnetElement.connectionLine.y,
                  },
                },
              ],
            };
          }

          // center - left side
          if (
            Math.abs(
              draggableElement.sides.centerVertical - magnetElement.sides.left
            ) <= magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.vertical,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x:
                      selectedElement.value.x + selectedElement.value.width / 2,
                    y: draggableElement.connectionLine.y,
                  },
                  to: {
                    x: element.x,
                    y: magnetElement.connectionLine.y,
                  },
                },
              ],
            };
          }

          // center - center
          if (
            Math.abs(
              draggableElement.sides.centerVertical -
                magnetElement.sides.centerVertical
            ) <= magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.vertical,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x:
                      selectedElement.value.x + selectedElement.value.width / 2,
                    y: draggableElement.connectionLine.y,
                  },
                  to: {
                    x: element.x + element.width / 2,
                    y: magnetElement.connectionLine.y,
                  },
                },
              ],
            };
          }

          /*
           * HORIZONTAL MAGNET
           */
          // top side - bottom side
          if (
            Math.abs(draggableElement.sides.top - magnetElement.sides.bottom) <=
            magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.horizontal,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: draggableElement.connectionLine.x,
                    y: selectedElement.value.y,
                  },
                  to: {
                    x: magnetElement.connectionLine.x,
                    y: element.y + element.height,
                  },
                },
              ],
            };
          }

          // top side - top side
          if (
            Math.abs(draggableElement.sides.top - magnetElement.sides.top) <=
            magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.horizontal,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: draggableElement.connectionLine.x,
                    y: selectedElement.value.y,
                  },
                  to: {
                    x: magnetElement.connectionLine.x,
                    y: element.y,
                  },
                },
              ],
            };
          }

          // bottom side - bottom side
          if (
            Math.abs(
              draggableElement.sides.bottom - magnetElement.sides.bottom
            ) <= magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.horizontal,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: draggableElement.connectionLine.x,
                    y: selectedElement.value.y + selectedElement.value.height,
                  },
                  to: {
                    x: magnetElement.connectionLine.x,
                    y: element.y + element.height,
                  },
                },
              ],
            };
          }

          // bottom side - top side
          if (
            Math.abs(draggableElement.sides.bottom - magnetElement.sides.top) <=
            magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.horizontal,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: draggableElement.connectionLine.x,
                    y: selectedElement.value.y + selectedElement.value.height,
                  },
                  to: {
                    x: magnetElement.connectionLine.x,
                    y: element.y,
                  },
                },
              ],
            };
          }

          // top - center
          if (
            Math.abs(
              draggableElement.sides.top - magnetElement.sides.centerHorizontal
            ) <= magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.horizontal,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: draggableElement.connectionLine.x,
                    y: selectedElement.value.y,
                  },
                  to: {
                    x: magnetElement.connectionLine.x,
                    y: element.y + element.height / 2,
                  },
                },
              ],
            };
          }

          // bottom - center
          if (
            Math.abs(
              draggableElement.sides.bottom -
                magnetElement.sides.centerHorizontal
            ) <= magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.horizontal,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: draggableElement.connectionLine.x,
                    y: selectedElement.value.y + selectedElement.value.height,
                  },
                  to: {
                    x: magnetElement.connectionLine.x,
                    y: element.y + element.height / 2,
                  },
                },
              ],
            };
          }

          // center - bottom
          if (
            Math.abs(
              draggableElement.sides.centerHorizontal -
                magnetElement.sides.bottom
            ) <= magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.horizontal,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: draggableElement.connectionLine.x,
                    y:
                      selectedElement.value.y +
                      selectedElement.value.height / 2,
                  },
                  to: {
                    x: magnetElement.connectionLine.x,
                    y: element.y + element.height,
                  },
                },
              ],
            };
          }

          // center - top
          if (
            Math.abs(
              draggableElement.sides.centerHorizontal - magnetElement.sides.top
            ) <= magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.horizontal,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: draggableElement.connectionLine.x,
                    y:
                      selectedElement.value.y +
                      selectedElement.value.height / 2,
                  },
                  to: {
                    x: magnetElement.connectionLine.x,
                    y: element.y,
                  },
                },
              ],
            };
          }

          // center - center
          if (
            Math.abs(
              draggableElement.sides.centerHorizontal -
                magnetElement.sides.centerHorizontal
            ) <= magnetThreshold
          ) {
            magnet.value = {
              axis: MAGNET_AXIS_OPTIONS.value.horizontal,
              connectionLines: [
                ...magnet.value.connectionLines,
                {
                  from: {
                    x: draggableElement.connectionLine.x,
                    y:
                      selectedElement.value.y +
                      selectedElement.value.height / 2,
                  },
                  to: {
                    x: magnetElement.connectionLine.x,
                    y: element.y + element.height / 2,
                  },
                },
              ],
            };
          }

          /*
           * unstuck (de-magnet) on mouse move away from magnet axis
           */
          const distanceX = Math.abs(newX - dragStart.value.x);
          const distanceY = Math.abs(newY - dragStart.value.y);

          if (
            (magnet.value.axis === MAGNET_AXIS_OPTIONS.value.vertical &&
              distanceY >= 2) ||
            (magnet.value.axis === MAGNET_AXIS_OPTIONS.value.horizontal &&
              distanceX >= 2)
          ) {
            magnet.value.axis = null;
          }
        }
      });

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

          magnet.value = {
            axis: null,
            connectionLines: [],
          };
      }

      break;
  }

  dragStart.value.x = newX;
  dragStart.value.y = newY;

  updateSelectedElement();
  canvasStore.redrawCanvas(false);
};
