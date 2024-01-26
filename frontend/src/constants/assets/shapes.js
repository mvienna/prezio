import { SHAPES_OPTIONS } from "src/constants/canvas/canvasVariables";

export const SHAPE_TYPES = {
  LINE: "line",
  SIMPLE_SHAPE: "simple_shape",
};

export const SHAPES = [
  /*
   * lines
   */
  {
    name: SHAPES_OPTIONS.LINE,
    icon: "r_remove",
    group: SHAPE_TYPES.LINE,
  },
  {
    name: SHAPES_OPTIONS.ARROW,
    icon: "r_arrow_right_alt",
    group: SHAPE_TYPES.LINE,
  },
  {
    name: SHAPES_OPTIONS.ARROW_DOUBLE,
    icon: "r_open_in_full",
    group: SHAPE_TYPES.LINE,
  },
  {
    name: SHAPES_OPTIONS.TURN_RIGHT,
    icon: "r_turn_right",
    group: SHAPE_TYPES.LINE,
    disabled: true,
  },

  /*
   * simple shapes
   */
  {
    name: SHAPES_OPTIONS.CIRCLE,
    icon: "o_circle",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
  },
  {
    name: SHAPES_OPTIONS.RECT,
    icon: "o_square",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
  },
  {
    name: SHAPES_OPTIONS.TRIANGLE,
    icon: "icon-triangle",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
  },
  {
    name: SHAPES_OPTIONS.STAR,
    icon: "o_grade",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
  },
  {
    name: SHAPES_OPTIONS.POLYGON,
    icon: "o_hexagon",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
  },
  {
    name: SHAPES_OPTIONS.LABEL,
    icon: "o_label",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
    disabled: true,
  },
  {
    name: SHAPES_OPTIONS.LABEL_IMPORTANT,
    icon: "icon-label_important",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
    disabled: true,
  },
  {
    name: SHAPES_OPTIONS.HEART,
    icon: "icon-heart",
    group: SHAPE_TYPES.SIMPLE_SHAPE,
    disabled: true,
  },
];
