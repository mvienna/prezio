import { fetchAndConvertToBase64Image } from "src/helpers/imageUtils";
import Konva from "konva";
import {
  COLOR_SCHEME_OPTIONS,
  CROP_POSITION_OPTIONS,
} from "src/constants/canvas/canvasVariables";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { colors } from "quasar";

const presentationsStore = usePresentationsStore();
const { slide, presentation } = storeToRefs(presentationsStore);

export async function defineColorScheme(
  baseFill = this.layers.base.findOne(".baseFill"),
  baseBackground = this.layers.base.findOne(".baseBackground"),
) {
  const computeAverageBrightness = async () => {
    return new Promise(async (resolve) => {
      /*
       * no background image
       */
      if (!baseBackground) {
        /*
         * base fill exists
         */
        if (baseFill?.attrs?.fill) {
          const rgb = colors.hexToRgb(baseFill.attrs.fill);
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

      canvas.width = baseBackground.attrs.width;
      canvas.height = baseBackground.attrs.height;

      // draw base fill
      if (baseFill?.attrs?.fill) {
        ctx.fillStyle = baseFill?.attrs?.fill;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // apply filters
      ctx.filter = `blur(${baseBackground.blurRadius()}px) contrast(${
        baseBackground.contrast() * 100
      }%) brightness(${baseBackground.brightness() * 100}%)`;

      if (baseBackground.opacity() >= 0) {
        ctx.globalAlpha = baseBackground.opacity();
      }

      const imageObj = new Image();

      let base64;
      let url = baseBackground.getAttr("source");
      if (url.includes("http")) {
        base64 = await fetchAndConvertToBase64Image(url);
        imageObj.src = base64;
      } else {
        imageObj.src = url;
      }

      imageObj.onload = () => {
        // draw background
        ctx.drawImage(
          baseBackground.attrs.image,
          0,
          0,
          canvas.width,
          canvas.height,
        );

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
      };
    });
  };

  const averageBrightness = await computeAverageBrightness();
  const brightnessThreshold = 128;

  return averageBrightness > brightnessThreshold
    ? COLOR_SCHEME_OPTIONS.LIGHT
    : COLOR_SCHEME_OPTIONS.DARK;
}

export async function updateBaseLayer(
  baseFill = null,
  baseBackgroundUrl = null,
  baseBackgroundFilters = null,
  baseBackgroundPreviewUrl = null,
) {
  // base fill
  if (baseFill) {
    this.layers.base.findOne(".baseFill").fill(baseFill);

    // save slide
    this.handleSlideUpdate();
  }

  // base background
  this.layers.base.findOne(".baseBackgroundPreview")?.destroy();

  if (baseBackgroundUrl || baseBackgroundPreviewUrl) {
    const imageObj = new Image();
    const url = baseBackgroundUrl || baseBackgroundPreviewUrl;

    let base64;
    if (url.includes("http")) {
      base64 = await fetchAndConvertToBase64Image(url);
      imageObj.src = base64;
    } else {
      imageObj.src = url;
    }

    imageObj.onload = () => {
      const name = baseBackgroundUrl
        ? "baseBackground"
        : "baseBackgroundPreview";

      const previousBaseBackground = this.layers.base.findOne(`.${name}`);

      // change existing background source
      if (previousBaseBackground) {
        previousBaseBackground.image(imageObj);

        // no previous background, add a new one
        // set background preview
      } else {
        const image = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: this.scene.width,
          height: this.scene.height,
          listening: false,
          name: name,
        });

        this.layers.base.add(image);
      }

      const baseBackground = this.layers.base.findOne(`.${name}`);
      baseBackground.setAttr("source", url);

      // apply crop
      const clipPosition = CROP_POSITION_OPTIONS.centerMiddle;
      baseBackground.setAttr("lastCropUsed", clipPosition);
      const crop = this.getCrop(
        baseBackground.image(),
        { width: baseBackground.width(), height: baseBackground.height() },
        clipPosition,
      );
      baseBackground.setAttrs(crop);

      // save slide
      if (baseBackgroundUrl) {
        this.handleSlideUpdate();
      }
    };
  }

  // base background filters
  if (baseBackgroundFilters) {
    const baseBackground = this.layers.base.findOne(".baseBackground");
    if (!baseBackground) return;

    this.applyBaseBackgroundFilters(baseBackground, baseBackgroundFilters);

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
    const stage = Konva.Node.create(item.canvas_data, "tempContainer");

    // replace base layer
    const baseLayer = this.layers.base.clone();
    stage.findOne(".baseLayer").destroy();
    stage.add(baseLayer);
    stage.findOne(".baseLayer").moveToBottom();

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
