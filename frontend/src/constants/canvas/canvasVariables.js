export const DRAWING_MODES = {
  BRUSH: "brush",
  ERASER: "eraser",
};

// TODO: REMOVE! canvas/update.js
export const BRUSH_TYPES = [
  { label: "presentationStudio.toolbar.drawing.BRUSH_TYPES.pen", value: "pen" },
  {
    label: "presentationStudio.toolbar.drawing.BRUSH_TYPES.pencil",
    value: "pencil",
  },
];

export const FONT_OPTIONS = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Courier",
  "Georgia",
  "Palatino",
  "Verdana",
  "Geneva",
  "Tahoma",
  "Trebuchet MS",
  "Impact",
  "Roboto",
];

export const COLOR_PALETTE = {
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  PRIMARY: "#1751D0",
  SECONDARY: "#113B98",
  WHITE_TRANSPARENT: "rgba(255, 255, 255, 0.1)",
  BLACK_TRANSPARENT: "rgba(0, 0, 0, 0.1)",
  GREY: "#A3A2A6",
};

export const ALIGNMENT = {
  horizontal: {
    left: "left",
    center: "center",
    right: "right",
  },

  vertical: {
    top: "top",
    middle: "middle",
    bottom: "bottom",
  },
};

export const SHAPES_OPTIONS = {
  CIRCLE: "Circle",
  RECT: "Rect",
  TRIANGLE: "Triangle",
  STAR: "Star",
  LINE: "Line",
  ARROW: "Arrow",
  ARROW_DOUBLE: "ArrowDouble",
  POLYGON: "Polygon",
  TURN_RIGHT: "TurnRight",
  LABEL: "Label",
  LABEL_IMPORTANT: "LabelImportant",
  HEART: "Heart",
};

export const CROP_POSITION_OPTIONS = {
  none: "none",

  centerTop: "centerTop",
  centerMiddle: "centerMiddle",
  centerBottom: "centerBottom",

  rightTop: "rightTop",
  rightMiddle: "rightMiddle",
  rightBottom: "rightBottom",

  leftTop: "leftTop",
  leftMiddle: "leftMiddle",
  leftBottom: "leftBottom",
};

export const BASE_FILL_COLOR_OPTIONS = [
  "#FFFFFF",
  "#000000",
  "#1751D0",
  "#DB4437",
  "#F4B400",
  "#0F9D58",
];

export const COLOR_SCHEME_OPTIONS = {
  LIGHT: "light",
  DARK: "dark",
};
