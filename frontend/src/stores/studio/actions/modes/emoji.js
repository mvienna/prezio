
import Konva from "konva";


export function addEmoji(emoji, size = 100) {
  console.log(emoji);
  const emojiText = new Konva.Text({
    x: this.scene.width / 2 - size / 2,
    y: this.scene.height / 2 - size / 2,
    text: emoji,
    // fontFamily: "'Noto Color Emoji', sans-serif",
    fontSize: size,
    width: size,
    height: size,
    align: "center",
    verticalAlign: "middle",
    draggable: true,
    name: this.MODE_OPTIONS.EMOJI,
  });

  // this.layers.default.add(emojiText);

  emojiText.toImage({
    callback: (img) => {
      const image = new Konva.Image({
        x: this.scene.width / 2 - size / 2,
        y: this.scene.height / 2 - size / 2,
        width: size,
        height: size,
        draggable: true,
        name: this.MODE_OPTIONS.IMAGE,
        image: img,
        source: img.src,
      });
      this.layers.default.add(image);
      // this.processImageNode(image, image.src);
      this.handleSlideUpdate();
    },
  });
}