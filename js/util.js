export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
