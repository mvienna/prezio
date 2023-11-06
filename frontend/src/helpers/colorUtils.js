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

export const wordCloudTextColors = [
  "#FF5733",
  "#00A36C",
  "#3498DB",
  "#E74C3C",
  "#9B59B6",
  "#2ECC71",
  "#1ABC9C",
  "#F39C12",
  "#D35400",
  "#3498DB",
  "#8E44AD",
  "#2C3E50",
  "#E67E22",
  "#16A085",
  "#FFC0CB",
  "#1E90FF",
  "#FF69B4",
  "#2E8B57",
  "#FFD700",
  "#FF6347",
];
