import Konva from "konva";
import SuperGif from "libgif";
import { fetchAndConvertToBase64Image } from "src/helpers/imageUtils";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

const presentationsStore = usePresentationsStore();
const { slide } = storeToRefs(presentationsStore);

export async function addGif(url) {
  const imageObj = new Image();
  document.body.appendChild(imageObj);

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

    const gifNode = new Konva.Image({
      x: x,
      y: y,
      image: imageObj,
      width: newWidth,
      height: newHeight,
      draggable: true,
      cornerRadius: 0,
      name: this.MODE_OPTIONS.GIF,
      source: url,
    });

    this.layers.default.add(gifNode);

    this.processGif(gifNode, url, imageObj);

    // save slide on new image added
    this.handleSlideUpdate();
  };
}

export async function processGif(node, url, imageObj) {
  node.setAttr("source", url);

  let gif = new SuperGif({
    gif: imageObj,
    progressbar_height: 0,
    auto_play: true,
    loop_mode: true,
    draw_while_loading: true,
  });

  gif.load();

  let gif_canvas = gif.get_canvas();
  let canvas = gif_canvas.cloneNode();
  let context = canvas.getContext("2d");

  const anim = (t) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(gif_canvas, 0, 0);
    this.layers.default.draw();
    requestAnimationFrame(anim);

    // prepare canvas for preview: hide additional elements, reset zoom
    this.prepareCanvasForPreview();

    // update slide preview
    slide.value.preview = this.generatePreviewForStage();

    // restore canvas additional elements after preview has been generated
    this.restoreCanvasAfterPreview();
  };

  anim();

  node.setAttr("image", canvas);

  document.querySelectorAll(".jsgif").forEach((el) => el.remove());

  node.on("transformend", this.handleSnappingEnd);
  node.on("dragstart", this.handleSelectionDragStart);
}
