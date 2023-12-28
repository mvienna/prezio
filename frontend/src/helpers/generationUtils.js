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

/*
 * folder icon
 */
export const getFolderIconName = ($q) => {
  if (
    $q.platform.is.mac ||
    $q.platform.is.ios ||
    $q.platform.is.ipad ||
    $q.platform.is.ipod ||
    $q.platform.is.iphone
  ) {
    return "folder--apple";
  }

  return "folder--windows";
};
