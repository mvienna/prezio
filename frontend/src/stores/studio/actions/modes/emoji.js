import Konva from "konva";

export function addEmoji(emoji, size = 100) {
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

  this.layers.default.add(emojiText);

  this.handleSlideUpdate();
}