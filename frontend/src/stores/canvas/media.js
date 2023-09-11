import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { generateUniqueId } from "src/helpers/generateUniqueId";

const canvasStore = useCanvasStore();
const { ctx, canvas, elements, MODES_OPTIONS } = storeToRefs(canvasStore);

export const useCanvasMediaStore = defineStore("canvasMedia", {
  actions: {
    /*
     * add image
     */
    addImage(url) {
      const image = new Image();
      image.src = url;

      image.onload = () => {
        const newImageHeight = canvas.value.height * 0.5;
        const aspectRatio = image.width / image.height;
        const newImageWidth = newImageHeight * aspectRatio;

        const x = (canvas.value.width - newImageWidth) / 2;
        const y = (canvas.value.height - newImageHeight) / 2;

        const imageData = {
          id: generateUniqueId(undefined, elements.value),
          mode: MODES_OPTIONS.value.media,
          isVisible: true,
          isLocked: false,
          image,
          imageSrc: url,
          x,
          y,
          width: newImageWidth,
          height: newImageHeight,
          rotationAngle: 0,
        };

        elements.value.unshift(imageData);
        ctx.value.drawImage(image, x, y, newImageWidth, newImageHeight);
      };

      canvasStore.redrawCanvas();
    },
  },
});
