import Konva from "konva";
import "gifler";
import { fetchAndConvertToBase64Image } from "src/helpers/imageUtils";

export async function addGif(url) {
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

    const canvas = document.createElement("canvas");
    const onDrawFrame = (ctx, frame) => {
      canvas.width = frame.width;
      canvas.height = frame.height;
      ctx.drawImage(frame.buffer, 0, 0);
      this.layers.default.draw();
    };

    gifler(url).frames(canvas, onDrawFrame);

    const gifNode = new Konva.Image({
      x: x,
      y: y,
      image: canvas,
      width: newWidth,
      height: newHeight,
      draggable: true,
      cornerRadius: 0,
      name: this.MODE_OPTIONS.GIF,
      source: url,
    });

    this.layers.default.add(gifNode);

    this.processGif(gifNode, url);

    // save slide on new image added
    this.handleSlideUpdate();
  };
}

export function processGif(gif, imageObj) {
  const canvas = document.createElement("canvas");
  const onDrawFrame = (ctx, frame) => {
    canvas.width = frame.width;
    canvas.height = frame.height;
    ctx.drawImage(frame.buffer, 0, 0);
    this.layers.default.draw();
  };
  gifler(gif.getAttr("source")).frames(canvas, onDrawFrame);
  gif.setAttr("image", canvas);

  gif.on("transformend", this.handleSnappingEnd);
  gif.on("dragstart", this.handleSelectionDragStart);
}

// export async function replaceImage(
//   nodes = this.transformer.default?.nodes(),
//   url,
// ) {
//   const imageObj = new Image();
//
//   let base64;
//   if (url.includes("http")) {
//     base64 = await fetchAndConvertToBase64Image(url);
//     imageObj.src = base64;
//   } else {
//     imageObj.src = url;
//   }
//
//   imageObj.onload = () => {
//     nodes
//       .filter((node) => node.getClassName() === "Image")
//       .forEach((node) => {
//         node.image(imageObj);
//         this.processImageNode(node, url, node.getAttr("lastCropUsed"));
//       });
//
//     this.handleSlideUpdate();
//   };
// }
