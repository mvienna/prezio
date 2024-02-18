import { colors } from "quasar";

export const textColorOnAColoredBackground = (
  backgroundColor,
  isReturnHex = true,
) => {
  backgroundColor = colors.hexToRgb(backgroundColor);

  const brightness =
    (backgroundColor.r * 299 +
      backgroundColor.g * 587 +
      backgroundColor.b * 114) /
    1000;

  if (!isReturnHex) {
    return brightness > 128 ? "black" : "white";
  }

  return colors.getPaletteColor(brightness > 128 ? "black" : "white");
};

export const wordCloudTextColors = [
  "#D80000",
  "#FF7F00",
  "#FFC72C",
  "#8CD600",
  "#4CAF50",
  "#00B8D4",
  "#0072E3",
  "#001F5B",
  "#8F00B2",
  "#E5008C",
];
