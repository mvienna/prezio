import QRCodeStyling from "qr-code-styling";

export const generateQrCode = (
  width = 225,
  height = 225,
  data = window.location.href,
  image = window.location.origin + "/logo_white.png",
  backgroundColor = "#1F1F29",
  color = "#FFFFFF"
) => {
  return new QRCodeStyling({
    width: width,
    height: height,
    type: "svg",
    data: data,
    image: image,
    dotsOptions: {
      type: "rounded",
      // gradient: {
      //   type: "linear",
      //   rotation: Math.PI / 4,
      //   colorStops: [
      //     { offset: 0, color: "#4971FF" },
      //     { offset: 1, color: "#4647DA" },
      //   ],
      // },
      color: color,
    },
    backgroundOptions: {
      color: backgroundColor,
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 2,
    },
  });
};
