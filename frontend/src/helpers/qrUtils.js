import QRCodeStyling from "qr-code-styling";

export const generateQrCode = (
  width = 256,
  height = 256,
  data = window.location.href,
  image = window.location.origin + "/logo.png",
  backgroundColor = "#0A090B",
  color = "#FFFFFF"
) => {
  return new QRCodeStyling({
    width: width,
    height: height,
    type: "svg",
    data: data,
    image: image,
    dotsOptions: {
      type: "extra-rounded",
      // gradient: {
      //   type: "linear",
      //   rotation: Math.PI / 4,
      //   colorStops: [
      //     { offset: 0, color: "#1751D0" },
      //     { offset: 1, color: "#4647DA" },
      //   ],
      // },
      color: color,
    },
    backgroundOptions: {
      color: backgroundColor,
    },
    imageOptions: {
      imageSize: 0.6,
      crossOrigin: "anonymous",
      margin: 5,
    },
  });
};
