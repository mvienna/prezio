import { colors } from "quasar";

export const textColorOnAColoredBackground = (backgroundColor) => {
  backgroundColor = colors.hexToRgb(backgroundColor);

  const brightness =
    (backgroundColor.r * 299 +
      backgroundColor.g * 587 +
      backgroundColor.b * 114) /
    1000;

  return colors.getPaletteColor(brightness > 128 ? "black" : "white");
};
