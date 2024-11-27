import { getRandomNumber, getRandomElement } from './util.js';

const commentsMessages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота.',
  'Лица у людей на фотке перекошены, как будто их избивают.',
];

const names = ['Намджун', 'Чонгук', 'Чингачгук', 'Гойко Митич', 'Дмин', 'Юнги', 'Джо Пич', 'Ясос Биб'];

export const generateComments = (count) => {
  const comments = [];

  for (let i = 0; i < count; i++) {
    comments.push({
      id: i + 1,
      avatar: `img/avatar-${getRandomNumber(1, 6)}.svg`,
      message: getRandomElement(commentsMessages),
      name: getRandomElement(names),
    });
  }

  return comments;
};
