const getRandomElementFromArray = (array: any[]): any => {
  return array ? array[Math.floor(Math.random() * array.length)] : null;
};

export default {
  getRandomElementFromArray,
};
