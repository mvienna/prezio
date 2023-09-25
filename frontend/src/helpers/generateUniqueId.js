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
export const getFolderIconName = (id) => {
  if (id % 4 === 1) {
    return "folder";
  } else if (id % 4 === 2) {
    return "folder_red";
  } else if (id % 4 === 3) {
    return "folder_green";
  } else if (id % 4 === 0) {
    return "folder_pink";
  }
};
