import { getData } from './api.js';

const DATA_URL = 'https://29.javascript.htmlacademy.pro/kekstagram/data';

const getPhotos = async () => {
  const photos = await getData(DATA_URL);
  return photos;
};

export { getPhotos };
