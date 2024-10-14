const quantityObjects = 25;

const minLikes = 15;

const maxAvatar = 6;
const maxId = 25;
const maxUrl = 25;
const maxComments = 30;
const maxLikes = 200;

const NAMES = [
  'Намджун',
  'Чонгук',
  'Чингачгук',
  'Гойко Митич',
  'Джин',
  'Юнги',
  'Джо Пич',
  'Ясос Биб',
];

const WORDS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const generationInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateComment = () => ({
  id: generationInt(1, maxId),
  avatar: `img/avatar-${generationInt(1, maxAvatar)}.svg`,
  message: WORDS[generationInt(0, WORDS.length - 1)],
  name: NAMES[generationInt(0, NAMES.length - 1)],
});

const generatePhoto = () => ({
  id: generationInt(1, maxId),
  url: `photos/${generationInt(1, maxUrl)}.jpg`,
  description: 'Описание объекта',
  likes: generationInt(minLikes, maxLikes),
  comments: Array.from({ length: generationInt(0, maxComments) }, generateComment)
});

const arrayObjects = () => Array.from({ length: quantityObjects }, generatePhoto);

arrayObjects();
