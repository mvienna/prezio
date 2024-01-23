export const DRAWING_STROKE_WIDTH_OPTIONS = [
  1, 2, 4, 8, 16, 24, 32, 48, 64, 96,
];

export const DRAWING_MODES = {
  BRUSH: "brush",
  ERASER: "eraser",
};

// TODO: REMOVE! canvas/index.js
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
  SELECTION_RECT: "rgba(17, 59, 152, .1)",
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
  circle: "circle",
  square: "square",
  triangle: "triangle",
  star: "star",
  line: "line",
  arrow: "arrow",
};

export const SHAPE_LINE_WIDTH_OPTIONS = [0, 1, 2, 4, 8, 16, 24, 32, 48, 64, 96];

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
  light: "light",
  dark: "dark",
};
