import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { useCanvasTextStore } from "stores/canvas/text";

const canvasStore = useCanvasStore();
const {
  elements,
  mode,
  mouse,
  MODES_OPTIONS,
  selectedElement,
  selectedElementIndex,
  magnet,
} = storeToRefs(canvasStore);

const textStore = useCanvasTextStore();

export const getHoveredElement = () => {
  let hoveredElement = null;
  let hoveredElementIndex = -1;

  let angle, centerX, centerY, rotatedMouseX, rotatedMouseY;

  const reversedElements = [...elements.value].reverse();

  reversedElements.map((element, index) => {
    if (element.isLocked) {
      return;
    }

    // switch (element.mode) {
    /*
     * drawing
     */
    // case MODES_OPTIONS.value.drawing:
    //   if (
    //     mouse.value.x >= element.x &&
    //     mouse.value.x <= element.x + element.width &&
    //     mouse.value.y >= element.y &&
    //     mouse.value.y <= element.y + element.height
    //   ) {
    //     hoveredElement = element;
    //     hoveredElementIndex = elements.value.length - 1 - index;
    //   }
    //   break;

    // case MODES_OPTIONS.value.drawing:
    //   angle = (element.rotationAngle * Math.PI) / 180;
    //   centerX = element.x + element.width / 2;
    //   centerY = element.y + element.height / 2;
    //
    //   // Rotate the mouse coordinates around the element's center
    //   rotatedMouseX =
    //       centerX +
    //       Math.cos(angle) * (mouse.value.x - centerX) -
    //       Math.sin(angle) * (mouse.value.y - centerY);
    //   rotatedMouseY =
    //       centerY +
    //       Math.sin(angle) * (mouse.value.x - centerX) +
    //       Math.cos(angle) * (mouse.value.y - centerY);
    //
    //   const minX = Math.min(...element.points.map((point) => point.x));
    //   const maxX = Math.max(...element.points.map((point) => point.x));
    //   const minY = Math.min(...element.points.map((point) => point.y));
    //   const maxY = Math.max(...element.points.map((point) => point.y));
    //
    //   if (
    //       rotatedMouseX >= minX &&
    //       rotatedMouseX <= maxX &&
    //       rotatedMouseY >= minY &&
    //       rotatedMouseY <= maxY
    //   ) {
    //     hoveredElement = element;
    //     hoveredElementIndex = elements.value.length - 1 - index;
    //   }
    //   break;

    /*
     * text
     */
    // case MODES_OPTIONS.value.text:
    //   if (
    //     Math.round(mouse.value.x) >= Math.round(element.x) &&
    //     Math.round(mouse.value.x) <=
    //       Math.round(
    //         element.x + canvasStore.computeAdjustedSize(element.width)
    //       ) &&
    //     Math.round(mouse.value.y) >= Math.round(element.y) &&
    //     Math.round(mouse.value.y) <=
    //       Math.round(
    //         element.y + canvasStore.computeAdjustedSize(element.height)
    //       )
    //   ) {
    //     hoveredElement = element;
    //     hoveredElementIndex = elements.value.length - 1 - index;
    //   }
    //   break;

    // case MODES_OPTIONS.value.text:
    // const angle = (element.rotationAngle * Math.PI) / 180;
    // const centerX =
    //   element.x + canvasStore.computeAdjustedSize(element.width) / 2;
    // const centerY =
    //   element.y + canvasStore.computeAdjustedSize(element.height) / 2;
    //
    // // Rotate the mouse coordinates around the element's center
    // const rotatedMouseX =
    //   centerX +
    //   Math.cos(angle) * (mouse.value.x - centerX) -
    //   Math.sin(angle) * (mouse.value.y - centerY);
    // const rotatedMouseY =
    //   centerY +
    //   Math.sin(angle) * (mouse.value.x - centerX) +
    //   Math.cos(angle) * (mouse.value.y - centerY);
    //
    // if (
    //   Math.round(rotatedMouseX) >= Math.round(element.x) &&
    //   Math.round(rotatedMouseX) <=
    //     Math.round(
    //       element.x + canvasStore.computeAdjustedSize(element.width)
    //     ) &&
    //   Math.round(rotatedMouseY) >= Math.round(element.y) &&
    //   Math.round(rotatedMouseY) <=
    //     Math.round(element.y + canvasStore.computeAdjustedSize(element.height))
    // ) {
    //   hoveredElement = element;
    //   hoveredElementIndex = elements.value.length - 1 - index;
    // }
    // break;

    /*
     * media
     */
    // case MODES_OPTIONS.value.media:
    // case MODES_OPTIONS.value.mediaEmoji:
    // case MODES_OPTIONS.value.shape:
    angle = (element.rotationAngle * Math.PI) / 180;
    centerX = element.x + element.width / 2;
    centerY = element.y + element.height / 2;

    // Rotate the mouse coordinates around the element's center
    rotatedMouseX =
      centerX +
      Math.cos(angle) * (mouse.value.x - centerX) -
      Math.sin(angle) * (mouse.value.y - centerY);
    rotatedMouseY =
      centerY +
      Math.sin(angle) * (mouse.value.x - centerX) +
      Math.cos(angle) * (mouse.value.y - centerY);

    if (
      Math.round(rotatedMouseX) >= Math.round(element.x) &&
      Math.round(rotatedMouseX) <= Math.round(element.x + element.width) &&
      Math.round(rotatedMouseY) >= Math.round(element.y) &&
      Math.round(rotatedMouseY) <= Math.round(element.y + element.height)
    ) {
      hoveredElement = element;
      hoveredElementIndex = elements.value.length - 1 - index;
    }
    // break;
    // }
  });

  return { hoveredElement, hoveredElementIndex };
};

export const selectElement = (element = null) => {
  if (element) {
    selectedElement.value = element;
    selectedElementIndex.value = elements.value.findIndex(
      (item) => item.id === element.id
    );
  } else {
    if (mode.value === MODES_OPTIONS.value.text && selectedElement.value)
      return;

    const isSelectedElementExisted = !!selectedElement.value;

    selectedElement.value = null;
    selectedElementIndex.value = -1;

    const { hoveredElement, hoveredElementIndex } = getHoveredElement();

    if (hoveredElement) {
      selectedElement.value = hoveredElement;
      selectedElementIndex.value = hoveredElementIndex;
    } else {
      if (isSelectedElementExisted) {
        canvasStore.switchMode(null);
      }
    }
  }

  if (selectedElement.value) {
    canvasStore.switchMode(selectedElement.value.mode);
  }

  magnet.value.axis = null;
  canvasStore.redrawCanvas(false);
};

export const doubleSelectElement = () => {
  const previousSelectedElementIndex = selectedElementIndex.value;

  selectedElement.value = null;
  selectedElementIndex.value = -1;

  const { hoveredElement, hoveredElementIndex } = getHoveredElement();

  if (hoveredElement) {
    selectedElement.value = hoveredElement;
    selectedElementIndex.value = hoveredElementIndex;
    canvasStore.switchMode(hoveredElement.mode);

    if (previousSelectedElementIndex === selectedElementIndex.value)
      switch (mode.value) {
        case MODES_OPTIONS.value.text:
          canvasStore.switchMode(MODES_OPTIONS.value.textEditing);
          break;
      }
  }

  magnet.value.axis = null;
};

export const deselectElement = () => {
  if (selectedElement.value) {
    if (selectedElement.value.mode === MODES_OPTIONS.value.text) {
      textStore.clearFormatting();
    }

    selectedElement.value = null;
    selectedElementIndex.value = -1;
  }

  magnet.value.axis = null;
  canvasStore.switchMode(null);

  canvasStore.redrawCanvas(false);
};

export const deleteElement = (element = selectedElement.value) => {
  if (element) {
    elements.value = elements.value.filter((item) => item.id !== element.id);

    selectedElement.value = null;
    selectedElementIndex.value = -1;

    updateSelectedElement();
    deselectElement();
    canvasStore.redrawCanvas();
  }
};

export const updateSelectedElement = () => {
  elements.value[selectedElementIndex.value] = selectedElement.value;
};
