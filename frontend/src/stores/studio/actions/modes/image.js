import { CROP_POSITION_OPTIONS } from "src/constants/canvas/canvasVariables";
import { fetchAndConvertToBase64Image } from "src/helpers/imageUtils";
import Konva from "konva";

export function getCrop(image, size, clipPosition = this.image.clipPosition) {
  const width = size.width;
  const height = size.height;
  const aspectRatio = width / height;

  let newWidth;
  let newHeight;

  const imageRatio = image.width / image.height;

  if (aspectRatio >= imageRatio) {
    newWidth = image.width;
    newHeight = image.width / aspectRatio;
  } else {
    newWidth = image.height * aspectRatio;
    newHeight = image.height;
  }

  let x = 0;
  let y = 0;
  switch (clipPosition) {
    case CROP_POSITION_OPTIONS.none:
      x = 0;
      y = 0;
      newWidth = image.width;
      newHeight = image.height;
      break;

    case CROP_POSITION_OPTIONS.centerTop:
      x = (image.width - newWidth) / 2;
      y = 0;
      break;

    case CROP_POSITION_OPTIONS.centerMiddle:
      x = (image.width - newWidth) / 2;
      y = (image.height - newHeight) / 2;
      break;

    case CROP_POSITION_OPTIONS.centerBottom:
      x = (image.width - newWidth) / 2;
      y = image.height - newHeight;
      break;

    case CROP_POSITION_OPTIONS.rightTop:
      x = image.width - newWidth;
      y = 0;
      break;

    case CROP_POSITION_OPTIONS.rightMiddle:
      x = image.width - newWidth;
      y = (image.height - newHeight) / 2;
      break;

    case CROP_POSITION_OPTIONS.rightBottom:
      x = image.width - newWidth;
      y = image.height - newHeight;
      break;

    case CROP_POSITION_OPTIONS.leftTop:
      x = 0;
      y = 0;
      break;

    case CROP_POSITION_OPTIONS.leftMiddle:
      x = 0;
      y = (image.height - newHeight) / 2;
      break;

    case CROP_POSITION_OPTIONS.leftBottom:
      x = 0;
      y = image.height - newHeight;
      break;

    default:
      console.error(
        new Error("Unknown clip position property - " + clipPosition),
      );
      break;
  }

  return {
    cropX: x,
    cropY: y,
    cropWidth: newWidth,
    cropHeight: newHeight,
  };
}

export async function addImage(url) {
  const imageObj = new Image();

  let base64;
  if (url.includes("http")) {
    base64 = await fetchAndConvertToBase64Image(url);
    imageObj.src = base64;
  } else {
    imageObj.src = url;
  }

  imageObj.onload = () => {
    const imageWidth = imageObj.width;
    const imageHeight = imageObj.height;

    const aspectRatio = imageWidth / imageHeight;

    const canvasWidth = this.scene.width;
    const canvasHeight = this.scene.height;

    const maxWidth = canvasWidth * 0.5;
    const maxHeight = canvasHeight * 0.5;

    let newWidth, newHeight;
    if (maxWidth / maxHeight > aspectRatio) {
      newHeight = maxHeight;
      newWidth = newHeight * aspectRatio;
    } else {
      newWidth = maxWidth;
      newHeight = newWidth / aspectRatio;
    }

    const x = (canvasWidth - newWidth) / 2;
    const y = (canvasHeight - newHeight) / 2;

    const imageNode = new Konva.Image({
      x: x,
      y: y,
      image: imageObj,
      width: newWidth,
      height: newHeight,
      draggable: true,
      cornerRadius: 0,
      name: this.MODE_OPTIONS.IMAGE,
    });

    this.layers.default.add(imageNode);

    this.processImageNode(imageNode, url);

    // save slide on new image added
    this.handleSlideUpdate();
  };
}

export function processImageNode(
  image,
  url,
  clipPosition = this.image.clipPosition,
) {
  // set source
  image.setAttr("source", url);

  // apply crop
  image.setAttr("lastCropUsed", clipPosition);
  const crop = this.getCrop(
    image.image(),
    { width: image.width(), height: image.height() },
    clipPosition,
  );
  image.setAttrs(crop);

  // on transform
  const handleTransform = () => {
    image.setAttrs({
      scaleX: 1,
      scaleY: 1,
      width: image.width() * image.scaleX(),
      height: image.height() * image.scaleY(),
    });

    // apply crop
    image.setAttr("lastCropUsed", this.image.clipPosition);
    const crop = this.getCrop(
      image.image(),
      { width: image.width(), height: image.height() },
      this.image.clipPosition,
    );
    image.setAttrs(crop);
  };

  image.on("transform", handleTransform);
}

export async function replaceImage(
  nodes = this.transformer.default?.nodes(),
  url,
) {
  const imageObj = new Image();

  let base64;
  if (url.includes("http")) {
    base64 = await fetchAndConvertToBase64Image(url);
    imageObj.src = base64;
  } else {
    imageObj.src = url;
  }

  imageObj.onload = () => {
    nodes
      .filter((node) => node.getClassName() === "Image")
      .forEach((node) => {
        node.image(imageObj);
        this.processImageNode(node, url, node.getAttr("lastCropUsed"));
      });

    this.handleSlideUpdate();
  };
}

export function setImageCustomization(node) {
  this.image = {
    ...this.image,
    opacity: node.opacity(),
    stroke: node.stroke(),
    shadowColor: node.shadowColor(),
    shadowBlur: node.shadowBlur(),
    shadowOffset: node.shadowOffset(),
    shadowOpacity: node.shadowOpacity(),
    clipPosition: node.getAttr("lastCropUsed"),
    cornerRadius: Math.round(
      (node.cornerRadius() / Math.min(node.width(), node.height())) * 100,
    ),
    strokeWidth:
      !node.strokeWidth() || node.strokeWidth() === 0.1
        ? 0
        : node.strokeWidth(),
  };
}

export function applyImageCustomization(node) {
  const crop = this.getCrop(
    node.image(),
    { width: node.width(), height: node.height() },
    this.image.clipPosition,
  );

  node.setAttrs({
    opacity: this.image.opacity,
    cornerRadius:
      Math.min(node.width(), node.height()) * (this.image.cornerRadius / 100),
    stroke: !this.image.strokeWidth ? "transparent" : this.image.stroke,
    strokeWidth: !this.image.strokeWidth ? 0.1 : Number(this.image.strokeWidth),
    shadowColor: this.image.shadowColor,
    shadowBlur: this.image.shadowBlur,
    shadowOffset: this.image.shadowOffset,
    shadowOpacity: this.image.shadowOpacity,
    scaleX: 1,
    scaleY: 1,
    width: node.width() * node.scaleX(),
    height: node.height() * node.scaleY(),
    lastCropUsed: this.image.clipPosition,
  });

  node.setAttrs(crop);
}
