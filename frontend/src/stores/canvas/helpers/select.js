import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { useCanvasTextStore } from "stores/canvas/text";

const canvasStore = useCanvasStore();
const {
  ctx,
  elements,
  mode,
  mouse,
  MODE_OPTIONS,
  selectedElement,
  selectedElementIndex,
  magnet,
} = storeToRefs(canvasStore);

const textStore = useCanvasTextStore();

export const getHoveredElement = () => {
  let hoveredElement = null;
  let hoveredElementIndex = -1;

  const reversedElements = [...elements.value].reverse();

  reversedElements.forEach((element, index) => {
    if (element.isLocked) {
      return;
    }

    ctx.value.save();

    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;

    ctx.value.translate(centerX, centerY);
    ctx.value.rotate(((element.rotationAngle || 0) * Math.PI) / 180);
    ctx.value.translate(-centerX, -centerY);

    const inverseMatrix = ctx.value.getTransform().invertSelf();
    const rotatedMouse = new DOMPoint(
      mouse.value.x,
      mouse.value.y
    ).matrixTransform(inverseMatrix);
    const rotatedMouseX = rotatedMouse.x;
    const rotatedMouseY = rotatedMouse.y;

    if (
      rotatedMouseX >= element.x &&
      rotatedMouseX <= element.x + element.width &&
      rotatedMouseY >= element.y &&
      rotatedMouseY <= element.y + element.height
    ) {
      hoveredElement = element;
      hoveredElementIndex = elements.value.length - 1 - index;
    }

    ctx.value.restore();
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
    if (mode.value === MODE_OPTIONS.value.text && selectedElement.value) return;

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
        case MODE_OPTIONS.value.text:
          canvasStore.switchMode(MODE_OPTIONS.value.textEditing);
          break;
      }
  } else {
    deselectElement();
  }

  magnet.value.axis = null;
};

export const deselectElement = () => {
  if (selectedElement.value) {
    if (selectedElement.value.mode === MODE_OPTIONS.value.text) {
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

    syncSelectedElementWithStoredElements();
    deselectElement();
    canvasStore.redrawCanvas();
  }
};

export const syncSelectedElementWithStoredElements = () => {
  elements.value[selectedElementIndex.value] = selectedElement.value;
};
