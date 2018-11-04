/**
 * lib/util.ts
 *
 * Utility general function
 */

/**
 * get a random element from an array
 *
 * @param {T[]} array a list of item
 * @returns {T | null} a random item from the list
 */
const getRandomElementFromArray = <T>(array: T[]): T | null => {
  return array ? array[Math.floor(Math.random() * array.length)] : null;
};

export default {
  getRandomElementFromArray,
};
