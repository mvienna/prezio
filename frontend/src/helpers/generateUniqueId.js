export const generateUniqueId = (length = 7, array = null) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  const generateRandomChar = () => {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    return characters[randomIndex];
  };

  let uniqueId;

  if (array) {
    let isNotUnique = true;

    while (isNotUnique) {
      uniqueId = Array.from({ length }, generateRandomChar).join("");
      isNotUnique = array.some((item) => item.id === uniqueId);
    }
  } else {
    uniqueId = Array.from({ length }, generateRandomChar).join("");
  }

  return uniqueId;
};
