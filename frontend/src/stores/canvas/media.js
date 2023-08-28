import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";

const { ctx, canvas } = storeToRefs(useCanvasStore());
const canvasStore = useCanvasStore();

export const useCanvasMediaStore = defineStore("canvasMedia", {
  state: () => ({
    mediaState: {},
  }),

  actions: {
    addImage(url) {
      const image = new Image();

      image.onload = function () {
        const newImageHeight = canvas.value.height * 0.5;
        const aspectRatio = image.width / image.height;
        const newImageWidth = newImageHeight * aspectRatio;

        const x = (canvas.value.width - newImageWidth) / 2;
        const y = (canvas.value.height - newImageHeight) / 2;

        ctx.value.drawImage(image, x, y, newImageWidth, newImageHeight);
      };

      image.src = url;
    },
  },
});
