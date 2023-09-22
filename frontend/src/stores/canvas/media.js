import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { generateUniqueId } from "src/helpers/generateUniqueId";
import { fetchAndConvertToBase64Image } from "src/helpers/fetchAndConvertToBase64Image";

const canvasStore = useCanvasStore();
const { ctx, canvas, elements, MODES_OPTIONS } = storeToRefs(canvasStore);

export const useCanvasMediaStore = defineStore("canvasMedia", {
  actions: {
    /*
     * add image
     */
    async addImage(
      url,
      x = null,
      y = null,
      width = null,
      height = null,
      layer = "top",
      mode = MODES_OPTIONS.value.media,
      isLocked = false,
      opacity = 1,
      blur = 0,
      contrast = 100,
      brightness = 100
    ) {
      const image = new Image();

      let base64;
      if (url.includes("http")) {
        base64 = await fetchAndConvertToBase64Image(url);
        image.src = base64;
      } else {
        image.src = url;
      }

      image.onload = () => {
        const newImageHeight = canvas.value.height * 0.5;
        const aspectRatio = image.width / image.height;
        const newImageWidth = newImageHeight * aspectRatio;

        const imageData = {
          id: generateUniqueId(undefined, elements.value),
          mode: mode,
          isVisible: true,
          isLocked: isLocked,
          image,
          imageSrc: url,
          imageBase64: base64,
          x:
            typeof x === "number"
              ? x
              : (canvas.value.width - newImageWidth) / 2,
          y:
            typeof y === "number"
              ? y
              : (canvas.value.height - newImageHeight) / 2,
          width: typeof width === "number" ? width : newImageWidth,
          height: typeof height === "number" ? height : newImageHeight,
          rotationAngle: 0,
          opacity,
          blur,
          contrast,
          brightness,
        };

        if (layer === "top") {
          elements.value.unshift(imageData);
        } else {
          const isBaseFillElementExists = elements.value.find(
            (element) => element.mode === MODES_OPTIONS.value.baseFill
          );

          elements.value.splice(
            elements.value.length - (isBaseFillElementExists ? 1 : 0),
            0,
            imageData
          );
        }

        ctx.value.drawImage(image, x, y, newImageWidth, newImageHeight);
        canvasStore.redrawCanvas(true, true);
      };
    },
  },
});
