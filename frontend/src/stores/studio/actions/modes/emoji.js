
import Konva from "konva";

// Konva.Font.load({
//   'Noto Color Emoji': {
//     url: 'https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap',
//     fontFamily: 'Noto Color Emoji'
//   }
// });

export function addEmoji(emoji, size = 100) {
  console.log(emoji);
  const emojiText = new Konva.Text({
    x: this.scene.width / 2 - size / 2,
    y: this.scene.height / 2 - size / 2,
    fontFamily: "Noto Color Emoji",
    text: emoji,
    fontStyle: "400",
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


  // setTimeout(() => {
  //   emojiText.fontFamily('"Noto Color Emoji", sens-serif');
  //   console.log('setTimeout');

  // }, 5000);


  // this.layers.default.add(emojiText);

  // emojiText.toImage({
  //   callback: (img) => {
  //     const image = new Konva.Image({
  //       x: this.scene.width / 2 - size / 2,
  //       y: this.scene.height / 2 - size / 2,
  //       width: size,
  //       height: size,
  //       draggable: true,
  //       name: this.MODE_OPTIONS.IMAGE,
  //       image: img,
  //       source: img.src,
  //     });
  //     this.layers.default.add(image);
  //     // this.processImageNode(image, image.src);
  //     this.handleSlideUpdate();
  //   },
  // });
}