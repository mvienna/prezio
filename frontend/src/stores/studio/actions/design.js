import { fetchAndConvertToBase64Image } from "src/helpers/imageUtils";
import Konva from "konva";
import {
  COLOR_PALETTE,
  COLOR_SCHEME_OPTIONS,
  CROP_POSITION_OPTIONS,
} from "src/constants/canvas/canvasVariables";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { colors } from "quasar";
import { SLIDE_TYPES } from "src/constants/presentationStudio";

const presentationsStore = usePresentationsStore();
const { slide, presentation } = storeToRefs(presentationsStore);

export async function defineColorScheme(
  baseFill = this.layers.base.findOne(".baseFill"),
  baseBackground = this.layers.base.findOne(".baseBackground"),
) {
  const computeAverageBrightness = async () => {
    return await new Promise(async (resolve) => {
      /*
       * no background image
       */
      if (!baseBackground || !baseBackground.image()) {
        /*
         * base fill exists
         */
        if (baseFill.fill()) {
          const rgb = colors.hexToRgb(baseFill.fill());
          return resolve(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
        }

        /*
         * no base fill
         */
        return resolve(255);
      }

      // define canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = 'Noto Color Emoji';


      canvas.width = baseBackground.width();
      canvas.height = baseBackground.height();

      // draw base fill
      if (baseFill.fill()) {
        ctx.fillStyle = baseFill.fill();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // apply filters
      ctx.filter = `blur(${baseBackground.blurRadius()}px) contrast(${
        100 + baseBackground.contrast() * 100
      }%) brightness(${100 + baseBackground.brightness() * 100}%)`;

      ctx.globalAlpha = baseBackground.opacity();

      // draw background
      ctx.drawImage(baseBackground.image(), 0, 0, canvas.width, canvas.height);

      // compute average brightness
      let sumBrightness = 0;
      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;

      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const brightness = (r + g + b) / 3;
        sumBrightness += brightness;
      }

      return resolve(sumBrightness / (canvas.width * canvas.height));
    });
  };

  const averageBrightness = await computeAverageBrightness();
  const brightnessThreshold = 128;

  const colorScheme =
    averageBrightness > brightnessThreshold
      ? COLOR_SCHEME_OPTIONS.LIGHT
      : COLOR_SCHEME_OPTIONS.DARK;

  if (slide.value.type !== SLIDE_TYPES.CONTENT) {
    this.layers.default.getChildren().forEach((node) => {
      if (node.getClassName() === this.MODE_OPTIONS.TEXT) {
        node.fill(
          colorScheme === COLOR_SCHEME_OPTIONS.LIGHT
            ? COLOR_PALETTE.BLACK
            : COLOR_PALETTE.WHITE,
        );
      }
    });
  }

  return colorScheme;
}

export async function updateBaseLayer(
  baseFill = null,
  baseBackgroundUrl = null,
  baseBackgroundFilters = null,
  baseBackgroundPreviewUrl = null,
  clipPosition = null,
) {
  // base fill
  if (baseFill) {
    this.layers.base.findOne(".baseFill").fill(baseFill);

    // save slide
    this.handleSlideUpdate();
  }

  // base background preview
  this.layers.base.findOne(".baseBackgroundPreview")?.destroy();

  const currentBaseBackground = this.layers.base.findOne(`.${name}`);

  /*
   * preview
   */
  if (baseBackgroundPreviewUrl) {
    const imageObj = new Image();
    const url = baseBackgroundPreviewUrl;

    let base64;
    if (url.includes("http")) {
      base64 = await fetchAndConvertToBase64Image(url);
      imageObj.src = base64;
    } else {
      imageObj.src = url;
    }

    imageObj.onload = () => {
      const image = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: this.scene.width,
        height: this.scene.height,
        listening: false,
        name: "baseBackgroundPreview",
        opacity: currentBaseBackground?.opacity() || 1,
        blurRadius: currentBaseBackground?.blurRadius() || 0,
        brightness: currentBaseBackground?.brightness() || 0,
        contrast: currentBaseBackground?.contrast() || 0,
        source: url,
        lastCropUsed: CROP_POSITION_OPTIONS.centerMiddle,
      });

      this.layers.base.add(image);

      // apply crop
      const crop = this.getCrop(
        image.image(),
        { width: image.width(), height: image.height() },
        image.getAttr("lastCropUsed"),
      );
      image.setAttrs(crop);

      slide.value.color_scheme = this.defineColorScheme(undefined, image);
    };
  }

  /*
   * base background
   */
  if (baseBackgroundUrl) {
    const imageObj = new Image();
    const url = baseBackgroundUrl;

    let base64;
    if (url.includes("http")) {
      base64 = await fetchAndConvertToBase64Image(url);
      imageObj.src = base64;
    } else {
      imageObj.src = url;
    }

    imageObj.onload = () => {
      this.layers.base.findOne(".baseBackground")?.destroy();

      const image = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: this.scene.width,
        height: this.scene.height,
        listening: false,
        name: "baseBackground",
        opacity: currentBaseBackground?.opacity() || 1,
        blurRadius: currentBaseBackground?.blurRadius() || 0,
        brightness: currentBaseBackground?.brightness() || 0,
        contrast: currentBaseBackground?.contrast() || 0,
        source: url,
        lastCropUsed: CROP_POSITION_OPTIONS.centerMiddle,
      });

      this.layers.base.add(image);

      // apply crop
      const crop = this.getCrop(
        image.image(),
        { width: image.width(), height: image.height() },
        image.getAttr("lastCropUsed"),
      );
      image.setAttrs(crop);

      // save slide
      this.handleSlideUpdate();
    };
  }

  // base background customization
  if (baseBackgroundFilters || clipPosition) {
    const baseBackground = this.layers.base.findOne(".baseBackground");
    if (!baseBackground) return;

    if (baseBackgroundFilters) {
      this.applyBaseBackgroundFilters(baseBackground, baseBackgroundFilters);
    }

    if (clipPosition) {
      baseBackground.setAttr("lastCropUsed", clipPosition);
      const crop = this.getCrop(
        baseBackground.image(),
        { width: baseBackground.width(), height: baseBackground.height() },
        baseBackground.getAttr("lastCropUsed"),
      );
      baseBackground.setAttrs(crop);
    }

    await this.handleSlideUpdate();
  }
}

export function applyBaseBackgroundFilters(node, filters = null) {
  if (!node) return;

  node.cache();
  node.opacity(filters?.opacity || node.opacity());
  node.filters([
    Konva.Filters.Blur,
    Konva.Filters.Brighten,
    Konva.Filters.Contrast,
  ]);
  node.blurRadius(filters?.blurRadius || node.blurRadius());
  node.brightness(filters?.brightness || node.brightness());
  node.contrast(filters?.contrast || node.contrast());
}

export async function applyDesignToAllSlides() {
  presentation.value.slides.map(async (item) => {
    // skip current slide
    if (item.id === slide.value.id) return item;

    // create temp container
    const tempDiv = document.createElement("div");
    tempDiv.id = "tempContainer";
    document.body.appendChild(tempDiv);

    // load stage
    const stage = item.canvas_data
      ? Konva.Node.create(item.canvas_data, "tempContainer")
      : new Konva.Stage({
          container: "tempContainer",
          width: this.scene.width,
          height: this.scene.height,
        });

    // replace base layer
    const baseLayer = this.layers.base.clone();
    stage.findOne(".baseLayer")?.destroy();
    stage.add(baseLayer);
    stage.findOne(".baseLayer")?.moveToBottom();

    // load images
    const loadImagePromises = [];
    stage.find("Image").forEach((node) => {
      loadImagePromises.push(
        new Promise((resolve, reject) => {
          const imageObj = new Image();
          const url = node.getAttr("source");

          imageObj.onload = () => {
            node.image(imageObj);
            this.applyBaseBackgroundFilters(node);

            resolve();
          };

          imageObj.onerror = reject;

          if (url.includes("http")) {
            fetchAndConvertToBase64Image(url)
              .then((base64) => {
                imageObj.src = base64;
              })
              .catch(reject);
          } else {
            imageObj.src = url;
          }
        }),
      );
    });
    await Promise.all(loadImagePromises);

    // update preview
    item.preview = this.generatePreviewForStage(stage);

    // update color scheme
    item.color_scheme = slide.value.color_scheme;

    // update canvas data
    item.canvas_data = stage.toJSON();

    // save slide
    await presentationsStore.saveSlide(item, slide.value);

    // remove temp container
    tempDiv.parentNode.removeChild(tempDiv);
    return item;
  });
}
