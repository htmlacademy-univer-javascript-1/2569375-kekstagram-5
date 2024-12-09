import { getRandomNumber, getRandomElement } from './util.js';
import { generateComments } from './data.js';
import { renderPictures } from './render.js';
import { initializeBigPicture, setPictureArray } from './bigpicture.js';
import './validation.js';
import './image-editor.js';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generatePictures = () => {
  const picture = [];
  const descriptions = [
    'Фотография прекрасного пейзажа.',
    'Счастливый момент в жизни.',
    'Незабываемое путешествие.',
    'Улыбка на лице.',
    'Воспоминания о лете.',
    'Закат в горах.',
    'Первый снег.',
    'Друзья и веселье.',
    'Семейные узы.',
    'На берегу моря.',
  ];

  for (let i = 1; i <= 25; i++) {
    const comments = generateComments(getRandomNumber(0, 30));
    picture.push({
      id: i,
      url: `photos/${i}.jpg`,
      description: getRandomElement(descriptions),
      likes: getRandomNumber(15, 200),
      comments: comments,
      commentCount: comments.length,
    });
  }

  return shuffleArray(picture);
};

const pictures = generatePictures();

renderPictures(pictures);
setPictureArray(pictures);
initializeBigPicture();
