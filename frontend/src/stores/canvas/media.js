import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";
import { generateUniqueId } from "src/helpers/generationUtils";
import { fetchAndConvertToBase64Image } from "src/helpers/imageUtils";
import { computeAverageBrightness } from "src/helpers/colorUtils";
import { usePresentationsStore } from "stores/presentations";
import { syncSelectedElementWithStoredElements } from "stores/canvas/helpers/select";

const canvasStore = useCanvasStore();
const { ctx, canvas, elements, selectedElement, MODE_OPTIONS } =
  storeToRefs(canvasStore);

const presentationsStore = usePresentationsStore();
const { averageBackgroundBrightness, slide } = storeToRefs(presentationsStore);

export const useCanvasMediaStore = defineStore("canvasMedia", {
  state: () => ({
    /*
     * customization
     */
    customization: {
      shadowColor: "#000000",
      shadowOpacity: 0,
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 0,

      opacity: 100,

      borderColor: "#4971FF",
      borderWidth: "2px",
    },
  }),

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
      mode = MODE_OPTIONS.value.media,
      isLocked = false,
      opacity = this.customization.opacity,
      blur = 0,
      contrast = 100,
      brightness = 100,
      invert = 0,
      grayscale = 0
    ) {
      const image = new Image();

      let base64;
      if (url.includes("http")) {
        base64 = await fetchAndConvertToBase64Image(url);
        image.src = base64;
      } else {
        image.src = url;
      }

      image.onload = async () => {
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
          invert,
          grayscale,
          shadowColor: this.customization.shadowColor,
          shadowOpacity: this.customization.shadowOpacity,
          shadowBlur: this.customization.shadowBlur,
          shadowOffsetX: this.customization.shadowOffsetX,
          shadowOffsetY: this.customization.shadowOffsetY,
          borderColor: this.customization.borderColor,
          borderWidth: this.customization.borderWidth,
        };

        if (layer === "top") {
          elements.value.unshift(imageData);
        } else {
          const isBaseFillElementExists = elements.value.find(
            (element) => element.mode === MODE_OPTIONS.value.baseFill
          );

          elements.value.splice(
            elements.value.length - (isBaseFillElementExists ? 1 : 0),
            0,
            imageData
          );
        }

        if (
          [
            MODE_OPTIONS.value.backgroundPreview,
            MODE_OPTIONS.value.background,
          ].includes(mode)
        ) {
          averageBackgroundBrightness.value = await computeAverageBrightness(
            elements.value
          );
          slide.value.previewAverageBrightness =
            averageBackgroundBrightness.value;
          presentationsStore.syncCurrentSlideWithPresentationSlides();
        }

        ctx.value.drawImage(image, x, y, newImageWidth, newImageHeight);
        canvasStore.redrawCanvas(mode !== MODE_OPTIONS.value.backgroundPreview);
      };
    },

    /*
     * customization
     */
    applyStyles() {
      if (
        selectedElement.value &&
        selectedElement.value.mode === MODE_OPTIONS.value.media
      ) {
        selectedElement.value.shadowColor = this.customization.shadowColor;
        selectedElement.value.shadowOpacity = this.customization.shadowOpacity;
        selectedElement.value.shadowBlur = this.customization.shadowBlur;
        selectedElement.value.shadowOffsetX = this.customization.shadowOffsetX;
        selectedElement.value.shadowOffsetY = this.customization.shadowOffsetY;

        selectedElement.value.opacity = this.customization.opacity;

        selectedElement.value.borderColor = this.customization.borderColor;
        selectedElement.value.borderWidth = this.customization.borderWidth;

        syncSelectedElementWithStoredElements();
        canvasStore.redrawCanvas();
      }
    },

    loadSelectedElementCustomization() {
      if (selectedElement.value.shadowColor) {
        this.customization.shadowColor = selectedElement.value.shadowColor;
        this.customization.shadowOpacity = selectedElement.value.shadowOpacity;
        this.customization.shadowBlur = selectedElement.value.shadowBlur;
        this.customization.shadowOffsetX = selectedElement.value.shadowOffsetX;
        this.customization.shadowOffsetY = selectedElement.value.shadowOffsetY;

        this.customization.opacity = selectedElement.value.opacity;

        this.customization.borderColor = selectedElement.value.borderColor;
        this.customization.borderWidth = selectedElement.value.borderWidth;
      }
    },
  },
});
