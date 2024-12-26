import { debounce } from './util.js';

const PICTURE_COUNT = 10;

const Filter = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const filterElement = document.querySelector('.img-filters');
let currentFilter = Filter.DEFAULT;
let pictures = [];
let activeButton = null;

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const sortByComments = (pictureA, pictureB) =>
  pictureB.comments.length - pictureA.comments.length;

const getFilteredPictures = () => {
  const filteredPictures = [...pictures];
  if (currentFilter === Filter.RANDOM) {
    // Randomly shuffle and return a slice of the pictures
    return shuffleArray(filteredPictures).slice(0, PICTURE_COUNT);
  } else if (currentFilter === Filter.DISCUSSED) {
    // Sort by the number of comments
    return filteredPictures.sort(sortByComments);
  }
  // Return all pictures by default
  return filteredPictures;
};

const setOnFilterClick = (callback) => {
  filterElement.addEventListener('click', (evt) => {
    if (!evt.target.classList.contains('img-filters__button')) {
      return;
    }
    const clickedButton = evt.target;
    if (clickedButton.id === currentFilter) {
      return;
    }
    if (activeButton) {
      activeButton.classList.remove('img-filters__button--active');
    }
    clickedButton.classList.add('img-filters__button--active');
    activeButton = clickedButton;
    currentFilter = clickedButton.id;
    callback(getFilteredPictures());
  });
};

const init = (loadedPictures, callback) => {
  filterElement.classList.remove('img-filters--inactive');
  pictures = [...loadedPictures];
  activeButton = filterElement.querySelector('.img-filters__button--active');
  setOnFilterClick(debounce(callback));
};

export { init, getFilteredPictures };
