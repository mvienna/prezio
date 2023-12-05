import { colors } from "quasar";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";

const canvasStore = useCanvasStore();
const { MODE_OPTIONS } = storeToRefs(canvasStore);

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

export const computeAverageBrightness = async (elements) => {
  let background = elements?.find(
    (element) => element.mode === MODE_OPTIONS.value.backgroundPreview
  );

  if (!background) {
    background = elements?.find(
      (element) => element.mode === MODE_OPTIONS.value.background
    );
  }

  const baseFill = elements?.find(
    (element) => element.mode === MODE_OPTIONS.value.baseFill
  );

  /*
   * no background image
   */
  if (!background) {
    /*
     * base fill exists
     */
    if (baseFill?.fillColor) {
      const rgb = colors.hexToRgb(baseFill.fillColor);
      return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    }

    /*
     * no base fill
     */
    return 255;
  }

  function compute(image) {
    // define canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = background.width;
    canvas.height = background.height;

    // draw base fill
    if (baseFill?.fillColor) {
      ctx.fillStyle = baseFill.fillColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // apply filters
    ctx.filter = `blur(${background.blur || 0}px) contrast(${
      background.contrast >= 0 ? background.contrast : 100
    }%) brightness(${
      background.brightness >= 0 ? background.brightness : 100
    }%) invert(${background.invert || 0}%) grayscale(${
      background.grayscale || 0
    }%)`;

    if (background.opacity >= 0) {
      ctx.globalAlpha = background.opacity / 100;
    }

    // draw background
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // compute average brightness
    let sumBrightness = 0;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const brightness = (r + g + b) / 3;
      sumBrightness += brightness;
    }

    return sumBrightness / (canvas.width * canvas.height);
  }

  /*
   * background image dom element exists
   */
  if (background?.image?.nodeType) {
    return compute(background.image);

    /*
     * background image src exists
     */
  } else {
    const image = new Image();
    image.src = background.imageSrc;

    return await new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(compute(image));
      };

      image.onerror = (error) => {
        console.log(error);
        resolve(255);
      };
    });
  }
};
