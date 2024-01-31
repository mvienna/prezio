/*
 * drawing
 */
export const DRAWING_MODES = {
  BRUSH: "brush",
  ERASER: "eraser",
};

/*
 * text
 */
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

/*
 * shape
 */
export const SHAPE_TYPES = {
  LINE: "line",
  SIMPLE_SHAPE: "simple_shape",
  ABSTRACT: "abstract",
};

export const SHAPE_OPTIONS = {
  // lines
  LINE: { name: "Line", icon: "r_remove", group: SHAPE_TYPES.LINE },
  ARROW: { name: "Arrow", icon: "r_arrow_right_alt", group: SHAPE_TYPES.LINE },
  ARROW_DOUBLE: {
    name: "ArrowDouble",
    icon: "r_open_in_full",
    group: SHAPE_TYPES.LINE,
  },
  TURN_RIGHT: {
    name: "TurnRight",
    icon: "r_turn_right",
    group: SHAPE_TYPES.LINE,
    disabled: true,
  },

  // simple shapes
  CIRCLE: { name: "Circle", icon: "o_circle", group: SHAPE_TYPES.SIMPLE_SHAPE },
  RECT: { name: "Rect", icon: "o_square", group: SHAPE_TYPES.SIMPLE_SHAPE },
  TRIANGLE: {
    name: "Triangle",
    icon: "icon-triangle",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
  },
  STAR: { name: "Star", icon: "o_grade", group: SHAPE_TYPES.SIMPLE_SHAPE },
  POLYGON: {
    name: "Polygon",
    icon: "o_hexagon",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
  },
  LABEL: {
    name: "Label",
    icon: "o_label",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
    disabled: true,
  },
  LABEL_IMPORTANT: {
    name: "LabelImportant",
    icon: "icon-label_important",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
    disabled: true,
  },
  HEART: {
    name: "Heart",
    icon: "icon-heart",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
    disabled: true,
  },

  // abstract
  ABSTRACT_1: {
    name: "Abstract1",
    icon: "o_bubble_chart",
    group: SHAPE_TYPES.ABSTRACT,
  },
  ABSTRACT_2: {
    name: "Abstract2",
    icon: "o_bubble_chart",
    group: SHAPE_TYPES.ABSTRACT,
  },
  ABSTRACT_3: {
    name: "Abstract3",
    icon: "o_bubble_chart",
    group: SHAPE_TYPES.ABSTRACT,
  },
  ABSTRACT_4: {
    name: "Abstract4",
    icon: "o_bubble_chart",
    group: SHAPE_TYPES.ABSTRACT,
  },
  ABSTRACT_5: {
    name: "Abstract5",
    icon: "o_bubble_chart",
    group: SHAPE_TYPES.ABSTRACT,
  },
  ABSTRACT_6: {
    name: "Abstract6",
    icon: "o_bubble_chart",
    group: SHAPE_TYPES.ABSTRACT,
  },
  ABSTRACT_7: {
    name: "Abstract7",
    icon: "o_bubble_chart",
    group: SHAPE_TYPES.ABSTRACT,
  },
  ABSTRACT_8: {
    name: "Abstract8",
    icon: "o_bubble_chart",
    group: SHAPE_TYPES.ABSTRACT,
  },
  ABSTRACT_9: {
    name: "Abstract9",
    icon: "o_bubble_chart",
    group: SHAPE_TYPES.ABSTRACT,
  },
  ABSTRACT_10: {
    name: "Abstract10",
    icon: "o_bubble_chart",
    group: SHAPE_TYPES.ABSTRACT,
  },
};

/*
 * crop
 */
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

/*
 * colors, themes
 */
export const COLOR_PALETTE = {
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  PRIMARY: "#1751D0",
  SECONDARY: "#113B98",
  WHITE_TRANSPARENT: "rgba(255, 255, 255, 0.1)",
  BLACK_TRANSPARENT: "rgba(0, 0, 0, 0.1)",
  GREY: "#A3A2A6",
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

/*
 * layouts
 */
export const LAYOUT_ELEMENT_OPTIONS = {
  titleCenterAbove: "title-center-above",
  subtitleCenterBelow: "subtitle-center-below",
  title: "title",
  body: "body",
  bodyLeft: "body-left",
  bodyRight: "body-right",
  titleCenterCenter: "title-center-center",
};

export const LAYOUT_OPTIONS = {
  blank: {
    name: "blank",
    elements: [],
  },
  titleSlide: {
    name: "titleSlide",
    elements: [
      LAYOUT_ELEMENT_OPTIONS.titleCenterAbove,
      LAYOUT_ELEMENT_OPTIONS.subtitleCenterBelow,
    ],
  },
  title: {
    name: "title",
    elements: [LAYOUT_ELEMENT_OPTIONS.title],
  },
  titleAndBody: {
    name: "titleAndBody",
    elements: [LAYOUT_ELEMENT_OPTIONS.title, LAYOUT_ELEMENT_OPTIONS.body],
  },
  titleAndTwoColumns: {
    name: "titleAndTwoColumns",
    elements: [
      LAYOUT_ELEMENT_OPTIONS.title,
      LAYOUT_ELEMENT_OPTIONS.bodyLeft,
      LAYOUT_ELEMENT_OPTIONS.bodyRight,
    ],
  },
  titleOnly: {
    name: "titleOnly",
    elements: [LAYOUT_ELEMENT_OPTIONS.titleCenterCenter],
  },
};
