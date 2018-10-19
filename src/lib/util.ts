export const getRandomElementFromArray = (array: any[]): any => {
  return array[Math.floor(Math.random() * array.length)];
};
