import { api } from "boot/axios";

export const fetchAndConvertToBase64Image = async (url) => {
  if (url.includes("prezio")) {
    const response = await api.get(`/image?url=${url}`);
    return `data:image/png;base64, ${response.data.base64}`;
  } else {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response error");
      }

      const blob = await response.blob();
      const reader = new FileReader();

      const readerPromise = new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
      });

      reader.readAsDataURL(blob);

      return await readerPromise;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  }
};
