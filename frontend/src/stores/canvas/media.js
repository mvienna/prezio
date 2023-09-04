import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";

const { ctx, canvas, elements, modes, mouse } = storeToRefs(useCanvasStore());
const canvasStore = useCanvasStore();

export const useCanvasMediaStore = defineStore("canvasMedia", {
  actions: {
    redrawCanvas() {
      canvasStore.redrawCanvas();
    },

    /*
     * add image
     */
    addImage(url) {
      const image = new Image();

      image.onload = () => {
        const newImageHeight = canvas.value.height * 0.5;
        const aspectRatio = image.width / image.height;
        const newImageWidth = newImageHeight * aspectRatio;

        const x = (canvas.value.width - newImageWidth) / 2;
        const y = (canvas.value.height - newImageHeight) / 2;

        const imageData = {
          mode: modes.value.media,
          isVisible: true,
          image,
          x,
          y,
          width: newImageWidth,
          height: newImageHeight,
          rotation: 0,
        };

        elements.value.push(imageData);
        ctx.value.drawImage(image, x, y, newImageWidth, newImageHeight);
      };

      image.src = url;
    },
  },
});
