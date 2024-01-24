export const SHAPE_TYPES = {
  line: "line",
  simpleShape: "simple_shape",
};

export const SHAPES = [
  /*
   * lines
   */
  {
    name: "line",
    icon: "r_remove",
    group: SHAPE_TYPES.line,
  },
  {
    name: "arrow",
    icon: "r_arrow_right_alt",
    group: SHAPE_TYPES.line,
  },
  {
    name: "double_arrow",
    icon: "r_open_in_full",
    group: SHAPE_TYPES.line,
  },
  {
    name: "turn_right",
    icon: "r_turn_right",
    group: SHAPE_TYPES.line,
    disabled: true,
  },

  /*
   * simple shapes
   */
  {
    name: "circle",
    icon: "o_circle",
    group: SHAPE_TYPES.simpleShape,
  },
  {
    name: "rectangle",
    icon: "o_square",
    group: SHAPE_TYPES.simpleShape,
  },
  {
    name: "triangle",
    icon: "icon-triangle",
    group: SHAPE_TYPES.simpleShape,
  },
  {
    name: "star",
    icon: "o_grade",
    group: SHAPE_TYPES.simpleShape,
  },
  {
    name: "polygon",
    icon: "o_hexagon",
    group: SHAPE_TYPES.simpleShape,
  },
  {
    name: "label",
    icon: "o_label",
    group: SHAPE_TYPES.simpleShape,
    disabled: true,
  },
  {
    name: "label_important",
    icon: "icon-label_important",
    group: SHAPE_TYPES.simpleShape,
    disabled: true,
  },
  {
    name: "heart",
    icon: "icon-heart",
    group: SHAPE_TYPES.simpleShape,
    disabled: true,
  },
];
