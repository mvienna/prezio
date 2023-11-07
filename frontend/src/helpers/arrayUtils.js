export const shuffleArray = (array) => {
  let currentIndex = array?.length,
    randomIndex;

  if (currentIndex) {
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  } else {
    return [];
  }
};
