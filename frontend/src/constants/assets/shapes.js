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
    disabled: true,
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
    icon: "r_circle",
    group: SHAPE_TYPES.simpleShape,
  },
  {
    name: "square",
    icon: "r_square",
    group: SHAPE_TYPES.simpleShape,
  },
  {
    name: "triangle",
    icon: "icon-triangle",
    group: SHAPE_TYPES.simpleShape,
  },
  {
    name: "star",
    icon: "r_grade",
    group: SHAPE_TYPES.simpleShape,
  },
  {
    name: "hexagon",
    icon: "r_hexagon",
    group: SHAPE_TYPES.simpleShape,
    disabled: true,
  },
  {
    name: "label",
    icon: "r_label",
    group: SHAPE_TYPES.simpleShape,
    disabled: true,
  },
  {
    name: "label_important",
    icon: "r_label_important",
    group: SHAPE_TYPES.simpleShape,
    disabled: true,
  },
  {
    name: "heart",
    icon: "r_favorite",
    group: SHAPE_TYPES.simpleShape,
    disabled: true,
  },
];
