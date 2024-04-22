import Konva from "konva";

export function addEmoji(emoji, size = 100) {

  // console.log(emoji.toDataURL());


  const emojiText = new Konva.Text({
    x: this.scene.width / 2 - size / 2,
    y: this.scene.height / 2 - size / 2,
    text: emoji,
    fontSize: size,
    width: size,
    height: size,
    align: "center",
    verticalAlign: "middle",
    draggable: true,
    name: this.MODE_OPTIONS.EMOJI,
  });

  

  Konva.Image.fromURL(emojiText.toDataURL(), (image) => {
    
    this.layers.default.add(image);
    this.handleSlideUpdate();

    image.setAttrs({
      x: this.scene.width / 2 - size / 2,
      y: this.scene.height / 2 - size / 2,
      width: size,
      height: size,
      draggable: true,
      name: this.MODE_OPTIONS.IMAGE,
      source: emojiText.toDataURL(),
    });

  });
}